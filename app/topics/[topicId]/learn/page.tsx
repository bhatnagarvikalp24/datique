import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { getTopic } from "@/lib/topics";
import { getTopicAssignments } from "@/lib/assignments";

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ purchaseId?: string }>;
}) {
  const { topicId } = await params;
  const { purchaseId } = await searchParams;
  const topic = getTopic(topicId);

  if (!topic) notFound();

  // TODO: re-enable payment gate before launch
  const purchase = { email: "preview@datapath.academy" };

  const assignments = getTopicAssignments(topicId);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-400">
              {topic.shortTitle} · Your Assignments
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {topic.title}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Logged in as <span className="font-medium text-slate-200">{purchase.email}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{assignments.length}</p>
            <p className="text-xs text-slate-500">assignments</p>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <p className="text-slate-400">No assignments published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/topics/${topicId}/learn/${assignment.id}?purchaseId=${purchaseId}`}
                className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-teal-500/50 hover:bg-slate-800"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-400 group-hover:bg-teal-900 group-hover:text-teal-300">
                  {String(assignment.number).padStart(2, "0")}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-white">{assignment.title}</p>
                  <p className="mt-0.5 text-sm text-slate-400 line-clamp-1">
                    {assignment.objective}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      DIFFICULTY_STYLES[assignment.difficulty]
                    }`}
                  >
                    {assignment.difficulty}
                  </span>
                  <span className="text-sm text-slate-500 group-hover:text-teal-400">
                    Solve →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
