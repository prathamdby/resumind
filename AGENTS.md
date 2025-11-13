# AGENTS systems briefing

## Overview

- Objective: shorten the time between first clone and first merged pull request by exposing the system's non-obvious architecture, dependencies, and invariants.
- Audience: contributors familiar with TypeScript, Next.js 16 App Router, Tailwind CSS 4, Bun, Prisma, and PostgreSQL.
- Scope: server/client components under `app/`, API routes in `app/api/`, database layer via Prisma, AI orchestration in `constants/`, and design system patterns documented in `DESIGN_SYSTEM.md`.

## Stage 1: Stabilize orientation (reduce initial anxiety)

### Run-time acceptance checklist

1. Confirm the toolchain: `bun --version` (>= 1.0), `node --version` (>= 18).
2. Install dependencies with `bun install`. Do not mix with npm or Yarn; the lockfile is Bun-specific (`bun.lock`).
3. Set up environment variables: Copy `.env.example` (if exists) or create `.env` with required variables (see README.md).
4. Set up database: Run `bunx prisma generate` then `bunx prisma migrate dev` to initialize schema.
5. Start the dev server with `bun run dev`. Expect Next.js to answer on port 3000.
6. Run `bun run typecheck` once per change set to catch TypeScript errors early.

### Immediate hazards to neutralize

| Risk                                        | Mitigation                                                                                                                                                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Server/client component boundary violations | Mark client components with `"use client"` directive. Server components are default; use them for data fetching. Keep browser-only APIs (`window`, `localStorage`) inside client components or `useEffect`.                    |
| AI responses breaking UI assumptions        | Keep the validation pipeline intact: AI response → `JSON.parse` → `FeedbackSchema.safeParse()` (Zod). Add fields only after updating both the schema string in `constants/index.ts`, `types/index.d.ts`, and `lib/schemas.ts`. |
| PDF service unavailable                     | External PDF service must be running at `PDF_SERVICE_URL`. Health check happens before conversion. Handle timeouts gracefully (25s limit).                                                                                     |
| Rate limit exhaustion                       | Rate limits: 2 analyses/min, 5 job imports/min per user. Uses in-memory cache + database persistence. Test with `DISABLE_RATE_LIMITING=true` in development if needed.                                                         |
| Authentication redirect loops               | Protected routes check `getServerSession()` server-side and redirect to `/auth` if unauthenticated. Client-side navigation uses `next/navigation` (`useRouter`, `redirect`).                                                   |
| Database connection issues                  | Uses Neon PostgreSQL with pooled connection (`DATABASE_URL`) for queries and direct connection (`DIRECT_DATABASE_URL`) for migrations. Ensure both are set correctly.                                                          |

## Stage 2: Recognize architecture patterns (provide relief)

### Layer map

| Layer            | Files                                                             | Responsibility                                                                                               | Notes                                                                                                     |
| ---------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Entry + Layout   | `app/layout.tsx`                                                  | Root layout, loads Tailwind (`globals.css`), wires Sonner toasts. No async operations; pure React component. | Layout wraps all pages; metadata defined here.                                                            |
| Routing          | `app/page.tsx`, `app/upload/page.tsx`, `app/resume/[id]/page.tsx` | Next.js App Router pages (server components by default). Dynamic routes use `params` Promise.                | Type-safe routing; no route config file needed.                                                           |
| API Routes       | `app/api/**/route.ts`                                             | Next.js API route handlers (`GET`, `POST`, `DELETE`). Server-side only; use `NextRequest`/`NextResponse`.    | Rate limiting, auth checks, and business logic live here.                                                 |
| Database         | `lib/prisma.ts`, `prisma/schema.prisma`                           | Prisma client singleton and schema definition. PostgreSQL via Neon.                                          | Always use the singleton from `lib/prisma.ts`; never create new PrismaClient instances.                   |
| Auth             | `lib/auth.ts`, `lib/auth-server.ts`, `lib/auth-client.ts`         | Better Auth configuration (server/client). Google OAuth provider. Session management.                        | Server: `getServerSession()`, Client: `useSession()` hook.                                                |
| AI orchestration | `constants/index.ts`, `lib/ai.ts`                                 | Centralizes prompts, persona constraints, and response schema. Cerebras AI client configuration.             | The stringified TypeScript interface in `constants/index.ts` is the contract enforced at runtime via Zod. |
| Validation       | `lib/schemas.ts`                                                  | Zod schemas for runtime validation (`FeedbackSchema`, `JobDataSchema`).                                      | Always validate AI responses and user input with Zod before persisting.                                   |
| Presentation     | `app/components/**`                                               | Tailwind-first components with shared tokens (`surface-card`, `section-shell`). Follow `DESIGN_SYSTEM.md`.   | No third-party headless kit; accessibility is handcrafted. Glassmorphic aesthetic required.               |

### Design system integration

**Critical**: All UI work must follow `DESIGN_SYSTEM.md`. Key principles:

