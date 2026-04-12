import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id required" }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({
    where: { id },
    select: { report_status: true, report_path: true },
  });

  if (!submission) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    status: submission.report_status,
    reportPath: submission.report_path,
  });
}
