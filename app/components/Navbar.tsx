"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-rose-500 tracking-tight">
          datique
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/about"
            className={`transition ${path === "/about" ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
          >
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
  );
}
