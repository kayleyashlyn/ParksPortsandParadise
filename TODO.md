# TODO — technical follow-ups

Engineering debt and pre-launch hardening. **Not** Phase 2 client scope — that
lives in `BACKLOG.md`. Items here came out of the 2026-09-08 component audit and
earlier build work; check them off or move them to a plan/issue as they're done.

## Client deliverables

- [ ] **`CLIENT_HANDOFF_GUIDE.md` — keep current.** Living plain-language ops
      guide for the client (integrations, sign-ins, troubleshooting, pre-launch
      checklist). Created 2026-09-09. Per `CLAUDE.md` (Definition of done), every
      PR that touches an integration / credential / env var / CMS model / editor
      workflow updates it + its Change log. Final pass before handoff: fill the
      `[TBD]` login-owner and developer-contact fields, confirm every section's
      status marker, walk it through with Paige/Ashley.

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
- [x] **Image schemas have no `alt` field** — DONE (branch `feat/image-alt-and-keywords`).
      Added an inline `alt` string field to `heroImage`, `destinationLocation.image`,
      `accreditationBadge.badgeImage`, and `agentProfile.photo`. Warning-level
      (`.required().warning()`) on all but `badgeImage` (plain optional) so the ~15
      already-seeded images don't become invalid. `SanityImage` projections are bare
      objects so `alt` flows through automatically; the `SanityImage` type gained
      `alt?: string | null` and every `<SanityImage>` call site now passes
      `image.alt ?? <sibling label>`. **Editors still need to fill alt on existing
      images** (Studio shows the warning until they do).
- [ ] **Query return types are hand-written, not runtime-validated** — if a GROQ
      projection in `lib/sanity.queries.ts` drifts from its TS type, nothing
      catches it. Consider `sanity typegen` or a Zod parse at the fetch boundary.

## Pre-launch hardening

- [x] **Security headers** — `next.config.mjs` `headers()`, all **enforced**.
      Baseline (every route): HSTS (`max-age=63072000; includeSubDomains` — no
      `preload`; add only if the client wants the apex + every subdomain locked
      to HTTPS near-permanently), `X-Content-Type-Options`,
      `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`,
      `X-DNS-Prefetch-Control`.
      **CSP is enforced**, split two ways: a strict `marketingCsp` on every route
      except `/studio/*` (no `'unsafe-eval'` in prod — `next dev` adds it back for
      HMR; no `blob:`; tight `connect-src`/`frame-src`) and a looser `studioCsp`
      on `/studio/*` (`'unsafe-eval'`, `blob:`, `wss://*.sanity.io`,
      `*.sanity-cdn.com`, `lh3.googleusercontent.com`). Verified: prod build has
      no `eval` outside the Studio chunks; deployed site had no CSP violations
      (the WebSocket error there was a Sanity **CORS** issue, not CSP). Rollback:
      swap a `Content-Security-Policy` key to `-Report-Only`.
      - [ ] Watch prod after this ships — logged-in Studio edit/upload/realtime,
            a form submit, the Instagram section — for any `Refused to …` CSP
            errors; widen the relevant allowlist if one appears.
      - [ ] Optional later: nonce middleware to drop `'unsafe-inline'` from the
            marketing `script-src`.
      - Not doing: `iframe sandbox` on `components/instagram-feed.tsx` — SnapWidget
            needs `allow-scripts allow-same-origin` which together defeat the
            sandbox; `frame-src https://snapwidget.com` is the control.
- [ ] **`lib/sanity.env.ts` silent placeholder** — `projectId` falls back to
      `"placeholder"`. Decide: keep for scaffold builds, or throw when
      `NODE_ENV === "production"` and the var is unset so a misconfigured deploy
      fails loud instead of rendering against a bogus project.
- [x] **`SITE_URL` crashed the build on a blank env var** — fixed 2026-09-09
      (`fix/site-url-empty-env`). `NEXT_PUBLIC_SITE_URL=""` in Vercel (created
      while adding other env vars) got past `?? fallback` and crashed
      `new URL(SITE_URL)` in `app/layout.tsx` — broke every deploy incl.
      production. `lib/site.ts` now treats empty/blank the same as unset.
