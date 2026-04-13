"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

type ReportStatus = "not_started" | "processing" | "done" | "failed";

const STATUS_CONFIG: Record<
  ReportStatus,
  { icon: string; headline: string; sub: string; color: string; bg: string }
> = {
  not_started: {
    icon: "⏳",
    headline: "Queuing your review…",
    sub: "We're running your profile through our review engine. This takes about 30–60 seconds.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  processing: {
    icon: "🔬",
    headline: "Reviewing your profile…",
    sub: "We're analysing every photo, prompt and bio against thousands of real profiles. Hang tight — about 30–60 seconds.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  done: {
    icon: "🎉",
    headline: "Your report is ready!",
    sub: "Your personalised PDF review is ready to download right now.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  failed: {
    icon: "⚠️",
    headline: "Generation failed",
    sub: "Something went wrong on our end. This is rare — please contact support and we'll regenerate your report manually at no extra charge.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const submissionId = searchParams.get("id");

  const [status, setStatus] = useState<ReportStatus>("not_started");
  const [reportPath, setReportPath] = useState<string | null>(null);
  // useRef so StrictMode double-invoke doesn't fire the fetch twice
  const triggeredRef = useRef(false);

  // Kick off report generation once
  useEffect(() => {
    if (!submissionId || triggeredRef.current) return;
    triggeredRef.current = true;
    setStatus("processing");

    fetch("/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "done") {
          setStatus("done");
          setReportPath(data.reportPath);
        }
      })
      .catch(console.error);
  }, [submissionId, router]);

  // Poll status while processing
  useEffect(() => {
    if (!submissionId || status === "done" || status === "failed") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/report-status?id=${submissionId}`);
        const data = await res.json();
        setStatus(data.status);
        if (data.reportPath) setReportPath(data.reportPath);
        if (data.status === "done" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch {
        // keep polling
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [submissionId, status]);

  const cfg = STATUS_CONFIG[status];

  return (
    <>
    <Navbar />
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mx-auto w-full max-w-lg">

        {/* Payment confirmed badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
            <span>✓</span> Payment Confirmed
          </span>
        </div>

        {/* Status card */}
        <div className={`rounded-2xl ${cfg.bg} border border-opacity-30 p-8 text-center shadow-sm mb-6`}>
          <div className="mb-4 text-5xl">{cfg.icon}</div>
          <h1 className={`mb-2 text-2xl font-bold ${cfg.color}`}>{cfg.headline}</h1>
          <p className="text-gray-600">{cfg.sub}</p>

          {/* Spinner for processing states */}
          {(status === "processing" || status === "not_started") && (
            <div className="mt-6 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
            </div>
          )}

          {/* Download button */}
          {status === "done" && reportPath && (
            <div className="mt-6">
              <a
                href={reportPath}
                download
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-rose-600 active:scale-95"
              >
                <span>⬇</span> Download Your PDF Report
              </a>
              <p className="mt-3 text-xs text-gray-400">
                Your 3-page personalised review — photos, prompts, rewrites & more.
              </p>
            </div>
          )}
        </div>

        {/* What's in your report */}
        {status !== "failed" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              What&apos;s in your report
            </h2>
            <ul className="space-y-3">
              {[
                ["📊", "Overall Score", "Across 5 dimensions: photos, bio, humor, intent, variety"],
                ["📸", "Photo-by-Photo Review", "Each photo scored, verdicted (Keep / Improve / Replace) with specific tips"],
                ["✍️", "Prompt Rewrites", "Your actual prompts rewritten in your voice — just copy-paste"],
                ["🎯", "3 Highest-Impact Fixes", "Ranked by effort vs. impact so you know exactly what to do first"],
                ["💬", "Rewritten Bio", "A full bio rewrite based on signals from your profile"],
                ["🧠", "Vibe Analysis", "Whether your profile is attracting who you actually want"],
              ].map(([icon, title, desc]) => (
                <li key={title as string} className="flex items-start gap-3">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <span className="font-medium text-gray-900">{title}</span>
                    <span className="text-gray-500"> — {desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-gray-400">Loading…</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
