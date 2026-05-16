import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getTopic } from "@/lib/topics";

export const runtime = "nodejs";

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { purchaseId } = await request.json();

    if (!purchaseId) {
      return Response.json({ error: "Purchase ID is required" }, { status: 400 });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      return Response.json({ error: "Purchase not found" }, { status: 404 });
    }

    const topic = getTopic(purchase.topic_id);
    if (!topic) {
      return Response.json({ error: "Topic not found" }, { status: 404 });
    }

    const amountInCents = topic.price * 100;

    const order = await getRazorpay().orders.create({
      amount: amountInCents,
      currency: "USD",
      receipt: `pack_${purchaseId.slice(0, 20)}`,
      notes: {
        purchaseId,
        topicId: topic.id,
        topicTitle: topic.title,
        email: purchase.email,
      },
    });

    await prisma.purchase.update({
      where: { id: purchaseId },
      data: { razorpay_order_id: order.id },
    });

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      topicTitle: topic.title,
    });
  } catch (err) {
    console.error("Create order error:", err);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
