import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopic } from "@/lib/topics";
import { getTopicAssignments } from "@/lib/assignments";
import { AssignmentsPDF, SolutionsPDF } from "@/lib/pdf-documents";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ purchaseId: string; type: string }> }
) {
  const { purchaseId, type } = await params;

  if (type !== "assignments" && type !== "solutions") {
    return Response.json({ error: "Invalid type" }, { status: 400 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    select: { topic_id: true, payment_status: true },
  });

  if (!purchase || purchase.payment_status !== "paid") {
    return Response.json({ error: "Purchase not found or not paid" }, { status: 403 });
  }

  const topic = getTopic(purchase.topic_id);
  if (!topic) {
    return Response.json({ error: "Topic not found" }, { status: 404 });
  }

  const assignments = getTopicAssignments(purchase.topic_id);
  if (assignments.length === 0) {
    return Response.json({ error: "No assignments available yet" }, { status: 404 });
  }

  const doc =
    type === "assignments" ? (
      <AssignmentsPDF topicTitle={topic.title} topicShortTitle={topic.shortTitle} assignments={assignments} />
    ) : (
      <SolutionsPDF topicTitle={topic.title} topicShortTitle={topic.shortTitle} assignments={assignments} />
    );

  const buffer = await renderToBuffer(doc);
  const filename = `datapath-${topic.id}-${type}.pdf`;
  const uint8 = new Uint8Array(buffer);

  return new Response(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(uint8.byteLength),
    },
  });
}
