# AGENTS systems briefing

## Overview

- Objective: shorten the time between first clone and first merged pull request by exposing the systems non-obvious architecture, dependencies, and invariants.
- Audience: contributors familiar with TypeScript, React Router v7, Tailwind CSS 4, Bun, and the Puter.js platform.
- Scope: client-rendered surfaces under `app/`, infrastructure glue in `app/lib`, AI prompt orchestration in `constants/`, and the Puter-backed persistence layer mediated by Zustand.

## Stage 1: Stabilize orientation (reduce initial anxiety)

### Run-time acceptance checklist

1. Confirm the toolchain: `bun --version` (>= 1.0), `node --version` (>= 18).
2. Install dependencies with `bun install`. Do not mix with npm or Yarn; the lockfile is Bun-specific (`bun.lock`).
3. Start the SSR dev server with `bun run dev`. Expect React Router v7s file-based server to answer on port 5173.
4. Verify the Puter runtime before testing authenticated flows. In the browser console, wait for `window.puter` to appear; the layouts `useEffect` initializes the store when that object resolves.
5. Run `bun run typecheck` once per change set. This command also regenerates React Router type stubs via `react-router typegen`.

### Immediate hazards to neutralize

| Risk                                                | Mitigation                                                                                                                                                                                                      |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Puter SDK unavailable during SSR or early hydration | Every store method checks `typeof window === "undefined"`. Keep new Puter calls inside client-only effects or actions.                                                                                          |
| KV or FS writes without namespace discipline        | Maintain the `resume:{uuid}` key pattern; downstream features assume the prefix when listing.                                                                                                                   |
| AI responses breaking UI assumptions                | Keep the validation pipeline intact (`extractMessageText`  `JSON.parse`  `validateFeedbackStructure`). Add fields only after updating both the schema string in `constants/index.ts` and the runtime validator. |
| PDF rendering crashes                               | Reuse the singleton worker in `convertPdfToImage`. Do not create new workers per conversion; memory pressure will break Safari and mobile Chromium.                                                             |
| Navigation regressions                              | Preserve the `/auth?next=...` redirect contract used across routes.                                                                                                                                             |

## Stage 2: Recognize architecture patterns (provide relief)

### Layer map

| Layer            | Files                                                        | Responsibility                                                                                                | Notes                                                                     |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Entry + Layout   | `app/root.tsx`                                               | Bootstraps SSR shell, loads Tailwind, initializes Puter store, wires Sonner toasts and Analytics.             | `Layout` runs `usePuterStore().init()` exactly once per document.         |
| Routing          | `app/routes.ts`, `app/routes/**`                             | React Router v7 module routes with co-located UI and metadata.                                                | Type signatures live in `app/routes/+types/**` (generated).               |
| State + Services | `app/lib/puter.ts`, `app/lib/pdf2img.ts`, `app/lib/utils.ts` | Single Zustand store mediates auth, filesystem, KV, and AI; utility modules encapsulate expensive operations. | Polling for `window.puter` uses exponential backoff capped at 2 s delays. |
| AI orchestration | `constants/index.ts`                                         | Centralizes prompts, persona constraints, and response schema.                                                | The stringified TypeScript interface is the contract enforced at runtime. |
| Presentation     | `app/components/**`                                          | Tailwind-first components with shared tokens (`surface-card`, `section-shell`).                               | No third-party headless kit; accessibility is handcrafted.                |

### Ghosts in the machine (historical decisions that still bind the design)

- **Platform bootstrap**: Earlier builds loaded Puter scripts asynchronously, leading to race conditions. The current store seeds `window.puter` manually and defers initialization with exponential backoff. Do not revert to direct imports.
- **Worker reuse pact**: PDF previews once allocated a worker per request, exhausting memory. The singleton `workerInstance` is a hard requirement.
- **Prompt persona**: The behavioral-economist persona and emotional arc in `prepareInstructions` exist to stabilize AI tone. Removing it caused high rejection rates from ATS reviewers; keep the persona hidden from end users but present in prompts.
- **Accordion persistence**: Contributors previously broke deep links by ignoring URL hashes. The accordion registers IDs and expands matching hashes on mount; preserve this when adding sections.
- **KV flush expectations**: `wipe.tsx` assumes `kv.flush()` clears all `resume:*` keys. New KV namespaces must account for this or expose a secondary wipe path.

