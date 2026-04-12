import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return Response.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return Response.json({ error: "Submission not found" }, { status: 404 });
    }

    const order = await getRazorpay().orders.create({
      amount: 19900, // ₹199 in paise
      currency: "INR",
      receipt: `receipt_${submissionId.slice(0, 20)}`,
      notes: {
        submissionId,
        email: submission.email,
      },
    });

    // Save order ID to submission
    await prisma.submission.update({
      where: { id: submissionId },
      data: { razorpay_order_id: order.id },
    });

    return Response.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("Create order error:", err);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
