"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          DataPath Academy
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/#topics"
            className="text-slate-400 transition hover:text-white"
          >
            Topics
          </Link>
          <Link
            href="/#pricing"
            className="text-slate-400 transition hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/#topics"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              path?.startsWith("/topics")
                ? "bg-slate-800 text-white"
                : "bg-teal-500 text-slate-950 hover:bg-teal-400"
            }`}
          >
            Browse Packs
          </Link>
        </div>
      </div>
    </nav>
  );
}
