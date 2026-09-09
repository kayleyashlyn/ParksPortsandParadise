# TODO — technical follow-ups

Engineering debt and pre-launch hardening. **Not** Phase 2 client scope — that
lives in `BACKLOG.md`. Items here came out of the 2026-09-08 component audit and
earlier build work; check them off or move them to a plan/issue as they're done.

## Sanity Studio

- [x] `http://localhost:3000` registered as a CORS origin on project `kuk7exxj`
      (done 2026-09-08; `/studio` now reaches the API and shows the login screen).
- [ ] **Add the remaining Studio origins** to project `kuk7exxj` CORS — the
      Vercel preview URL(s) and the production domain — before deploy.
- [ ] **`/studio` renders inside the marketing header/footer** — the Studio SPA
      is wrapped by `app/layout.tsx`'s `<SiteHeader>` / `<SiteFooter>`. It should
      be full-bleed. Fix belongs to `ui-agent` (route group: move marketing
      pages under an `app/(marketing)/` layout, leave `app/studio` on a bare
      root layout).

## Sanity data layer

- [x] **`production` dataset (`kuk7exxj`) had 0 published docs** on the 2026-09-08
      smoke test — resolved: 3 `destinationFamily` docs are now published
      (`parks` / `ports` / `paradise`), plus accreditation badges. **Still open:**
      no `destinationFamily.locations[]` are populated yet, so the
      `/destinations/[slug]` pages render their "guide coming soon" empty state.
      Add locations in Studio (image per §4 editorial rule + `blurb`) to make the
      family pages meaningful.
- [ ] ~~(original)~~ Confirm the seeded destination
      families / accreditation badges / agent profiles were **Published** (not
      left as drafts) and are in the `production` dataset. Re-run the smoke check
      once populated.
- [ ] **Image schemas have no `alt` field** — `heroImage`, `destinationLocation.image`,
      `accreditationBadge.badgeImage`, `agentProfile.photo` return no alt text, so
      `lib/sanity.queries.ts` can't project one. Either add an `alt` string field
      to those image fields (content-schema-agent — needs an IMPLEMENTATION_PLAN
      update per CLAUDE.md) or have consumers derive alt from the sibling
      `name` / `title` / `label`.
- [ ] **Query return types are hand-written, not runtime-validated** — if a GROQ
      projection in `lib/sanity.queries.ts` drifts from its TS type, nothing
      catches it. Consider `sanity typegen` or a Zod parse at the fetch boundary.

## Pre-launch hardening

- [ ] **Security headers** — `next.config.mjs` sets none. Add a `headers()`
      block (CSP / `frame-ancestors`, `Referrer-Policy`, `X-Content-Type-Options`,
      HSTS) before go-live. Owner: deploy config. **CSP must allow the SnapWidget
      Instagram embed:** `frame-src https://snapwidget.com`. Also evaluate an
      `iframe sandbox` allowlist on `components/instagram-feed.tsx` against what
      SnapWidget actually needs (likely `allow-scripts allow-popups`).
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
- [ ] **Homepage First Load JS ~174 kB** (up from ~103) — `components/sanity-image.tsx`
      is a client component (custom `next/image` loader can't cross the RSC
      boundary) and pulls in `@sanity/image-url`. Options: precompute a small set
      of Sanity URLs server-side and drop the loader, or accept it. Check against
      the Lighthouse/perf gate.

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

