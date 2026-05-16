import OpenAI from "openai";
import { spawn } from "child_process";
import { tmpdir } from "os";
import { join } from "path";
import { writeFileSync, unlinkSync } from "fs";
import type { Assignment } from "./assignments";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ─── shared JSON schema (same for all topics) ─── */
const SCHEMA = `
Return a JSON object with a single key "assignments" containing an array of exactly 20 objects. No markdown, no explanation. Every element must match this schema:

{
  "id": string,             // e.g. "<topicId>-ai-1" — use topic prefix + sequential number
  "topicId": string,        // must match the topicId provided
  "number": number,         // 1 through 20
  "title": string,          // concise, specific title
  "difficulty": "easy" | "medium" | "hard",
  "objective": string,      // one sentence: what skill the student practices
  "problemStatement": string,  // scenario + numbered task list. Use \\n for newlines
  "requirements": string[],    // 4–6 concrete requirements
  "inputFormat": string,       // describe input OR "No input required — data is hardcoded"
  "outputFormat": string,      // exact expected output format with example values
  "examples": [{
    "input": string,           // empty string if no input
    "output": string,          // exact stdout. Use \\n for newlines
    "explanation": string
  }],
  "starterCode": string,    // scaffolded starter with TODOs. Use \\n for newlines
  "solution": string,       // complete working solution. Use \\n for newlines
  "testCases": [{
    "id": string,           // "tc1", "tc2", etc
    "description": string,
    "stdin": string,        // empty string if no input
    "expectedOutput": string,
    "hidden": boolean       // first 1–2 false, rest true
  }],
  "bonusTask": string
}`;

/* ─── topic-specific system prompts ─── */

const PYTHON_PROMPT = `You are an expert Python programming instructor creating assignment packs for data professionals.
Generate exactly 20 Python assignments progressing in difficulty: 1–7 EASY, 8–14 MEDIUM, 15–20 HARD.
${SCHEMA}

Rules:
- Solutions must be complete, runnable Python 3 programs using only the standard library
- All solutions must produce EXACTLY the expectedOutput when run — character-for-character match
- For no-input assignments: hardcode data inside the program
- For input assignments: use input() calls, one value per line
- EASY: variables, if-else, loops, basic lists/dicts/sets
- MEDIUM: nested structures, list comprehensions, functions, sorting, string manipulation
- HARD: recursion, classes, generators, complex algorithms
- Use real-world scenarios (records, transactions, inventory, employees)
- Test cases must be deterministic`;

const SQL_PROMPT = `You are an expert SQL instructor creating assignment packs for data analysts and engineers.
Generate exactly 20 SQL assignments progressing in difficulty: 1–7 EASY, 8–14 MEDIUM, 15–20 HARD.
${SCHEMA}

Rules:
- Each assignment is a SQL problem. The "solution" field must contain the complete SQL query/queries that solve it
- Starter code contains the table schema (CREATE TABLE + INSERT statements) and a TODO for the query
- The "starterCode" field includes table setup SQL + a comment saying "-- Write your query below"
- inputFormat: always "No input required — write a SQL query against the provided schema"
- outputFormat: show the expected result set as a formatted table (columns + rows)
- testCases: describe what the query should return (use description field, stdin is always empty, expectedOutput is the result table as plain text)
- EASY: SELECT, WHERE, ORDER BY, basic aggregations
- MEDIUM: JOINs (inner/left/self), GROUP BY with HAVING, subqueries
- HARD: Window functions (ROW_NUMBER, RANK, LAG, LEAD), CTEs, complex multi-step analysis
- Use realistic business scenarios: sales data, employee records, e-commerce orders, product inventory`;

const DATA_ENGINEERING_PROMPT = `You are an expert data engineering instructor creating assignment packs for aspiring data engineers.
Generate exactly 20 data engineering assignments progressing in difficulty: 1–7 EASY, 8–14 MEDIUM, 15–20 HARD.
${SCHEMA}

Rules:
- Assignments cover pipeline design, SQL transformations, schema design, and data quality — not just coding
- The "solution" field contains either: a SQL query, a Python script (stdlib only), or a detailed written answer with steps
- The "starterCode" field provides schema, sample data, or a partial pipeline to complete
- inputFormat: "No input required — use the schema and data provided in the starter"
- outputFormat: show expected query result, transformed data, or the key elements of the written answer
- EASY: ETL concepts, reading/writing files, basic SQL transforms, schema basics
- MEDIUM: Star schema design, pipeline DAG design, data quality checks, dbt-style transformations
- HARD: Slowly Changing Dimensions, partitioning strategies, incremental loads, debugging broken pipelines
- Use realistic scenarios: e-commerce data pipelines, log processing, warehouse migrations`;

