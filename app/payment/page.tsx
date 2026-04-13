"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

interface Submission {
  id: string;
  name: string | null;
  email: string;
  age: number;
  app_used: string;
  payment_status: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  image?: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

const WHATS_INCLUDED = [
  "Overall score across 5 dimensions",
  "Photo-by-photo breakdown with verdicts",
  "Your prompts rewritten in your voice",
  "3 highest-impact fixes, ranked",
  "Full bio rewrite",
  "Vibe & positioning analysis",
];

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch(`/api/submission?id=${id}`)
      .then((r) => r.json())
      .then((data) => { setSubmission(data.submission ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function handlePay() {
    if (!submission || !scriptLoaded) return;
    setPaying(true);

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.error || "Failed to create order");
        setPaying(false);
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: "INR",
        name: "Datique",
        description: "Dating Profile Review — 3-page PDF report",
        order_id: orderData.orderId,
        prefill: {
          name: submission.name ?? "",
          email: submission.email,
        },
        theme: { color: "#f43f5e" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                submissionId: submission.id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              router.push(`/success?id=${submission.id}`);
            } else {
              toast.error(verifyData.error || "Payment verification failed");
              setPaying(false);
            }
          } catch {
            toast.error("Verification error. Please contact support.");
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => { setPaying(false); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-200 border-t-rose-500" />
      </div>
    );
  }

  if (!id || !submission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <p className="mb-4 text-gray-500">Submission not found.</p>
        <Link href="/submit" className="text-rose-500 hover:underline">
          Go back and submit your profile
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />

      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-lg">

          <Link
            href="/submit"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </Link>

          {/* Progress indicator */}
          <div className="mb-8 flex items-center gap-2 text-xs text-gray-400">
            <span className="text-gray-300">Submit Profile</span>
            <span>→</span>
            <span className="font-semibold text-rose-500">Payment</span>
            <span>→</span>
            <span className="text-gray-300">Get Report</span>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            {/* Header band */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-6 text-white">
              <p className="text-sm font-medium text-rose-100 mb-1">One-time payment</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold">₹199</span>
                <span className="mb-1 text-rose-200 line-through text-sm">₹999</span>
              </div>
              <p className="mt-1 text-sm text-rose-100">
                Full profile review · Instant PDF · No subscription
              </p>
            </div>

            <div className="p-8">

              {/* What's included */}
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  What you get
                </p>
                <ul className="space-y-2">
                  {WHATS_INCLUDED.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 text-xs font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div className="mb-6 border-t border-gray-100" />

              {/* Order details */}
              <div className="mb-6 rounded-xl bg-gray-50 px-5 py-4 text-sm">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>For</span>
                  <span className="font-medium text-gray-900 truncate max-w-[200px]">
                    {submission.email}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivers to</span>
                  <span className="font-medium text-gray-900">PDF download</span>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={paying || !scriptLoaded}
                className="w-full rounded-full bg-rose-500 py-4 text-base font-bold text-white shadow-md transition hover:bg-rose-600 disabled:opacity-60 active:scale-95"
              >
                {paying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing…
                  </span>
                ) : !scriptLoaded ? (
                  "Loading payment…"
                ) : (
                  "Pay ₹199 & Get My Report →"
                )}
              </button>

              {/* Trust row */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <span>🔒</span>
                <span>Secured by Razorpay · UPI, Cards, Netbanking accepted</span>
              </div>

              {/* Guarantee note */}
              <div className="mt-4 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-center">
                <p className="text-xs text-green-700">
                  <span className="font-semibold">Report delivered instantly</span> after payment.
                  Issues? Email <a href="mailto:connect@datique.co.in" className="underline">connect@datique.co.in</a> and we&apos;ll make it right.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-200 border-t-rose-500" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