- [ ] **Vercel env vars regressed (2026-09-09) — deploys are RED.** After the
      `SITE_URL` fix above, the Vercel build fails deeper with
      `Dataset "production" not found for project ID "placeholder"` — i.e.
      `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` are missing
      or blank on Vercel (they were working through PR #13; likely disturbed
      while adding `NEXT_PUBLIC_GA4_MEASUREMENT_ID` / `RESEND_API_KEY`).
      **Owner: client — restore in Vercel → Settings → Environment Variables,
      all environments:**
      `NEXT_PUBLIC_SANITY_PROJECT_ID=kuk7exxj`,
      `NEXT_PUBLIC_SANITY_DATASET=production`,
      `NEXT_PUBLIC_SANITY_API_VERSION=2026-09-08`, and a non-blank
      `NEXT_PUBLIC_SITE_URL` (Production = the prod domain, Preview = the preview
      URL). Re-check the whole env list against `.env.example` while in there.
      The site is CMS-driven — no code change makes it build green without these.
- [ ] **`AGENT_PORTAL_URL` real target** — `lib/site.ts` currently points the
      footer "Agent Portal" link at `/studio` (the CMS). The plan's Agent Portal
      is the advisors' external portal — a different system. Set
      `NEXT_PUBLIC_AGENT_PORTAL_URL` to the real gated URL.
- [x] **`metadataBase` + OG/Twitter metadata** — done 2026-09-09 (`feat/seo-phase-1`).
      `app/layout.tsx` sets `metadataBase` from `SITE_URL` (`lib/site.ts`,
      env `NEXT_PUBLIC_SITE_URL`), default OpenGraph/Twitter/robots, and a
      `title.template`. Per-page metadata routes through `pageMetadata()`
      (`lib/seo.ts`). Site-wide `TravelAgency` + `WebSite` JSON-LD in the root
      layout; `ItemList`/`TouristAttraction` + `BreadcrumbList` on
      `/destinations/[slug]`. `app/sitemap.ts` + `app/robots.ts` added.
- [ ] **Default OG image asset** — no site-wide `og:image`. Inner pages other
      than destination families (home, Meet the Team, Plan Your Vacation) ship
      with no OG image, so social cards fall back to a bare link. `seo-agent`
      deliberately did **not** commit a placeholder. Owner: design — supply a
      1200×630 branded share image; then set it as the default in
      `app/layout.tsx` `openGraph.images` (+ `twitter.images`).
- [ ] **Favicon — transparent sparkle mark** (client request 2026-09-09). Want
      just the gold sparkle motif on a transparent background, not the full seal
      (illegible at 16–32 px). Need a square transparent PNG (≥512 px) or SVG of
      the sparkles alone; then replace `app/icon.png`, `app/apple-icon.png`,
      `app/favicon.ico` and it's wired automatically (Next file convention, no
      code). Can't derive it cleanly from the existing seal PNGs here.
- [ ] **Horizontal logo lockup** — the only logo assets are the vertical
      circular seal (`public/images/logos/logo-*.png`, 1080×1350). Its fine text
      is unreadable at header size, so the header now shows the seal only at
      `sm+` and a text wordmark ("Parks Ports & Paradise", `font-heading`)
      carries the brand on mobile (`components/site-header.tsx`). A proper
      horizontal lockup (mark + wordmark) from the client would let both show at
      every width and drop the CSS wordmark fallback.
- [ ] **`content-schema-agent`: optional SEO fields on `destinationFamily`** —
      metadata currently reuses `shortDescription` for `<meta description>` /
      `og:description` and crops `heroImage` to 1200×630 for `og:image`. That's
      workable. A dedicated `seoDescription` (≤160 chars, plain) and/or
      `ogImage` field would let the editor tune search/social copy independently
      of on-page hero copy. Not blocking; needs an IMPLEMENTATION_PLAN update
      per CLAUDE.md if added.
- [ ] **Real `lastModified` in `app/sitemap.ts`** — every entry currently uses
      build/revalidate time. Project `_updatedAt` into `getDestinationFamilies()`
      (touches the hand-written type in `lib/sanity.queries.ts`) to emit true
      per-family timestamps.

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