- **Typography**: Mona Sans font family (loaded from Google Fonts). Never use Inter, Roboto, or system fallbacks as primary.
- **Color**: Indigo/pink gradient palette with glassmorphic surfaces. CSS variables defined in `app/globals.css` (`@theme` block).
- **Surfaces**: Frosted glass cards with `backdrop-blur-md`, `border-white/30`, `bg-[var(--color-surface-muted)]`.
- **Motion**: Subtle transitions (200-500ms), `ease-out` easing. Hover lifts (`hover:-translate-y-1`).
- **Spacing**: Generous gaps (`gap-6+`), consistent padding (`p-5`, `p-6`).

When adding components, reference existing patterns (`ResumeCard`, `Navbar`, `UploadForm`) and extend them consistently.

### Ghosts in the machine (historical decisions that still bind the design)

- **PDF service dependency**: Resume analysis requires an external PDF service (Python FastAPI) running at `PDF_SERVICE_URL`. This service converts PDFs to markdown and generates preview images. The service is synchronous and queues requests; timeouts occur under load.
- **Prompt persona**: The behavioral-economist persona and emotional arc in `prepareInstructions` exist to stabilize AI tone. Removing it caused high rejection rates from ATS reviewers; keep the persona hidden from end users but present in prompts.
- **Accordion persistence**: The accordion component (`app/components/Accordion.tsx`) persists state to `localStorage` using a `persistKey`. It also handles URL hash navigation (deep links). Preserve this when adding new accordion sections.
- **Rate limit hybrid strategy**: Rate limiting uses both in-memory cache (fast checks) and database persistence (survives serverless cold starts). The cache TTL is 60s; database records persist for 7 days before cleanup.
- **Preview image storage**: Preview images are stored as base64 strings in the database (`previewImage` field, `@db.Text`). Max size: 5MB. If the PDF service doesn't return a preview, the UI gracefully handles missing images.

### Directory signals

