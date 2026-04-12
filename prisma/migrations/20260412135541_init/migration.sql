-- CreateTable
CREATE TABLE "Submission" (
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
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
