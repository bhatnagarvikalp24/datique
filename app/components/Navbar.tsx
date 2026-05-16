"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-base font-bold tracking-tight text-white sm:text-lg">
          DataPath Academy
        </Link>
        <div className="flex items-center gap-3 text-sm sm:gap-6">
          <Link href="/#topics" className="hidden text-slate-400 transition hover:text-white sm:block">
            Topics
          </Link>
          <Link href="/#pricing" className="hidden text-slate-400 transition hover:text-white sm:block">
            Pricing
          </Link>
          <Link
            href="/#topics"
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
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
