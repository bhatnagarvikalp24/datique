import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { embedText, buildCorpusText } from "@/lib/embeddings";

export const runtime = "nodejs";

function authorize(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token");
  return !!token && token === process.env.ADMIN_PASSWORD;
}

// ── GET: list all corpus entries ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.profileCorpus.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      app: true,
      tier: true,
      age_bracket: true,
      vibe: true,
      description: true,
      photos_desc: true,
      prompts: true,
      bio: true,
      notes: true,
      created_at: true,
      // omit embedding from list — large payload
    },
  });

  return Response.json({ entries });
}

// ── POST: add a new corpus entry (auto-embeds) ────────────────────────────────
export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { app, tier, age_bracket, vibe, description, photos_desc, prompts, bio, notes } = body;

  if (!app || !tier || !age_bracket || !vibe || !description || !photos_desc || !prompts) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const text = buildCorpusText({ app, tier, age_bracket, vibe, description, photos_desc, prompts, bio });
  const embedding = await embedText(text);

  const entry = await prisma.profileCorpus.create({
    data: {
      app,
      tier,
      age_bracket,
      vibe,
      description,
      photos_desc,
      prompts,
      bio: bio || null,
      notes: notes || null,
      embedding: JSON.stringify(embedding),
    },
  });

  return Response.json({ id: entry.id }, { status: 201 });
}

// ── DELETE: remove a corpus entry ─────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  if (!authorize(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return Response.json({ error: "id required" }, { status: 400 });

  await prisma.profileCorpus.delete({ where: { id } });
  return Response.json({ ok: true });
}
