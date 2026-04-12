/**
 * Seed the ProfileCorpus with reference profiles.
 * Run: npx tsx scripts/seed-corpus.ts
 */

import path from "path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("../app/generated/prisma/client");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
import OpenAI from "openai";
import { buildCorpusText } from "../lib/embeddings";

const adapter = new PrismaBetterSqlite3({
  url: path.resolve(process.cwd(), "dev.db"),
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

const profiles = [
  // ── TOP TIER ──────────────────────────────────────────────────────────────
  {
    app: "Hinge",
    tier: "top",
    age_bracket: "25-30",
    vibe: "Casual / Chill",
    description:
      "Comes across as confident, specific, and effortlessly interesting. Profile tells a story without trying too hard. Each photo and prompt reveals a different dimension.",
    photos_desc:
      "Lead photo: well-lit solo shot outdoors with a natural smile and direct eye contact. Second: candid group photo at a social event (he's clearly in his element). Third: action shot doing something specific (hiking, cooking, playing sport). Fourth: close-up showing face clearly. No gym selfies, no sunglasses in lead photo.",
    prompts: JSON.stringify([
      {
        prompt: "The most spontaneous thing I've done",
        response:
          "Booked a one-way flight to Lisbon at 11pm on a Tuesday. Came back three weeks later with a leather jacket and a new appreciation for bacalhau.",
      },
      {
        prompt: "I'm convinced that",
        response:
          "A good playlist can fix almost any mood. Currently rotating between 70s soul and hyperpop, which tells you everything you need to know.",
      },
      {
        prompt: "Typical Sunday",
        response:
          "Farmer's market at 9am (yes, I'm that person), cooking something new by noon, calling my mum, evening walk with no destination in mind.",
      },
    ]),
    bio: "Software engineer who actually leaves the house. Equal parts overthinking and under-planning. Looking for someone to eat good food with and argue about movies.",
    notes:
      "Specific, visual storytelling. Prompts have an entry point for conversation — you can imagine replying to any of them. Photos show range without trying too hard. No clichés.",
  },
  {
    app: "Hinge",
    tier: "top",
    age_bracket: "18-24",
    vibe: "Funny / Witty",
    description:
      "Profile is sharp, self-aware, and funny without trying to be a comedian. Shows personality clearly. Photos are high quality and varied.",
    photos_desc:
      "Lead: genuine laughing photo in natural light. Second: doing something active outdoors (not just standing). Third: well-dressed at an event. Clear face in all three.",
    prompts: JSON.stringify([
      {
        prompt: "Dating me is like",
        response:
          "Finding a charger when your phone is at 2%. Occasionally annoying to locate but worth it once you do.",
      },
      {
        prompt: "I go crazy for",
        response:
          "The first bite of something I've been craving for three days. And live music in small venues where you can actually feel the bass.",
      },
      {
        prompt: "Two truths and a lie",
        response:
          "I once cooked for 40 people on a camping trip. I've read every Murakami novel. I'm a morning person.",
      },
    ]),
    bio: null,
    notes:
      "Humor is specific and self-deprecating without being insecure. The 'dating me is like' prompt is a masterclass — it's funny, memorable, and opens a conversation.",
  },
  {
    app: "Bumble",
    tier: "top",
    age_bracket: "31-40",
    vibe: "Serious Relationship",
    description:
      "Emotionally mature, clear about what he wants without being intense. Profile communicates stability and genuine warmth. Easy to imagine a life with.",
    photos_desc:
      "Lead: smiling solo photo in natural setting, no sunglasses. Second: with a dog or child (nephew/niece, clearly labelled) — shows warmth. Third: doing something that shows personality (cooking, hiking, building something). Fourth: dressed up, looking confident.",
    prompts: JSON.stringify([
      {
        prompt: "I want someone who",
        response:
          "Knows what they want but isn't in a rush. I'm at a point where I'm looking for something real — not a situationship.",
      },
      {
        prompt: "The way to my heart",
        response:
          "Send me a voice note instead of a paragraph. Or make a reservation somewhere without asking me to decide.",
      },
      {
        prompt: "My simple pleasures",
        response:
          "Morning run before the city wakes up. Cooking a proper meal on a Sunday. A long phone call with someone who makes time pass fast.",
      },
    ]),
    bio: "Product manager at a startup that's doing okay. Marathon runner (slowly). Originally from Pune, been in Bangalore five years. Looking for something that grows into something.",
    notes:
      "Clear intentionality without desperation. Specific about location and life context which builds trust. Prompts show emotional availability which is rare and attractive in this bracket.",
  },

  // ── AVERAGE TIER ──────────────────────────────────────────────────────────
  {
    app: "Hinge",
    tier: "average",
    age_bracket: "25-30",
    vibe: "Casual / Chill",
    description:
      "Profile is inoffensive but unmemorable. Nothing actively wrong but nothing that makes you stop scrolling either. Generic interests, good photos but no story.",
    photos_desc:
      "Lead: decent solo photo but slightly awkward pose. Second: group photo where it's unclear which one he is. Third: travel photo (Eiffel Tower). One gym selfie.",
    prompts: JSON.stringify([
      {
        prompt: "I'm looking for",
        response: "Someone who loves to travel, try new restaurants, and chill on weekends.",
      },
      {
        prompt: "A random fact I love",
        response: "Honey never expires. I love sharing fun facts like this!",
      },
      {
        prompt: "Typical Sunday",
        response: "Gym in the morning, brunch with friends, Netflix in the evening.",
      },
    ]),
    bio: "Software engineer. Love travelling, food, and good vibes. Always down for an adventure.",
    notes:
      "The profile describes a generic person. 'Love travelling, food, good vibes' describes literally everyone on the app. No specific details, no story, no entry points for conversation.",
  },
  {
    app: "Bumble",
    tier: "average",
    age_bracket: "18-24",
    vibe: "Adventurous",
    description:
      "Tries to come across as adventurous and fun but relies on adjectives rather than showing through specifics. Photos are good but prompts fall flat.",
    photos_desc:
      "Lead: solo photo, decent lighting but blank expression. Second: mountain hiking photo (common). Third: friends group. One photo with sunglasses.",
    prompts: JSON.stringify([
      {
        prompt: "I go crazy for",
        response: "Adventures, good food, and meeting new people.",
      },
      {
        prompt: "My love language is",
        response: "Acts of service and quality time.",
      },
    ]),
    bio: "Live, laugh, adventure. MBA student. Fitness enthusiast.",
    notes:
      "Tells instead of shows. 'Adventures, good food, meeting new people' is the most common prompt response on the app. Love languages prompt is overused and reveals nothing unique.",
  },

  // ── POOR TIER ─────────────────────────────────────────────────────────────
  {
    app: "Hinge",
    tier: "poor",
    age_bracket: "25-30",
    vibe: "Serious Relationship",
    description:
      "Profile actively hurts chances. Comes across as either closed-off, needy, or generic. Photos are low quality or unflattering. Prompts give nothing to work with.",
    photos_desc:
      "Lead: group photo (hard to identify him). Second: sunglasses photo, face obscured. Third: dark, blurry photo from a party. Fourth: mirror selfie in a cramped bathroom.",
    prompts: JSON.stringify([
      { prompt: "I'm looking for", response: "My future wife :)" },
      {
        prompt: "Green flags",
        response: "When someone actually replies fast and doesn't ghost.",
      },
      { prompt: "About me", response: "Ask me anything!" },
    ]),
    bio: null,
    notes:
      "Lead group photo is the single biggest mistake — women can't identify who he is. 'Future wife :)' reads as intense on a first impression. 'Ask me anything' is a conversation dead-end. Bitter green flags response signals past baggage.",
  },
  {
    app: "Bumble",
    tier: "poor",
    age_bracket: "31-40",
    vibe: "Casual / Chill",
    description:
      "Minimal effort profile. Few photos, short prompts, nothing that communicates personality or what kind of person he is. Easy to swipe left without a second thought.",
    photos_desc:
      "Only 2 photos: one passport-style photo with neutral expression, one group photo. No variety.",
    prompts: JSON.stringify([
      { prompt: "About me", response: "I work in finance. I like to travel." },
      { prompt: "I'm looking for", response: "Someone real." },
    ]),
    bio: null,
    notes:
      "Absolute minimum effort. 'Someone real' is universally meaningless. Only 2 photos signals low investment to the viewer. Finance + travel is perhaps the most common combination on dating apps.",
  },
];

async function main() {
  // Clear existing entries
  await prisma.profileCorpus.deleteMany();
  console.log("Cleared existing corpus.");

  for (const profile of profiles) {
    const text = buildCorpusText(profile);
    const embedding = await embed(text);
    await prisma.profileCorpus.create({
      data: {
        ...profile,
        prompts: typeof profile.prompts === "string" ? profile.prompts : JSON.stringify(profile.prompts),
        bio: profile.bio ?? null,
        notes: profile.notes ?? null,
        embedding: JSON.stringify(embedding),
      },
    });
    console.log(`✓ ${profile.tier.padEnd(8)} ${profile.app} / ${profile.age_bracket} / ${profile.vibe}`);
  }

  console.log(`\nSeeded ${profiles.length} reference profiles.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
