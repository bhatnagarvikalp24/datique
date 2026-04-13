import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { resolveStoredPath } from "@/lib/paths";
import { findSimilarProfiles, formatCorpusContext } from "@/lib/corpus";

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhotoFeedback {
  photoNumber: number;
  score: number; // 1–10
  verdict: "Keep" | "Improve" | "Replace";
  strengths: string[];
  issues: string[];
  tip: string;
}

export interface PromptFeedback {
  original: string;
  score: number; // 1–10
  whatWorks: string;
  whatDoesnt: string;
  rewrite: string;
}

export interface ProfileReport {
  // ── Validity gate ──
  isValidProfile: boolean; // false if no dating profile detected in screenshots

  // ── Overall ──
  overallScore: number; // 1–100
  tagline: string; // e.g. "Solid foundation, needs a sharper hook"
  tldr: string; // 2-3 sentence executive summary

  // ── Dimension scores (1–10 each) ──
  dimensions: {
    photoQuality: number;
    photoVariety: number;
    bioAuthenticity: number;
    humorWit: number;
    intentClarity: number;
  };

  // ── Photo analysis ──
  photos: PhotoFeedback[];
  photosOverview: string;
  recommendedPhotoOrder: number[]; // e.g. [3, 1, 4, 2]

  // ── Bio & prompts ──
  prompts: PromptFeedback[];
  bioOverview: string;

  // ── Vibe & positioning ──
  currentVibe: string; // what the profile currently communicates
  targetVibe: string; // what they said they want
  vibeMismatch: string; // explanation of the gap (or "" if aligned)

  // ── Actionable wins ──
  quickWins: Array<{
    priority: number; // 1 = highest impact
    action: string;
    why: string;
    effort: "Low" | "Medium" | "High";
  }>;

  // ── Strengths ──
  strengths: string[];

  // ── One rewritten bio ──
  rewrittenBio: string;

  // ── Closing note ──
  closingNote: string;
}

// ─── Helper: convert local file to base64 data URL ───────────────────────────

