# Resumind Design System Skill

## Purpose

Guide design generation to match Resumind's glassmorphic aesthetic: frosted surfaces, subtle gradients, and clear hierarchy. Avoid generic patterns while maintaining consistency with the established system.

## Core Problem

Designs can drift toward generic SaaS patterns (Inter, purple gradients, flat cards) or over-styled alternatives. Resumind uses a specific glassmorphic language that must be preserved.

## Design Principles

### Typography

Mona Sans is the primary typeface. Use it consistently with clear hierarchy.

**Font Stack:**

- Primary: `"Mona Sans", ui-sans-serif, system-ui, sans-serif`
- Variable weights: 200-900
- Load from Google Fonts: `https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap`

**Typography Scale:**

- Headlines: `text-4xl` → `text-6xl` (sm: `text-5xl`, lg: `text-6xl`, xl: `text-[58px]`)
- Leading: `leading-[1.08]` for headlines
- Weight: `font-semibold` (600) for headlines, `font-medium` for body
- Eyebrow labels: `text-xs` or `text-sm`, `uppercase`, `tracking-[0.28em]` to `tracking-[0.32em]`, muted color (`text-slate-500`)

**Never use:**

- Inter, Roboto, Open Sans, or other sans-serifs
- Serif fonts (editorial style)
- Monospace fonts (code aesthetic)
- System font fallbacks as primary

**Implementation:**

```css
.headline {
  @apply text-balance text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl xl:text-[58px];
}

.section-eyebrow {
  @apply inline-flex items-center justify-center self-start rounded-full border border-white/70 bg-white/80 px-4 py-1 text-sm font-medium uppercase tracking-[0.32em] text-slate-500 shadow-[var(--shadow-ring)] backdrop-blur;
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

**Semantic Colors:**

- Success: Emerald (`bg-emerald-100/80`, `text-emerald-700`)
- Warning: Amber (`bg-amber-100/70`, `text-amber-700`)
- Error: Red (`bg-rose-100/80`, `text-rose-700`)

**Background Strategy:**

```css
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

**Never use:**

- Solid white/gray backgrounds
- Flat color fills without depth
- Generic purple gradients
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
- Navbar: `bg-white/85` + `backdrop-blur-xl` + `rounded-full`

**Never use:**

- Solid backgrounds without transparency
- Heavy borders (`border-2` or darker)
- Flat shadows without blur
- Sharp corners (`rounded-lg` or less)

### Motion & Animation

Subtle, purposeful motion with gentle easing.

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
```

**Accordion Animation:**

```css
/* Grid-based expand/collapse */
grid transition-all duration-300 ease-in-out
grid-rows-[1fr] opacity-100 (active)
grid-rows-[0fr] opacity-0 (inactive)
```

**Guidelines:**

- Use CSS transitions, not JavaScript animations
- Prefer transform + opacity for performance
- Subtle elevation changes on hover
- Smooth accordion expand/collapse
- Avoid bouncy or aggressive motion

**Never use:**

- Bounce or elastic easing
- Fast animations (< 150ms)
- Overly dramatic transforms
- Staggered animations without purpose

### Layout & Spacing

Generous spacing with clear hierarchy.

**Container System:**

```css
.page-shell {
  @apply mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-12 pt-12 sm:px-10 lg:px-16;
}

.section-shell {
  @apply mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 sm:px-8 lg:px-12;
}
```

**Spacing Scale:**

- Section gaps: `gap-10`, `gap-12`, `gap-14`, `gap-16`, `gap-20`
- Component gaps: `gap-3`, `gap-4`, `gap-6`, `gap-8`
- Padding: `p-5`, `p-6` for cards; `px-4 py-3` for buttons

**Grid Patterns:**

- Dashboard: `lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)]`
- Resume detail: `lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`
- Cards: `sm:grid-cols-2 lg:grid-cols-3`

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
```

**Score Badge:**

- Semantic colors by threshold (80+/60+/40+/<40)
- Pill shape: `rounded-[var(--radius-pill)]` (999px)
- Labels: "On target", "Getting close", "Needs lifts", "Focus area"

**Form Inputs:**

```css
.input-field {
  @apply w-full rounded-2xl border border-indigo-100/70 bg-white/95 px-4 py-3 text-base text-slate-900 shadow-[inset_0_2px_8px_rgba(79,70,229,0.07)] transition;
}

.input-field:focus {
  @apply border-indigo-300 shadow-[0_0_0_1px_rgba(79,70,229,0.35),inset_0_2px_6px_rgba(79,70,229,0.1)];
}
```

**Never use:**

- Square buttons (`rounded-md`)
- Flat inputs without inset shadows
- Generic form styling
- Inconsistent border radius

## Anti-Convergence Directives

**Actively resist:**

- Defaulting to Inter or other common fonts
- Solid backgrounds without glassmorphism
- Generic purple gradients
- Dark mode implementations
- Flat, material design patterns
- Over-styled animations

**When in doubt:**

- Reference existing components (`ResumeCard`, `Navbar`, `UploadForm`)
- Use established CSS variables and utility classes
- Maintain the glassmorphic aesthetic
- Keep motion subtle and purposeful

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

## Context-Specific Patterns

**Dashboard (`/`):**

- Hero section with eyebrow + headline + subheadline
- Spotlight card (right sidebar)
- Stats grid (3 columns)
- Resume cards with hover lift

**Upload (`/upload`):**

- Two-column layout (form + checklist)
- File uploader with drag-and-drop
- Real-time validation feedback
- Processing state with GIF animation

**Resume Detail (`/resume/:id`):**

- Sticky preview rail (right)
- Scrollable feedback section (left)
- Accordion sections with persistence
- Score visualizations (circle, gauge, badge)

**Auth (`/auth`):**

- Centered, minimal layout
- Hero decor background
- Google OAuth button (glassmorphic style)

## Implementation Notes

**Tech Stack:**

- Tailwind CSS v4 with `@theme` directive
- CSS variables in `@theme` block
- Utility classes for consistency
- Next.js App Router (server components)

**CSS Organization:**

```css
@theme {
  /* CSS variables */
}

@layer base {
  /* Resets, global styles */
}

@layer components {
  /* Component classes */
}
```

**Accessibility:**

- Semantic HTML
- ARIA labels on interactive elements
- Focus states: `ring-4 ring-indigo-200/70 ring-offset-2`
- Color contrast: WCAG AA compliant
- Keyboard navigation support

## Remember

Resumind's design language is:

- Glassmorphic, not flat
- Subtle, not flashy
- Generous, not cramped
- Consistent, not generic
- Purposeful, not decorative

Every design decision should reinforce the frosted glass aesthetic while maintaining clarity and usability. When adding new components, study existing patterns (`ResumeCard`, `Navbar`, `UploadForm`) and extend them consistently rather than introducing new styles.
