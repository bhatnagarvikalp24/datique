import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, submissionId } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !submissionId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Mark payment as failed
      await prisma.submission.update({
        where: { id: submissionId },
        data: { payment_status: "failed" },
      });
      return Response.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update DB: payment verified
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        payment_status: "paid",
        razorpay_payment_id,
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Verify payment error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
