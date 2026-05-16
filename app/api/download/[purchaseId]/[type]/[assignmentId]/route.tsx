import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopic } from "@/lib/topics";
import { getAssignment } from "@/lib/assignments";
import type { Assignment } from "@/lib/assignments";
import { AssignmentPDF, SolutionPDF } from "@/lib/pdf-documents";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ purchaseId: string; type: string; assignmentId: string }> }
) {
  const { purchaseId, type, assignmentId } = await params;

  if (type !== "assignment" && type !== "solution") {
    return Response.json({ error: "Invalid type" }, { status: 400 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { generated_pack: true },
  });

  if (!purchase || purchase.payment_status !== "paid") {
    return Response.json({ error: "Purchase not found or not paid" }, { status: 403 });
  }

  const topic = getTopic(purchase.topic_id);
  if (!topic) {
    return Response.json({ error: "Topic not found" }, { status: 404 });
  }

  // Prefer approved generated pack; fall back to static assignments
  let assignment: Assignment | undefined;

  if (purchase.generated_pack?.status === "approved") {
    const all: Assignment[] = JSON.parse(purchase.generated_pack.assignments);
    assignment = all.find((a) => a.id === assignmentId);
  }

  if (!assignment) {
    assignment = getAssignment(purchase.topic_id, assignmentId);
  }

  if (!assignment) {
    return Response.json({ error: "Assignment not found" }, { status: 404 });
  }

  const doc =
    type === "assignment" ? (
      <AssignmentPDF
        topicTitle={topic.title}
        topicShortTitle={topic.shortTitle}
        assignment={assignment}
      />
    ) : (
      <SolutionPDF
        topicTitle={topic.title}
        topicShortTitle={topic.shortTitle}
        assignment={assignment}
      />
    );

  const buffer = await renderToBuffer(doc);
  const num = String(assignment.number).padStart(2, "0");
  const filename = `datapath-${topic.id}-${type}-${num}.pdf`;
  const uint8 = new Uint8Array(buffer);

  return new Response(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(uint8.byteLength),
    },
  });
}
