# Resumind Design System Skill

## Purpose

Guide design generation to match Resumind's glassmorphic aesthetic: frosted surfaces, subtle gradients, and clear hierarchy. Avoid generic patterns while maintaining consistency with the established system.

## Core Problem

Designs can drift toward generic SaaS patterns (Inter, purple gradients, flat cards) or over-styled alternatives. Resumind uses a specific glassmorphic language that must be preserved.

## Routing Context

The app uses a split routing structure:

- `/` -- Public landing page (server component, no auth). Marketing-focused with 10 sections.
- `/auth` -- Sign-in page with gradient hero panel and glassmorphic form.
- `/app` -- Authenticated dashboard (protected by `(dashboard)` route group layout).
- `/app/upload`, `/app/resume/[id]`, `/app/cover-letter/*` -- Authenticated sub-routes.

All internal navigation within the authenticated app uses `/app/...` prefixed paths. The `UserMenu` sign-out intentionally navigates to `/` (the landing page). All dashboard links point to `/app`.

## Design Principles

### Typography

Mona Sans is the primary typeface. Use it consistently with clear hierarchy.

**Font Stack:**

- Primary: `"Mona Sans", ui-sans-serif, system-ui, sans-serif`
- Variable weights: 200-900
- Load from Google Fonts: `https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap`

**Typography Scale:**

- Headlines (app): `text-4xl` → `text-6xl` (sm: `text-5xl`, lg: `text-6xl`, xl: `text-[58px]`), `font-semibold`
- Headlines (landing): `text-4xl` → `text-7xl` (sm: `text-5xl`, lg: `text-6xl`, xl: `text-7xl`), `font-bold` for more punch
- Leading: `leading-[1.08]` for all headlines
- Weight: `font-semibold` (600) for app headlines, `font-bold` (700) for landing page headlines, `font-medium` for body
- Eyebrow labels: `text-xs` or `text-sm`, `uppercase`, `tracking-[0.28em]` to `tracking-[0.32em]`, muted color (`text-slate-500` or `text-indigo-500`)

**Gradient Text:**

Used for high-emphasis text on the landing page. The gradient is a warm-to-cool sweep that complements the indigo/pink palette without being generic purple.

```css
.text-gradient {
  @apply bg-clip-text text-transparent bg-linear-to-r from-[#AB8C95] via-[#000000] to-[#8E97C5];
}
```

Usage: hero accent phrases, step numbers, stat counters. Never for body text or secondary labels.

**Never use:**

- Inter, Roboto, Open Sans, or other sans-serifs
- Serif fonts (editorial style)
- Monospace fonts (except inside diff/code mockups)
- System font fallbacks as primary

**Implementation:**

```css
.headline {
  @apply text-balance text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl xl:text-[58px];
}

.section-eyebrow {
  @apply inline-flex items-center justify-center self-start rounded-full border border-white/70 bg-white/80 px-4 py-1 text-sm font-medium uppercase tracking-[0.32em] text-slate-500 shadow-[var(--shadow-ring)] backdrop-blur;
}

/* Landing page variant -- indigo tint, icon slot, smaller text */
.landing-eyebrow {
  @apply inline-flex items-center justify-center rounded-full border border-white/70 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500 backdrop-blur;
  box-shadow: var(--shadow-ring);
}
```

### Color & Theme

Glassmorphic palette with indigo/pink gradients and semantic colors.

**Color System (CSS Variables):**

```css
--color-dark-200: #344053;
--color-dark-300: #0f172a;
--color-light-blue-100: #c1d3f81a;
--color-light-blue-200: #a7bff14d;
--color-surface: #ffffff;
--color-surface-muted: rgba(255, 255, 255, 0.88);

--color-badge-green: #d5faf1;
--color-badge-red: #f9e3e2;
--color-badge-yellow: #fceed8;
```

**Primary Palette:**

- Indigo gradient: `#6f7aff` → `#4c57e9` → `#7b5cff` (buttons, accents)
- Pink accent: `rgba(250, 113, 133, 0.12)` (background gradients)
- Slate grays: `slate-50` (background) → `slate-900` (text)
- Deep indigo (immersive sections): `#1e1b4b` → `#312e81` → `#3730a3` (CTA backgrounds, auth hero)

