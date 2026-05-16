import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { TOPICS } from "@/lib/topics";

const TOPIC_ACCENTS: Record<string, { border: string; badge: string; glow: string }> = {
  sql:               { border: "border-blue-500/40",   badge: "bg-blue-500/20 text-blue-300",   glow: "hover:border-blue-400/70" },
  python:            { border: "border-amber-500/40",  badge: "bg-amber-500/20 text-amber-300", glow: "hover:border-amber-400/70" },
  "data-engineering":{ border: "border-purple-500/40", badge: "bg-purple-500/20 text-purple-300",glow: "hover:border-purple-400/70" },
  "cloud-computing": { border: "border-cyan-500/40",   badge: "bg-cyan-500/20 text-cyan-300",   glow: "hover:border-cyan-400/70" },
  "case-studies":    { border: "border-rose-500/40",   badge: "bg-rose-500/20 text-rose-300",   glow: "hover:border-rose-400/70" },
};

const TOPIC_ICONS: Record<string, string> = {
  sql: "⬡",
  python: "◎",
  "data-engineering": "⟳",
  "cloud-computing": "◈",
  "case-studies": "◆",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.12),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.08),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-medium text-teal-300 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            20 assignments · instant PDF · $15
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:mt-8 sm:text-6xl lg:text-7xl">
            Practice with{" "}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              real assignments.
            </span>
            <br />
            Learn from{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              explained solutions.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
            Topic-wise assignment packs for SQL, Python, Data Engineering, Cloud, and Case Studies.
            Pay once, download instantly, keep forever.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center">
            <Link
              href="#topics"
              className="w-full rounded-xl bg-teal-500 px-8 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-teal-400 sm:w-auto"
            >
              Browse Topics
            </Link>
            <Link
              href="#pricing"
              className="w-full rounded-xl border border-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white sm:w-auto"
            >
              See Pricing
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
            {["Downloadable PDFs", "Assignments + Solutions", "One-time payment", "Lifetime access"].map((pill) => (
              <span key={pill} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-400">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
              Assignment Packs
            </p>
            <h2 className="mt-3 text-4xl font-bold">Choose your topic</h2>
            <p className="mt-3 text-slate-400">
              Each pack comes as downloadable PDFs — assignments and fully explained solutions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic) => {
              const accent = TOPIC_ACCENTS[topic.id] ?? TOPIC_ACCENTS["sql"];
              const icon = TOPIC_ICONS[topic.id] ?? "●";
              return (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className={`group relative flex flex-col rounded-2xl border bg-slate-900 p-6 transition ${accent.border} ${accent.glow}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`rounded-xl px-2.5 py-1 text-lg font-bold ${accent.badge}`}>
                      {icon}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
                      {topic.assignmentCount} assignments
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-white">{topic.shortTitle}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-400">{topic.tagline}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">One-time</p>
                      <p className="text-xl font-bold text-white">${topic.price}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-500 transition group-hover:text-white">
                      View pack →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you get strip */}
      <section className="border-y border-slate-800 bg-slate-900 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: "✎",
                title: "Real Assignments",
                body: "Topic-wise questions used in real jobs and interviews — not generic exercises.",
              },
              {
                icon: "◉",
                title: "Explained Solutions",
                body: "Every answer comes with a full walkthrough so you actually understand it.",
              },
              {
                icon: "↓",
                title: "Instant PDF Download",
                body: "Pay once, download immediately. Lifetime access, no subscriptions.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-lg font-bold text-teal-400">
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Simple &amp; flat</h2>
          <p className="mt-3 text-slate-400">Every topic is $15. One-time. Lifetime access.</p>

          <div className="mt-10 rounded-2xl border border-teal-500/40 bg-slate-900 p-8">
            <p className="text-6xl font-extrabold text-white">$15</p>
            <p className="mt-2 text-slate-400">per topic · one-time payment</p>
            <ul className="mt-8 space-y-3 text-left">
              {[
                "20 AI-generated assignments — instant PDF",
                "20 fully explained solutions — instant PDF",
                "Lifetime access",
                "All 5 topics available",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-0.5 text-teal-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="#topics"
              className="mt-8 block rounded-xl bg-teal-500 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-teal-400"
            >
              Browse Topics
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 px-4 py-12 text-center sm:px-6 sm:py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Start practising today.</h2>
          <p className="mt-4 text-slate-400">
            Pick any topic. Pay once. Solve assignments and learn from solutions.
          </p>
          <Link
            href="#topics"
            className="mt-8 inline-flex rounded-xl bg-teal-500 px-8 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-teal-400"
          >
            Browse Topics
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold text-white">DataPath Academy</span>
          <span>Real assignments. Explained solutions. One-time access.</span>
          <a href="mailto:connect@datapath.academy" className="hover:text-white">
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