- [ ] **GA4** — tag wired in `app/layout.tsx` via `@next/third-parties`,
      double-gated on `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (`G-31KW1BQLNR`, stream
      15748056048) **and** analytics consent (`components/analytics.tsx`).
      **Remaining:**
      - [ ] Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in Vercel **Production** only.
      - [ ] In GA4 Admin, mark `generate_lead` as a **key event**.
      - [x] Consent / cookie banner — **built** (`feat/cookie-consent`).
            Opt-in: GA loads only after "Accept" in `components/cookie-consent.tsx`;
            first-party cookie `ppp-analytics-consent`; GPC signal honoured as a
            silent decline; "Cookie settings" control in the footer re-opens it.
            `/privacy` §6 rewritten from placeholders. Final wording still rides
            the overall legal review.
      - The `generate_lead` event itself fires from the Vacation Request Form
        (`feat/plan-your-vacation` / PR #4) — `window.gtag?.()` is optional-chained,
        so it's a safe no-op when the visitor declined or the tag isn't loaded.
- [ ] **Newsletter submit** — `components/newsletter-form.tsx` is presentational;
      needs a real endpoint + GA4 event. Owner: `forms-agent` / `seo-agent`.
- [ ] **Unsplash placeholder imagery** — `BRAND_KIT.md` records categories only;
      pick concrete `images.unsplash.com` URLs / collections (host is already
      allow-listed in `next.config.mjs`).
- [x] **Nav routes** — all built as of 2026-09-09. (`/meet-the-team`
      2026-09-08; `/destinations` + `/destinations/[slug]` + `/plan-your-vacation`
      2026-09-09; `/privacy` + `/terms` 2026-09-09 as **draft** shells;
      `/work-with-us` 2026-09-09; `/blog` + `/blog/[slug]` 2026-09-09.)
- [ ] **Blog — migrate the Squarespace posts.** `post` schema + `/blog` +
      `/blog/[slug]` shipped (`feat/blog`). The index shows an empty state until
      there's at least one **published** post. Client content task: export the
      existing Squarespace blog, recreate each as a `post` in Studio, re-upload
      images at proper resolution, and set `publishedAt` to the original date
      (posts with a future `publishedAt` stay hidden). Refresh visuals on posts
      whose imagery predates the brand refresh (IMPLEMENTATION_PLAN §11 #2/#7).
- [x] **`/work-with-us`** — page + single-step form built and copy finalised per
      client (2026-09-09): framed as a low-key **"Get in touch"** contact form —
      **no résumé / file upload**, submit button "Send message"; **no visible
      fee / commission structure**; FAQ uses "onboarding" not "interview" and
      covers experience, E&O, culture, time-to-first-booking.
      (`app/work-with-us/page.tsx`, `components/work-with-us-form.tsx`,
      `app/api/work-with-us/route.ts` → `lib/notify.ts` → `hello@`.) No open
      follow-up.
- [ ] **`/privacy` + `/terms` are DRAFT** (`feat/privacy-terms-shells`) —
      starting-point copy in `app/privacy/page.tsx` / `app/terms/page.tsx`, wrapped
      by `components/legal-page.tsx`. A "Draft — pending legal review" notice shows
      while `LEGAL_DRAFT` is `true` in `lib/legal.ts`. Before launch: a
      travel-industry / privacy attorney fills every `[BRACKETED]` value (legal
      entity name, mailing address, phone, effective + last-updated dates,
      retention periods, governing-law state/county, Terms §5 fee option A/B,
      consent-banner wording, GPC handling) and reviews both; then set the two
      dates in `lib/legal.ts` and flip `LEGAL_DRAFT` to `false`.
- [x] **Vacation Request Form — email provider** — Resend chosen 2026-09-09;
      `sendNotification()` in `app/api/vacation-request/route.ts` now calls the
      Resend SDK. **Still needed before it actually sends:**
      - [ ] Set `RESEND_API_KEY` (Vercel env, all environments) + `EMAIL_FROM` /
            `EMAIL_TO` if overriding the defaults.
      - [ ] Verify a sending domain in Resend for `parksportsandparadise.com`
            (or a `send.` subdomain) — add its SPF/DKIM (and DMARC) DNS records.
            These coexist with the existing Google Workspace MX; the Workspace
            inbox `hello@parksportsandparadise.com` stays the recipient.
            **CIRCLE BACK AFTER CUTOVER — do not touch the current DNS.** As of
            2026-09-10 the zone is at Google Domains / Squarespace, the live site
            is still Squarespace (`198.49.23.144`), and Vercel has 0 domains
            attached. Client's decision: the launch is a **fresh start on
            Vercel** — the domain (and its DNS) moves to Vercel at cutover, and
            we are **not** editing Squarespace/Google DNS in the meantime. So the
            Resend SPF/DKIM/DMARC records get added **in the Vercel DNS panel**
            once the domain is on Vercel, in the same pass as re-creating the
            Google Workspace MX/SPF/DKIM/DMARC records there. `EMAIL_FROM` must
            match whatever domain/subdomain is verified. Sequencing: (1) move
            domain to Vercel, (2) re-create Workspace email DNS in Vercel so mail
            keeps flowing, (3) add Resend's records + click Verify, (4) set the
            Vercel env vars.
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
- [ ] **Homepage sections still missing** (`app/page.tsx`) — testimonials (no
      content) and a newsletter section. Built: image/video **hero**
      (`components/hero.tsx`, CMS-driven — `siteSettings.heroPoster` +
      optional `heroVideo`; plain text hero until a poster is uploaded;
      video is desktop + motion-OK only), destination-family grid, trust bar,
      Instagram feed. **Client action:** upload a hero image (and optionally a
      short muted loop video, well under ~5 MB) in Studio → Site Settings →
      Homepage hero. Real brand photography still pending (CLAUDE.md embargo).
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
- [x] **Trust bar renders `badgeImage` seals** — DONE (2026-09-11). The client
      had already uploaded real logo artwork for all 4 badges (CLIA, IATAN, TL
      Network, Universal Orlando) but `components/trust-bar.tsx` never rendered
      it — text-only labels shipped regardless. Now renders via `SanityImage`
      in a fixed box with `object-contain` (no `aspect`/crop — badge art isn't
      hotspot-cropped); falls back to the text label only when a badge has no
      `badgeImage` (e.g. the Seller of Travel registration numbers). The
      `metadata.dimensions` projection this item used to call for turned out to
      be unnecessary — `SanityImage`'s existing `fill` + `object-contain`
      handles it without intrinsic dimensions.
- [x] **Sanity image `alt` text** — DONE. Per-image `alt` field added to all four
      image schemas; call sites fall back to the sibling label only when `alt` is
      blank. Editors need to backfill `alt` on the already-seeded images.
- [ ] **`shortTag` → `searchKeywords` re-entry** — `shortTag` (previously a visible
      uppercase eyebrow on destination locations) was renamed to `searchKeywords`,
      a hidden field fed into the `/destinations/[slug]` JSON-LD (`keywords` on each
      `TouristAttraction`). The 2 locations that had `shortTag` values lost them in
      the rename — re-enter them as comma-separated search terms in `searchKeywords`.
- [ ] **`agentProfile` contact fields — move data out of bios** (schema shipped
      2026-09-10, `feat/agent-contact-fields`). New optional `location` / `email` /
      `instagramHandle` fields on `agentProfile`; `team-grid.tsx` renders them as a
      pin / `mailto:` link / `instagram.com/<handle>` link. The 3 seeded agents
      currently have this info hand-typed at the end of `bio` (e.g. Alyssa's is
      `"Jones, OK\n@alyssaatthecastle"`; Paige/Ashley have placeholder lists) —
      content task: cut it from `bio` into the new fields. No migration script;
      all three fields are optional so nothing breaks until it's done.
- [ ] **`agentProfile.teamGroup` — set the founders** (schema shipped 2026-09-10,
      `feat/team-leadership-group`). `teamGroup` (`"leadership"` | `"advisor"`,
      defaults to `"advisor"`) splits `/meet-the-team` into a founders row above
      the advisors. Content task: set **Team section → Founder / leadership** on
      Paige Gold and Ashley Mackay. Query coalesces a missing value, so until then
      everyone just renders in the single advisors grid as before.
