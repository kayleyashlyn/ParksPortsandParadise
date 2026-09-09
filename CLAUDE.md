# CLAUDE.md — Build Instructions for This Repo

This file is read automatically by Claude Code at the start of every session in this
repo. It exists so that implementation work stays consistent and clean across many
sessions and multiple contributors (human or agent), instead of degrading as context
fills up over a long build.

Full requirements live in `IMPLEMENTATION_PLAN.md` — read that first for *what* to
build. This file is about *how* to build it without losing quality as the codebase grows.

## Project facts an agent should never re-derive from scratch
- Stack: **Next.js 15.5** (App Router) · **React 19** · **TypeScript** (~5.7, `strict`) · **Sanity.io v3** (embedded Studio at `/studio`) · **Tailwind CSS 3.4 + shadcn/ui** ("new-york") · **React Hook Form + Zod** · deployed on **Vercel**.
- **Build status (2026-09-09, PRs #4 + #5 merged):** `npm run build` + `npx tsc --noEmit` green. Routes: `/` · `/destinations` · `/destinations/[slug]` (SSG: parks/ports/paradise) · `/meet-the-team` · `/plan-your-vacation` (dynamic — multi-step RHF + Zod form, reads `?destination=`) · `/api/vacation-request` (POST — Zod-validated, Resend) · `/studio/[[...tool]]` · icon/favicon routes. GA4 loads in the root layout via `@next/third-parties`. Deps added: `resend`, `@next/third-parties`. Still 404: `/work-with-us`, `/blog`, `/privacy`, `/terms`. Keep build + tsc green before every commit — see "Before committing" below.
- **SEO base is in place (2026-09-09, `feat/seo-phase-1`).** `app/layout.tsx` has `metadataBase` + default OG/Twitter/robots + `title.template`, driven by `SITE_URL` (`lib/site.ts`, env `NEXT_PUBLIC_SITE_URL`, fallback the prod domain). Per-page metadata goes through `pageMetadata()` in `lib/seo.ts` (callers pass a bare title + description + path). JSON-LD via `components/json-ld.tsx`: site-wide `TravelAgency` + `WebSite` in the root layout, `ItemList`/`TouristAttraction` + `BreadcrumbList` on `/destinations/[slug]`. `app/sitemap.ts` (static routes + live `destinationFamily` slugs) and `app/robots.ts` added — `/sitemap.xml`, `/robots.txt` live. No default `og:image` asset yet (design TODO); destination pages derive one from the family `heroImage`.
- **Email + analytics are wired but env-gated — the no-ops are deliberate, not bugs.** Vacation Request Form notifications go through Resend (`app/api/vacation-request/route.ts`); GA4 loads via `@next/third-parties` (`app/layout.tsx`). Both stay inert until the client sets `RESEND_API_KEY` (+ a Resend-verified sending domain) and `NEXT_PUBLIC_GA4_MEASUREMENT_ID` — see `TODO.md`. The form fires the GA4 `generate_lead` conversion **only when the API reports the email was delivered**, so a broken Resend can't inflate conversions. Don't "fix" these to always send / always fire, and don't add a second GA script.
- **Platform decision is final:** migrating off Squarespace (client-confirmed, IMPLEMENTATION_PLAN.md §10). Don't re-litigate or hedge on this.
- **Styling embargo for `ui-agent` — logo cleared; photography interim (updated 2026-09-08):** colour values, type families, and logo files are delivered and wired (tokens in `tailwind.config.ts` / `app/globals.css`; assets in `public/images/logos/` + the favicon set). **Logo embargo: fully cleared.** For **photography**, `BRAND_KIT.md` now records an *interim* placeholder direction (Unsplash categories for theme parks / cruises / resorts) — enough to unblock the global layout shell and component work, but the client's real brand photography has **not** been delivered. The §4 editorial rule still stands: destination-family location images must depict that specific location, and generic stock must not ship on those grids (`qa-agent` checks this). Swap in real photography before any photo-dependent page is called done.
- No direct booking/payment on-site — every conversion path ends at the Vacation
  Request Form, not a checkout.
- CMS editor is non-technical — keep Sanity schemas flat and few. Do not introduce
  a page-builder pattern without explicit sign-off; it will not get adopted by the client.
- Nav is capped at one dropdown level, one dominant CTA ("Request a Quote") repeated
  across the page — this is a hard brand constraint, not a style preference (see
  competitive analysis in the implementation plan for why).
- Itinerary detail pages, direct booking, and CRM API integration are Phase 2 —
  do not build them "while you're in there" even if it looks easy.
- **`CLIENT_HANDOFF_GUIDE.md` is a living client-facing deliverable** — a
  detailed operations guide (every integration, sign-in, troubleshooting step,
  pre-launch task) for the non-technical client. Any change that adds or alters
  an integration, an account/credential, an env var, a CMS model, or an
  editor-facing workflow **must update it in the same PR**, including its Change
  log. Keep the tone plain-language; the audience is Paige/Ashley, not a dev.

## Styling & architecture rules

**Design tokens**
- `BRAND_KIT.md` is the source of truth for palette, type, radius, and assets.
  `tailwind.config.ts` and `app/globals.css` mirror it — change them together,
  never let them drift.
- Style with the shadcn **semantic tokens** (`bg-primary`, `text-foreground`,
  `text-muted-foreground`, `border-border`, `bg-secondary`, …). No raw hex in
  component classes. When a semantic token doesn't fit, reach for
  `colors.brand.*` (the exact client swatches), not a literal hex.
- `--primary` / `--ring` are a contrast-tuned deeper Slate Blue;
  `colors.brand.primary` (`#7393b9`) is the exact swatch, for decorative fills
  only.
- Fonts load once via `next/font` in `app/layout.tsx`: `font-heading` =
  Playfair Display, `font-sans` = Inter. No `@import`, no font-CDN `<link>`.

**Components & structure**
- Server Components by default. Add `"use client"` only for state / effects /
  browser APIs, and keep those components small and leaf-ward.
- Use shadcn/ui primitives from `components/ui/*` (add via the CLI per
  `components.json`). Don't hand-roll a duplicate of one.
- **Forms:** shadcn `Input` / `Label` + native `<select>` / checkbox / radio —
  no extra Radix deps. Multi-step forms validate per step via RHF `trigger()`,
  re-validate everything on submit. `lib/vacationRequestSchema.ts` is the single
  source of truth for the Vacation Request Form's fields *and* option lists (the
  UI maps over the exported `*_OPTIONS`) — keep it field-for-field with
  IMPLEMENTATION_PLAN.md §6 (`forms-agent`).
