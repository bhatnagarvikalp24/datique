FROM node:24-alpine

# Required for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build (runs prisma generate + next build)
COPY . .

# Dummy build-time env vars so Next.js static analysis doesn't crash
# on missing secrets — real values are injected at runtime by Railway
ARG OPENAI_API_KEY=build_placeholder
ARG DATABASE_URL=file:/tmp/build.db
ARG ADMIN_PASSWORD=build_placeholder
ARG RAZORPAY_KEY_ID=build_placeholder
ARG RAZORPAY_KEY_SECRET=build_placeholder
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID=build_placeholder
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
ENV RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID

RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Start runs: prisma migrate deploy && next start
CMD ["npm", "start"]
