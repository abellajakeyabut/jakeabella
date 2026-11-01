# Code Review: jakeabella personal site

**Reviewed:** 2026-10-16, commit `efc1407` (`master`)
**Stack:** Next.js 16.4.1 (App Router, Turbopack), React 19.3, TypeScript 7.0.2
**Scope:** every tracked file: `src/app/*`, `src/components/*`, `src/data/profile.ts`, config files, `Profile.pdf`

## Summary

This is a small, tidy single-page site. Components are short and do one job each. Client code is limited to the four interactive components. `prefers-reduced-motion` and `:focus-visible` are handled, and all content is kept in one data file.

**Checks run:**
- `tsc --noEmit` passes.
- `next build` passes, and `/` is prerendered as static content.
- There are no correctness bugs that would crash the site, and the attack surface is small: no user input, no API routes, no secrets.

The main problems are:

1. **Content is hidden until JavaScript runs.** If JS is slow or fails, most of the page stays invisible.
2. **Accessibility gaps.** The animated tagline is hidden from screen readers, and several colours fail WCAG AA contrast.
3. **Facts are hard-coded and will go out of date** (durations, the copyright year).
4. **Tooling and SEO basics are missing:** no lint step, no favicon, no Open Graph metadata.
5. **Possible personal data in the public repo:** `Profile.pdf` is committed.

| Severity | Count |
|---|---|
| High | 2 |
| Medium | 7 |
| Low | 12 |

---

## High

