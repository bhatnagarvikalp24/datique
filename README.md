# DataPath Academy

A paid edtech platform for practical data and AI courses. Users preview course contents, pay once, and unlock lifetime access to the selected course dashboard.

## Courses

| Course | Price | Access |
| --- | ---: | --- |
| SQL Mastery for All Data Profiles | $20 USD | Lifetime |
| Python for Data | $20 USD | Lifetime |
| Data Science and Machine Learning Course | $35 USD | Lifetime |
| AI Course: AI, GenAI and Agentic AI | $50 USD | Lifetime |

Each course includes theory, practical assignments, solutions, questions, test series, and one live industry-style case.

## Tech Stack

- Frontend: Next.js 16 App Router + Tailwind CSS
- Backend: Next.js API routes
- Database: SQLite via Prisma v7 and `@prisma/adapter-better-sqlite3`
- Payment: Razorpay checkout

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma generate
npm run dev
```

Open `http://localhost:3000`.

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Course catalog |
| `/courses/[courseId]` | Course preview and checkout form |
| `/payment?id=<purchase_id>` | Razorpay checkout |
| `/success?id=<purchase_id>` | Payment confirmation |
| `/learn/[courseId]?purchaseId=<purchase_id>` | Paid course dashboard |
| `/admin` | Admin purchase dashboard |

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/purchase` | Create pending course purchase |
| GET | `/api/purchase?id=` | Fetch purchase status |
| POST | `/api/create-order` | Create Razorpay order |
| POST | `/api/verify-payment` | Verify payment and unlock course |
| GET | `/api/admin/submissions` | List course purchases for admin |
