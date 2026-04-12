"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SESSION_KEY = "datique_admin_token";

const APPS = ["Hinge", "Bumble", "Tinder", "Any"];
const TIERS = ["top", "average", "poor"] as const;
const AGE_BRACKETS = ["18-24", "25-30", "31-40", "41+"];
const VIBES = [
  "Casual / Chill",
  "Serious Relationship",
  "Funny / Witty",
  "Deep / Intellectual",
  "Adventurous",
  "Any",
];

const TIER_STYLES: Record<string, string> = {
  top: "bg-green-100 text-green-700",
  average: "bg-yellow-100 text-yellow-700",
  poor: "bg-red-100 text-red-700",
};

interface CorpusEntry {
  id: string;
  app: string;
  tier: string;
  age_bracket: string;
  vibe: string;
  description: string;
  photos_desc: string;
  prompts: string;
  bio: string | null;
  notes: string | null;
  created_at: string;
}

const EMPTY_FORM = {
  app: "",
  tier: "",
  age_bracket: "",
  vibe: "",
  description: "",
  photos_desc: "",
  prompts: "",
  bio: "",
  notes: "",
};

export default function CorpusPage() {
  const [token, setToken] = useState<string | null>(null);
  const [entries, setEntries] = useState<CorpusEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) {
      window.location.href = "/admin";
      return;
    }
    setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/corpus", { headers: { "x-admin-token": token } })
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/corpus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token ?? "",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save.");
        return;
      }
      // Refresh list
      const list = await fetch("/api/admin/corpus", {
        headers: { "x-admin-token": token ?? "" },
      }).then((r) => r.json());
      setEntries(list.entries ?? []);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this corpus entry?")) return;
    await fetch("/api/admin/corpus", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token ?? "",
      },
      body: JSON.stringify({ id }),
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  if (!token) return null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Corpus</h1>
            <p className="text-sm text-gray-500">
              Reference profiles used for RAG-based evaluation. More entries = smarter AI.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">
              ← Dashboard
            </Link>
            <button
              onClick={() => { setShowForm(true); setError(""); }}
              className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              + Add Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {(["top", "average", "poor"] as const).map((tier) => (
            <div key={tier} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-400">{tier} tier</p>
              <p className={`mt-1 text-3xl font-bold ${tier === "top" ? "text-green-600" : tier === "average" ? "text-yellow-600" : "text-red-600"}`}>
                {entries.filter((e) => e.tier === tier).length}
              </p>
            </div>
          ))}
        </div>

        {/* Add form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Add Reference Profile</h2>
              <form onSubmit={handleAdd} className="space-y-4">

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">App</label>
                    <select value={form.app} onChange={(e) => setForm((p) => ({ ...p, app: e.target.value }))} required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-400">
                      <option value="">Select</option>
                      {APPS.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tier</label>
                    <select value={form.tier} onChange={(e) => setForm((p) => ({ ...p, tier: e.target.value }))} required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-400">
                      <option value="">Select</option>
                      {TIERS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Age Bracket</label>
                    <select value={form.age_bracket} onChange={(e) => setForm((p) => ({ ...p, age_bracket: e.target.value }))} required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-400">
                      <option value="">Select</option>
                      {AGE_BRACKETS.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Vibe</label>
                    <select value={form.vibe} onChange={(e) => setForm((p) => ({ ...p, vibe: e.target.value }))} required
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-400">
                      <option value="">Select</option>
                      {VIBES.map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Profile Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea rows={2} required value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Overall summary of this profile — who the person comes across as"
                    className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-400" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Photos Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea rows={2} required value={form.photos_desc}
                    onChange={(e) => setForm((p) => ({ ...p, photos_desc: e.target.value }))}
                    placeholder="e.g. Clear solo lead photo outdoors with genuine smile, group photo showing social life, hobby action shot"
                    className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-400" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Prompts (JSON array) <span className="text-rose-500">*</span>
                  </label>
                  <textarea rows={4} required value={form.prompts}
                    onChange={(e) => setForm((p) => ({ ...p, prompts: e.target.value }))}
                    placeholder={'[{"prompt": "The most spontaneous thing I\'ve done", "response": "Booked a flight to Goa at midnight. Worth it."}]'}
                    className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 font-mono text-xs outline-none focus:border-rose-400" />
                  <p className="mt-1 text-xs text-gray-400">JSON array of {`{prompt, response}`} objects</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Bio (optional)</label>
                  <textarea rows={2} value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="The about / bio section text"
                    className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-400" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Why this tier? (optional but recommended)
                  </label>
                  <textarea rows={2} value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="e.g. Specific prompts with visual storytelling, lead photo has strong eye contact, no generic bio filler"
                    className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-400" />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 rounded-full bg-rose-500 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50">
                    {saving ? "Saving & embedding…" : "Save Profile"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="rounded-full border border-gray-200 px-6 py-3 text-sm text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Corpus list */}
        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-2xl mb-2">📭</p>
            <p className="font-medium text-gray-700">No reference profiles yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Add high-performing and low-performing profile examples to make the AI smarter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <div
                  className="flex cursor-pointer items-center justify-between px-6 py-4"
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_STYLES[entry.tier]}`}>
                      {entry.tier}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {entry.app}
                    </span>
                    <span className="text-xs text-gray-400">{entry.age_bracket}</span>
                    <span className="text-xs text-gray-500">{entry.vibe}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">
                      {new Date(entry.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                    <span className="text-gray-400">{expandedId === entry.id ? "▲" : "▼"}</span>
                  </div>
                </div>

                {expandedId === entry.id && (
                  <div className="border-t border-gray-50 px-6 py-4 space-y-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Profile</p>
                      <p className="text-gray-700">{entry.description}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Photos</p>
                      <p className="text-gray-700">{entry.photos_desc}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Prompts</p>
                      <pre className="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-700 whitespace-pre-wrap">{entry.prompts}</pre>
                    </div>
                    {entry.bio && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Bio</p>
                        <p className="text-gray-700">{entry.bio}</p>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Why this tier</p>
                        <p className="text-gray-600 italic">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
