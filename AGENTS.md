# AGENTS systems briefing

## Overview

- Objective: shorten the time between first clone and first merged pull request by exposing the systems non-obvious architecture, dependencies, and invariants.
- Audience: contributors familiar with TypeScript, React Router v7, Tailwind CSS 4, Bun, and Python backend APIs.
- Scope: client-rendered surfaces under `app/`, infrastructure glue in `app/lib`, API orchestration in `app/lib/services`, and the Python backend-backed persistence layer.

## Stage 1: Stabilize orientation (reduce initial anxiety)

### Run-time acceptance checklist

1. Confirm the toolchain: `bun --version` (>= 1.0), `node --version` (>= 18).
2. Install dependencies with `bun install`. Do not mix with npm or Yarn; the lockfile is Bun-specific (`bun.lock`).
3. Start the SSR dev server with `bun run dev`. Expect React Router v7s file-based server to answer on port 5173.
4. Verify the Python backend before testing authenticated flows. The backend handles auth via Better Auth and all resume operations.
5. Run `bun run typecheck` once per change set. This command also regenerates React Router type stubs via `react-router typegen`.

### Immediate hazards to neutralize

| Risk                                       | Mitigation                                                                                                                                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Better Auth session unavailable during SSR | Session hooks check for client-side execution. Keep new auth calls inside client-only effects or actions.                                                                                                     |
| API calls without proper auth headers      | All API calls go through `app/lib/api.ts` which handles cookie-based auth automatically via `credentials: "include"`.                                                                                         |
| AI responses breaking UI assumptions       | Keep the validation pipeline intact (`extractMessageText` `JSON.parse` `validateFeedbackStructure`). Add fields only after updating both the schema string in `constants/index.ts` and the runtime validator. |
| Navigation regressions                     | Preserve the `/auth?next=...` redirect contract used across routes.                                                                                                                                           |
| Resume data inconsistencies                | Backend normalizes both snake_case (API) and camelCase (legacy) field names. Frontend handles both formats.                                                                                                   |

## Stage 2: Recognize architecture patterns (provide relief)

### Layer map

| Layer            | Files                                                    | Responsibility                                                                  | Notes                                                              |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Entry + Layout   | `app/root.tsx`                                           | Bootstraps SSR shell, loads Tailwind, wires Sonner toasts and Analytics.        | `Layout` monitors Better Auth session state.                       |
| Routing          | `app/routes.ts`, `app/routes/**`                         | React Router v7 module routes with co-located UI and metadata.                  | Type signatures live in `app/routes/+types/**` (generated).        |
| State + Services | `app/lib/auth.ts`, `app/lib/api.ts`, `app/lib/services/` | Better Auth client and API layer; services encapsulate backend communication.   | All API calls use cookie-based auth automatically.                 |
| AI orchestration | Backend Python API                                       | Centralizes prompts, persona constraints, and Cerebras AI integration.          | Frontend validates response structure; backend handles generation. |
| Presentation     | `app/components/**`                                      | Tailwind-first components with shared tokens (`surface-card`, `section-shell`). | No third-party headless kit; accessibility is handcrafted.         |

### Ghosts in the machine (historical decisions that still bind the design)

- **Platform migration**: Earlier builds used Puter.js for auth and storage. The system now uses Better Auth + Python backend API for all operations. Code gracefully handles both snake_case (API) and camelCase (legacy) field names.
- **Text-only storage**: Resume PDFs are extracted to text server-side. The frontend displays text previews instead of image renders, removing PDF.js dependency from the client.
- **Prompt persona**: The behavioral-economist persona and emotional arc in `constants/index.ts` exist to stabilize AI tone. Removing it caused high rejection rates from ATS reviewers; keep the persona as reference for backend prompt structure.
- **Accordion persistence**: Contributors previously broke deep links by ignoring URL hashes. The accordion registers IDs and expands matching hashes on mount; preserve this when adding sections.
- **API-driven deletion**: Delete operations call the backend API and revalidate React Router loaders to refresh the UI.

### Directory signals

