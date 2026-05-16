import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET — list all generated packs with purchase info
export async function GET() {
  const packs = await prisma.generatedPack.findMany({
    orderBy: { created_at: "desc" },
    include: {
      purchase: { select: { email: true, topic_id: true, tier: true } },
    },
  });

  return Response.json({
    packs: packs.map((p) => ({
      id: p.id,
      purchase_id: p.purchase_id,
      topic_id: p.topic_id,
      status: p.status,
      created_at: p.created_at,
      reviewed_at: p.reviewed_at,
      email: p.purchase.email,
      tier: p.purchase.tier,
      assignments: JSON.parse(p.assignments),
    })),
  });
}

// POST — approve or reject a pack
export async function POST(req: NextRequest) {
  const { packId, action } = await req.json();

  if (!packId || (action !== "approve" && action !== "reject")) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.generatedPack.update({
    where: { id: packId },
    data: {
      status: action === "approve" ? "approved" : "rejected",
      reviewed_at: new Date(),
    },
  });

  return Response.json({ success: true });
}
