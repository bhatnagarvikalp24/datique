import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";
import { REPORTS_DIR } from "@/lib/paths";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/download-report/[id]">
) {
  const { id } = await ctx.params;

  const submission = await prisma.submission.findUnique({
    where: { id },
    select: { report_status: true, name: true, payment_status: true },
  });

  if (!submission || submission.payment_status !== "paid") {
    return new Response("Not found", { status: 404 });
  }

  if (submission.report_status !== "done") {
    return new Response("Report not ready yet", { status: 202 });
  }

  const filePath = path.join(REPORTS_DIR, `report_${id}.pdf`);

  let buffer: Buffer;
  try {
    buffer = await readFile(filePath);
  } catch {
    return new Response("Report file not found", { status: 404 });
  }

  const filename = `Datique_Report_${(submission.name ?? "Profile").replace(/\s+/g, "_")}.pdf`;
  const uint8 = new Uint8Array(buffer);

  return new Response(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": uint8.length.toString(),
    },
  });
}