**Neutral Text Gradient:**

A warm-to-cool gradient used for large numeric/accent text. Avoids the cliché purple-to-pink by using muted rose, pure black, and dusty blue:

```
from-[#AB8C95] via-[#000000] to-[#8E97C5]
```

Usage: step numbers (`01`, `02`, `03`), stat counters, hero accent text. Applied via `bg-clip-text text-transparent`.

**Semantic Colors:**

- Success: Emerald (`bg-emerald-100/80`, `text-emerald-700`)
- Warning: Amber (`bg-amber-100/70`, `text-amber-700`)
- Error: Red (`bg-rose-100/80`, `text-rose-700`)

**Background Strategy:**

```css
/* App pages: fixed radial gradient wash */
body {
  background-image:
    radial-gradient(
      circle at top left,
      rgba(124, 139, 255, 0.14),
      transparent 45%
    ),
    radial-gradient(
      circle at top right,
      rgba(250, 113, 133, 0.12),
      transparent 40%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.92),
      rgba(255, 255, 255, 0.88)
    );
  background-attachment: fixed;
}
```

For immersive sections (final CTA, auth hero), use the deep indigo gradient with animated blobs at higher opacity:

```css
background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 100%);
```

Overlay a noise texture (`feTurbulence` SVG inline data URI, `mix-blend-mode: overlay`, `opacity: 0.3`) for grain depth.

**Never use:**

- Solid white/gray backgrounds
- Flat color fills without depth
- Generic purple gradients (the indigo/pink palette is specific, follow the hex values)
- Dark mode (light mode only)
- High-contrast neon colors

### Glassmorphic Surfaces

Core visual language: frosted glass cards with backdrop blur.

**Surface Card Pattern:**

```css
.surface-card {
  @apply rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] p-6 shadow-[var(--shadow-surface)] backdrop-blur-md;
}
```

**Key Properties:**

- Border radius: `28px` (`--radius-card`)
- Background: `rgba(255, 255, 255, 0.88-0.95)` opacity
- Border: `border-white/30` or `border-white/70`
- Backdrop blur: `backdrop-blur-md` or `backdrop-blur-xl`
- Shadow: Soft elevation (`--shadow-surface`, `--shadow-ring`)

**Variants:**

- Standard: `p-6`
- Tight: `surface-card--tight` with `p-5 sm:p-6`
- Navbar (app): `bg-white/85` + `backdrop-blur-xl` + `rounded-full`
- Navbar (landing): `bg-white/85` + `backdrop-blur-xl` + `rounded-full` + `max-w-5xl` centered
- Bento cell: `rounded-card` + `border-white/40` + `bg-white/90` + hover lift
- Step card: Same surface DNA but with gradient step numbers
- Trust bar: `rounded-full` + `border-white/40` + `bg-white/80` horizontal band
- Testimonial card: `rounded-card` + `border-white/40` + `bg-white/90` + star ratings
- FAQ item: `rounded-2xl` + `border-white/40` + `bg-white/80`

**Pattern: Full-width glassmorphic bands**

For horizontal trust bars and stat bands, use `rounded-full` or `rounded-card` with `bg-white/80-90` and `backdrop-blur-md`. These sit between content sections as visual breathers.

**Pattern: Mockup frames**

CSS-built product mockups use a browser chrome header (three colored dots + address bar) with `border`, `bg-white/95`, and `rounded-card`. The mockup body renders fake UI with semantic colors matching the real app output. See `.mockup-frame`, `.mockup-chrome`, `.mockup-dot` in `globals.css`.

**Never use:**

- Solid backgrounds without transparency
- Heavy borders (`border-2` or darker)
- Flat shadows without blur
- Sharp corners (`rounded-lg` or less)

### Motion & Animation

Subtle, purposeful motion with gentle easing. Three animation tiers:

1. **Micro**: Hover/focus transitions (150–300ms). CSS transitions only.
2. **Entrance**: Elements appearing on scroll or page load (500–1000ms). CSS keyframes.
3. **Ambient**: Background blobs and floating elements (6–25s). CSS keyframes, infinite loops.

