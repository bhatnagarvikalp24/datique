import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopicAssignments } from "@/lib/assignments";
import type { Assignment } from "@/lib/assignments";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params;

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { generated_pack: true },
  });

  if (!purchase || purchase.payment_status !== "paid") {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  // Use approved generated pack if available, else static assignments
  let source: Pick<Assignment, "id" | "number" | "title" | "difficulty">[];

  if (purchase.generated_pack?.status === "approved") {
    const all: Assignment[] = JSON.parse(purchase.generated_pack.assignments);
    source = all.map((a) => ({ id: a.id, number: a.number, title: a.title, difficulty: a.difficulty }));
  } else {
    source = getTopicAssignments(purchase.topic_id).map((a) => ({
      id: a.id,
      number: a.number,
      title: a.title,
      difficulty: a.difficulty,
    }));
  }

  const packStatus = purchase.generated_pack?.status ?? null;

  return Response.json({ assignments: source, packStatus });
}
