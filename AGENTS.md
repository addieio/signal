<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Signal — Agent Design Rulebook

> **Product:** Signal — AI-powered hackathon & campus event ranking platform  
> **Stack:** Next.js 16 · TypeScript strict · Tailwind CSS v4 · shadcn/ui v4 · Zustand v5 · Framer Motion v14 · Zod v4

---

## 1. Design System — Colour Tokens

| Token | Value | Usage |
|---|---|---|
| `bg` / `--color-bg` | `#0B0E14` | Page background only |
| `surface` / `--color-surface` | `#11151C` | Cards, panels |
| `surface2` / `--color-surface2` | `#1A2029` | Nested surfaces, inputs |
| `border-subtle` | `rgba(255,255,255,0.08)` | All borders |
| `text` / `--color-text` | `#F9FAFB` | Body text |
| `muted` / `--color-muted` | `#9CA3AF` | Secondary text, placeholders |
| `primary` | `#6366F1` | Buttons, links, focus |
| `primary-hover` | `#4F46E5` | Hover state of primary |
| `lime` / `--color-lime` | `#C6FF4A` | **SCORES AND RATINGS ONLY** |
| `peri` / `--color-peri` | `#A5B4FC` | Secondary accent, periwinkle |
| `pos` | `#22C55E` | Positive vibe tags |
| `neu` | `#9CA3AF` | Neutral vibe tags |
| `neg` | `#F87171` | Negative vibe tags |

> **CRITICAL:** Lime (`#C6FF4A`) is used **exclusively** for score numbers, MatchRings, rating percentages, and the "WE PROVE." landing headline. Never use lime for general text, backgrounds, or decorative accents.

---

## 2. Typography

| Usage | Font | Weight | Class |
|---|---|---|---|
| Hero headlines | Space Grotesk | 700–800 | `font-display font-bold tracking-tight` |
| Section headings | Space Grotesk | 700 | `font-display font-bold` |
| Body, labels | Inter | 400–500 | `font-sans` |
| Micro-labels | Inter | 500 | `.micro-label` (10px, uppercase, tracked) |
| Score numbers | Inter / Space Grotesk | 700 | `text-score font-bold tabular-nums` |
| Code glyphs | System monospace | 700 | `font-mono` |

**Never** use browser-default fonts. Always import Space Grotesk and Inter via `next/font/google`.

---

## 3. Logo Variants — When to Use

| Variant | Component | Used In |
|---|---|---|
| V4 — Negative-Space S | `<SignalLogo />` | NavBar, favicon, app icon |
| V3 — Noise→Signal path | `<NoiseTrSignalMark />` | Landing hero animation only |
| V2 — Score Ring | `<ScoreRingMark />` | Loading spinners, empty states |
| V1 — Beacon | `<BeaconMark />` | Genie chat avatar |

All logo components live in `src/components/SignalLogo.tsx`.

---

## 4. Component Conventions

### Server vs Client
- **Default to Server Components.** Add `"use client"` only when the component uses:
  - React state (`useState`, `useReducer`)
  - Effects (`useEffect`)
  - Browser APIs
  - Framer Motion animations
  - Zustand stores

### File Structure
```
src/
├── app/              # Routes (Server Components by default)
│   └── api/          # API routes (Edge/Node runtime)
├── components/
│   ├── layout/       # TopNav, BottomNav, GridGlyphBg
│   ├── ui/           # shadcn primitives (DO NOT EDIT)
│   └── *.tsx         # Shared Signal components
├── lib/              # Pure functions, types, data
├── store/            # Zustand stores (client only)
└── hooks/            # Custom React hooks
```

### Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- All IDs on interactive elements must be unique and descriptive

---

## 5. Animation Guidelines (Framer Motion)

| Animation | Duration | Easing |
|---|---|---|
| Micro (hover, tap) | 150–200ms | `ease-out` |
| State transitions | 300–400ms | `ease-in-out` |
| Page transitions | 400ms | `[0.25, 0.46, 0.45, 0.94]` |
| Hero path draw | 1200–2000ms | `easeInOut` |
| CompareTray slide | spring `{stiffness:400, damping:30}` | — |
| MatchRing draw | 800ms | `easeOut` |
| Confetti burst | canvas-confetti, one-shot | — |

