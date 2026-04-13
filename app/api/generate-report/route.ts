import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateProfile } from "@/lib/evaluator";
import { ProfileReportPDF } from "@/lib/pdf-report";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement, JSXElementConstructor } from "react";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { REPORTS_DIR } from "@/lib/paths";
import React from "react";

export const runtime = "nodejs";
// Allow up to 5 minutes for GPT-4o + PDF rendering
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return Response.json({ error: "submissionId required" }, { status: 400 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return Response.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.payment_status !== "paid") {
      return Response.json({ error: "Payment not verified" }, { status: 403 });
    }

    // Already generated?
    if (submission.report_status === "done" && submission.report_path) {
      return Response.json({
        status: "done",
        reportPath: submission.report_path,
      });
    }

    // Mark as processing
    await prisma.submission.update({
      where: { id: submissionId },
      data: { report_status: "processing" },
    });

    // Parse screenshot paths
    const screenshotPaths: string[] = JSON.parse(submission.screenshots);

    // ── Step 1: GPT-4o evaluation ──────────────────────────────────────────
    const report = await evaluateProfile({
      name: submission.name,
      age: submission.age,
      app_used: submission.app_used,
      struggle: submission.struggle,
      vibe: submission.vibe,
      screenshotPaths,
    });

    // ── Step 2: Render PDF ─────────────────────────────────────────────────
    let pdfBuffer: Buffer;
    try {
      const element = React.createElement(ProfileReportPDF, {
        report,
        submissionMeta: {
          name: submission.name,
          age: submission.age,
          app: submission.app_used,
        },
      }) as ReactElement<DocumentProps, string | JSXElementConstructor<unknown>>;
      pdfBuffer = await renderToBuffer(element);
    } catch (pdfErr) {
      console.error("PDF rendering failed:", pdfErr);
      await prisma.submission.update({
        where: { id: submissionId },
        data: { report_status: "failed" },
      });
      return Response.json({ error: "PDF generation failed" }, { status: 500 });
    }

    // ── Step 3: Save PDF ───────────────────────────────────────────────────
    await mkdir(REPORTS_DIR, { recursive: true });

    const filename = `report_${submissionId}.pdf`;
    const filePath = path.join(REPORTS_DIR, filename);
    await writeFile(filePath, pdfBuffer);

    const reportPath = `/api/download-report/${submissionId}`;

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        report_status: "done",
        report_path: reportPath,
      },
    });

    return Response.json({ status: "done", reportPath });
  } catch (err) {
    console.error("Generate report error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