**Transition Standards:**

- Duration: `200ms` (buttons), `300ms` (cards), `500ms` (complex)
- Easing: `ease-out` standard
- Transform: `hover:-translate-y-0.5` to `hover:-translate-y-1`

**Hover Patterns:**

```css
/* Cards */
.resume-card {
  @apply hover:-translate-y-1 hover:shadow-[0_30px_70px_-35px_rgba(15,23,42,0.45)] transition-transform duration-300;
}

/* Buttons */
.primary-button {
  @apply hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-20px_rgba(96,107,235,0.48)] transition-transform duration-200 ease-out;
}

/* Bento cells */
.bento-cell {
  @apply hover:-translate-y-1 hover:shadow-lg transition-all duration-300;
}
```

**Accordion Animation:**

```css
/* Grid-based expand/collapse */
grid transition-all duration-300 ease-in-out
grid-rows-[1fr] opacity-100 (active)
grid-rows-[0fr] opacity-0 (inactive)
```

**Organic Blob Animation (shared across Auth + Landing + CTA):**

```css
/* Slow morphing blobs -- transform + border-radius only (GPU-composited) */
@keyframes blobMorph1 {
  0%,
  100% {
    border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
    transform: translate(0, 0) scale(1);
  }
  25% {
    border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%;
    transform: translate(5%, -8%) scale(1.05);
  }
  50% {
    border-radius: 30% 70% 40% 60% / 55% 30% 70% 45%;
    transform: translate(-3%, 6%) scale(0.97);
  }
  75% {
    border-radius: 55% 45% 60% 40% / 40% 70% 30% 60%;
    transform: translate(4%, 3%) scale(1.03);
  }
}
/* blobMorph2: 22s, blobMorph3: 25s -- see globals.css for full definitions */
```

- Cycle durations: 18s, 22s, 25s (staggered to avoid sync)
- Use `will-change: transform, border-radius` on blob elements
- Position blobs with percentage-based `top`/`left`/`right`/`bottom` and percentage widths/heights
- Blobs use `radial-gradient` fills, not solid colors
- Blob opacity varies by context: ~0.45–0.55 on dark backgrounds (auth hero, CTA), ~0.15–0.20 on light backgrounds (landing hero)

**Entrance Animations:**

Three entrance keyframes serve different contexts:

```css
/* Auth page cards */
@keyframes authFadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Usage: animation: authFadeUp 600ms ease-out both; animation-delay: 150ms; */

/* Landing page headlines, CTAs */
@keyframes landingFadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Usage: animation: landingFadeUp 0.8s ease-out both; animation-delay: 0–300ms staggered */

/* Landing hero mockup */
@keyframes landingScaleIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
/* Usage: animation: landingScaleIn 1s ease-out both; animation-delay: 500ms */
```

Stagger delays for grouped elements: 0ms → 150ms → 300ms → 500ms.

**Floating Mockup Animation:**

```css
@keyframes floatMockup {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
/* Usage: animation: floatMockup 6s ease-in-out infinite */
```

Used on hero product mockup. Gentle 12px vertical oscillation at 6s cycle.

**Scroll-Triggered Entrance: `ScrollReveal` Component**

A minimal client component (`app/components/ScrollReveal.tsx`) wraps sections in a `.scroll-reveal` container. Uses `IntersectionObserver` (threshold 0.15) to add `.is-visible` class when the element enters the viewport. Supports `delay` prop for staggered reveals.

```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s ease-out,
    transform 0.7s ease-out;
}
.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

Design decisions:

- Chose `IntersectionObserver` over `animation-timeline: view()` for browser compatibility.
- The component is a client component to use `useEffect`, but wraps server-rendered children (no hydration mismatch).
- Once visible, the observer disconnects. No re-triggering on scroll up.
- Delay is applied via `setTimeout` in the observer callback, not CSS `transition-delay`, to avoid elements being visible-but-not-animated when scrolling fast.

**Reduced Motion Accessibility:**

All animations are disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .scroll-reveal {
    opacity: 1;
    transform: none;
  }
}
```

