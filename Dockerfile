FROM node:20-alpine
WORKDIR /app

RUN corepack enable

ENV DATABASE_URL="postgresql://x:x@localhost/x" \
    DIRECT_DATABASE_URL="postgresql://x:x@localhost/x" \
    GOOGLE_CLIENT_ID="x" GOOGLE_CLIENT_SECRET="x" \
    BETTER_AUTH_SECRET="x" BETTER_AUTH_URL="http://localhost:3000" \
    NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000" \
    CEREBRAS_API_KEY="x" PDF_SERVICE_URL="http://localhost:8000"

COPY package.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000
CMD ["sh", "-c", "pnpm db:setup && pnpm start"]
