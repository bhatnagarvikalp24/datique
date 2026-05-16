-- CreateTable
CREATE TABLE "GeneratedPack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "purchase_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "assignments" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" DATETIME,
    CONSTRAINT "GeneratedPack_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedPack_purchase_id_key" ON "GeneratedPack"("purchase_id");
