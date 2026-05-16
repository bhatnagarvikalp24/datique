import { NextRequest } from "next/server";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export const runtime = "nodejs";

type TestCaseInput = {
  id: string;
  stdin: string;
  expectedOutput: string;
  hidden: boolean;
};

function runPython(
  code: string,
  stdin: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const tmpFile = join(
    tmpdir(),
    `dp_${Date.now()}_${Math.random().toString(36).slice(2)}.py`
  );
  writeFileSync(tmpFile, code, "utf8");

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;

    const proc = spawn("python3", [tmpFile]);

    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });

    proc.stdin.write(stdin);
    proc.stdin.end();

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      proc.kill("SIGKILL");
      try { unlinkSync(tmpFile); } catch { /* ignore */ }
      resolve({ stdout: "", stderr: "Execution timed out (5s limit).", exitCode: 1 });
    }, 5000);

    proc.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { unlinkSync(tmpFile); } catch { /* ignore */ }
      resolve({
        stdout: stdout.trimEnd(),
        stderr: stderr.trimEnd(),
        exitCode: code ?? 0,
      });
    });

    proc.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { unlinkSync(tmpFile); } catch { /* ignore */ }
      resolve({ stdout: "", stderr: err.message, exitCode: 1 });
    });
  });
}

function normalizeOutput(output: string): string {
  return output
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code: string = body.code ?? "";
    const testCases: TestCaseInput[] = body.testCases ?? [];

    if (!code.trim()) {
      return Response.json({ error: "No code provided." }, { status: 400 });
    }

    if (testCases.length === 0) {
      return Response.json({ error: "No test cases provided." }, { status: 400 });
    }

    // Run sequentially to avoid overwhelming the server
    const results = [];
    for (const tc of testCases) {
      const { stdout, stderr, exitCode } = await runPython(code, tc.stdin);

      if (exitCode !== 0 || (stderr && !stdout)) {
        results.push({
          id: tc.id,
          passed: false,
          output: stderr || stdout || "Runtime error",
          expected: tc.hidden ? null : tc.expectedOutput,
          error: true,
        });
        continue;
      }

      const normalizedActual = normalizeOutput(stdout);
      const normalizedExpected = normalizeOutput(tc.expectedOutput);
      const passed = normalizedActual === normalizedExpected;

      results.push({
        id: tc.id,
        passed,
        output: stdout,
        expected: tc.hidden ? null : tc.expectedOutput,
        error: false,
      });
    }

    return Response.json({ results });
  } catch (err) {
    console.error("run-code error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