### Directory signals

| Path                    | Signals                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/components/`       | UI primitives. Expect Tailwind utility classes, `cn()` for merging, and Lucide icons. Maintain the `surface-card` design tokens defined in `app/app.css`.           |
| `app/routes/upload.tsx` | The heaviest orchestration file: form state, Puter FS uploads, AI retries, PDF conversion, and job import heuristics. Treat it as the canonical workflow reference. |
| `app/routes/home.tsx`   | Dashboard lifecycles: KV list, local deletion queue, toasts, and CTA variants.                                                                                      |
| `constants/index.ts`    | Single source of truth for AI contracts. Update here before editing validators.                                                                                     |
| `types/index.d.ts`      | Global ambient types for `Resume`, `Feedback`, and `LineImprovement`. Align any new persisted shape with these definitions.                                         |

## Stage 3: Operational mental models (build confidence)

### Model 1: "Puter as capability registry"

- Interact with Puter exclusively through the Zustand store. Each namespace (`auth`, `fs`, `kv`, `ai`) exposes Promise-returning methods.
- Handle absence gracefully: methods resolve `undefined` on failure. Downstream callers must guard against falsy results.
- Authentication drives navigation. Routes gate access by watching `auth.isAuthenticated`; they redirect via `useNavigate` if unauthenticated.

### Model 2: "Resume lifecycle pipeline"

1. Collect form data and job context in `upload.tsx`.
2. Convert the uploaded PDF to a WebP (or PNG fallback) preview via `convertPdfToImage`.
3. Upload both artifacts using `fs.upload`; capture returned `FSItem.path` values.
4. Generate instructions with `prepareInstructions` and call `ai.chat`.
5. Validate the AI response; abort and toast on structural violations.
6. Persist the merged payload to KV (`resume:{uuid}`) and route to `/resume/:id`.
7. Downstream pages read the KV entry, stream blobs via `fs.read`, and render sections inside the accordion.

### Model 3: "SSR-first React Router"

- Route modules run in both server and client contexts. Keep browser-only APIs inside effects or guards (`typeof window !== "undefined"`).
- Use the generated `Route` types when adding loaders or actions to prevent signature drift.
- The layout must remain pure (no async) to satisfy React Routers streaming SSR pipeline.

### Model 4: "AI prompt governance"

- The schema string in `constants/index.ts` mirrors `types/index.d.ts`. Update both together and adjust `validateFeedbackStructure` to enforce the new contract.
- The emotional arc is enforced through textual instructions; UI copy assumes that structure. Changing the arc requires coordinated UX updates.
- Retry logic for job import AI calls caps at three attempts with Gemini Flash. Respect this budget to avoid quota issues.

## Stage 4: Execute your first contribution quickly (create urgency)

1. Choose an issue that touches only one layer (for example, a new dashboard card or an additional validation rule). Avoid cross-layer changes for the first PR.
2. Duplicate established patterns instead of inventing new ones. Example: new persisted fields must appear in `types/index.d.ts`, the prompt schema string, the validator, and the consuming components.
3. Validate locally: `bun run dev` for manual smoke tests, `bun run typecheck` for automated gating. No additional test suites exist.
4. Review for SSR safety. Look for `window`, `document`, or DOM-only APIs and wrap them in guards.
5. Run through the wipe workflow if you added storage: ensure `/wipe` still clears your artifacts.
6. Capture screenshots or screen recordings; reviewers expect visual confirmation for UI changes.

## Reference commands

| Task                        | Command             |
| --------------------------- | ------------------- |
| Install dependencies        | `bun install`       |
| Start dev server (SSR)      | `bun run dev`       |
| Type generation + typecheck | `bun run typecheck` |
| Build for production        | `bun run build`     |
| Serve production build      | `bun run start`     |

## Contact points for future contributors

- Puter platform documentation: `https://puter.com/docs/js`
- React Router v7 SSR guide: `https://reactrouter.com/7/ssr/introduction`
- Tailwind CSS v4 release notes (utility changes referenced in `app/app.css`): `https://tailwindcss.com/docs/v4`
