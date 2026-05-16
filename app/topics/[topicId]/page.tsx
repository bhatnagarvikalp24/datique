import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import PurchaseForm from "@/app/components/PurchaseForm";
import { getTopic } from "@/lib/topics";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getTopic(topicId);

  if (!topic) notFound();


  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Header */}
      <section className="border-b border-slate-800 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <Link href="/#topics" className="text-sm text-slate-500 hover:text-white">
              ← Back to topics
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-teal-400 sm:mt-8">
              Assignment Pack · {topic.assignmentCount} assignments
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {topic.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:mt-5 sm:text-lg sm:leading-8">
              {topic.description}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8">
              {[
                { value: topic.assignmentCount, label: "Assignments" },
                { value: `$${topic.price}`, label: "One-time" },
                { value: "∞", label: "Lifetime" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center sm:p-4">
                  <p className="text-lg font-bold text-teal-400 sm:text-xl">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase card */}
          <aside className="h-fit rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6 lg:sticky lg:top-24">
            <PurchaseForm topic={topic} />
          </aside>
        </div>
      </section>

      {/* What the assignments cover */}
      <section className="px-4 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            Coverage
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">What the assignments cover</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Every subtopic includes graded assignments with fully worked solutions.
          </p>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {topic.subtopics.map((subtopic, i) => (
              <div
                key={subtopic}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <span className="mt-0.5 text-xs font-bold text-teal-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-medium text-slate-300">{subtopic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get after paying */}
      <section className="border-y border-slate-800 bg-slate-900 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            After payment
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">What you unlock</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: "↓",
                title: "Download Instantly",
                body: "PDFs unlock immediately after payment. No waiting, no approval.",
              },
              {
                icon: "✎",
                title: "Real Assignments",
                body: "Topic-wise questions that mirror real job tasks and technical interviews.",
              },
              {
                icon: "◉",
                title: "Explained Solutions",
                body: "Every answer includes a full walkthrough — not just the final answer.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-700 bg-slate-800 p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-xl font-bold text-teal-400">
                  {item.icon}
                </span>
                <p className="mt-4 font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-800 bg-slate-900 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                q: "How do I get the PDFs?",
                a: "Your 20 assignment and solution PDFs are generated instantly after payment — no waiting.",
              },
              {
                q: "What's included?",
                a: "20 assignments PDF + 20 fully explained solutions PDF. Each assignment is its own downloadable file.",
              },
              {
                q: "Can I buy multiple topics?",
                a: "Yes — each topic is purchased separately for $15. Every pack comes with lifetime access.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                <p className="font-semibold text-white">{q}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