| Path                    | Signals                                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/components/`       | UI primitives. Expect Tailwind utility classes, `cn()` for merging, and Lucide icons. Maintain the `surface-card` design tokens defined in `app/app.css`.               |
| `app/routes/upload.tsx` | The heaviest orchestration file: form state, job import via fetch + AI summarization, and backend API calls for analysis. Treat it as the canonical workflow reference. |
| `app/routes/home.tsx`   | Dashboard lifecycles: loader fetches resumes from API, local deletion queue, toasts, and CTA variants.                                                                  |
| `app/lib/api.ts`        | API client foundation. All calls include cookies automatically and throw on HTTP errors.                                                                                |
| `app/lib/services/`     | Service layer wrapping backend endpoints. Resume operations live in `resume-api.ts`.                                                                                    |
| `constants/index.ts`    | Reference for AI contracts. Backend owns prompts but this file documents the expected response structure.                                                               |
| `types/index.d.ts`      | Global ambient types for `Resume`, `Feedback`, and `LineImprovement`. Handles both API (snake_case) and legacy (camelCase) field names.                                 |

## Stage 3: Operational mental models (build confidence)

### Model 1: "Better Auth as session manager"

- Interact with auth exclusively through `app/lib/auth.ts`. Session state comes from `useSession()` hook.
- Handle absence gracefully: routes check session and redirect via `loader` if unauthenticated.
- Authentication drives navigation. Routes gate access by checking session in loaders; they redirect via `redirect()` if needed.

### Model 2: "Resume lifecycle pipeline"

1. Collect form data and job context in `upload.tsx`.
2. Upload PDF via `resumeApi.analyze` which sends multipart form to Python backend.
3. Backend extracts text, generates instructions, calls Cerebras AI, validates response.
4. Backend persists resume + feedback to PostgreSQL, returns `resume_id` and `feedback`.
5. Frontend redirects to `/resume/:id`.
6. Downstream pages read via `loader` calling `resumeApi.get(id)`, render text preview and feedback sections.

### Model 3: "SSR-first React Router"

- Route modules run in both server and client contexts. Keep browser-only APIs inside effects or guards (`typeof window !== "undefined"`).
- Use the generated `Route` types when adding loaders or actions to prevent signature drift.
- The layout must remain pure (no async) to satisfy React Routers streaming SSR pipeline.

### Model 4: "AI prompt governance"

- The schema string in `constants/index.ts` mirrors `types/index.d.ts`. Backend owns the actual prompts.
- Frontend validates structure with `validateFeedbackStructure` to enforce the contract.
- The emotional arc is enforced through backend prompts; UI copy assumes that structure. Changing the arc requires coordinated backend + frontend updates.

## Stage 4: Execute your first contribution quickly (create urgency)

1. Choose an issue that touches only one layer (for example, a new dashboard card or an additional validation rule). Avoid cross-layer changes for the first PR.
2. Duplicate established patterns instead of inventing new ones. Example: new persisted fields must appear in `types/index.d.ts`, the backend schema, the validator, and the consuming components.
3. Validate locally: `bun run dev` for manual smoke tests, `bun run typecheck` for automated gating. No additional test suites exist.
4. Review for SSR safety. Look for `window`, `document`, or DOM-only APIs and wrap them in guards.
5. Capture screenshots or screen recordings; reviewers expect visual confirmation for UI changes.

## Reference commands

| Task                        | Command             |
| --------------------------- | ------------------- |
| Install dependencies        | `bun install`       |
| Start dev server (SSR)      | `bun run dev`       |
| Type generation + typecheck | `bun run typecheck` |
| Build for production        | `bun run build`     |
| Serve production build      | `bun run start`     |

## Contact points for future contributors

- Better Auth documentation: `https://www.better-auth.com/`
- React Router v7 SSR guide: `https://reactrouter.com/7/ssr/introduction`
- Tailwind CSS v4 release notes (utility changes referenced in `app/app.css`): `https://tailwindcss.com/docs/v4`

## Migration notes

**⚠️ CRITICAL MIGRATION**: This codebase has been fully migrated from Puter.js to Better Auth + Python backend API.

### What changed

- **Auth**: Puter.js Better Auth (server-side sessions)
- **Storage**: Puter KV (`resume:{uuid}`) PostgreSQL via Python API
- **Files**: Puter FS (PDF + image) Text-only (server-side extraction)
- **AI**: Puter AI Cerebras AI via Python API
- **State**: Zustand store (`usePuterStore`) React Router loaders/actions

### Backend integration

All operations now go through `app/lib/api.ts` `app/lib/services/resume-api.ts`:

- `POST /api/analyze/resume`: Upload PDF + metadata, returns `resume_id` + `feedback`
- `GET /api/resumes`: List all resumes for authenticated user
- `GET /api/resumes/:id`: Get specific resume by ID
- `DELETE /api/resumes/:id`: Delete resume and its analysis

### Field naming

Backend uses snake_case (`company_name`, `job_title`, `text_content`). Frontend handles both snake_case (API) and camelCase (legacy) for backward compatibility. Type definitions in `types/index.d.ts` include both formats.

### No PDF rendering

PDFs are extracted to text server-side. Frontend displays text previews instead of rendered images. This removes PDF.js worker complexity from the client.

### Auth flow

1. User lands on protected route without session redirected to `/auth?next=/original-path`
2. User clicks sign in Better Auth handles OAuth or credentials
3. Session cookie set automatically redirect to `next` param
4. All API calls include session cookie via `credentials: "include"`

### Data fetching

Routes use loaders instead of `useEffect`:

```typescript
export async function loader({ request }: Route.LoaderArgs) {
  try {
    const resumes = await resumeApi.list();
    return { resumes };
  } catch (error) {
    if (error instanceof Error && error.message.includes("401")) {
      const url = new URL(request.url);
      throw redirect(`/auth?next=${url.pathname}`);
    }
    throw error;
  }
}
```

Component receives data from `loaderData` prop, no loading state needed.

### Mutations

Use React Router actions or direct API calls + revalidation:

```typescript
const revalidator = useRevalidator();

const confirmDelete = async () => {
  await resumeApi.delete(id);
  revalidator.revalidate(); // Refresh loader data
};
```

### Environment variables

Required in `.env`:

```bash
BETTER_AUTH_URL=http://localhost:3000
API_URL=http://localhost:8000
```

Vite config injects these via `define` for client-side access.

---

**Last Updated**: 2025-01-XX  
**Version**: 2.0.0 (Post-migration)
