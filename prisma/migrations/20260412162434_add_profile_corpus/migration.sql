-- CreateTable
CREATE TABLE "ProfileCorpus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "app" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "age_bracket" TEXT NOT NULL,
    "vibe" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos_desc" TEXT NOT NULL,
    "prompts" TEXT NOT NULL,
    "bio" TEXT,
    "notes" TEXT,
    "embedding" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
