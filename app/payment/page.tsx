"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { getTopic } from "@/lib/topics";

interface Purchase {
  id: string;
  name: string | null;
  email: string;
  topic_id: string;
  tier: string;
  payment_status: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
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

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [paying, setPaying] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const topic = purchase ? getTopic(purchase.topic_id) : undefined;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/purchase?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPurchase(data.purchase ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handlePay() {
    if (!purchase || !topic || !scriptLoaded) return;
    setPaying(true);

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId: purchase.id }),
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
        currency: orderData.currency,
        name: "DataPath Academy",
        description: `${topic.title} — Assignment Pack`,
        order_id: orderData.orderId,
        prefill: { name: purchase.name ?? "", email: purchase.email },
        theme: { color: "#14b8a6" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                purchaseId: purchase.id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              router.push(`/success?id=${purchase.id}`);
            } else {
              toast.error(verifyData.error || "Payment verification failed");
              setPaying(false);
            }
          } catch {
            toast.error("Verification error. Please contact support.");
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-800 border-t-teal-400" />
      </div>
    );
  }

  if (!id || !purchase || !topic) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <p className="mb-4 text-slate-400">Purchase not found.</p>
        <Link href="/#topics" className="text-teal-400 hover:underline">
          Go back to topics
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

      <main className="min-h-screen bg-slate-950 px-4 py-12">
        <div className="mx-auto max-w-md">
          <Link
            href={`/topics/${topic.id}`}
            className="mb-6 inline-flex text-sm text-slate-500 hover:text-white"
          >
            ← Back to pack
          </Link>

          <div className="overflow-hidden rounded-2xl border border-slate-700">
            {/* Header */}
            <div className="bg-slate-900 px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                Assignment Pack · One-time payment
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-extrabold text-white">${topic.price}</span>
                <span className="mb-1 text-sm text-slate-400">USD</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{topic.title}</p>
            </div>

            <div className="bg-slate-950 p-8">
              {/* Includes */}
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  This pack includes
                </p>
                <ul className="space-y-2">
                  {topic.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-300">
                      <span className="mt-0.5 text-teal-400">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 border-t border-slate-800" />

              {/* Purchase details */}
              <div className="mb-6 rounded-xl bg-slate-900 px-5 py-4 text-sm">
                <div className="flex justify-between gap-4 text-slate-400">
                  <span>Access email</span>
                  <span className="truncate font-medium text-white">{purchase.email}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4 text-slate-400">
                  <span>Access type</span>
                  <span className="font-medium text-white">Lifetime</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={paying || !scriptLoaded}
                className="w-full rounded-xl bg-teal-500 py-4 text-base font-bold text-slate-950 transition hover:bg-teal-400 disabled:opacity-50"
              >
                {paying
                  ? "Processing..."
                  : !scriptLoaded
                  ? "Loading..."
                  : `Pay $${topic.price} and unlock`}
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                Secured by Razorpay · Assignments unlock immediately after payment.
              </p>
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
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-800 border-t-teal-400" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
