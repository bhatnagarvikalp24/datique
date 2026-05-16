import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />
      <section className="border-b border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            About DataPath Academy
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Practical data education for people who want to build real skills.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            DataPath Academy packages every course as a complete learning kit:
            theory, practical work, assignments, solutions, questions, tests,
            and an industry-style case study. The goal is simple: help learners
            practice the kind of work data teams actually do.
          </p>
          <Link
            href="/#courses"
            className="mt-8 inline-flex rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Browse Courses
          </Link>
        </div>
      </section>
    </main>
  );
}
