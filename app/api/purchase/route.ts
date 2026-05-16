import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopic } from "@/lib/topics";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id required" }, { status: 400 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      topic_id: true,
      tier: true,
      payment_status: true,
    },
  });

  if (!purchase) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ purchase });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email as string | undefined)?.trim().toLowerCase() ?? "";
    const name = (body.name as string | undefined)?.trim() || null;
    const topicId = (body.topicId as string | undefined)?.trim() ?? "";
    const tier = (body.tier as string | undefined) === "pro" ? "pro" : "basic";

    if (!email || !isValidEmail(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!getTopic(topicId)) {
      return Response.json({ error: "Topic not found." }, { status: 404 });
    }

    const recentCount = await prisma.purchase.count({
      where: {
        email,
        topic_id: topicId,
        payment_status: "pending_payment",
        created_at: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });

    if (recentCount >= 3) {
      return Response.json(
        { error: "Too many checkout attempts. Please wait an hour or contact support." },
        { status: 429 }
      );
    }

    const purchase = await prisma.purchase.create({
      data: {
        email,
        name,
        topic_id: topicId,
        tier,
        payment_status: "pending_payment",
      },
    });

    return Response.json({ id: purchase.id }, { status: 201 });
  } catch (err) {
    console.error("Purchase create error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
