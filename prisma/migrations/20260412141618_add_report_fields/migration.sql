-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "app_used" TEXT NOT NULL,
    "struggle" TEXT NOT NULL,
    "vibe" TEXT NOT NULL,
    "screenshots" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'pending_payment',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "report_status" TEXT NOT NULL DEFAULT 'not_started',
    "report_path" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Submission" ("age", "app_used", "created_at", "email", "id", "name", "payment_status", "razorpay_order_id", "razorpay_payment_id", "screenshots", "struggle", "vibe") SELECT "age", "app_used", "created_at", "email", "id", "name", "payment_status", "razorpay_order_id", "razorpay_payment_id", "screenshots", "struggle", "vibe" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
