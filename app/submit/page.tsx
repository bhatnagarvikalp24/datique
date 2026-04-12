"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

const VIBES = [
  "Casual / Chill",
  "Serious Relationship",
  "Funny / Witty",
  "Deep / Intellectual",
  "Adventurous",
];
const AGES = Array.from({ length: 58 }, (_, i) => i + 18); // 18–75

const MAX_FILE_SIZE_MB = 8;
const MAX_FILES = 10;
const MIN_FILES = 2;
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ── Screenshot Error Modal ────────────────────────────────────────────────────
type ModalError =
  | { type: "invalid_screenshots" }
  | { type: "platform_mismatch"; detectedApp: string; selectedApp: string };

function ScreenshotErrorModal({
  error,
  onRetry,
}: {
  error: ModalError;
  onRetry: () => void;
}) {
  const isMismatch = error.type === "platform_mismatch";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">

          {/* Top band */}
          <div
            className={`px-8 pt-10 pb-8 text-center ${
              isMismatch
                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                : "bg-gradient-to-br from-rose-500 to-pink-600"
            }`}
          >
            <div className="mb-3 text-6xl">{isMismatch ? "🔀" : "🙈"}</div>
            <h2 className="text-2xl font-extrabold text-white">
              {isMismatch ? "Wrong app screenshots" : "Not a dating profile"}
            </h2>
            <p className="mt-2 text-sm text-white/80">
              {isMismatch
                ? `You selected ${(error as { type: "platform_mismatch"; selectedApp: string }).selectedApp} but these look like ${(error as { type: "platform_mismatch"; detectedApp: string }).detectedApp} screenshots.`
                : "Our AI couldn't find a dating app profile in your images."}
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            {isMismatch ? (
              <>
                <p className="mb-4 text-sm text-gray-600">
                  Please either:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-xl">1️⃣</span>
                    <span className="text-sm text-gray-700">
                      Go back and change the <strong>App Used</strong> field to{" "}
                      <strong>{(error as { type: "platform_mismatch"; detectedApp: string }).detectedApp}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">2️⃣</span>
                    <span className="text-sm text-gray-700">
                      Or re-upload screenshots from{" "}
                      <strong>{(error as { type: "platform_mismatch"; selectedApp: string }).selectedApp}</strong> instead
                    </span>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  What to upload
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    ["📱", "Your Hinge, Bumble, or Tinder profile screen"],
                    ["🖼️", "Screenshots showing your photos and prompts"],
                    ["📝", "Your bio / about me section"],
                    ["✅", "At least 2 screenshots, ideally the full profile"],
                  ].map(([icon, text]) => (
                    <li key={text as string} className="flex items-start gap-3">
                      <span className="text-xl">{icon}</span>
                      <span className="text-sm text-gray-700">{text}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 mb-6">
                  <p className="text-xs text-amber-700">
                    <span className="font-semibold">Tip:</span> On Hinge, tap the edit profile icon and screenshot each section. On Bumble, go to your profile and screenshot the full view.
                  </p>
                </div>
              </>
            )}

            <button
              onClick={onRetry}
              className="w-full rounded-full bg-rose-500 py-4 text-base font-bold text-white shadow-md transition hover:bg-rose-600 active:scale-95"
            >
              Try Again →
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              You won&apos;t be charged until screenshots are successfully validated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    struggle: "",
    vibe: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState<ModalError | null>(null);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const errors: string[] = [];
    const valid: File[] = [];

    for (const file of selected) {
      if (!VALID_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" is not a valid image (JPG, PNG, WEBP only).`);
        continue;
      }
      if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
        errors.push(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }
      valid.push(file);
    }

    if (valid.length + files.length > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} screenshots allowed.`);
      const remaining = MAX_FILES - files.length;
      valid.splice(remaining);
    }

    setFileErrors(errors);
    const combined = [...files, ...valid];
    setFiles(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    setPreviews(updated.map((f) => URL.createObjectURL(f)));
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileErrors([]);
  }

  function handleRetry() {
    setModalError(null);
    setFiles([]);
    setPreviews([]);
    setFileErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Scroll to the screenshots section
    setTimeout(() => fileInputRef.current?.click(), 100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ── Client-side validations ──
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!form.age) {
      toast.error("Please select your age.");
      return;
    }
    if (!form.vibe) {
      toast.error("Please select your vibe.");
      return;
    }
    if (files.length < MIN_FILES) {
      toast.error(`Please upload at least ${MIN_FILES} screenshots.`);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("email", form.email);
      if (form.name) data.append("name", form.name);
      data.append("age", form.age);
      data.append("struggle", form.struggle);
      data.append("vibe", form.vibe);
      files.forEach((f) => data.append("screenshots", f));

      const res = await fetch("/api/submit", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      // ── Invalid screenshots (422) → show modal, not toast ──
      if (res.status === 422) {
        setModalError({ type: "invalid_screenshots" });
        return;
      }

      if (!res.ok) {
        toast.error(json.error || "Submission failed. Please try again.");
        return;
      }

      router.push(`/payment?id=${json.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      {/* Screenshot error modal */}
      {modalError && (
        <ScreenshotErrorModal error={modalError} onRetry={handleRetry} />
      )}

      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </Link>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Submit Your Profile
            </h1>
            <p className="mb-8 text-gray-500">
              Fill in the details below. Our AI analyses every element and generates
              your PDF report instantly after payment.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Your PDF report will be delivered here.
                </p>
              </div>

              {/* Age */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Age <span className="text-rose-500">*</span>
                </label>
                <select
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">Select age</option>
                  {AGES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Vibe */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Your Vibe <span className="text-rose-500">*</span>
                </label>
                <select
                  name="vibe"
                  value={form.vibe}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">What kind of person are you?</option>
                  {VIBES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Struggle */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  What are you struggling with?
                </label>
                <textarea
                  name="struggle"
                  value={form.struggle}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Getting matches but no replies, very few matches overall, unsure about photo order..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Screenshots */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Profile Screenshots <span className="text-rose-500">*</span>
                </label>
                <p className="mb-3 text-xs text-gray-400">
                  Upload at least 2 screenshots of your actual Hinge, Bumble, or Tinder profile.
                  Max {MAX_FILES} files · {MAX_FILE_SIZE_MB}MB each · JPG, PNG, WEBP
                </p>

                <div
                  className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition hover:border-rose-300 hover:bg-rose-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-3xl">📱</div>
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    Click to upload screenshots
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Must be actual dating app profile screenshots
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFiles}
                  className="hidden"
                />

                {/* File errors */}
                {fileErrors.length > 0 && (
                  <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3">
                    {fileErrors.map((err, i) => (
                      <p key={i} className="text-xs text-red-600">{err}</p>
                    ))}
                  </div>
                )}

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {previews.map((src, i) => (
                      <div key={i} className="group relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          className="h-24 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {files.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`text-xs font-medium ${
                        files.length >= MIN_FILES ? "text-green-600" : "text-rose-500"
                      }`}
                    >
                      {files.length >= MIN_FILES ? "✓" : "⚠"} {files.length} file
                      {files.length !== 1 ? "s" : ""} selected
                      {files.length < MIN_FILES && ` (need at least ${MIN_FILES})`}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-rose-500 py-4 text-base font-semibold text-white shadow-md transition hover:bg-rose-600 disabled:opacity-60 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {files.length > 0 ? "Validating screenshots…" : "Submitting…"}
                  </span>
                ) : (
                  "Continue to Payment →"
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                Screenshots are validated before payment. You won&apos;t be charged for invalid uploads.
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