### H1. Whole page is invisible without JavaScript (`Reveal`)
**Where:** [src/components/Reveal.tsx](src/components/Reveal.tsx), [src/app/globals.css:243-252](src/app/globals.css#L243-L252)

`.reveal` starts at `opacity: 0`, and only the client-side `IntersectionObserver` adds `.reveal--in`. Nearly all content is wrapped in `<Reveal>`: section headings, player card, dialog, stats, journey cards, skills, achievements, portfolio and contact. The server-rendered HTML therefore has all of it at opacity 0. The page stays mostly blank in any of these cases:
- JS is disabled or blocked
- the bundle fails to load
- hydration throws
- a crawler or link-preview bot doesn't execute JS

Hydration can also be slow on a poor mobile connection. On a CV-style site, a blank page is the worst possible failure.

**Remediation (pick one):**
- Gate the hidden state behind a "JS is running" flag. For example, use an inline script in `layout.tsx` to set `document.documentElement.classList.add("js")`, then change the CSS selector to `.js .reveal { opacity: 0; ... }`.
- Or add a `<noscript><style>.reveal{opacity:1;transform:none}</style></noscript>` in the layout.
- Optionally, show elements that are already in the viewport on first paint, so above-the-fold content doesn't flash.

### H2. `Profile.pdf` committed to a (likely public) GitHub repo
**Where:** `/Profile.pdf` (47 KB, tracked); remote `github.com/abellajakeyabut/jakeabella`

The file name matches LinkedIn's "Save to PDF" export. Those exports usually include your email address and sometimes a phone number. The site itself deliberately shows only a LinkedIn link. The PDF isn't served by the site because it isn't under `public/`. But if the repo is public, anyone can download it, and it stays in git history even after deletion.

**Remediation:**
1. Check whether the repo is public and what the PDF contains.
2. If it shouldn't be public: `git rm --cached Profile.pdf` and add `*.pdf` (or the file name) to `.gitignore`.
3. If it was already pushed to a public repo, purge it from history (`git filter-repo --path Profile.pdf --invert-paths`) and force-push. Treat anything in it as already exposed.

---

## Medium

### M1. Animated tagline is hidden from screen readers and missing from the HTML
**Where:** [src/components/Typewriter.tsx:34-36](src/components/Typewriter.tsx#L34-L36)

```tsx
<span className="typewriter" aria-label={lines[0]}>
  <span aria-hidden>{text}</span>
```
- `aria-label` on a plain `<span>` (generic role) is prohibited by ARIA and ignored by most screen readers. The visible text is `aria-hidden`, so assistive tech gets **nothing**. Even if the label worked, it would only ever expose the first tagline.
- `text` starts as `""`, so the server-rendered HTML has no tagline text at all.

**Remediation:** Render all taglines as visually hidden text and keep the animation `aria-hidden`:
```tsx
<span className="typewriter">
  <span className="sr-only">{lines.join(" ")}</span>
  <span aria-hidden>{text}</span>
  <span className="typewriter__caret" aria-hidden />
</span>
```
Add a standard `.sr-only` utility class to `globals.css`. Consider initialising `text` to `lines[0]` so the server-rendered HTML shows real content.

### M2. Colour contrast fails WCAG AA in several places
Measured ratios (AA requires 4.5:1 for normal text, 3:1 for large text):

| Usage | Colours | Ratio |
|---|---|---|
| `--muted` text on cream (`.level__world`, `.player-card__attrs dt`, `.slot__tag`, `.achievement__issuer`, `.cart__no`) | `#7a7590` / `#fff8e7` | **4.15** |
| `--muted` on locked cart stripes | `#7a7590` / `#f1eef8` | **3.84** |
| White on `.btn--blue` (LinkedIn CTA, 0.82rem) | `#ffffff` / `#3f7cf0` | **3.92** |
| `.hud strong` score, coral on white (0.6rem) | `#ff6b6b` / `#ffffff` | **2.78** |
| Hero surname, coral on cream (large, has ink shadow) | `#ff6b6b` / `#fff8e7` | 2.62 |

Many of these are also very small (0.52–0.6rem) in a pixel font, which makes them harder to read.

**Remediation:**
- Darken `--muted` to about `#6a6580` (≥ 4.5:1 on all the light backgrounds).
- Darken the blue button background to about `#2f66d6`, or use ink-coloured text.
- Use a darker coral (about `#d94343`) for small coral text.
- Raise the minimum font size of the pixel-font labels.

### M3. Hard-coded durations and counts will go stale
**Where:** [src/data/profile.ts](src/data/profile.ts), [src/app/layout.tsx:12](src/app/layout.tsx#L12)

- `duration: '4 yrs 8 mos'` (current role) is correct for Oct 2026 but wrong from next month.
- "21 years" appears in three places: metadata description, tagline, summary.
- `'11'` Years at UOB and `'15+'` Years in Banking are fixed numbers.

Each update means editing several places by hand.

**Remediation:**
- Store start dates (e.g. `start: '2022-03'`) and compute durations and year counts in one helper.
- Make `metadata` use the computed value.
- Because the page is static, values computed at build time freeze at the last deploy. Either add `export const revalidate = 86400` to `page.tsx`, or compute only on the client. Monthly accuracy is probably enough, so a periodic rebuild is also fine.

### M4. Footer year is frozen at build time
**Where:** [src/app/page.tsx:19](src/app/page.tsx#L19)

`new Date().getFullYear()` runs during the static prerender (the build output marks `/` as `○ Static`), so `© 2026` stays until the next deploy. Related: if Cache Components (`cacheComponents`) is ever enabled in Next 16, reading `new Date()` in a server component without `"use cache"` or a dynamic boundary causes a prerender error.

**Remediation:** Add `revalidate` (see M3), or move the year into a tiny client component. Alternatively, accept the frozen year and deploy at least once a year.

### M5. Career dates overlap and conflict with the stated years of experience
**Where:** [src/data/profile.ts:80-157](src/data/profile.ts#L80-L157)

- Panasonic ends **Jul 2009**, but MUFG starts **Jun 2009**.
- UOB AVP ends **Apr 2022**, but UOB VP starts **Mar 2022**.
- The journey's first job is Jul 2008 (about 18 years ago), yet the site claims **21 years** in IT. If there is earlier experience (2005–2008), it is missing from the timeline. Otherwise the figure is inconsistent.

Recruiters do look at these details.

**Remediation:** Check the dates against the source CV and fix them, or add the missing 2005–2008 entry.

### M6. No lint or format tooling, and no quality scripts
**Where:** [package.json](package.json)

There is no ESLint (or Biome) config and no `lint` or `typecheck` script. Next 16 removed `next lint`, and `next build` no longer lints, so nothing catches React hook-dependency mistakes, a11y issues (`jsx-a11y`) or unused code (see L6).

**Remediation:**
- Add `eslint` with `eslint-config-next` (flat config), or Biome.
- Add scripts: `"lint": "eslint ."` and `"typecheck": "tsc --noEmit"`.
- Optionally run them in a GitHub Action on push.

### M7. Missing favicon, social preview and SEO metadata
**Where:** [src/app/layout.tsx](src/app/layout.tsx); there is no `public/` dir and no `app/icon.*`

A personal site gets shared on LinkedIn and in chat apps. Right now those shares show a generic or missing preview, and browser tabs show the default icon.

**Remediation:**
- Add `src/app/icon.png` (or `icon.svg`). The heart or hero sprite would fit.
- Add `src/app/opengraph-image.png` (or a generated `opengraph-image.tsx`).
- In `metadata`, set `metadataBase`, `openGraph`, `twitter` and `alternates.canonical`.
- Add `src/app/robots.ts` and `src/app/sitemap.ts`.
- Add JSON-LD `Person` structured data (name, jobTitle, sameAs → LinkedIn).

---

## Low

### L1. Nav highlight never clears when scrolling back to the hero
**Where:** [src/components/Nav.tsx:24-35](src/components/Nav.tsx#L24-L35)

Only the five content sections are observed, and entries with `isIntersecting === false` are ignored. After visiting "About", scrolling back to the top leaves "About" highlighted with the blinking cursor.

**Remediation:** Also observe `#top`, and map it to `""`, or clear `active` when `window.scrollY` is near 0 inside the existing scroll handler.

### L2. Mobile menu doesn't close on Escape or outside click
**Where:** [src/components/Nav.tsx](src/components/Nav.tsx)

**Remediation:**
- Add a `keydown` listener that closes the menu on `Escape` and returns focus to the toggle.
- Close on clicks outside the header.
- Optionally close when the viewport grows past 760px.

### L3. Coin easter egg comes before the main content in tab order
**Where:** [src/app/page.tsx:34](src/app/page.tsx#L34), [src/components/CoinField.tsx](src/components/CoinField.tsx)

`<CoinField />` sits before `.hero__inner` in the DOM, so keyboard users tab through five "Collect coin" buttons before reaching "Press Start". The `aria-live` HUD also announces the score each time a coin is collected.

**Remediation:** Either move `<CoinField />` after the hero content in the DOM (it's absolutely positioned, so the visuals don't change), or give the coins `tabIndex={-1}` and treat them as a mouse-only easter egg. The site also has no "skip to content" link; add one at the top of `<body>`.

### L4. "+100" pop stays on screen permanently with reduced motion
**Where:** [src/app/globals.css:568-577](src/app/globals.css#L568-L577) and the reduced-motion block at the end of the file

The `pop` keyframe fades the label to `opacity: 0` with `forwards`. The reduced-motion rule sets `animation: none !important`, so the label stays fully visible forever.

**Remediation:** Add `.coin-pop { display: none; }` inside the `prefers-reduced-motion` block, or remove the element after a timeout.

### L5. `:root` font variables override next/font's variables
**Where:** [src/app/globals.css:31-33](src/app/globals.css#L31-L33), [src/app/layout.tsx:5-7](src/app/layout.tsx#L5-L7)

`:root { --font-display: ...; --font-body: ...; --font-mono: ... }` has the same specificity as next/font's `.xxx_variable` classes on `<html>`. The built CSS puts the `:root` block later, so it wins. Fonts still load because the family names match. The cost is that next/font's metric-matched fallback fonts (`"Press Start 2P Fallback"` etc.) are dropped, which adds layout shift while fonts load.

**Remediation:** Delete the three `--font-*` declarations from `:root`. The `var(--font-x), monospace` fallbacks at each use site already cover the no-variable case.

### L6. Unused code and data
- `profile.shortName`, `profile.team` and `profile.company` are never read.
- `sprites.mail` is never rendered.
- `PixelArt`'s `colors` prop is never passed.
- `.contact__mail` is applied to the **heart** sprite, so the class name is misleading.

**Remediation:** Remove these, or use them (see L7).

### L7. Some content is hard-coded in `page.tsx`, despite the data-file convention
`profile.ts` says "All site content lives here", but these strings live in `page.tsx`:
- "Tech & Functional Lead", "UOB · Global Markets" and "E-Trading Development" (player card)
- the "JAKE / ABELLA" hero heading
- the "Hi! I'm Jake" bubble
- the contact lead text

Some of these duplicate the unused `profile.team` and `profile.company` fields.

**Remediation:** Move them into `profile.ts` and read them from there.

### L8. Copy and terminology errors in `profile.ts`
- "Five years of software engineering in banking, **Migrated**…" → comma splice and capital M; also ".Net" → ".NET".
- "Building inventory systems and cost management tools" has no full stop, unlike the other notes.
- "Implemented and **Developed**" → "developed". "**EDistribution**" → probably "eDistribution" or "E-Distribution".
- Inventory names: "Jboss EAP" → "JBoss EAP", "Websphere" → "WebSphere", "NoSQL - Mongodb" → "MongoDB (NoSQL)", "apache-httpd" → "Apache httpd".
- `ExpressJS` and `NodeJS` are tagged `LANG`. They are a framework and a runtime; use `RUNTIME` or `API` instead, and "Node.js" / "Express" are the usual spellings.
- `'Middleware'` is much longer than the other 2–4 letter tags and may overflow the 0.52rem slot tag. Consider `MW`.

### L9. No validation of sprite characters
**Where:** [src/components/PixelArt.tsx:27](src/components/PixelArt.tsx#L27)

A character in a sprite that isn't in the palette is silently skipped, so a typo just shows a transparent pixel. All current sprites are valid: rows are consistent widths, and every character is in the palette.

**Remediation (optional):** Tighten the types so `sprites` rows can only contain palette keys, or add a dev-only check that logs unknown characters.

### L10. No security headers
**Where:** [next.config.mjs](next.config.mjs)

The risk is low for a static site with no input. Still, setting baseline headers is cheap: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy: frame-ancestors 'none'` (or `X-Frame-Options: DENY`) and `Permissions-Policy`. Set them via `async headers()` in `next.config.mjs` or at the hosting layer.

A full script CSP needs nonces with the App Router, so only add one if you want to.

### L11. Toolchain and engine mismatch
Every `npm`/`npx` command warns: *"npm v12.1.0 does not support Node.js v24.14.0 (requires ^24.15.0)"*. TypeScript 7 (the native compiler) works with this Next version: build and typecheck both pass.

**Remediation:** Upgrade Node to ≥ 24.15. Add `"engines": { "node": ">=24.15" }` and an `.nvmrc` so local and hosting environments match.

### L12. No README
Add a short README covering how to run the site, how to edit content (`src/data/profile.ts`), how to unlock a portfolio slot, and how it's deployed.

---

## What's good
- Interactive logic is cleanly split into small client components, and `page.tsx` stays a server component.
- `PixelArt` is a neat approach: sprites are text grids rendered as merged SVG runs with `crispEdges`. Decorative SVGs are `aria-hidden`, and the meaningful one gets `role="img"` and a `<title>`.
- Observers and listeners are cleaned up correctly (`disconnect`, `removeEventListener`, `clearTimeout`), and the scroll listener is passive.
- Reduced motion is respected in both CSS and `Typewriter`, and `:focus-visible` has a clear, on-theme outline.
- `scroll-padding-top` accounts for the fixed nav, and mobile layouts degrade sensibly.
- External links use `rel="noreferrer"`. The lockfile is committed, `strict` TypeScript is on, and the `@/*` path alias is used consistently.

## Suggested order of work
1. **H2:** check the PDF's contents and visibility; purge it from history if needed.
2. **H1:** no-JS fallback for `Reveal`.
3. **M1, M2:** tagline accessibility and contrast fixes.
4. **M5, L8:** fix the content and dates.
5. **M3, M4:** computed durations, plus revalidate or rebuild.
6. **M6, M7:** linting, favicon, OG metadata.
7. The remaining low-severity items.