**Guidelines:**

- Use CSS transitions, not JavaScript animations (except `IntersectionObserver` for scroll triggers)
- Prefer transform + opacity for performance
- Subtle elevation changes on hover
- Smooth accordion expand/collapse
- Avoid bouncy or aggressive motion
- Long-running ambient animations (blobs): 15-25s cycles, `ease-in-out`, infinite
- Entrance animations: 600ms–1000ms, `ease-out`, `fill: both`

**Never use:**

- Bounce or elastic easing
- Fast animations (< 150ms)
- Overly dramatic transforms
- Staggered animations without purpose
- `animation-timeline: view()` (poor browser support as of early 2026)
- JavaScript-driven scroll-position animations (use `IntersectionObserver` instead)

### Layout & Spacing

Generous spacing with clear hierarchy.

**Container System:**

```css
/* App dashboard pages */
.page-shell {
  @apply mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-12 pt-12 sm:px-10 lg:px-16;
}

/* App inner sections */
.section-shell {
  @apply mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 sm:px-8 lg:px-12;
}

/* Landing page sections */
.landing-section {
  @apply mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 py-20 text-center sm:px-10 sm:py-24 lg:px-16;
}
```

**Spacing Scale:**

- Section gaps (app): `gap-10`, `gap-12`, `gap-14`, `gap-16`, `gap-20`
- Section vertical padding (landing): `py-20` → `py-24` (sm), generous breathing room
- Component gaps: `gap-3`, `gap-4`, `gap-6`, `gap-8`
- Padding: `p-5`, `p-6` for cards; `px-4 py-3` for buttons; `px-6` or `px-8` horizontal page padding

**Grid Patterns:**

- Dashboard: `lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)]`
- Resume detail: `lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`
- Cards: `sm:grid-cols-2 lg:grid-cols-3`
- Bento grid (landing features): `sm:grid-cols-2 lg:grid-cols-3`, `gap-5`
- Showcase (alternating): `lg:grid-cols-2 lg:gap-16` with `order-1`/`order-2` for zig-zag layout
- Steps row: `lg:flex-row lg:gap-5` with a connecting gradient line behind

**Alternating Showcase Layout:**

Product showcase sections alternate text/mockup placement:

1. Text left, mockup right (Score Dashboard)
2. Mockup left, text right (Line Improvements), uses `order-1`/`order-2` with `lg:order-*` overrides
3. Text left, mockup right (Cover Letters)

This zig-zag pattern prevents visual monotony across stacked sections.

**Never use:**

- Tight spacing (`gap-1`, `gap-2`)
- Full-width containers without max-width
- Inconsistent padding
- Cramped layouts

### Component Patterns

**Primary Button:**

```css
.primary-button {
  @apply inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow-[0_18px_45px_-20px_rgba(96,107,235,0.55)] transition-transform duration-200 ease-out;
  background: linear-gradient(120deg, #6f7aff 0%, #4c57e9 50%, #7b5cff 100%);
}

/* Ghost variant for secondary CTAs */
.primary-button--ghost {
  @apply border border-slate-200/80 bg-white/90 text-slate-700 shadow-none backdrop-blur hover:bg-white;
}
```

On dark backgrounds (CTA section), use inverted styling: `bg-white text-indigo-600` with dark shadow.

**Score Badge:**

- Semantic colors by threshold (80+/60+/40+/<40)
- Pill shape: `rounded-[var(--radius-pill)]` (999px)
- Labels: "On target", "Getting close", "Needs lifts", "Focus area"

**Score Gauge (SVG):**

Used in hero mockup and showcase mockups. Circular SVG with:

- Background track: `stroke="rgba(99,102,241,0.1)"`, `strokeWidth="10"`
- Progress arc: `stroke="url(#scoreGradient)"` (indigo-to-pink linear gradient), `strokeDasharray` calculated from score percentage × circumference
- Center text: bold score number + `/100` label
- Container: `-rotate-90` to start arc from top

