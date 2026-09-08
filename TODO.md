# TODO — technical follow-ups

Engineering debt and pre-launch hardening. **Not** Phase 2 client scope — that
lives in `BACKLOG.md`. Items here came out of the 2026-09-08 component audit and
earlier build work; check them off or move them to a plan/issue as they're done.

## Pre-launch hardening

- [ ] **Security headers** — `next.config.mjs` sets none. Add a `headers()`
      block (CSP / `frame-ancestors`, `Referrer-Policy`, `X-Content-Type-Options`,
      HSTS) before go-live. Owner: deploy config.
- [ ] **`lib/sanity.env.ts` silent placeholder** — `projectId` falls back to
      `"placeholder"`. Decide: keep for scaffold builds, or throw when
      `NODE_ENV === "production"` and the var is unset so a misconfigured deploy
      fails loud instead of rendering against a bogus project.
- [ ] **`AGENT_PORTAL_URL` real target** — `lib/site.ts` currently points the
      footer "Agent Portal" link at `/studio` (the CMS). The plan's Agent Portal
      is the advisors' external portal — a different system. Set
      `NEXT_PUBLIC_AGENT_PORTAL_URL` to the real gated URL.
- [ ] **`metadataBase` + OG/Twitter metadata** — absent in `app/layout.tsx`;
      Next will warn once OG images exist. Owner: `seo-agent`.

## Performance

- [ ] **Oversized logo source assets** — `public/images/logos/logo-primary.png`
      is 386 KB at 1080×1350, rendered ~35 px wide. Pre-scale sources to ~256 px
      and strip metadata (repo weight; also matters if the Image Optimizer is
      ever bypassed).
- [ ] **`priority` on the header logo** (`components/site-header.tsx`) — it's not
      the LCP element (`<h1>` text is). Drop `priority` or leave it; low impact.
- [ ] **Header client-JS island split** (`components/site-header.tsx`) — the
      whole header is `"use client"`. Optional: keep `SiteHeader` a Server
      Component rendering the static shell, move the flyout + mobile menu +
      active-link (`usePathname`) state into a small client island.
- [ ] **Font `display` strategy** — `app/layout.tsx` uses `swap` for Inter +
      Playfair Display. `next/font` auto-adjusts fallback metrics so CLS is
      small; switch to `optional` if we want zero swap shift. Decide and record.

## Code quality / correctness

- [ ] **Footer copyright year frozen at build time** — `components/site-footer.tsx`
      calls `new Date().getFullYear()` in a Server Component on a statically
      prerendered page, so the year is fixed at build. Accept (rebuild cadence)
      or make a tiny `<Year>` client component.
- [ ] **Footer heading semantics** — `components/site-footer.tsx` uses `<h2>` per
      column while each `<nav>` already has an `aria-label`. Reconsider
      (`<p>` / visually-hidden headings / keep) once real pages set the `<h1>`
      context.
- [ ] **`flyoutRef` single-flyout assumption** — `components/site-header.tsx`
      binds the outside-click ref inside `.map()`; only safe while "one flyout
      max" holds (it's a hard nav rule, so this is a watch-item, not a bug).

## Feature wiring (owned elsewhere, tracked here for visibility)

- [ ] **Newsletter submit** — `components/newsletter-form.tsx` is presentational;
      needs a real endpoint + GA4 event. Owner: `forms-agent` / `seo-agent`.
- [ ] **Unsplash placeholder imagery** — `BRAND_KIT.md` records categories only;
      pick concrete `images.unsplash.com` URLs / collections (host is already
      allow-listed in `next.config.mjs`).
- [ ] **Nav routes** — `/destinations/*`, `/meet-the-team`, `/plan-your-vacation`,
      `/work-with-us`, `/blog`, `/privacy`, `/terms` are linked but 404 until
      built as their own tasks.
