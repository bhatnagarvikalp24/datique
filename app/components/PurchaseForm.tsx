"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Topic } from "@/lib/topics";

export default function PurchaseForm({ topic }: { topic: Topic }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topicId: topic.id, tier: "basic" }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not start checkout.");
        return;
      }

      router.push(`/payment?id=${data.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Price */}
      <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-4 text-center">
        <p className="text-4xl font-extrabold text-white">${topic.price}</p>
        <p className="mt-1 text-sm text-slate-400">One-time · Lifetime access</p>
      </div>

      {/* Includes */}
      <ul className="space-y-2">
        {topic.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
            <span className="mt-0.5 text-teal-400">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-800 pt-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Name <span className="text-slate-500">(optional)</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Email <span className="text-teal-400">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-teal-500 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-teal-400 disabled:opacity-60"
        >
          {loading ? "Starting checkout…" : `Get Pack — $${topic.price}`}
        </button>

        <p className="text-center text-xs text-slate-500">
          One-time payment · Instant download · Secured by Razorpay
        </p>
      </div>
    </form>
  );
}
