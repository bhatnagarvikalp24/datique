"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

interface Submission {
  id: string;
  name: string | null;
  email: string;
  age: number;
  app_used: string;
  vibe: string;
  payment_status: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending_payment: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const SESSION_KEY = "datique_admin_token";

// ── Password Gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: (pwd: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, value);
        onUnlock(value);
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="text-3xl">🔒</span>
          <h1 className="mt-3 text-xl font-bold text-gray-900">Admin Access</h1>
          <p className="mt-1 text-sm text-gray-500">Enter your admin password to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !value}
            className="w-full rounded-full bg-rose-500 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ token }: { token: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/submissions", {
      headers: { "x-admin-token": token },
    })
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(data.submissions ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const paid = submissions.filter((s) => s.payment_status === "paid").length;
  const pending = submissions.filter(
    (s) => s.payment_status === "pending_payment"
  ).length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">All profile review submissions</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/corpus" className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-50">
                Manage Corpus →
              </Link>
              <button
                onClick={() => {
                  sessionStorage.removeItem(SESSION_KEY);
                  window.location.reload();
                }}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Sign out
              </button>
              <Link href="/" className="text-sm text-rose-500 hover:underline">
                ← Home
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Submissions", value: submissions.length, color: "text-gray-900" },
              { label: "Paid", value: paid, color: "text-green-600" },
              { label: "Pending Payment", value: pending, color: "text-yellow-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-gray-400">No submissions yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-500">Name / Email</th>
                      <th className="px-4 py-3 font-semibold text-gray-500">Age</th>
                      <th className="px-4 py-3 font-semibold text-gray-500">App</th>
                      <th className="px-4 py-3 font-semibold text-gray-500">Vibe</th>
                      <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
                      <th className="px-4 py-3 font-semibold text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-gray-50 transition hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {s.name || "—"}
                          </div>
                          <div className="text-xs text-gray-400">{s.email}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{s.age}</td>
                        <td className="px-4 py-3 text-gray-700">{s.app_used}</td>
                        <td className="px-4 py-3 text-gray-700">{s.vibe}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              STATUS_STYLES[s.payment_status] ?? "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {s.payment_status === "pending_payment"
                              ? "Pending"
                              : s.payment_status === "paid"
                              ? "Paid"
                              : "Failed"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(s.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) setToken(stored);
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!token) {
    return <PasswordGate onUnlock={(pwd) => setToken(pwd)} />;
  }

  return <Dashboard token={token} />;
}
