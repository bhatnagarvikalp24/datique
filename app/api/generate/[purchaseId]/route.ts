import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopic } from "@/lib/topics";
import { generateAssignments } from "@/lib/generation";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min — generation + validation takes time

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params;

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { generated_pack: true },
  });

  if (!purchase || purchase.payment_status !== "paid") {
    return Response.json({ error: "Purchase not found or not paid" }, { status: 403 });
  }

  if (purchase.generated_pack) {
    return Response.json({ error: "Pack already generated", status: purchase.generated_pack.status });
  }

  const topic = getTopic(purchase.topic_id);
  if (!topic) {
    return Response.json({ error: "Topic not found" }, { status: 404 });
  }

  const result = await generateAssignments(topic.id, topic.shortTitle, topic.subtopics);

  if (!result.success) {
    console.error("Generation failed:", result.error);
    return Response.json({ error: result.error }, { status: 500 });
  }

  await prisma.generatedPack.create({
    data: {
      purchase_id: purchaseId,
      topic_id: topic.id,
      status: "approved",
      assignments: JSON.stringify(result.assignments),
    },
  });

  return Response.json({ success: true, count: result.assignments.length });
}
