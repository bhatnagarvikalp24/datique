import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseId } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !purchaseId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: { payment_status: "failed" },
      });
      return Response.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        payment_status: "paid",
        razorpay_payment_id,
      },
    });

    // Kick off AI generation in the background — don't await so payment response is instant
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    fetch(`${baseUrl}/api/generate/${purchaseId}`, { method: "POST" }).catch((err) =>
      console.error("Failed to trigger generation:", err)
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("Verify payment error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
