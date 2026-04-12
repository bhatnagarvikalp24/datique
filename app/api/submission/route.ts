import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      app_used: true,
      payment_status: true,
    },
  });

  if (!submission) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ submission });
}
