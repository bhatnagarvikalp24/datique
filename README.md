# MatchFix

A platform where users submit their dating profiles (Hinge/Bumble), pay ₹199 via Razorpay, and receive a PDF review via email.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS
- **Backend**: Next.js API routes (Node.js)
- **Database**: SQLite via Prisma v7 + `@prisma/adapter-better-sqlite3`
- **File Upload**: Local `/uploads` directory
- **Payment**: Razorpay (test mode)
- **Notifications**: react-hot-toast

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your Razorpay keys:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="file:./dev.db"
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_key_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id"
```

Get your test keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys).

### 3. Run database migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/submit` | Profile submission form |
| `/payment?id=<id>` | Payment page (Razorpay checkout) |
| `/success` | Confirmation after payment |
| `/admin` | Admin dashboard (all submissions) |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/submit` | Save form submission |
| GET | `/api/submission?id=` | Fetch single submission |
| POST | `/api/create-order` | Create Razorpay order |
| POST | `/api/verify-payment` | Verify signature, update DB |
| GET | `/api/admin/submissions` | List all submissions |

## Payment Flow

1. User fills form → POST `/api/submit` → saved with `pending_payment`
2. Redirect to `/payment?id=<submission_id>`
3. Click "Pay" → POST `/api/create-order` → Razorpay checkout opens
4. On success → POST `/api/verify-payment` → status updated to `paid`
5. Redirect to `/success`

## Production Build

```bash
npm run build
npm start
```