**Performance:** Use `will-change: transform` via `style` prop on heavy animations. Prefer `transform` and `opacity` over layout properties.

---

## 6. EventCard Anatomy (strict order)

```
1. GradientPoster (4:3 gradient div + event initials)
2. RankBadge (#1/#2 badge, gold/silver/lime)
3. MatchRing (SVG circular progress, lime, animated on mount)
4. Title (Space Grotesk bold)
5. MicroLabel ("IIIT DELHI · HACKATHON · OFFLINE")
6. ThemeChips (badge row, peri bg)
7. AvatarStack + peersLine ("+N going · M seniors from your dept")
8. VibeTagRow (max 4, sentiment-colored chips)
9. AIVerdict (one-liner from ranking reasons[0])
10. Actions: [Why #?] [Compare] [Details]
```

---

## 7. Ranking Engine Rules

The ranking engine (`src/lib/ranking.ts`) is **purely deterministic** — no randomness, no API calls. Weights:

| Dimension | Weight | Description |
|---|---|---|
| `profileMatch` | 0.40 | Jaccard overlap of interests/themes + goal/skill/mode fit |
| `communityVibe` | 0.30 | Bayesian avg (prior 3.5, minVotes 5) + tag sentiment balance |
| `organizerTrust` | 0.15 | `organizer.trustScore / 100` |
| `roi` | 0.15 | Heuristic from perks/prize/networking vs mode effort |

`total` is always 0–100. Category re-weighting adjusts weights but keeps `total` in range.

---

## 8. AI / Genie Rules

- **NEVER throw to the client.** All errors → fallback response.
- **Fallback NLU** (`src/lib/nlu.ts`) must handle all query types with keyword maps.
- **Zod-validate** all API route inputs before processing.
- **Response shape** is always `{ text: string, events: Event[] }` — same for live and fallback.
- When `GEMINI_API_KEY` is absent or any call fails → silently use fallback, log server-side only.

---

## 9. Hard Prohibitions

Per PRD Section 0:
- ❌ No maps, navigation, or routing features
- ❌ No calendar widgets, countdowns, or deadline trackers
- ❌ No registration / "Apply Now" flows
- ❌ No organizer social network features
- ❌ No inter-college collaboration tools

Event dates appear as **plain informational text only** (e.g., `"Nov 15–17, 2025"`).

---

## 10. Taste Principles (from taste skill)

1. **Typography:** Always Space Grotesk (display) + Inter (body). Never browser defaults.
2. **Spacing:** Ample, consistent whitespace. `gap-4` minimum between card elements.
3. **Colors:** Use the curated palette. No harsh fully-saturated colors outside the palette.
4. **Borders & Shadows:** Subtle — `border-border-subtle`, `shadow-xl` max. No heavy outlines.
5. **No Clichés:** No centered gradient blobs as the only background. Use `.grid-bg` + `.glass`.
6. **Micro-animations on every interactive element** — hover lifts, tap scales.
7. **Skeleton loaders** over spinners for list content.
8. **No lorem ipsum** — all copy in authentic student voice.

---

## 11. Accessibility Checklist

- [ ] `aria-label` on every icon-only button
- [ ] Semantic heading hierarchy (`h1` → `h2` → `h3`)
- [ ] `role` attributes on custom interactive regions
- [ ] Visible focus rings (lime-colored, see globals.css)
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] `alt` text on all non-decorative images
- [ ] `aria-hidden="true"` on decorative SVGs and icons

---

## 12. Build Checklist (run after every phase)

```bash
npm run build   # must exit 0, zero TS errors
npm run lint    # zero ESLint warnings
```

Zero `any` types. Zero `eslint-disable` comments without justification. Zero `console.log` in production paths (use `console.error` for server-side error logging only).
