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

// Razorpay options type
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: { color: string };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/submission?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSubmission(data.submission ?? null);
        setLoading(false);
      })
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
        description: "Dating Profile Review",
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
              toast.success("Payment Successful! 🎉");
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
          ondismiss: () => {
            toast.error("Payment cancelled");
            setPaying(false);
          },
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
        <div className="text-gray-400">Loading...</div>
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
        <div className="mx-auto max-w-md">
          <Link
            href="/submit"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </Link>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              Complete Your Order
            </h1>
            <p className="mb-8 text-sm text-gray-500">
              One step away from getting your profile reviewed.
            </p>

            {/* Order summary */}
            <div className="mb-8 rounded-xl bg-gray-50 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium text-gray-900">
                    Dating Profile Review
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">App</span>
                  <span className="font-medium text-gray-900">
                    {submission.app_used}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900 truncate max-w-[180px]">
                    {submission.email}
                  </span>
                </div>
                <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-rose-500">₹199</span>
                </div>
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={paying || !scriptLoaded}
              className="w-full rounded-full bg-rose-500 py-4 text-base font-semibold text-white shadow-md transition hover:bg-rose-600 disabled:opacity-60 active:scale-95"
            >
              {paying ? "Processing..." : "Pay ₹199 Securely →"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>🔒</span>
              <span>Secured by Razorpay. We never store your card details.</span>
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
          <div className="text-gray-400">Loading...</div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
