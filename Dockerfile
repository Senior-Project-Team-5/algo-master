# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./

# Use --legacy-peer-deps to bypass dependency issues
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Public environment variables
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGl2aW5lLWFwaGlkLTE1LmNsZXJrLmFjY291bnRzLmRldiQ
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_APP_URL=https://algo-master-ar72sp7yfa-uc.a.run.app
ENV NEXT_PUBLIC_SUPABASE_URL=https://vgveigetaybtvigqswxc.supabase.co
ENV NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndmVpZ2V0YXlidHZpZ3Fzd3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwOTgzNDcsImV4cCI6MjA1NTY3NDM0N30.dClERMGkRuVbGbxpmR8LLIf0xE3-NfA6o-RvhDEGy1o

RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# You only need to copy next.config.ts if you are NOT using the default configuration
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]