function fileToBase64DataUrl(filePath: string): string {
  const absolutePath = resolveStoredPath(filePath);
  const buffer = fs.readFileSync(absolutePath);
  const ext = path.extname(filePath).toLowerCase().replace(".", "");
  const mime =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "png"
      ? "image/png"
      : ext === "webp"
      ? "image/webp"
      : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

// ─── Main evaluator ──────────────────────────────────────────────────────────

export async function evaluateProfile(params: {
  name: string | null;
  age: number;
  app_used: string;
  struggle: string;
  vibe: string;
  screenshotPaths: string[];
}): Promise<ProfileReport> {
  const { name, age, app_used, struggle, vibe, screenshotPaths } = params;

  // ── RAG: retrieve similar corpus profiles for benchmarking ──────────────────
  let corpusContext = "";
  try {
    const matches = await findSimilarProfiles({ app_used, age, vibe, struggle });
    corpusContext = formatCorpusContext(matches);
  } catch (err) {
    // Non-fatal — proceed without corpus context
    console.warn("Corpus retrieval failed (proceeding without RAG):", err);
  }

  // Build image content parts
  const imageMessages: OpenAI.Chat.ChatCompletionContentPart[] =
    screenshotPaths.map((p, i) => ({
      type: "image_url" as const,
      image_url: {
        url: fileToBase64DataUrl(p),
        detail: "high" as const,
      },
    }));

  const systemPrompt = `You are "Datique AI" — a brutally honest, empathetic dating profile coach who thinks like an attractive, perceptive woman in her mid-20s who uses ${app_used} regularly.${corpusContext}

Your job is to analyze a man's dating profile screenshots and deliver a structured, actionable review that genuinely helps him get more quality matches.

When reference profiles are provided above, use them as calibration anchors — compare the user's profile against them and call out specific gaps or advantages.

TONE RULES:
- Be specific, never generic. "Your third photo is too dark and your posture looks closed-off" beats "improve your photos".
- Be direct but kind. You're a friend who tells the truth, not a harsh critic.
- Celebrate what's genuinely working — don't manufacture fake praise.
- Ground every criticism in what a real woman on ${app_used} actually thinks/feels.

SCORING RUBRIC:
- Photos: lighting, composition, genuine smile, variety (activity/social/close-up), background, attire
- Prompts: specificity, humor, emotional hook, conversational entry points, avoiding clichés
- Overall vibe: does the profile attract the type of person they want?

FIRST CHECK: Before doing anything else, look at the images. If they do NOT show a Hinge, Bumble, or Tinder profile (e.g. they are random photos, documents, memes, or screenshots from other apps), set isValidProfile to false and fill every other field with empty defaults — do NOT attempt a full analysis.

OUTPUT: Return ONLY a valid JSON object matching this exact TypeScript type (no markdown, no explanation outside the JSON):

{
  isValidProfile: boolean (true if the screenshots show a real dating app profile, false otherwise),
  overallScore: number (1-100, use 0 if isValidProfile is false),
  tagline: string (max 10 words, honest verdict like a headline),
  tldr: string (2-3 sentences, what to fix first and why),
  dimensions: {
    photoQuality: number (1-10),
    photoVariety: number (1-10),
    bioAuthenticity: number (1-10),
    humorWit: number (1-10),
    intentClarity: number (1-10)
  },
  photos: Array<{
    photoNumber: number,
    score: number (1-10),
    verdict: "Keep" | "Improve" | "Replace",
    strengths: string[],
    issues: string[],
    tip: string (one specific actionable tip)
  }>,
  photosOverview: string (2-3 sentences about overall photo strategy),
  recommendedPhotoOrder: number[] (reorder by impact, 1-indexed),
  prompts: Array<{
    original: string (exact text from screenshot, or "Could not extract" if unreadable),
    score: number (1-10),
    whatWorks: string,
    whatDoesnt: string,
    rewrite: string (a better version in his voice)
  }>,
  bioOverview: string (2-3 sentences),
  currentVibe: string (what the profile actually communicates),
  targetVibe: string (what they said they want — from user input),
  vibeMismatch: string (the gap, or empty string if aligned),
  quickWins: Array<{
    priority: number,
    action: string (imperative, specific),
    why: string (one sentence on the impact),
    effort: "Low" | "Medium" | "High"
  }> (exactly 3 items, ranked by impact),
  strengths: string[] (2-4 genuine strengths),
  rewrittenBio: string (a full rewritten bio/about section in his voice, based on signals from his profile),
  closingNote: string (2-3 warm, motivating sentences to end the report)
}`;

  const userMessage = `Please review this ${app_used} profile.

USER CONTEXT:
- Name: ${name ?? "Not provided"}
- Age: ${age}
- Vibe they're going for: ${vibe}
- What they're struggling with: ${struggle || "Not specified"}

The following ${screenshotPaths.length} screenshot(s) show the full profile. Analyse every visible element — photos, prompts, bio, all text visible.`;

  const makeRequest = async () => {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4096,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userMessage },
            ...imageMessages,
          ],
        },
      ],
    });
    return response.choices[0].message.content ?? "{}";
  };

  const parseReport = (raw: string): ProfileReport => {
    return JSON.parse(raw);
  };

  // Single attempt — response_format: json_object guarantees valid JSON back
  try {
    const raw = await makeRequest();
    return parseReport(raw);
  } catch {
    // API error or unexpected parse failure — return fallback
    const notProfileReport: ProfileReport = {
      isValidProfile: false,
      overallScore: 0,
      tagline: "No dating profile detected in screenshots",
      tldr:
        "We couldn't detect a Hinge, Bumble, or Tinder profile in the screenshots you uploaded. Please re-submit with actual screenshots of your dating app profile — including your photos, bio, and prompts.",
      dimensions: {
        photoQuality: 0,
        photoVariety: 0,
        bioAuthenticity: 0,
        humorWit: 0,
        intentClarity: 0,
      },
      photos: [],
      photosOverview:
        "No profile photos were detected. Please upload screenshots directly from your dating app.",
      recommendedPhotoOrder: [],
      prompts: [],
      bioOverview:
        "No bio or prompts were detected in the uploaded images.",
      currentVibe: "Could not determine — no profile content found.",
      targetVibe: vibe,
      vibeMismatch:
        "We couldn't analyse your vibe because no dating profile was detected in the screenshots.",
      quickWins: [
        {
          priority: 1,
          action: "Re-submit with real profile screenshots",
          why: "Your uploaded images didn't contain a recognisable Hinge, Bumble, or Tinder profile.",
          effort: "Low",
        },
        {
          priority: 2,
          action: "Include your full profile overview screenshot",
          why: "This shows all photos and prompts in one view, giving the AI the most context.",
          effort: "Low",
        },
        {
          priority: 3,
          action: "Add individual photo and prompt screenshots",
          why: "Higher resolution screenshots allow more detailed per-photo feedback.",
          effort: "Low",
        },
      ],
      strengths: ["Could not evaluate — please re-submit with valid profile screenshots."],
      rewrittenBio:
        "Unable to generate a bio rewrite without profile content. Please re-submit.",
      closingNote:
        "Don't worry — just re-submit with the correct screenshots and we'll give you the full, detailed review you paid for. If you need help, reach out to our support team.",
    };
    return notProfileReport;
  }
}
