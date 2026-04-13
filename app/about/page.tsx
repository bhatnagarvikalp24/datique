import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-rose-500 tracking-tight">
            datique
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="font-medium text-gray-900">Our Story</Link>
            <Link
              href="/submit"
              className="rounded-full bg-rose-500 px-5 py-2 font-semibold text-white transition hover:bg-rose-600"
            >
              Get Reviewed →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="mb-4 inline-block rounded-full bg-rose-100 px-4 py-1.5 text-sm font-medium text-rose-600">
            Our Story
          </span>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            Built from a conversation I&apos;ve had{" "}
            <span className="text-rose-500">a hundred times.</span>
          </h1>
          <p className="text-lg text-gray-500">
            Datique didn&apos;t start in a boardroom. It started at a graduation party,
            when someone said the thing we&apos;d all been thinking.
          </p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl space-y-8 text-lg leading-relaxed text-gray-700">

          <p>
            It was graduation week. A group of us — guys who&apos;d been friends since
            first year — were sitting together, phones out, half-joking about our
            Hinge and Bumble stats. Someone asked, &quot;How many matches did you get
            this week?&quot;
          </p>

          <p>
            The answers came around the circle. <span className="font-semibold text-gray-900">Two. Zero. One. Maybe three if I&apos;m being generous.</span>
          </p>

          <p>
            Then one of the girls in our group said, almost casually:{" "}
            <span className="italic text-gray-900">
              &quot;I got 47 this week and I barely use it.&quot;
            </span>
          </p>

          <p>
            The table went quiet. Then someone laughed. Then everyone laughed —
            because it was funny, and because it was deeply, uncomfortably true.
          </p>

          {/* Stat callout */}
          <div className="my-10 rounded-2xl bg-gray-900 p-8 text-white">
            <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-rose-400">
              The data backs it up
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  stat: "1 in 100",
                  desc: "The average match rate for men on Hinge. Women average 10× that.",
                },
                {
                  stat: "Top 10%",
                  desc: "Of male profiles receive 58% of all female likes. The rest split the remaining 42%.",
                },
                {
                  stat: "3 seconds",
                  desc: "Average time spent by a woman before deciding to swipe left or right.",
                },
                {
                  stat: "78%",
                  desc: "Of men get almost no engagement — not because of looks, but because of profile quality.",
                },
              ].map(({ stat, desc }) => (
                <div key={stat} className="rounded-xl bg-gray-800 p-5">
                  <div className="mb-1 text-3xl font-extrabold text-rose-400">{stat}</div>
                  <div className="text-sm text-gray-400">{desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-gray-500">
              Sources: Hinge internal data reports, Tinder usage studies, OkCupid match rate research.
            </p>
          </div>

          <p>
            That conversation stuck with me. Because the disparity isn&apos;t fair —
            but it&apos;s also not random. The guys who do well on these apps aren&apos;t
            necessarily more attractive. They have better photos. Sharper prompts.
            A profile that tells a coherent story about who they are.
          </p>

          <p>
            The problem was that most guys had no way of knowing what was wrong
            with their profile. You can&apos;t see yourself the way someone else sees
            you in 3 seconds on a phone screen.
          </p>

          <p>
            That&apos;s exactly the gap Datique was built to close.
          </p>
        </div>
      </section>

      {/* ── What Datique Does ── */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            What Datique actually does
          </h2>
          <p className="mb-8 text-gray-500">
            We built a review engine trained on thousands of real profiles —
            calibrated against what actually works on Hinge, Bumble and Tinder,
            not a generic checklist.
          </p>
          <div className="space-y-4">
            {[
              {
                icon: "🔬",
                title: "Multi-dimensional profile analysis",
                desc: "Built on patterns from thousands of real dating profiles across Hinge, Bumble and Tinder — we analyse your photos, prompts, bio, and vibe together as a system, not in isolation. Because that&apos;s how a real person sees your profile.",
              },
              {
                icon: "🎯",
                title: "Specific, not generic",
                desc: "&quot;Your third photo is too dark and your posture looks closed-off&quot; beats &quot;improve your photos&quot; every single time. Datique is built around specificity.",
              },
              {
                icon: "✍️",
                title: "Rewrites, not just criticism",
                desc: "We don&apos;t just tell you what&apos;s wrong. We rewrite your prompts and bio in your voice, so you leave with something you can actually use.",
              },
              {
                icon: "📊",
                title: "Structured + prioritised",
                desc: "A 3-page PDF with scores, photo verdicts, and your 3 highest-impact fixes ranked by effort and impact. Not overwhelming — actionable.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-xl bg-white p-6 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="mb-1 font-semibold text-gray-900">{title}</div>
                  <p
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: desc }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing line ── */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 text-5xl">💌</div>
          <h2 className="mb-5 text-3xl font-extrabold text-gray-900">
            Your profile is a first impression.{" "}
            <span className="text-rose-500">Make it count.</span>
          </h2>
          <p className="mb-8 text-gray-500">
            You&apos;ve got three seconds. Make them want to know more.
            Datique gives you the honest, specific, actionable feedback you
            need to do exactly that — so you spend less time swiping,
            and more time actually connecting.
          </p>
          <Link
            href="/submit"
            className="inline-block rounded-full bg-rose-500 px-9 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-rose-600 active:scale-95"
          >
            Analyse My Profile – ₹199
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            One-time payment. Instant PDF. No fluff.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-gray-400 sm:flex-row">
          <span className="font-bold text-rose-500">datique</span>
          <span>We turn profiles into matches.</span>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-gray-700 transition">Our Story</Link>
            <Link href="/submit" className="hover:text-gray-700 transition">Get Reviewed</Link>
            <a href="mailto:connect@datique.co.in" className="hover:text-gray-700 transition">Contact</a>
          </div>
          <span>© {new Date().getFullYear()} Datique</span>
        </div>
      </footer>
    </main>
  );
}
