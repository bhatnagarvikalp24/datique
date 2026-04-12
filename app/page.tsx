import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-rose-500 tracking-tight">
            datique
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="text-gray-500 hover:text-gray-900 transition">
              Our Story
            </Link>
            <Link
              href="/submit"
              className="rounded-full bg-rose-500 px-5 py-2 font-semibold text-white transition hover:bg-rose-600"
            >
              Get Reviewed →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-white px-6 py-24 text-center">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-rose-100 opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-pink-100 opacity-50 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="mb-5 inline-block rounded-full bg-rose-100 px-4 py-1.5 text-sm font-medium text-rose-600">
            AI-Powered Profile Analysis
          </span>
          <h1 className="mb-5 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl">
            We turn profiles{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-rose-500">into matches.</span>
              <span className="absolute bottom-1 left-0 z-0 h-3 w-full rounded bg-rose-100 opacity-60" />
            </span>
          </h1>
          <p className="mb-10 text-lg text-gray-500 sm:text-xl">
            Datique&apos;s AI analyses your Hinge, Bumble or Tinder profile — photos,
            prompts, vibe — and delivers a brutally honest, actionable PDF report
            so you know exactly what to fix.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/submit"
              className="inline-block rounded-full bg-rose-500 px-9 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-rose-600 hover:shadow-xl active:scale-95"
            >
              Analyse My Profile – ₹199
            </Link>
            <Link
              href="/about"
              className="inline-block rounded-full border border-gray-200 px-7 py-4 text-sm font-medium text-gray-600 transition hover:border-rose-300 hover:text-rose-500"
            >
              Why Datique?
            </Link>
          </div>
          <p className="mt-5 text-xs text-gray-400">
            One-time ₹199 · PDF delivered instantly · No subscriptions
          </p>
        </div>
      </section>

      {/* ── The Uncomfortable Truth (stat hook) ─────────────────── */}
      <section className="bg-gray-900 px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-rose-400">
            The uncomfortable truth
          </p>
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            The average guy gets{" "}
            <span className="text-rose-400">1 match per 100 swipes.</span>
          </h2>
          <p className="mb-10 text-gray-400">
            The top 10% of male profiles get{" "}
            <span className="font-semibold text-white">58% of all matches</span>{" "}
            on Hinge. The difference between them and everyone else isn&apos;t looks —
            it&apos;s profile execution. Datique helps you cross that line.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { stat: "~1%", label: "Average male match rate on Hinge" },
              { stat: "10×", label: "More matches the top profiles get vs. average" },
              { stat: "3 sec", label: "Time a woman spends before swiping left" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-2xl bg-gray-800 p-6">
                <div className="mb-1 text-4xl font-extrabold text-rose-400">{stat}</div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-rose-400">
            Simple process
          </p>
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            From submission to report in minutes
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: "📸",
                title: "Upload Your Profile",
                desc: "Submit screenshots of your full profile — photos, prompts, bio. We analyse everything.",
              },
              {
                step: "02",
                icon: "🤖",
                title: "AI Does the Work",
                desc: "Our deep-learning engine — built on multimodal vision models and trained on real dating app behavioural data — scores every element of your profile simultaneously.",
              },
              {
                step: "03",
                icon: "📄",
                title: "Get Your PDF Report",
                desc: "A 3-page structured report with scores, rewrites, and your 3 highest-impact fixes. Ready instantly.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative rounded-2xl bg-gray-50 p-7">
                <div className="mb-4 text-4xl">{icon}</div>
                <div className="absolute right-5 top-5 text-5xl font-extrabold text-gray-100">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's in the Report ─────────────────────────────────── */}
      <section className="bg-rose-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-rose-400">
            Your deliverable
          </p>
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            A 3-page PDF that does the thinking for you
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "📊", title: "Overall Score + 5 Dimensions", desc: "Photo quality, variety, bio authenticity, humor, intent clarity — all scored." },
              { icon: "📸", title: "Photo-by-Photo Breakdown", desc: "Each photo scored /10, verdict (Keep / Improve / Replace), and one specific fix." },
              { icon: "✍️", title: "Prompt Rewrites", desc: "Your actual prompts rewritten in your voice. Copy-paste ready." },
              { icon: "🎯", title: "3 Highest-Impact Fixes", desc: "Ranked by effort vs. impact so you know exactly where to start." },
              { icon: "💬", title: "Full Bio Rewrite", desc: "A complete rewrite based on signals from your profile." },
              { icon: "🧠", title: "Vibe & Positioning Analysis", desc: "Are you attracting the people you actually want? We check." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="mb-1 font-semibold text-gray-900">{title}</div>
                  <div className="text-sm text-gray-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-rose-500 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-4xl font-extrabold">
            Stop guessing. Start matching.
          </h2>
          <p className="mb-8 text-lg text-rose-100">
            For ₹199 — less than a single date — get a complete AI analysis of
            your profile with actionable fixes that actually move the needle.
          </p>
          <Link
            href="/submit"
            className="inline-block rounded-full bg-white px-10 py-4 text-lg font-bold text-rose-500 shadow-lg transition hover:bg-rose-50 active:scale-95"
          >
            Analyse My Profile – ₹199
          </Link>
          <p className="mt-4 text-sm text-rose-200">
            Report generated instantly · No recurring charges
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-gray-400 sm:flex-row">
          <span className="font-bold text-rose-500">datique</span>
          <span>We turn profiles into matches.</span>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-gray-700 transition">Our Story</Link>
            <Link href="/submit" className="hover:text-gray-700 transition">Get Reviewed</Link>
            <a href="mailto:venturesloading@gmail.com" className="hover:text-gray-700 transition">Contact</a>
          </div>
          <span>© {new Date().getFullYear()} Datique</span>
        </div>
      </footer>
    </main>
  );
}
