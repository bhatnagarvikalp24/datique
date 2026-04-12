import { prisma } from "@/lib/prisma";
import { embedText, cosineSimilarity, buildQueryText } from "@/lib/embeddings";

export interface CorpusMatch {
  tier: string;
  app: string;
  age_bracket: string;
  vibe: string;
  description: string;
  photos_desc: string;
  prompts: string;
  bio: string | null;
  notes: string | null;
  similarity: number;
}

/**
 * Retrieve the top-k most similar profiles from the corpus.
 * Falls back to an empty array if the corpus is empty or embedding fails.
 */
export async function findSimilarProfiles(
  params: {
    app_used: string;
    age: number;
    vibe: string;
    struggle: string;
  },
  k = 3
): Promise<CorpusMatch[]> {
  const all = await prisma.profileCorpus.findMany({
    select: {
      tier: true,
      app: true,
      age_bracket: true,
      vibe: true,
      description: true,
      photos_desc: true,
      prompts: true,
      bio: true,
      notes: true,
      embedding: true,
    },
  });

  if (all.length === 0) return [];

  const queryText = buildQueryText(params);
  const queryEmbedding = await embedText(queryText);

  const scored = all.map((entry) => {
    const embedding = JSON.parse(entry.embedding) as number[];
    return {
      tier: entry.tier,
      app: entry.app,
      age_bracket: entry.age_bracket,
      vibe: entry.vibe,
      description: entry.description,
      photos_desc: entry.photos_desc,
      prompts: entry.prompts,
      bio: entry.bio,
      notes: entry.notes,
      similarity: cosineSimilarity(queryEmbedding, embedding),
    };
  });

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, k);
}

/**
 * Format retrieved corpus matches into a prompt-injectable string.
 */
export function formatCorpusContext(matches: CorpusMatch[]): string {
  if (matches.length === 0) return "";

  const sections = matches.map((m, i) => {
    const tierLabel =
      m.tier === "top"
        ? "HIGH-PERFORMING PROFILE"
        : m.tier === "average"
        ? "AVERAGE PROFILE"
        : "LOW-PERFORMING PROFILE";

    const prompts = (() => {
      try {
        const parsed = JSON.parse(m.prompts) as Array<{ prompt: string; response: string }>;
        return parsed
          .map((p) => `  • "${p.prompt}" → "${p.response}"`)
          .join("\n");
      } catch {
        return `  ${m.prompts}`;
      }
    })();

    return [
      `--- REFERENCE ${i + 1}: ${tierLabel} ---`,
      `App: ${m.app} | Age bracket: ${m.age_bracket} | Vibe: ${m.vibe}`,
      `Photos: ${m.photos_desc}`,
      `Prompts:\n${prompts}`,
      m.bio ? `Bio: ${m.bio}` : "",
      m.notes ? `Why this tier: ${m.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  return `\n\nREFERENCE PROFILES FROM HIGH-PERFORMING CORPUS (use these as benchmarks — do NOT copy them, use them to calibrate your scoring and identify gaps):\n\n${sections.join("\n\n")}`;
}
