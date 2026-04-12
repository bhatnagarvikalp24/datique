import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = await prisma.submission.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      app_used: true,
      vibe: true,
      payment_status: true,
      created_at: true,
    },
  });

  return Response.json({ submissions });
}
