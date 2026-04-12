import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const dbPath = path.resolve(rawUrl.replace(/^file:/, ""));
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  // PrismaClient in v7 requires adapter to be passed at the type level
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
