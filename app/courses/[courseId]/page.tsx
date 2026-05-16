import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import EnrollmentForm from "@/app/components/EnrollmentForm";
import { getCourse } from "@/lib/courses";

export default async function CoursePreviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);

  if (!course) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <section className="border-b border-slate-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <Link href="/#courses" className="text-sm text-slate-500 hover:text-slate-950">
              Back to courses
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-teal-700">
              {course.level} · {course.duration}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {course.description}
            </p>
            <div className="mt-6 border-l-4 border-teal-600 bg-white p-5">
              <p className="text-sm font-semibold text-slate-950">Course promise</p>
              <p className="mt-2 text-slate-600">{course.promise}</p>
            </div>
          </div>

          <aside className="h-fit border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-500">Lifetime access</p>
                <p className="text-4xl font-bold text-slate-950">${course.priceUsd}</p>
              </div>
              <span className="rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                One-time
              </span>
            </div>
            <EnrollmentForm courseId={course.id} priceUsd={course.priceUsd} />
            <p className="mt-4 text-xs leading-5 text-slate-500">
              After payment, you unlock the full course dashboard with lessons,
              practicals, assignments, solutions, test series, and case study material.
            </p>
          </aside>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Outcomes
            </p>
            <h2 className="mt-2 text-3xl font-bold">What you will be able to do</h2>
            <div className="mt-6 space-y-3">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="border border-slate-200 p-4 text-sm font-medium text-slate-700">
                  {outcome}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Included after payment
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {course.includes.map((item) => (
                <div key={item} className="bg-slate-50 p-4 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-300">
            Curriculum preview
          </p>
          <h2 className="mt-2 text-3xl font-bold">Course modules</h2>
          <div className="mt-8 space-y-4">
            {course.modules.map((module, index) => (
              <div key={module.title} className="border border-slate-700 bg-slate-900 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <p className="text-sm font-semibold text-teal-300">
                      Module {index + 1}
                    </p>
                    <h3 className="mt-1 text-xl font-bold">{module.title}</h3>
                  </div>
                  <span className="text-sm text-slate-400">
                    Practical + assignment + test
                  </span>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Lessons
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {module.lessons.map((lesson) => (
                        <li key={lesson}>{lesson}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p><span className="font-semibold text-white">Practical:</span> {module.practical}</p>
                    <p><span className="font-semibold text-white">Assignment:</span> {module.assignment}</p>
                    <p><span className="font-semibold text-white">Solution:</span> {module.solution}</p>
                    <p><span className="font-semibold text-white">Test:</span> {module.test}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl border border-slate-200 p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Live industry case
          </p>
          <h2 className="mt-2 text-3xl font-bold">{course.caseStudy.title}</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">{course.caseStudy.brief}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {course.caseStudy.deliverables.map((deliverable) => (
              <div key={deliverable} className="bg-slate-50 p-4 text-sm font-medium text-slate-700">
                {deliverable}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
