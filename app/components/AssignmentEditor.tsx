"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Assignment, TestCase } from "@/lib/assignments";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type TestResult = {
  id: string;
  passed: boolean;
  output: string;
  expected: string | null;
  error: boolean;
};

type RunState = "idle" | "running" | "done";

function DifficultyBadge({ difficulty }: { difficulty: Assignment["difficulty"] }) {
  const styles = {
    easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    hard: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function TestCaseStatus({ result, tc }: { result: TestResult | undefined; tc: TestCase }) {
  if (!result) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span className="text-sm font-medium text-slate-300">{tc.description}</span>
          {tc.hidden && (
            <span className="ml-auto rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
              Hidden
            </span>
          )}
        </div>
        {!tc.hidden && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-500">Input</p>
              <pre className="rounded bg-slate-900 p-2 text-xs text-slate-300">{tc.stdin}</pre>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-500">Expected Output</p>
              <pre className="rounded bg-slate-900 p-2 text-xs text-slate-300">{tc.expectedOutput}</pre>
            </div>
          </div>
        )}
      </div>
    );
  }

  const statusColor = result.passed
    ? "border-emerald-500/40 bg-emerald-900/20"
    : "border-rose-500/40 bg-rose-900/20";
  const dot = result.passed ? "bg-emerald-400" : "bg-rose-400";
  const label = result.passed ? "Passed" : result.error ? "Error" : "Failed";

  return (
    <div className={`rounded-lg border p-4 ${statusColor}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-sm font-medium text-slate-200">{tc.description}</span>
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold ${
            result.passed
              ? "bg-emerald-500/30 text-emerald-400"
              : "bg-rose-500/30 text-rose-400"
          }`}
        >
          {label}
        </span>
      </div>

      {!tc.hidden && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-500">Input</p>
            <pre className="rounded bg-slate-900 p-2 text-xs text-slate-300">{tc.stdin}</pre>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-500">Expected Output</p>
            <pre className="rounded bg-slate-900 p-2 text-xs text-slate-300">{tc.expectedOutput}</pre>
          </div>
        </div>
      )}

      {!result.passed && (
        <div className="mt-2">
          <p className="mb-1 text-xs font-semibold text-rose-400">Your Output</p>
          <pre className="rounded bg-slate-900 p-2 text-xs text-rose-300">
            {result.output || "(no output)"}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function AssignmentEditor({
  assignment,
  purchaseId,
  topicId,
  allAssignments,
}: {
  assignment: Assignment;
  purchaseId: string;
  topicId: string;
  allAssignments: { id: string; number: number; title: string }[];
}) {
  const [code, setCode] = useState(assignment.starterCode);
  const [runState, setRunState] = useState<RunState>("idle");
  const [results, setResults] = useState<TestResult[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "solution">("problem");
  const editorRef = useRef<unknown>(null);

  const passedCount = results.filter((r) => r.passed).length;
  const allPassed = results.length > 0 && passedCount === assignment.testCases.length;

  async function handleRun() {
    if (runState === "running") return;
    setRunState("running");
    setResults([]);

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          testCases: assignment.testCases.map((tc) => ({
            id: tc.id,
            stdin: tc.stdin,
            expectedOutput: tc.expectedOutput,
            hidden: tc.hidden,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to run code.");
        return;
      }
      setResults(data.results);
    } catch {
      alert("Failed to reach the code runner. Please try again.");
    } finally {
      setRunState("done");
    }
  }

  function handleReset() {
    setCode(assignment.starterCode);
    setResults([]);
    setRunState("idle");
    setShowSolution(false);
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      {/* Top bar */}
      <header className="flex items-center gap-4 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <Link
          href={`/topics/${topicId}/learn?purchaseId=${purchaseId}`}
          className="rounded px-2 py-1 text-sm text-slate-400 hover:text-white"
        >
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">#{assignment.number}</span>
          <h1 className="text-sm font-semibold text-white">{assignment.title}</h1>
          <DifficultyBadge difficulty={assignment.difficulty} />
        </div>

        {results.length > 0 && (
          <span className={`ml-auto text-sm font-semibold ${allPassed ? "text-emerald-400" : "text-rose-400"}`}>
            {passedCount}/{assignment.testCases.length} passed
          </span>
        )}

        <div className={`flex items-center gap-2 ${results.length > 0 ? "" : "ml-auto"}`}>
          <button
            onClick={handleReset}
            className="rounded px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={runState === "running"}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-50"
          >
            {runState === "running" ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                Running...
              </>
            ) : (
              "▶  Run Code"
            )}
          </button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: problem / solution */}
        <aside className="flex w-[42%] flex-col border-r border-slate-800">
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab("problem")}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                activeTab === "problem"
                  ? "border-b-2 border-teal-500 text-teal-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Problem
            </button>
            <button
              onClick={() => {
                setActiveTab("solution");
                setShowSolution(true);
              }}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                activeTab === "solution"
                  ? "border-b-2 border-amber-500 text-amber-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Solution
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 text-sm leading-7">
            {activeTab === "problem" ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                    Objective
                  </p>
                  <p className="mt-2 text-slate-300">{assignment.objective}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                    Problem Statement
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap text-slate-300">
                    {assignment.problemStatement}
                  </pre>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                    Requirements
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {assignment.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-slate-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                    Input Format
                  </p>
                  <p className="mt-2 text-slate-300">{assignment.inputFormat}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                    Output Format
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap rounded bg-slate-900 p-3 text-xs text-slate-300">
                    {assignment.outputFormat}
                  </pre>
                </div>

                {assignment.examples.map((ex, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                      Example {i + 1}
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs text-slate-500">Input</p>
                        <pre className="rounded bg-slate-900 p-3 text-xs text-slate-300">
                          {ex.input}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-slate-500">Output</p>
                        <pre className="rounded bg-slate-900 p-3 text-xs text-slate-300">
                          {ex.output}
                        </pre>
                      </div>
                    </div>
                    {ex.explanation && (
                      <p className="mt-1 text-xs text-slate-500">{ex.explanation}</p>
                    )}
                  </div>
                ))}

                {assignment.bonusTask && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-900/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Bonus Task
                    </p>
                    <p className="mt-2 text-slate-300">{assignment.bonusTask}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {!showSolution ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-slate-400">Solution is available since you&apos;ve purchased this pack.</p>
                    <button
                      onClick={() => setShowSolution(true)}
                      className="mt-4 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400"
                    >
                      Show Solution
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Full Solution
                    </p>
                    <pre className="whitespace-pre-wrap rounded-lg bg-slate-900 p-4 text-xs leading-6 text-slate-200">
                      {assignment.solution}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Right: editor + test cases */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Editor */}
          <div className="relative flex-1 border-b border-slate-800">
            <div className="absolute right-3 top-2 z-10 flex items-center gap-2">
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                Python 3
              </span>
            </div>
            <MonacoEditor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              onMount={(editor) => { editorRef.current = editor; }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 12 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            />
          </div>

          {/* Test cases panel */}
          <div className="h-[280px] overflow-y-auto bg-slate-900 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Test Cases
              </p>
              {runState === "done" && (
                <p className={`text-xs font-bold ${allPassed ? "text-emerald-400" : "text-rose-400"}`}>
                  {allPassed
                    ? "All test cases passed!"
                    : `${passedCount} of ${assignment.testCases.length} passed`}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {assignment.testCases.map((tc) => {
                const result = results.find((r) => r.id === tc.id);
                return <TestCaseStatus key={tc.id} result={result} tc={tc} />;
              })}
            </div>

            {runState === "idle" && (
              <p className="mt-3 text-center text-xs text-slate-600">
                Click &quot;Run Code&quot; to test your solution against all cases.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
