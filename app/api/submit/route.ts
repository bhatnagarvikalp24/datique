import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateProfileScreenshots } from "@/lib/validateScreenshots";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { UPLOADS_DIR, resolveStoredPath } from "@/lib/paths";

export const runtime = "nodejs";
// Allow time for gpt-4o-mini screenshot validation
export const maxDuration = 60;

const VALID_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_MB = 8;
const MAX_FILES = 10;
const MIN_FILES = 2;
const MAX_TOTAL_SIZE_MB = 40;
const VALID_VIBES = [
  "Casual / Chill",
  "Serious Relationship",
  "Funny / Witty",
  "Deep / Intellectual",
  "Adventurous",
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const email     = (formData.get("email") as string | null)?.trim() ?? "";
    const name      = (formData.get("name") as string | null)?.trim() || null;
    const ageRaw    = formData.get("age") as string | null;
    const struggle  = (formData.get("struggle") as string | null)?.trim() ?? "";
    const vibe      = (formData.get("vibe") as string | null)?.trim() ?? "";
    const files     = formData.getAll("screenshots") as File[];

    // ── Field validations ──────────────────────────────────────────────────

    if (!email || !isValidEmail(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const age = parseInt(ageRaw ?? "", 10);
    if (isNaN(age) || age < 18 || age > 75) {
      return Response.json(
        { error: "Please select a valid age (18–75)." },
        { status: 400 }
      );
    }

    if (!VALID_VIBES.includes(vibe)) {
      return Response.json(
        { error: "Please select a valid vibe." },
        { status: 400 }
      );
    }

    // ── File validations ───────────────────────────────────────────────────

    if (!files || files.length < MIN_FILES) {
      return Response.json(
        { error: `Please upload at least ${MIN_FILES} screenshots.` },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return Response.json(
        { error: `Maximum ${MAX_FILES} screenshots allowed.` },
        { status: 400 }
      );
    }

    let totalSizeMB = 0;
    for (const file of files) {
      if (!VALID_MIME_TYPES.includes(file.type)) {
        return Response.json(
          { error: `"${file.name}" is not a valid image. Please upload JPG, PNG, or WEBP files only.` },
          { status: 400 }
        );
      }
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        return Response.json(
          { error: `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit. Please compress or crop it.` },
          { status: 400 }
        );
      }
      totalSizeMB += fileSizeMB;
    }

    if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
      return Response.json(
        { error: `Total upload size exceeds ${MAX_TOTAL_SIZE_MB}MB. Please reduce the number or size of screenshots.` },
        { status: 400 }
      );
    }

    // ── Rate limit: same email can't have >3 pending submissions ──────────
    const recentCount = await prisma.submission.count({
      where: {
        email,
        payment_status: "pending_payment",
        created_at: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // last 1 hour
      },
    });
    if (recentCount >= 3) {
      return Response.json(
        { error: "Too many submissions from this email. Please wait an hour or contact support." },
        { status: 429 }
      );
    }

    // ── Save files to disk ─────────────────────────────────────────────────
    const uploadDir = UPLOADS_DIR;
    await mkdir(uploadDir, { recursive: true });

    const savedPaths: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}_${safeName}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      savedPaths.push(`/uploads/${filename}`);
    }

    // ── AI screenshot validation (gpt-4o-mini, fast) ──────────────────────
    let validation;
    try {
      validation = await validateProfileScreenshots(savedPaths, "any");
    } catch (err) {
      // If validation itself fails (network issue etc.), fail open
      console.error("Screenshot validation error (failing open):", err);
      validation = { valid: true, reason: "", platformMismatch: false, detectedApp: "unknown" };
    }

    if (!validation.valid) {
      // Clean up uploaded files — no point storing invalid screenshots
      for (const p of savedPaths) {
        unlink(resolveStoredPath(p)).catch(() => {});
      }
      return Response.json(
        {
          error: validation.platformMismatch ? "platform_mismatch" : "invalid_screenshots",
          message: validation.reason || "These don't look like dating app profile screenshots.",
          detectedApp: validation.detectedApp,
        },
        { status: 422 }
      );
    }

    // ── Save submission to DB ──────────────────────────────────────────────
    const submission = await prisma.submission.create({
      data: {
        email,
        name,
        age,
        app_used: validation.detectedApp ?? "unknown",
        struggle,
        vibe,
        screenshots: JSON.stringify(savedPaths),
        payment_status: "pending_payment",
      },
    });

    return Response.json({ id: submission.id }, { status: 201 });
  } catch (err) {
    console.error("Submit error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
