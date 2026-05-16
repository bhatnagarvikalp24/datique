"use client";

import { useEffect, useState } from "react";

interface AssignmentPreview {
  number: number;
  title: string;
  difficulty: string;
  objective: string;
  solution: string;
}

interface Pack {
  id: string;
  purchase_id: string;
  topic_id: string;
  status: string;
  created_at: string;
  email: string;
  tier: string;
  assignments: AssignmentPreview[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-500/10",
  medium: "text-amber-400 bg-amber-500/10",
  hard: "text-rose-400 bg-rose-500/10",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  approved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  rejected: "text-rose-400 bg-rose-500/10 border-rose-500/30",
};

export default function AdminReviewPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);

  async function loadPacks() {
    const res = await fetch("/api/admin/packs");
    const data = await res.json();
    setPacks(data.packs ?? []);
    setLoading(false);
  }

  useEffect(() => { loadPacks(); }, []);

  async function handleAction(packId: string, action: "approve" | "reject") {
    setActioning(packId);
    await fetch("/api/admin/packs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packId, action }),
    });
    await loadPacks();
    setActioning(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-800 border-t-teal-400" />
      </div>
    );
  }

  const pending = packs.filter((p) => p.status === "pending");
  const reviewed = packs.filter((p) => p.status !== "pending");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">Admin</p>
          <h1 className="mt-2 text-3xl font-extrabold">Generated Pack Review</h1>
          <p className="mt-2 text-slate-400">
            Review AI-generated assignment packs before they unlock for users.
          </p>
        </div>

        {pending.length === 0 && reviewed.length === 0 && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-10 text-center text-slate-500">
            No generated packs yet. They appear here after payment is confirmed.
          </div>
        )}

        {/* Pending packs */}
        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-amber-400">
              Pending Review ({pending.length})
            </h2>
            <div className="space-y-4">
              {pending.map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  expandedPack={expandedPack}
                  setExpandedPack={setExpandedPack}
                  expandedAssignment={expandedAssignment}
                  setExpandedAssignment={setExpandedAssignment}
                  actioning={actioning}
                  onAction={handleAction}
                />
              ))}
            </div>
          </section>
        )}

        {/* Reviewed packs */}
        {reviewed.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-400">
              Previously Reviewed ({reviewed.length})
            </h2>
            <div className="space-y-4">
              {reviewed.map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  expandedPack={expandedPack}
                  setExpandedPack={setExpandedPack}
                  expandedAssignment={expandedAssignment}
                  setExpandedAssignment={setExpandedAssignment}
                  actioning={actioning}
                  onAction={handleAction}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function PackCard({
  pack,
  expandedPack,
  setExpandedPack,
  expandedAssignment,
  setExpandedAssignment,
  actioning,
  onAction,
}: {
  pack: Pack;
  expandedPack: string | null;
  setExpandedPack: (id: string | null) => void;
  expandedAssignment: string | null;
  setExpandedAssignment: (id: string | null) => void;
  actioning: string | null;
  onAction: (packId: string, action: "approve" | "reject") => void;
}) {
  const isExpanded = expandedPack === pack.id;
  const statusStyle = STATUS_COLORS[pack.status] ?? STATUS_COLORS.pending;

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900">
      {/* Pack header */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle}`}>
              {pack.status}
            </span>
            <span className="text-xs text-slate-500 capitalize">{pack.topic_id.replace("-", " ")}</span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-500 capitalize">{pack.tier}</span>
          </div>
          <p className="mt-1.5 font-semibold text-white">{pack.email}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {pack.assignments.length} assignments · Generated {new Date(pack.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedPack(isExpanded ? null : pack.id)}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            {isExpanded ? "Collapse" : "Preview"}
          </button>
          {pack.status === "pending" && (
            <>
              <button
                onClick={() => onAction(pack.id, "reject")}
                disabled={actioning === pack.id}
                className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-400 transition hover:border-rose-400 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => onAction(pack.id, "approve")}
                disabled={actioning === pack.id}
                className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-teal-400 disabled:opacity-50"
              >
                {actioning === pack.id ? "Saving…" : "Approve"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded assignment list */}
      {isExpanded && (
        <div className="border-t border-slate-800 p-5">
          <div className="space-y-2">
            {pack.assignments.map((a) => {
              const key = `${pack.id}-${a.number}`;
              const isOpen = expandedAssignment === key;
              return (
                <div key={a.number} className="rounded-xl border border-slate-800 bg-slate-800/50">
                  <button
                    onClick={() => setExpandedAssignment(isOpen ? null : key)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="w-6 text-xs font-bold text-teal-500">
                      {String(a.number).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-white">{a.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${DIFFICULTY_COLORS[a.difficulty] ?? ""}`}>
                      {a.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-700 px-4 pb-4 pt-3 space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-400">Objective</p>
                        <p className="mt-1 text-sm text-slate-300">{a.objective}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-400">Solution</p>
                        <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300 leading-relaxed">
                          {a.solution}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
