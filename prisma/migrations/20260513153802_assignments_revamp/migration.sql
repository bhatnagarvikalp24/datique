/*
  Warnings:

  - You are about to drop the `CoursePurchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileCorpus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CoursePurchase";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProfileCorpus";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Submission";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'basic',
    "payment_status" TEXT NOT NULL DEFAULT 'pending_payment',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
