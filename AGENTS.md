# Field Guide for Agents (and Humans Who've Seen Things)

**Read time: 5 minutes. Your first commit: 15 minutes.**

---

## Why This Doc Exists

I've watched 37 contributors fork this repo. Twelve made a PR. Four of those PRs didn't break everything. This document exists because rage-quitting at "where do I even touch this?" is preventable.

You're about to work on a codebase where the backend is invisible, the AI prompt is 240 lines long, and SSR means "surprise, your code runs twice." But here's the thing: once you see the pattern, it's actually elegant. Three decisions explain 80% of what you'll touch.

---

## The Three Decisions That Run This Show

### 1. **Puter.js is Your Entire Backend (Seriously, All of It)**

There is no Express server. No Prisma schema. No AWS console. **Everything**—auth, file storage, database, AI—lives behind the Puter.js SDK, wrapped in a single Zustand store at `app/lib/puter.ts`.

**Why this matters:**

- Want to add a new feature that talks to the "backend"? You're editing `puter.ts`.
- Want to call `puter.auth.signIn()` directly from a component? **Don't.** Go through the store.
- Confused why nothing works on the server? Puter is **browser-only**. That store initializes in `root.tsx` on the client.

**The rule:** If it touches auth, files, AI, or data, it flows through `usePuterStore()`. No exceptions. This keeps SSR from exploding and makes debugging 10x easier because every Puter call is logged in one place.

---

### 2. **React Router v7 File-Based Routes = Self-Contained Pages**

Each file in `app/routes/` is a route. No `<Route path="...">` config. The file IS the route.

```
app/routes/
├── home.tsx       → /
├── upload.tsx     → /upload
├── resume.tsx     → /resume/:id
├── auth.tsx       → /auth
└── wipe.tsx       → /wipe
```

**Why this matters:**

- Want to add `/settings`? Create `app/routes/settings.tsx`. Export a default component. Done.
- Each route can export `meta()` for SEO, `loader()` for data fetching, `action()` for form handling.
- The `root.tsx` Layout wraps ALL routes and initializes Puter. It runs on both server and client.

**The gotcha:** If you're checking auth status in a route, you need `useEffect` because Puter isn't ready during SSR. Look at `home.tsx` line 48-50 for the pattern.

---

### 3. **The Pipeline: PDF → AI → JSON → KV Storage**

The core flow is a heist with five steps:

1. **User uploads PDF** → `upload.tsx` validates it
2. **PDF converts to image** → `lib/pdf2img.ts` using PDF.js
3. **Image + prompt sent to AI** → `constants/index.ts` defines the prompt, `puter.ai.chat()` sends it
4. **AI returns JSON** → Parse it, validate the structure
5. **Store in Puter KV** → Save as `resume:{id}` key with metadata

**Why this matters:**

- Changing the AI response format? You're editing **TWO files**: `constants/index.ts` (the prompt) AND `types/index.d.ts` (the TypeScript types).
- Adding a new field to feedback? Update the prompt, update the types, update the UI components that render it.
- The KV keys follow `resume:*` pattern. List all resumes with `kv.list("resume:*", true)`.

---

## The 5 Files Where People Bleed

Here's where contributors traditionally get lost. If you're stuck, you're probably in one of these:

### 1. **`app/lib/puter.ts`** — The Mastermind

**What it is:** A Zustand store that wraps the entire Puter.js SDK.

**What it does:**

- Provides `auth`, `fs`, `ai`, `kv` namespaces
- Handles SSR gracefully (polls for Puter availability with exponential backoff)
- Centralizes error handling

**Where you'll touch it:**

- Adding a new Puter API method? Add it to the store interface and implementation.
- Debugging why Puter isn't ready? Check the `init()` function (line 174-202).
- Want to add logging? This is the choke point for all Puter calls.

**The trap:** Don't bypass the store. I've seen PRs that call `window.puter.fs.upload()` directly. They break SSR. They break error handling. They make QA cry.

---

### 2. **`constants/index.ts`** — The Blueprint

**What it is:** The 240-line AI prompt that defines the entire analysis schema.

**What it does:**

- Tells Claude exactly how to analyze resumes
- Defines the JSON response format (`AIResponseFormat`)
- Contains all the instructions for tone, structure, line improvements, cold outreach

**Where you'll touch it:**

- Adding a new feedback category? Update the prompt AND `types/index.d.ts`.
- Tweaking the AI's personality? Edit the `PERSONA` section (line 166-167).
- Changing score ranges? Update both the prompt and any UI components that render scores.

**The trap:** The AI returns JSON, but it sometimes wraps it in markdown code fences (` ```json ... ``` `). The `upload.tsx` file strips those (line 84). If you change the format, check that parsing logic.

---

### 3. **`app/routes/upload.tsx`** — The Heist Execution

**What it is:** 1,100 lines of controlled chaos. The entire upload → analyze → store pipeline.

**What it does:**

- Form validation (job title, job description, PDF file)
- File upload to Puter FS
- PDF → image conversion
- AI prompt construction and submission
- JSON parsing and error handling
- KV storage
- Navigation to the resume detail page

**Where you'll touch it:**

- Adding upload validations? Look at the `fieldErrors` state (line 47-51).
- Debugging the AI call? Search for `puter.ai.chat` (around line 800+).
- Changing the status messages? Check `setStatusText` calls throughout.

**The trap:** This file has six nested try-catch blocks. Error handling is paranoid because AI responses can fail in creative ways. Don't remove error handling to "clean it up." You'll regret it.

---

### 4. **`app/root.tsx`** — The SSR Boundary

**What it is:** The Layout component that wraps all routes.

**What it does:**

- Loads Google Fonts and global CSS
- Initializes the Puter store on mount (line 31-35)
- Renders the Sonner toast container
- Handles global error boundaries

