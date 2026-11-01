# CLAUDE.md

@AGENTS.md

## What this is

Jake Abella's personal CV site (https://jakeyabutabella.com): one page with a retro pixel-game / platformer theme. Sections are `#anchors` on `/`, not separate routes: hero (`#top`), `#about`, `#journey`, `#skills`, `#portfolio`, `#contact`.

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 7 (native compiler), plain CSS. No other runtime dependencies, no UI library, no Tailwind, no tests.

## Commands

```bash
npm run dev      # next dev
npm run build    # next build: the main check that everything compiles
npm run start    # serve the production build
npx tsc --noEmit # typecheck (there's no script for it yet)
```

There is no lint setup. Next 16 removed `next lint`, and `next build` doesn't lint.

## Layout

```
src/
  app/
    layout.tsx     # fonts (next/font: Press Start 2P, Space Grotesk, Space Mono), generateMetadata, viewport
    page.tsx       # the whole page: server component, revalidate = 86400
    globals.css    # all styles (~1350 lines), BEM-ish class names, theme tokens on :root
    robots.ts      # robots.txt, built from siteUrl
    sitemap.ts     # a single entry for siteUrl
  components/
    PixelArt.tsx   # server-safe: renders a text-grid sprite as SVG rects
    sprites.ts     # `palette` (char → colour) and `sprites` (name → string[] grid)
    Nav.tsx        # client: sticky nav, IntersectionObserver highlights the active section, mobile menu
    Reveal.tsx     # client: fades/slides children in on scroll
    Typewriter.tsx # client: animates the hero taglines
    CoinField.tsx  # client: easter egg with collectable coins and a score HUD
  data/
    profile.ts     # ALL site content: profile, journey, achievements, projects, milestones, siteUrl
  lib/
    career.ts      # date helpers (YYYY-MM): formatPeriod, formatDuration, yearsSince, fill
review.md          # code review from 2026-10-16 with prioritised findings (H/M/L)
```

## Conventions

- **Content belongs in `src/data/profile.ts`.** Edit text there, not in JSX. (A few strings are still hard-coded in `page.tsx`; `review.md` L7 lists them.)
- **Computed facts:** "N years" figures come from `milestones` and `getFacts(now)`. In any content string, write `{yearsInIT}`, `{yearsInBanking}` or `{yearsAtUOB}`. `page.tsx` swaps them in with `fill(text, facts)`, so any new string that uses tokens has to go through `fill`.
- **Journey stages** either give `start`/`end` as `'YYYY-MM'` (period and duration are computed; leave out `end` for the current role) or give fixed `period`/`duration` labels. Use the `stagePeriod` / `stageDuration` helpers. Durations count months inclusively, the way LinkedIn does. `color` must be one of `coral | sky | mint | sun | grape | leaf`, each matching a `.level--<color>` CSS class.
- **Portfolio:** to unlock a slot in `projects`, set `locked: false` and add a `url`.
- **Dates/time:** the page reads `new Date()` at render time, and `revalidate = 86400` regenerates it daily. Metadata uses `generateMetadata()`, not a `metadata` const, for the same reason. Keep it that way, so year counts and the footer year don't freeze at build time.
- **Server vs client:** `page.tsx` and `PixelArt` are server components. Only components that need state, effects or observers get `"use client"`. Keep client components small.
- **Sprites:** add a grid to `sprites` in `sprites.ts`. Each character is a palette key and `.` is transparent. Keep every row the same width. A character missing from the palette is silently skipped. `SpriteName` is derived from the keys.
- **Styling:** use the CSS custom properties in `globals.css` (`--ink`, `--cream`, `--coral`, `--px`, etc.). Pixel-box look via `.px-box`, `.chip`, `.btn`. Respect `prefers-reduced-motion`; there's a block at the end of `globals.css`, and `Typewriter` checks it too.
- **Imports:** use the `@/*` alias for `./src/*`. TS is `strict`.
- **Accessibility:** decorative SVGs/sections are `aria-hidden`. Meaningful sprites take a `title` (which gives `role="img"`). External links use `target="_blank" rel="noreferrer"`.

## Known issues / open work

See `review.md` for the full list. The main open items:
- **H1:** `.reveal` starts at `opacity: 0` until JS runs, so without JS the page is mostly blank.
- **M1:** the Typewriter tagline isn't exposed to screen readers.
- **M2:** several colours fail WCAG AA contrast (`--muted`, `.btn--blue`, small coral text).
- **M5:** some career dates overlap. `milestones.inIT` is a placeholder (marked TODO).
- **M6/M7:** no ESLint, no favicon or Open Graph image/metadata.

Before relying on a finding in `review.md`, check whether it has already been fixed (M3/M4 computed dates and part of M7 robots/sitemap are done).
