FROM node:24-alpine

# Required for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build (runs prisma generate + next build)
COPY . .
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Start runs: prisma migrate deploy && next start
CMD ["npm", "start"]