| Path                            | Signals                                                                                                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/components/`               | UI primitives. Expect Tailwind utility classes, `cn()` for merging, and Lucide icons. Maintain the `surface-card` design tokens defined in `app/globals.css`. Follow `DESIGN_SYSTEM.md` for all styling decisions. |
| `app/upload/page.tsx`           | Upload page (server component). Renders `UploadForm` client component. Minimal logic; data fetching happens in API routes.                                                                                         |
| `app/components/UploadForm.tsx` | The heaviest client component: form state, validation, file handling, API calls, error handling, and job import integration. Treat it as the canonical workflow reference.                                         |
| `app/page.tsx`                  | Dashboard (server component). Fetches resumes via Prisma, renders `ResumeCard` components. Handles empty states and navigation.                                                                                    |
| `app/api/analyze/route.ts`      | Core analysis endpoint. Handles PDF upload, conversion, AI analysis, validation, and database persistence. Rate limited (2/min).                                                                                   |
| `constants/index.ts`            | Single source of truth for AI contracts. Update here before editing validators in `lib/schemas.ts`.                                                                                                                |
| `types/index.d.ts`              | Global ambient types for `Resume`, `Feedback`, and `LineImprovement`. Align any new persisted shape with these definitions and Prisma schema.                                                                      |
| `lib/schemas.ts`                | Zod validation schemas. Must stay in sync with `types/index.d.ts` and `constants/index.ts`. Used for runtime validation of AI responses and user input.                                                            |

## Stage 3: Operational mental models (build confidence)

### Model 1: "Next.js App Router server/client split"

- **Server components** (default): Can be async, fetch data directly, access environment variables, use server-only APIs. Cannot use hooks, browser APIs, or event handlers.
- **Client components** (`"use client"`): Can use hooks, browser APIs, event handlers, state. Cannot access server-only APIs or environment variables directly.
- **API routes**: Server-side only. Use `NextRequest`/`NextResponse`. Handle auth, rate limiting, and business logic here.
- **Navigation**: Server-side uses `redirect()` from `next/navigation`. Client-side uses `useRouter()` from `next/navigation` and `router.push()`.

### Model 2: "Resume lifecycle pipeline"

1. User fills form in `UploadForm` (client component): job title, description, company name, PDF file.
2. Optional: User imports job from URL → `POST /api/import-job` → Jina.ai fetches content → Cerebras AI extracts structured data → returns to form.
3. User submits → `POST /api/analyze`:
   - File validated (PDF, <20MB)
   - PDF written to temp file
   - External PDF service converts to markdown + preview image (base64)
   - Markdown truncated to 15K chars
   - Cerebras AI analyzes resume with job context
   - AI response validated with `FeedbackSchema` (Zod)
   - Resume record created in database (Prisma)
   - Temp file deleted
4. Client redirects to `/resume/[id]`
5. Resume detail page (`app/resume/[id]/page.tsx`): Server component fetches resume via Prisma, renders feedback sections in accordion.

### Model 3: "Authentication flow"

- **Server-side**: `getServerSession()` from `lib/auth-server.ts` checks cookies and returns session or `null`.
- **Protected routes**: Server components check session, redirect to `/auth` if missing. API routes return 401 if unauthenticated.
- **Client-side**: `useSession()` hook from `lib/auth-client.ts` provides reactive session state.
- **Sign in**: `signInWithGoogle()` triggers OAuth flow via Better Auth. Redirects handled automatically.
- **Sign out**: `signOut()` clears session and redirects.

### Model 4: "AI prompt governance"

- The schema string in `constants/index.ts` (`AIResponseFormat`) mirrors `types/index.d.ts` (`Feedback` interface).
- Update both together: `constants/index.ts` → `types/index.d.ts` → `lib/schemas.ts` (Zod) → consuming components.
- The emotional arc is enforced through textual instructions in `prepareInstructions`; UI copy assumes that structure. Changing the arc requires coordinated UX updates.
- AI config: Cerebras `gpt-oss-120b` model, `temperature: 0.6`, `max_completion_tokens: 65536`, `response_format: { type: "json_object" }`.
- Timeouts: 25s for analysis, 30s for job import. Handle gracefully with user-friendly error messages.

### Model 5: "Rate limiting strategy"

- **Hybrid approach**: In-memory cache (Map) for fast checks + database persistence for serverless resilience.
- **Cache TTL**: 60s. Cache cleanup runs every 5 minutes.
- **Database**: `RateLimit` table stores `key` (user:route), `count`, `resetAt`, `lastRequest`.
- **Limits**: `/api/analyze` = 2/min, `/api/import-job` = 5/min, default = 100/min.
- **Flow**: Check cache → if miss/hit limit, check DB → update both cache and DB → return allowed/denied.

### Model 6: "Database schema and Prisma patterns"

- **Schema**: Defined in `prisma/schema.prisma`. Better Auth tables (`User`, `Account`, `Session`, `Verification`) + app tables (`Resume`, `RateLimit`).
- **Client**: Singleton from `lib/prisma.ts`. Never create new `PrismaClient` instances (connection pool exhaustion).
- **Migrations**: Use `bunx prisma migrate dev` for development, `bunx prisma migrate deploy` for production. Never use `prisma db push` in production.
- **Relations**: `User` → `Resume[]` (one-to-many). Cascading deletes configured.
- **JSON fields**: `Resume.feedback` stored as `Json` type. Cast to `Feedback` type when reading (`as unknown as Feedback`).

## Stage 4: Execute your first contribution quickly (create urgency)

1. Choose an issue that touches only one layer (for example, a new dashboard card, additional validation rule, or UI component). Avoid cross-layer changes for the first PR.
2. Duplicate established patterns instead of inventing new ones. Example: new persisted fields must appear in:
   - `prisma/schema.prisma` (database schema)
   - `types/index.d.ts` (TypeScript types)
   - `constants/index.ts` (AI prompt schema string)
   - `lib/schemas.ts` (Zod validation schema)
   - Consuming components
3. Follow `DESIGN_SYSTEM.md` religiously. Use existing component patterns, CSS variables, and utility classes. Never introduce new fonts, colors, or spacing scales.
4. Validate locally: `bun run dev` for manual smoke tests, `bun run typecheck` for automated gating. No additional test suites exist.
5. Review for server/client boundary safety:
   - Server components: No hooks, no browser APIs, can be async
   - Client components: Mark with `"use client"`, can use hooks and browser APIs
   - API routes: Server-only, use `NextRequest`/`NextResponse`
6. Test authentication flows: Ensure protected routes redirect correctly, API routes return 401 when unauthenticated.
7. Test rate limiting: Verify limits are enforced (or use `DISABLE_RATE_LIMITING=true` in dev).
8. Capture screenshots or screen recordings; reviewers expect visual confirmation for UI changes.

## Reference commands

| Task                   | Command                   |
| ---------------------- | ------------------------- |
| Install dependencies   | `bun install`             |
| Generate Prisma Client | `bunx prisma generate`    |
| Run migrations         | `bunx prisma migrate dev` |
| Start dev server       | `bun run dev`             |
| Type checking          | `bun run typecheck`       |
| Build for production   | `bun run build`           |
| Serve production build | `bun run start`           |
| View Prisma Studio     | `bunx prisma studio`      |

## Design system reference

**Always consult `DESIGN_SYSTEM.md` before making UI changes.** Key takeaways:

- Typography: Mona Sans (never Inter/Roboto)
- Colors: Indigo/pink gradients, glassmorphic surfaces
- Components: Reference `ResumeCard`, `Navbar`, `UploadForm` for patterns
- Motion: Subtle (200-500ms), `ease-out`
- Spacing: Generous (`gap-6+`)

## Contact points for future contributors

- Next.js 16 App Router docs: `https://nextjs.org/docs/app`
- Better Auth docs: `https://www.better-auth.com/docs`
- Prisma docs: `https://www.prisma.io/docs`
- Tailwind CSS v4 docs: `https://tailwindcss.com/docs/v4`
- Cerebras AI docs: `https://docs.cerebras.ai`
- Design system: See `DESIGN_SYSTEM.md` in repository root