```jsx
<svg viewBox="0 0 120 120" className="-rotate-90">
  <circle
    cx="60"
    cy="60"
    r="52"
    fill="none"
    stroke="rgba(99,102,241,0.1)"
    strokeWidth="10"
  />
  <circle
    cx="60"
    cy="60"
    r="52"
    fill="none"
    stroke="url(#scoreGradient)"
    strokeWidth="10"
    strokeLinecap="round"
    strokeDasharray={`${(score / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
  />
</svg>
```

**Category Pills:**

Inline score badges showing category + numeric score. Semantic color coding:

- Emerald: scores ≥ 80 (`bg-emerald-100/80 text-emerald-700`)
- Amber: scores 60–79 (`bg-amber-100/80 text-amber-700`)
- Rose: scores < 60 (`bg-rose-100/80 text-rose-700`)

Shape: `rounded-full`, small padding (`px-3 py-1`), `text-xs font-medium`.

**Diff Cards (Before/After Rewrites):**

Mockup of the line improvement feature. Structure:

- Header: category tag (`bg-rose-100 text-rose-600` for HIGH, `bg-amber-100 text-amber-600` for MED) + type label
- Remove line: `bg-rose-50/60`, `font-mono text-xs text-rose-700/80`, red `−` prefix
- Add line: `bg-emerald-50/60`, `font-mono text-xs text-emerald-700/80`, green `+` prefix
- Container: `rounded-xl border border-slate-100`, `overflow-hidden`

**Form Inputs:**

```css
.input-field {
  @apply w-full rounded-2xl border border-indigo-100/70 bg-white/95 px-4 py-3 text-base text-slate-900 shadow-[inset_0_2px_8px_rgba(79,70,229,0.07)] transition;
}

.input-field:focus {
  @apply border-indigo-300 shadow-[0_0_0_1px_rgba(79,70,229,0.35),inset_0_2px_6px_rgba(79,70,229,0.1)];
}
```

**FAQ Accordion (Native `<details>/<summary>`):**

Used on the landing page to keep it as a server component (no client-side state). Styled as glassmorphic cards:

```css
.faq-item {
  @apply rounded-2xl border border-white/40 bg-white/80 backdrop-blur transition-all duration-300;
}
.faq-item summary {
  @apply cursor-pointer list-none px-5 py-4 text-left text-base font-semibold text-slate-900;
}
.faq-answer {
  @apply px-5 pb-5 text-sm leading-relaxed text-slate-600;
}
```

ChevronDown icon rotates 180° when open: `[[open]>&]:rotate-180` Tailwind variant.

**Testimonial Cards:**

```css
.testimonial-card {
  @apply flex flex-col gap-4 rounded-card border border-white/40 bg-white/90 p-6 backdrop-blur;
}
```

Structure: star rating row (5× filled amber stars) → blockquote → divider (`border-t border-slate-100 pt-4`) → avatar (gradient circle with initials) + name/title.

**Noise Texture Overlay:**

Reusable SVG-based noise pattern applied via inline `backgroundImage` data URI:

```css
background-image: url("data:image/svg+xml,...feTurbulence type='fractalNoise' baseFrequency='0.85'...");
background-repeat: repeat;
background-size: 128px 128px;
opacity: 0.3;
mix-blend-mode: overlay;
```

Used on: auth hero panel, landing CTA section. Adds analog grain depth to gradient backgrounds.

**Never use:**

- Square buttons (`rounded-md`)
- Flat inputs without inset shadows
- Generic form styling
- Inconsistent border radius
- Real screenshots in mockups (always CSS-built to match the design language)

## Anti-Convergence Directives

**Actively resist:**

- Defaulting to Inter or other common fonts
- Solid backgrounds without glassmorphism
- Generic purple-to-pink gradients (our palette is specific: indigo `#6f7aff`, not purple `#7C3AED`)
- Dark mode implementations
- Flat, material design patterns
- Over-styled animations
- Stock photography or illustration (CSS-built mockups only)
- "AI slop" patterns: centered purple hero + 3-column feature grid + generic testimonials. Ours differ through glassmorphic surfaces, alternating showcase layouts, and CSS-built product mockups

**When in doubt:**

- Reference existing components (`ResumeCard`, `Navbar`, `UploadForm`, `AuthForm`, `AuthHeroPanel`, `LandingPage`)
- Use established CSS variables and utility classes
- Maintain the glassmorphic aesthetic
- Keep motion subtle and purposeful
- Check `globals.css` for existing component classes before creating new ones

## Quality Checklist

Before finalizing any design:

- [ ] Typography: Mona Sans with proper weight/size hierarchy
- [ ] Color: Indigo/pink gradient palette with CSS variables
- [ ] Surfaces: Glassmorphic cards with backdrop blur and transparency
- [ ] Motion: Subtle transitions (200-500ms) with ease-out
- [ ] Spacing: Generous gaps (gap-6+) and consistent padding
- [ ] Consistency: Matches existing component patterns
- [ ] Background: Layered radial gradients, not solid colors
- [ ] Responsive: Proper breakpoints (sm/md/lg/xl)
- [ ] Reduced motion: `@media (prefers-reduced-motion: reduce)` handled
- [ ] Server/client boundary: No hooks or browser APIs in server components
- [ ] No `shadow-(--var)` in `@apply` (use `box-shadow: var(...)` separately, see gotcha below)

## Context-Specific Patterns

**Dashboard (`/app`):**

- Hero section with eyebrow + headline + subheadline
- Spotlight card (right sidebar)
- Stats grid (3 columns)
- Resume cards with hover lift

**Upload (`/app/upload`):**

- Two-column layout (form + checklist)
- File uploader with drag-and-drop
- Real-time validation feedback
- Processing state with GIF animation

**Resume Detail (`/app/resume/:id`):**

- Sticky preview rail (right)
- Scrollable feedback section (left)
- Accordion sections with persistence
- Score visualizations (circle, gauge, badge)

**Landing Page (`/`):**

Pure server component. 10 sections composed from extracted sub-components:

| Section           | Component                                           | Key Pattern                                                                                    |
| ----------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Navigation        | `LandingNav`                                        | Glassmorphic pill nav, anchor links + auth CTAs                                                |
| Hero              | `HeroSection` → `HeroBlobBackground` + `HeroMockup` | Staggered `landingFadeUp` + `landingScaleIn`, CSS-built product mockup with floating animation |
| Trust Bar         | `TrustBar`                                          | Horizontal glassmorphic band, icon + value + label triplets, dividers between                  |
| Features          | `FeaturesSection`                                   | 2×3 bento grid, icon gradient circles, staggered scroll reveals (80ms each)                    |
| How It Works      | `HowItWorks`                                        | 3 step cards, gradient line connector behind, gradient step numbers                            |
| Score Dashboard   | `ShowcaseScoreDashboard`                            | Text left / mockup right, SVG score gauge                                                      |
| Line Improvements | `ShowcaseDiffView`                                  | Mockup left / text right (alternated), diff card mockup                                        |
| Cover Letters     | `ShowcaseCoverLetters`                              | Text left / mockup right, template sidebar mockup                                              |
| Stats Band        | `StatsBand`                                         | Glassmorphic band, gradient text counters, dividers                                            |
| Testimonials      | `Testimonials`                                      | 3-column grid, star ratings, avatar initials, blockquotes                                      |
| FAQ               | `FAQ`                                               | Native `<details>`/`<summary>`, ChevronDown rotation                                           |
| Final CTA         | `FinalCTA`                                          | Deep indigo gradient, blobs at high opacity, noise overlay, inverted white button              |
| Footer            | `Footer`                                            | Minimal: logo + copyright                                                                      |

_Component extraction philosophy:_

Each section is a standalone function component within `app/page.tsx`. Data arrays (features, steps, testimonials, FAQ items, stats) are declared as module-level `const` arrays, not inline, for readability and future extraction.

_Server component strategy:_

The entire landing page is a server component. The only client component dependency is `ScrollReveal` (used for scroll-triggered entrance animations). The FAQ uses native `<details>/<summary>` instead of React state to remain server-renderable.

_Copywriting principles:_

- Active voice. Short sentences. Concrete numbers.
- Avoid overused phrases: "cutting-edge", "revolutionary", "leverage", "seamless"
- Name the specific benefit: "82/100 score" not "great scores"
- Ban list enforced in cover letter generation applies to marketing copy too
- No AI vendor branding in user-facing copy

_CSS classes (defined in `globals.css`):_

- `.landing-nav` -- pill navbar with `bg-white/85 backdrop-blur-xl rounded-full max-w-5xl`
- `.landing-section` -- standard section container with centered content
- `.landing-eyebrow` -- section label pill with icon slot
- `.landing-cta` -- full-width dark CTA section
- `.bento-grid` / `.bento-cell` -- feature grid and cards
- `.step-card` -- how-it-works card
- `.mockup-frame` / `.mockup-chrome` / `.mockup-dot` -- browser mockup chrome
- `.testimonial-card` -- testimonial card
- `.faq-item` / `.faq-answer` -- FAQ accordion
- `.stat-number` -- large counter text
- `.text-gradient` -- neutral warm-to-cool gradient text
- `.scroll-reveal` / `.scroll-reveal.is-visible` -- scroll-triggered entrance

**Auth (`/auth`):**

Two-column split layout with an immersive gradient hero panel and a glassmorphic sign-in panel.

_Layout:_

- Grid: `lg:grid-cols-2`, stacks vertically below `lg`
- Hero panel fills left column (100vh on desktop, 40vh tablet, 30vh mobile)
- Auth panel fills right column, vertically/horizontally centered content
- Card container: `max-w-md`, uses `surface-card` pattern with `bg-white/80`

_Left Panel (Gradient Hero):_

- Deep indigo base: `linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 100%)`
- Three animated organic blobs using CSS `@keyframes` morphing:
  - Indigo blob: `rgba(111, 122, 255, 0.55)`, 18s cycle (`blobMorph1`)
  - Pink blob: `rgba(250, 113, 133, 0.45)`, 22s cycle (`blobMorph2`)
  - Peach blob: `rgba(251, 191, 146, 0.4)`, 25s cycle (`blobMorph3`)
- Animations use `transform` + `border-radius` only (GPU-composited, no layout thrashing)
- Noise texture overlay via inline SVG data URI (`mix-blend-mode: overlay`, `opacity: 0.35`)
- Typography: Mona Sans `text-4xl`/`text-5xl`/`text-6xl`, `font-bold`, white, `text-shadow` for depth
- Brand mark: `border-white/30`, `bg-white/10`, `backdrop-blur-sm` circle
- Footer text: `text-indigo-300/70`, hidden below `lg`
- Entire panel is `aria-hidden="true"` (decorative)

_Right Panel (Auth Form):_

- Subtle radial gradient background (indigo 8% + pink 6%) for depth
- Entrance animation: `authFadeUp` 600ms ease-out with 150ms delay
- Card: `rounded-[var(--radius-card)]`, `border-white/40`, `bg-white/80`, `backdrop-blur-md`, `shadow-[var(--shadow-surface)]`
- Brand mark: gradient circle (`from-indigo-500 to-purple-600`) with white border and indigo shadow
- Google OAuth button: `rounded-full`, `border-indigo-100/60`, hover lift (`-translate-y-0.5`) with indigo shadow transition
- Divider: horizontal rules flanking "secure sign-in" text (`bg-slate-200/70`)
- Terms text: `text-xs`, `text-slate-400`

_CSS Classes (BEM):_

- `.auth-layout` -- grid container
- `.auth-hero` -- left gradient panel
- `.auth-hero__blob--{indigo,pink,peach}` -- animated organic shapes
- `.auth-hero__noise` -- texture overlay
- `.auth-hero__content` -- headline + subtitle wrapper
- `.auth-hero__brand` / `.auth-hero__brand-mark` -- top-left logo
- `.auth-hero__footer` -- bottom text (desktop only)
- `.auth-panel` -- right panel container
- `.auth-panel__inner` -- max-width wrapper with fade-up animation
- `.auth-panel__card` -- glassmorphic card
- `.auth-panel__google-btn` -- styled OAuth button
- `.auth-panel__divider` -- line + text + line separator

_Key constraints:_

- No new fonts or dependencies (pure CSS animations)
- `group` cannot be used in `@apply` (Tailwind v4 restriction); add it as a className in JSX instead
- Server/client boundary: hero panel is a server component (pure HTML/CSS), form is `"use client"`
- All blob animations use `will-change: transform, border-radius` for performance

## Implementation Notes

**Tech Stack:**

- Tailwind CSS v4 with `@theme` directive
- CSS variables in `@theme` block
- Utility classes for consistency
- Next.js App Router (server components default, `"use client"` when needed)

**CSS Organization:**

```css
@theme {
  /* CSS variables: colors, radii, shadows */
}

@layer base {
  /* Resets, global styles, body background */
}

@layer components {
  /* App component classes (surface-card, primary-button, etc.) */
  /* Auth component classes (auth-layout, auth-hero, etc.) */
  /* Landing page classes (landing-nav, landing-section, bento-grid, etc.) */
}
```

Landing page classes are grouped under a `/* ─── Landing Page ─── */` comment block in `globals.css`.

**Tailwind v4 Gotchas:**

| Gotcha                                                              | Workaround                                                                                            |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `shadow-(--custom-var)` inside `@apply` causes PostCSS parse errors | Write `box-shadow: var(--custom-var);` as a separate property outside `@apply`                        |
| `group` inside `@apply` fails                                       | Add `group` as a JSX className, not in `@apply`                                                       |
| `bg-linear-to-*` replaces `bg-gradient-to-*`                        | Use `bg-linear-to-r`, `bg-linear-to-br`, etc.                                                         |
| `rounded-card` custom value                                         | Define in `@theme { --radius-card: 28px; }`, use via `rounded-[var(--radius-card)]` or `rounded-card` |

**Server/Client Boundary Rules:**

| Pattern                                  | Where                             | Why                                                                                                                       |
| ---------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Data arrays as module-level `const`      | `app/page.tsx`                    | Avoid prop serialization; keeps landing page as server component                                                          |
| `IntersectionObserver` in `ScrollReveal` | `app/components/ScrollReveal.tsx` | Isolates client-side logic; server-rendered children hydrate normally                                                     |
| Native `<details>/<summary>` for FAQ     | `app/page.tsx`                    | No `useState` needed; stays server-renderable                                                                             |
| Inline `style={{ animation: ... }}`      | Hero elements                     | CSS keyframes defined in `globals.css`; inline `style` avoids Tailwind arbitrary value complexity for compound animations |

**Accessibility:**

- Semantic HTML: `<header>`, `<nav>`, `<section>`, `<footer>`, `<blockquote>`, `<details>/<summary>`
- ARIA labels on interactive elements and navigation landmarks
- Focus states: `ring-4 ring-indigo-200/70 ring-offset-2`
- Color contrast: WCAG AA compliant
- Keyboard navigation support
- `aria-hidden="true"` on purely decorative panels (auth hero, blob backgrounds)
- `@media (prefers-reduced-motion: reduce)` disables all animation
- Anchor links use native `href="#id"` for keyboard and assistive technology support

**Performance Notes:**

- Blob animations use only `transform` + `border-radius` (GPU-composited, no layout/paint)
- `will-change: transform, border-radius` on animated blobs
- `ScrollReveal` observer disconnects after first intersection (no ongoing observation)
- Landing page is 100% server-rendered except `ScrollReveal` wrappers
- Mockups are CSS-built, not images. Zero additional network requests
- Lucide icons are tree-shaken by import (only used icons ship to client)

## Remember

Resumind's design language is:

- Glassmorphic, not flat
- Subtle, not flashy
- Generous, not cramped
- Consistent, not generic
- Purposeful, not decorative
- Server-first, client when necessary

Every design decision should reinforce the frosted glass aesthetic while maintaining clarity and usability. When adding new components, study existing patterns (`ResumeCard`, `Navbar`, `UploadForm`, `LandingPage`, `AuthForm`) and extend them consistently rather than introducing new styles.

When adding new landing page sections, follow the established pattern: module-level data array → named function component → `ScrollReveal` wrapper → add to the `LandingPage` default export composition.
