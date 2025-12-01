# AI Resume Analyzer

## Core Context

Next.js 16/React 19 platform for AI-powered resume analysis. Uses Cerebras (LLM) for critique and Neon (PostgreSQL) for persistence. Built on Bun.

## Tech Stack

- **Runtime:** Bun (Strict dependency)
- **Framework:** Next.js 16 App Router, React 19
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Auth:** Better Auth (Google OAuth)
- **Styling:** Tailwind CSS 4, Lucide Icons, Sonner (Toasts)
- **AI:** Cerebras SDK, Zod validation

## Build & Run

- `bun install` - Install deps (creates `bun.lock`)
- `bun run dev` - Start dev server (Port 3000)
- `bun run typecheck` - Run TypeScript validation
- `bunx prisma migrate dev` - Apply schema changes
- `bunx prisma studio` - Inspect database

## Architecture Map

- `app/api/` - API Routes (Server-only, rate-limited)
- `app/components/` - UI primitives (Glassmorphism, Tailwind 4)
- `constants/index.ts` - AI Prompt/Schema Contracts (Source of Truth)
- `lib/prisma.ts` - DB Singleton (**Invariant:** Use this instance only)
- `lib/schemas.ts` - Zod runtime validators (Sync with `types/`)

## Key Invariants

1.  **Server/Client Split:** Default to Server Components. Use `"use client"` only for interactivity/hooks.
2.  **AI Pipeline:** AI Response -> JSON -> Zod Parse -> Database. Never persist unvalidated AI output.
3.  **Styling:** Follow `DESIGN_SYSTEM.md`. Use `Mona Sans` font. No random colors.
4.  **Database:** Use `lib/prisma.ts` singleton. Never `new PrismaClient()`.
5.  **Package Manager:** Use `bun` exclusively.

## Progressive Disclosure

- **Database:** See `prisma/schema.prisma` for models.
- **Design:** See `DESIGN_SYSTEM.md` for tokens/patterns.
- **Detailed Docs:** See `AGENTS.md` for architectural deep dive.