- Navigation / footer / business-fact config lives in `lib/site.ts`, not inline
  in components. Confirmed facts (Seller-of-Travel numbers, accreditations,
  Instagram handle) come from `IMPLEMENTATION_PLAN.md` §4 / §11.
- Import with the `@/*` path alias.
- Public runtime config: a `NEXT_PUBLIC_*` env var with a sensible in-code
  fallback **and** a line in `.env.example`.

**Images**
- `next/image` only, with explicit `width`/`height` (or `fill`). Local files in
  `public/`; every remote host must be listed in `next.config.mjs`
  `images.remotePatterns`.
- Every Sanity image field has an inline `alt` string (warning-level, not
  required — pre-existing seeded images stay valid). `<SanityImage>` call sites
  pass `image.alt ?? <sibling label>`; never drop the fallback.
- `destinationLocation.searchKeywords` is SEO-only — it feeds the
  `/destinations/[slug]` JSON-LD (`keywords`) and must never render on the page.
- Logo variants: `logo-primary` on light, `logo-white` on dark, `logo-black`
  one-colour on light, `logo-outline` on mid-tone / coloured.

**Layout & accessibility**
- No horizontal overflow at any width — verify `scrollWidth === clientWidth`
  at 390px and ≥1280px. Wide content (tables, code) scrolls inside its own
  container, never the page.
- Dark sections: wrap in the `dark` class so tokens resolve to their dark
  values (see `SiteFooter`) — don't hard-code inverted colours.
- Interactive text and controls clear **WCAG AA 4.5:1** (this is why `--primary`
  was deepened). Icon-only controls need an `aria-label` or `sr-only` label;
  disclosure menus need `aria-expanded` + Escape + outside-click close.
- Exactly one button-weight CTA visible per view ("Request a Quote"); keep a
  skip-to-content link in the header.

**Before committing**
- `npx tsc --noEmit` and `npm run build` both green. Scope each commit to one
  role / task.

## Why subagents, and when to use them

A single long-running session that does discovery, design, schema work, page
building, and QA back-to-back accumulates context bloat: early decisions get
half-remembered, and late-session code quality drifts from early-session code
quality. Split work by **role**, not by page, and give each subagent only the
context it needs.

Recommended subagents (define under `.claude/agents/`):

| Subagent | Scope | Reads | Should NOT touch |
|---|---|---|---|
| `content-schema-agent` | Sanity schema definitions (`sanity/schemaTypes/`) | §5, §7 of implementation plan | Frontend components |
| `ui-agent` | Page/component building in `app/` and `components/` | §4, §6 of plan, Tailwind config, shadcn conventions | Sanity schema internals |
| `forms-agent` | Vacation Request Form, RHF/Zod schema, email-notification API route | §6 field spec exactly as written | Unrelated pages |
| `seo-agent` | Metadata, JSON-LD, sitemap.xml, GA4 event wiring | §9, §11 (analytics) | Visual design decisions |
| `qa-agent` | Review diffs for regressions before merge; checks nav stays one-level, single dominant CTA rule, no Phase-2 scope creep | This file + implementation plan | Should not author new features itself |

## Context-hygiene rules
1. **One role per session.** Don't ask a single session to design the schema *and*
   build the UI *and* wire analytics — spin up a fresh session/subagent per role above.
2. **Clear context between unrelated tasks**, even within the same role, once a task
   is merged. A stale 40-message thread about the destination grid is not useful
   context for the next task on the Vacation Request Form.
3. **Re-read `IMPLEMENTATION_PLAN.md` at the start of a new session** rather than
   relying on memory of a previous session's summary — requirements should come from
   the document, not from what an earlier agent said it did.
4. **Phase-2 items go in `BACKLOG.md`, not into code.** If a subagent notices a
   Phase 2 opportunity mid-task, it should log it there and keep scope to Phase 1.
   Engineering debt / pre-launch hardening (not client scope) goes in `TODO.md`.
5. **No schema or nav changes without updating the implementation plan.** The plan
   is the source of truth; code and docs should never silently diverge.

## Definition of done (per feature)
- Matches the field/behavior spec in `IMPLEMENTATION_PLAN.md` exactly — no
  unrequested extra fields or pages.
- Passes `qa-agent` review against the nav/CTA brand constraints above.
- Lighthouse/perf and basic a11y check before merge (fast pages were a stated
  business goal, not just a tech preference).
- If the feature touches an integration, credential, env var, CMS model, or
  editor workflow, `CLIENT_HANDOFF_GUIDE.md` is updated in the same PR (with a
  Change-log entry).
