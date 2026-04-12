import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

const dbPath = process.env.DATABASE_URL?.replace("file:", "") ?? "./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `file:${path.resolve(dbPath)}`,
  },
});
