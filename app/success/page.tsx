"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { getTopic } from "@/lib/topics";

interface Purchase {
  id: string;
  name: string | null;
  email: string;
  topic_id: string;
  tier: string;
  payment_status: string;
}

interface AssignmentMeta {
  id: string;
  number: number;
  title: string;
  difficulty: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get("id");
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [assignments, setAssignments] = useState<AssignmentMeta[]>([]);
  const [packStatus, setPackStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(purchaseId));

  useEffect(() => {
    if (!purchaseId) return;

    Promise.all([
      fetch(`/api/purchase?id=${purchaseId}`).then((r) => r.json()),
      fetch(`/api/assignments/${purchaseId}`).then((r) => r.json()),
    ])
      .then(([purchaseData, assignmentsData]) => {
        setPurchase(purchaseData.purchase ?? null);
        setAssignments(assignmentsData.assignments ?? []);
        setPackStatus(assignmentsData.packStatus ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [purchaseId]);

  const topic = purchase ? getTopic(purchase.topic_id) : undefined;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-800 border-t-teal-400" />
      </div>
    );
  }

  if (!purchase || !topic || purchase.payment_status !== "paid") {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
          <h1 className="text-2xl font-bold text-white">Access not confirmed yet</h1>
          <p className="mt-3 max-w-md text-slate-400">
            We could not confirm a paid purchase. If payment was deducted, contact support with your email.
          </p>
          <Link href="/#topics" className="mt-6 text-teal-400 hover:underline">
            Back to topics
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 px-4 py-12">
        <div className="mx-auto max-w-xl space-y-5">

          {/* Confirmed banner */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-sm font-semibold text-teal-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Payment confirmed
            </span>
            <h1 className="mt-5 text-3xl font-extrabold text-white">
              You&apos;re in.
            </h1>
            <p className="mt-3 text-slate-400">
              Lifetime access to the{" "}
              <span className="font-semibold text-white">{topic.shortTitle}</span>{" "}
              pack is now unlocked.
            </p>

            <div className="mt-6 rounded-xl bg-slate-800 p-4 text-left text-sm">
              <div className="flex justify-between gap-4 text-slate-400">
                <span>Pack</span>
                <span className="font-medium text-white">{topic.shortTitle}</span>
              </div>
              <div className="mt-2 flex justify-between gap-4 text-slate-400">
                <span>Price</span>
                <span className="font-medium text-white">${topic.price}</span>
              </div>
              <div className="mt-2 flex justify-between gap-4 text-slate-400">
                <span>Email</span>
                <span className="font-medium text-white">{purchase.email}</span>
              </div>
            </div>
          </div>

          {/* PDF Downloads */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
              Your Downloads
            </p>
            <h2 className="mt-2 text-lg font-bold text-white">
              Assignment &amp; Solution PDFs
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Each assignment has its own PDF. Click to download.
            </p>

            {assignments.length === 0 ? (
              <p className="mt-5 text-sm text-slate-500">Assignments are being generated — refresh in a moment.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {assignments.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-slate-700 bg-slate-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          <span className="mr-2 text-xs font-bold text-teal-500">
                            {String(a.number).padStart(2, "0")}
                          </span>
                          {a.title}
                        </p>
                        <p className="mt-0.5 text-xs capitalize text-slate-500">
                          {a.difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={`/api/download/${purchase.id}/assignment/${a.id}`}
                        className="flex-1 rounded-lg border border-slate-600 py-2 text-center text-xs font-semibold text-slate-300 transition hover:border-teal-500 hover:text-white"
                      >
                        ↓ Assignment PDF
                      </a>
                      <a
                        href={`/api/download/${purchase.id}/solution/${a.id}`}
                        className="flex-1 rounded-lg bg-teal-500/15 py-2 text-center text-xs font-semibold text-teal-400 transition hover:bg-teal-500/25"
                      >
                        ↓ Solution PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/#topics" className="text-sm text-slate-500 hover:text-white">
              ← Browse more topics
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
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-800 border-t-teal-400" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