const CLOUD_PROMPT = `You are an expert cloud computing instructor creating assignment packs for data and cloud professionals.
Generate exactly 20 cloud computing assignments progressing in difficulty: 1–7 EASY, 8–14 MEDIUM, 15–20 HARD.
${SCHEMA}

Rules:
- Assignments are scenario-based: given a business requirement, design/choose the right cloud architecture
- The "solution" field contains a detailed written answer: which services to use, why, and how they connect
- The "starterCode" field contains the scenario description, constraints, and guiding questions to answer
- inputFormat: "No input required — read the scenario and answer the architecture questions"
- outputFormat: outline the key components of a correct answer (services chosen, data flow, justification)
- testCases: describe the critical points that must appear in a correct answer (use description, stdin empty, expectedOutput is a checklist of required points)
- EASY: choosing between S3 vs EBS, EC2 vs Lambda, basic IAM, storage tiers
- MEDIUM: VPC design, multi-region architecture, cost optimization, serverless vs containers
- HARD: full data platform design (ingestion + processing + serving), disaster recovery, security architecture
- Cover AWS primarily, with GCP and Azure where relevant`;

const CASE_STUDIES_PROMPT = `You are an expert data analytics instructor creating case study assignment packs for aspiring analysts.
Generate exactly 20 case study assignments progressing in difficulty: 1–7 EASY, 8–14 MEDIUM, 15–20 HARD.
${SCHEMA}

Rules:
- Each assignment is a realistic business case requiring SQL analysis, metric definition, and written interpretation
- The "solution" field contains: the SQL query + a 3–5 line written interpretation of what the numbers mean
- The "starterCode" field contains table schemas, sample data (INSERT statements), and the business question
- inputFormat: "No input required — analyse the provided dataset and answer the business question"
- outputFormat: show the query result table AND the key business insight in 1–2 sentences
- testCases: describe what a correct answer must include (correct metric + correct interpretation direction)
- EASY: single-table analysis — revenue totals, customer counts, basic averages
- MEDIUM: multi-table joins — funnel analysis, cohort retention, segment comparison
- HARD: advanced metrics — LTV, churn rate, attribution, forecasting, executive-style write-up
- Domains: e-commerce, SaaS, fintech, marketplace, healthcare`;

const PROMPTS: Record<string, string> = {
  python: PYTHON_PROMPT,
  sql: SQL_PROMPT,
  "data-engineering": DATA_ENGINEERING_PROMPT,
  "cloud-computing": CLOUD_PROMPT,
  "case-studies": CASE_STUDIES_PROMPT,
};

/* ─── Python solution validator ─── */

async function runPython(code: string, stdin: string): Promise<string> {
  const file = join(tmpdir(), `validate_${Date.now()}.py`);
  writeFileSync(file, code);

  return new Promise((resolve) => {
    const proc = spawn("python3", [file], { timeout: 8000 });
    let out = "";
    let err = "";

    if (stdin) proc.stdin.write(stdin);
    proc.stdin.end();

    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (err += d.toString()));

    proc.on("close", () => {
      try { unlinkSync(file); } catch {}
      resolve(out.trimEnd());
    });

    proc.on("error", () => {
      try { unlinkSync(file); } catch {}
      resolve(`ERROR: ${err}`);
    });
  });
}

async function validatePythonAssignment(a: Assignment): Promise<void> {
  if (!Array.isArray(a.testCases) || a.testCases.length === 0) return;
  for (const tc of a.testCases) {
    const actual = await runPython(a.solution, tc.stdin ?? "");
    const expected = (tc.expectedOutput ?? "").replace(/\\n/g, "\n");
    if (actual !== expected) {
      console.warn(
        `Assignment ${a.number} tc "${tc.id}" mismatch.\n` +
        `Expected: ${JSON.stringify(expected)}\nGot: ${JSON.stringify(actual)}`
      );
    }
  }
}

/* ─── Main export ─── */

export type GenerationResult =
  | { success: true; assignments: Assignment[] }
  | { success: false; error: string };

export async function generateAssignments(
  topicId: string,
  topicShortTitle: string,
  subtopics: string[]
): Promise<GenerationResult> {
  const systemPrompt = PROMPTS[topicId] ?? PYTHON_PROMPT;

  const userPrompt = `Generate 20 assignments for the topic "${topicShortTitle}" (topicId: "${topicId}").

Cover these subtopics across the difficulty progression:
${subtopics.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Return the JSON object now.`;

  let raw: string;
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 16000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content in response");
    const parsed = JSON.parse(content);
    raw = JSON.stringify(Array.isArray(parsed) ? parsed : (parsed.assignments ?? parsed));
  } catch (err) {
    return { success: false, error: `OpenAI API error: ${String(err)}` };
  }

  let assignments: Assignment[];
  try {
    const jsonStr = raw.startsWith("[") ? raw : raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1);
    assignments = JSON.parse(jsonStr);
    if (!Array.isArray(assignments) || assignments.length === 0) {
      throw new Error("Parsed result is not a non-empty array");
    }
  } catch (err) {
    return { success: false, error: `JSON parse error: ${String(err)}` };
  }

  // Only run code validation for Python — other topics have written/SQL solutions
  if (topicId === "python") {
    for (const a of assignments) {
      await validatePythonAssignment(a);
    }
  }

  return { success: true, assignments };
}
