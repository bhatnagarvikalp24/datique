import OpenAI from "openai";

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string): Promise<number[]> {
  const response = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/** Build a single text blob from a corpus entry for embedding. */
export function buildCorpusText(entry: {
  app: string;
  tier: string;
  age_bracket: string;
  vibe: string;
  description: string;
  photos_desc: string;
  prompts: string;
  bio?: string | null;
}): string {
  return [
    `App: ${entry.app}`,
    `Tier: ${entry.tier}`,
    `Age bracket: ${entry.age_bracket}`,
    `Vibe: ${entry.vibe}`,
    `Profile: ${entry.description}`,
    `Photos: ${entry.photos_desc}`,
    `Prompts: ${entry.prompts}`,
    entry.bio ? `Bio: ${entry.bio}` : "",
  ]
    .filter(Boolean)
    .join(". ");
}

/** Build query text from a user's submission metadata. */
export function buildQueryText(params: {
  app_used: string;
  age: number;
  vibe: string;
  struggle: string;
}): string {
  return [
    `App: ${params.app_used}`,
    `Age: ${params.age}`,
    `Vibe: ${params.vibe}`,
    params.struggle ? `Struggle: ${params.struggle}` : "",
  ]
    .filter(Boolean)
    .join(". ");
}