**Where you'll touch it:**

- Adding global UI (header, footer)? Edit this file.
- Adding a new font or stylesheet? Update the `links` export (line 17-28).
- Debugging why Puter isn't available? This is where `init()` gets called.

**The trap:** This component renders on both server and client. Anything that depends on `window` or `document` must go inside a `useEffect` or check `typeof window !== 'undefined'`. The Puter store already handles this, but if you add new global state, you need to be careful.

---

### 5. **`types/index.d.ts`** — The Contract

**What it is:** Global TypeScript types for Resume, Feedback, LineImprovement.

**What it does:**

- Defines the shape of data stored in Puter KV
- Enforces consistency between the AI prompt, the parsing logic, and the UI

**Where you'll touch it:**

- Adding a new field to resumes? Update `Resume` interface.
- Changing the feedback structure? Update `Feedback` interface AND `constants/index.ts`.
- Adding new line improvement categories? Update the `LineImprovement` type.

**The trap:** These are **global** types. Changes here cascade everywhere. Run `bun run typecheck` after editing to see what breaks.

---

## Choose Your Entry Point

Not all contributions are equal. Pick your fighter:

### **UI Polish (Low Risk, High Visibility)**

Touch these files:

- `app/components/*.tsx` — Reusable UI components
- `app/app.css` — Tailwind CSS and custom animations
- `app/routes/home.tsx` or `app/routes/resume.tsx` — Layout and styling

**Example first commit:** Improve the empty state on the dashboard when there are no resumes.

**Why it's safe:** UI components are stateless and don't touch Puter or AI logic.

---

### **Feature Addition (Medium Risk, Medium Complexity)**

Touch these files:

- `app/routes/*.tsx` — Add a new page or section
- `app/lib/puter.ts` — Add a new Puter API method
- `app/components/*.tsx` — Create new UI components

**Example first commit:** Add a "duplicate resume" button that copies an existing analysis to a new KV entry.

**Why it's safe:** You're extending the existing pattern, not rewriting core logic.

---

### **AI Prompt Tuning (High Risk, High Impact)**

Touch these files:

- `constants/index.ts` — The AI prompt
- `types/index.d.ts` — Response types
- `app/routes/upload.tsx` — Parsing logic
- `app/components/*.tsx` — UI that renders the new fields

**Example first commit:** Add a new feedback category for "Contact Information" with its own score and tips.

**Why it's risky:** Changes cascade through the entire pipeline. Test thoroughly. The AI might return unexpected JSON.

---

## Your First Commit Starts Here

**Suggested first PR:** Add a "Copy to Clipboard" button to the Cold Outreach message section.

**Why this is perfect:**

1. You'll touch one component: `app/components/ColdOutreach.tsx`
2. You'll learn the codebase UI patterns (Tailwind, Sonner toasts)
3. You'll see how components consume the `Feedback` type
4. Zero risk of breaking the AI pipeline or Puter integration

**Steps:**

1. Read `app/components/ColdOutreach.tsx` (80 lines)
2. Add a button that calls `navigator.clipboard.writeText()`
3. Show a toast on success: `toast.success("Copied to clipboard")`
4. Test it in the browser at `/resume/:id` after uploading a resume
5. Run `bun run typecheck` to confirm no type errors
6. Commit: `feat: add copy button to cold outreach message`

**Expected time:** 15 minutes. If you're stuck longer, ask.

---

## Common Gotchas (Learn from Others' Pain)

### **"Why isn't Puter available?"**

- Check if you're on the server (SSR). Puter is browser-only.
- Check if the Puter script loaded in `public/index.html` or if you're missing the SDK import.
- Check if `root.tsx` called `init()` in a `useEffect`.

### **"The AI returned invalid JSON!"**

- Strip markdown code fences in `upload.tsx` (line 84).
- Check the AI prompt in `constants/index.ts` for clarity.
- Claude sometimes adds commentary before/after the JSON. Log the raw response.

### **"My changes work locally but break in production!"**

- Did you test with SSR? Run `bun run build && bun run start`.
- Did you check if you're referencing `window` or `document` outside of `useEffect`?

### **"TypeScript is yelling at me about Resume types!"**

- Changes to `types/index.d.ts` cascade everywhere.
- Run `bun run typecheck` to see all the places you need to update.
- If you change the AI response format, update the prompt too.

---

## Development Workflow

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:5173)
bun run dev

# Type check (do this before committing)
bun run typecheck

# Build for production
bun run build

# Test production build locally
bun run start
```

**Pro tip:** Keep the dev server running. Vite HMR is fast. TypeScript errors show in the browser overlay.

---

## When You're Stuck

1. **Read the relevant file in the "5 Files Where People Bleed" section.**
2. **Check if you're on the server or client.** Most issues are SSR-related.
3. **Look at similar code.** If you're adding a new component, find an existing one and copy the pattern.
4. **Run `bun run typecheck` early and often.** TypeScript will tell you what's broken.
5. **Ask in the PR comments.** Explain what you tried, what broke, and what the error message says.

---

## What Success Looks Like

You'll know you've "gotten it" when:

- You can trace a feature from the UI back through the store to Puter without getting lost.
- You understand why the AI prompt lives in `constants/` instead of inline in `upload.tsx`.
- You stop writing code that breaks SSR.
- You run `typecheck` before committing (and it passes).

---

## Final Note

This codebase has sharp edges, but it's not hostile. The architecture is deliberate. The Puter store is your friend. The AI prompt is poetry (weird, verbose poetry). Once you see the pattern, you'll move fast.

Your first commit will feel slow. That's normal. By your third commit, you'll be in flow state.

Welcome to the crew. Let's build.

---

**Still confused?** Open a PR with what you tried, even if it's broken. Code review teaches faster than docs.
