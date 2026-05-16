"use client";

import { useEffect, useState } from "react";
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
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-teal-100 text-teal-700",
  pending_payment: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const SESSION_KEY = "datapath_admin_token";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-950">Admin Access</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your admin password to continue.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !value}
            className="w-full rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ token }: { token: string }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/submissions", {
      headers: { "x-admin-token": token },
    })
      .then((r) => r.json())
      .then((data) => {
        setPurchases(data.purchases ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const paid = purchases.filter((s) => s.payment_status === "paid").length;
  const pending = purchases.filter((s) => s.payment_status === "pending_payment").length;
  const revenue = purchases
    .filter((s) => s.payment_status === "paid")
    .reduce((sum, p) => {
      const topic = getTopic(p.topic_id);
      return sum + (topic ? topic.price : 0);
    }, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-950">Pack Purchases</h1>
              <p className="text-sm text-slate-500">Paid and pending assignment pack records</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  sessionStorage.removeItem(SESSION_KEY);
                  window.location.reload();
                }}
                className="text-sm text-slate-400 hover:text-slate-700"
              >
                Sign out
              </button>
              <Link href="/" className="text-sm text-teal-700 hover:underline">
                Home
              </Link>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Purchases", value: purchases.length },
              { label: "Paid", value: paid },
              { label: "Revenue", value: `$${revenue}` },
              { label: "Pending Payment", value: pending },
            ].map(({ label, value }) => (
              <div key={label} className="border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading...</div>
          ) : purchases.length === 0 ? (
            <div className="border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-slate-400">No purchases yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-4 py-3 font-semibold text-slate-500">Name / Email</th>
                      <th className="px-4 py-3 font-semibold text-slate-500">Topic</th>
                      <th className="px-4 py-3 font-semibold text-slate-500">Tier</th>
                      <th className="px-4 py-3 font-semibold text-slate-500">Price</th>
                      <th className="px-4 py-3 font-semibold text-slate-500">Status</th>
                      <th className="px-4 py-3 font-semibold text-slate-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => {
                      const topic = getTopic(purchase.topic_id);
                      const price = topic ? topic.price : 0;
                      return (
                        <tr key={purchase.id} className="border-b border-slate-100">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-950">{purchase.name || "-"}</div>
                            <div className="text-xs text-slate-400">{purchase.email}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {topic?.shortTitle ?? purchase.topic_id}
                          </td>
                          <td className="px-4 py-3">
                            <span className="capitalize text-slate-700">{purchase.tier}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700">${price}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[purchase.payment_status] ?? "bg-slate-100 text-slate-600"}`}>
                              {purchase.payment_status === "pending_payment"
                                ? "Pending"
                                : purchase.payment_status === "paid"
                                ? "Paid"
                                : "Failed"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(purchase.created_at).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      );
                    })}
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

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setToken(stored);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;
  if (!token) return <PasswordGate onUnlock={(pwd) => setToken(pwd)} />;
  return <Dashboard token={token} />;
}