- [ ] **GA4** — tag wired in `app/layout.tsx` via `@next/third-parties`
      (`GoogleAnalytics`), gated on `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
      (`G-31KW1BQLNR`, stream 15748056048). **Remaining:**
      - [ ] Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in Vercel **Production** only.
      - [ ] In GA4 Admin, mark `generate_lead` as a **key event**.
      - [ ] Consent / cookie-banner decision (GA4 sets cookies; audience
            includes CA residents). `/privacy` page still needs a cookies
            section.
      - The `generate_lead` event itself fires from the Vacation Request Form
        (`feat/plan-your-vacation` / PR #4) — safe no-op until this tag lands.
- [ ] **Newsletter submit** — `components/newsletter-form.tsx` is presentational;
      needs a real endpoint + GA4 event. Owner: `forms-agent` / `seo-agent`.
- [ ] **Unsplash placeholder imagery** — `BRAND_KIT.md` records categories only;
      pick concrete `images.unsplash.com` URLs / collections (host is already
      allow-listed in `next.config.mjs`).
- [ ] **Nav routes still 404** — `/work-with-us`, `/blog`, `/privacy`,
      `/terms`. (`/meet-the-team` 2026-09-08; `/destinations` +
      `/destinations/[slug]` + `/plan-your-vacation` 2026-09-09.)
- [x] **Vacation Request Form — email provider** — Resend chosen 2026-09-09;
      `sendNotification()` in `app/api/vacation-request/route.ts` now calls the
      Resend SDK. **Still needed before it actually sends:**
      - [ ] Set `RESEND_API_KEY` (Vercel env, all environments) + `EMAIL_FROM` /
            `EMAIL_TO` if overriding the defaults.
      - [ ] Verify a sending domain in Resend for `parksportsandparadise.com`
            (or a `send.` subdomain) — add its SPF/DKIM (and DMARC) DNS records.
            These coexist with the existing Google Workspace MX; the Workspace
            inbox `hello@parksportsandparadise.com` stays the recipient.
      Until both are done the route validates + logs the submission and returns
      `{ delivered: false }`.
- [ ] **Vacation Request Form — GA4 `generate_lead` event** — the form fires
      `window.gtag("event", "generate_lead", …)` on success, but no gtag /
      `NEXT_PUBLIC_GA4_MEASUREMENT_ID` exists yet, so it's a no-op. Owner:
      `seo-agent` (analytics wiring). Per `forms-agent.md` a missing event is a
      bug, not optional.
- [ ] **Vacation Request Form — spam hardening** — honeypot field only. Add
      rate-limiting (and/or a captcha) on `app/api/vacation-request/route.ts`
      before launch.
- [ ] **`?destination=` prefill is best-effort** — `matchDestinationOption()`
      maps a CMS location name to one of the form's fixed options by fuzzy
      contains; names it can't match just don't pre-fill.
- [ ] **Homepage sections still missing** (`app/page.tsx`) — real hero (blocked
      on brand photography), testimonials (no content), a newsletter section.
      Hero/section copy needs sign-off. Built: destination-family grid + trust
      bar + Instagram feed (all CMS-driven).
- [ ] **Instagram feed — SnapWidget setup** — component + `siteSettings` schema
      shipped (2026-09-09); the section renders only once the client:
      - [ ] creates a SnapWidget widget for `@parksportsandparadise` (business
            account, not personal) — free tier has a small watermark; Pro
            (~$5/mo) removes it,
      - [ ] pastes the widget ID into **Site Settings → SnapWidget widget ID**
            in Studio and toggles **Show the Instagram feed on the homepage** on.
      Also: CSP `frame-src https://snapwidget.com` (see Pre-launch hardening).
- [x] **Nav hrefs vs CMS slugs** — reconciled 2026-09-09: `lib/site.ts`
      `PRIMARY_NAV` / `FOOTER_NAV` now hardcode the live slugs
      `/destinations/parks` · `/ports` · `/paradise` (comment in the file flags
      "keep in sync with the CMS"). Follow-up if slugs churn: generate the
      Destinations nav from `getDestinationFamilies()` — but the header is a
      client component, so that needs the nav data passed in from a Server
      Component parent.
- [x] **`/destinations/[slug]` pages** — built 2026-09-09 (`generateStaticParams`
      + ISR `revalidate=60`, `notFound()` on unknown slug, CMS-driven hero +
      metadata). Locations render as on-page sections (`DestinationLocations`),
      each a single link to `/plan-your-vacation?destination=<name>`.
      **Still open:** no `locations[]` in Studio yet, so all three currently show
      the "guide coming soon" empty state. `?destination=` prefill needs the
      Vacation Request Form to read the query param (owner: `forms-agent`).
- [ ] **Trust bar renders text only** (`components/trust-bar.tsx`) — to show
      `badgeImage` seals, add `badgeImage.asset->metadata.dimensions` to the
      `accreditationBadge` projection in `lib/sanity.queries.ts` and render with
      `next/image`.
- [ ] **Sanity image `alt` text** — `SanityImage` currently uses the sibling
      `title` / `label`. Replace with real alt text once finalized images land
      (per decision 2026-09-08).
