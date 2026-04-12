import OpenAI from "openai";
import fs from "fs";
import { resolveStoredPath } from "@/lib/paths";

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ValidationResult {
  valid: boolean;
  reason: string;           // shown to user if invalid
  platformMismatch: boolean; // true if profile found but wrong app
  detectedApp: string;       // what the AI actually sees ("Hinge", "Bumble", "Tinder", "unknown", "none")
}

function fileToBase64DataUrl(filePath: string): string {
  const absolutePath = resolveStoredPath(filePath);
  const buffer = fs.readFileSync(absolutePath);
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  const mime =
    ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
    ext === "png"  ? "image/png"  :
    ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function validateProfileScreenshots(
  screenshotPaths: string[],
  expectedApp: string          // "Hinge" | "Bumble" | "Tinder"
): Promise<ValidationResult> {
  const sample = screenshotPaths.slice(0, 3);

  const imageMessages: OpenAI.Chat.ChatCompletionContentPart[] = sample.map((p) => ({
    type: "image_url" as const,
    image_url: { url: fileToBase64DataUrl(p), detail: "low" as const },
  }));

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 120,
    messages: [
      {
        role: "system",
        content: `You are a dating app screenshot validator. Inspect the image(s) and return ONLY valid JSON — no extra text.

Schema:
{
  "valid": boolean,        // true ONLY if images show a real Hinge/Bumble/Tinder profile UI
  "detectedApp": string,   // "Hinge" | "Bumble" | "Tinder" | "unknown" | "none"
  "reason": string         // max 15 words, shown to user if invalid
}

Rules:
- valid=true only if the UI clearly belongs to Hinge, Bumble, or Tinder (look for logos, brand colours, UI elements, prompt cards, etc.)
- valid=false for: random photos, documents, memes, WhatsApp, Instagram, other apps, or plain selfies with no app UI
- detectedApp must be one of the five options above — never null
- reason is only relevant when valid=false`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `The user says these are ${expectedApp} screenshots. What dating app profile (if any) do you see?`,
          },
          ...imageMessages,
        ],
      },
    ],
  });

  const raw = (response.choices[0].message.content ?? "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    const result = JSON.parse(raw) as Omit<ValidationResult, "platformMismatch">;

    const detectedApp  = result.detectedApp ?? "unknown";
    const KNOWN_APPS   = ["Hinge", "Bumble", "Tinder"];
    const appIdentified = KNOWN_APPS.includes(detectedApp);

    // Mismatch: only check when a specific app was expected
    const platformMismatch =
      expectedApp !== "any" &&
      result.valid &&
      appIdentified &&
      detectedApp !== expectedApp;

    return {
      valid: result.valid && !platformMismatch,
      reason: platformMismatch
        ? `These look like ${detectedApp} screenshots, but you selected ${expectedApp}.`
        : result.reason ?? "",
      platformMismatch,
      detectedApp,
    };
  } catch {
    // Fail open — full evaluator will handle bad images
    return { valid: true, reason: "", platformMismatch: false, detectedApp: "unknown" };
  }
}
