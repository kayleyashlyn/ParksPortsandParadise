# Parks Ports & Paradise — Website Rebuild
## Functional Specification & Implementation Plan
*Prepared from client discovery notes, current-site audit, and reference-site analysis. Deliverable per "Post-Meeting Deliverables Checklist."*

---

## 1. Discovery Summary

| Topic | Finding |
|---|---|
| Current platform pain | Site is on Squarespace (managed by Ashley); it's editable but not fully custom-coded. No hard technical blocker — the real complaint is **polish**, not functionality. |
| Manual bottleneck | Inquiries currently land in email; agents key details into **Vacation Creations (VC)**, a third-party agent CRM the agents themselves pay for. PPP does not need to own/build a CRM. |
| Definition of success | A **more professional-looking site** that helps attract experienced agents with an existing book of business. Quote: current site "looks made by someone who doesn't know what they're doing." 25 agents total, only 4 experienced — the site is also a recruiting tool, not just a lead-gen tool. |
| Catalog size | ~100 active tour/package references this cycle, but itinerary detail pages are **explicitly out of scope** for this phase. |
| Booking model | **Inquiry-only** — no direct booking/payment on-site. Confirmed "not MVP scope." |
| Lead routing | Form submissions email **hello@parksportsandparadise.com** (the business's main inbox, monitored by Paige and Ashley) — no CRM auto-push required for MVP. |
| Content ownership | Ashley (basic technical comfort) will manage content day-to-day. Needs a **simple, low-friction CMS**. Only two personas needed: Admin and end user (no multi-role/editor tiers). |
| Social content | Homepage should support a **cycling Instagram feed**. |
| Brand voice | Warm, welcoming, expert, trustworthy, friendly, a little funny, casual-family, authentic, "can't do it without you," not cookie-cutter, tailored. |
| CRM / Email marketing | None owned by PPP — Vacation Creations auto-sends on the agent side. |
| Payments | Credit card auth handled through VC's own form — not built by us. |
| Travel APIs / booking engines | Handled by VC — no integration needed in Phase 1. |
| Analytics | None currently in place. Client wants to measure **conversion rate** (inquiry submitted vs. no booking) — GA4 + form-event tracking is a gap to close. |

---

## 2. Competitive & Reference-Site Analysis

### Current site (parksportsandparadise.com)
Actually has a reasonably restrained nav already (Home / Meet the Team / Destinations / Vacation Request Form / Work With Us / Agent Portal / Blog). The professionalism gap is **visual execution**, not structure: generic Squarespace block sections, stock-feeling imagery, inconsistent visual hierarchy, and a CTA that doesn't feel bespoke. This tells us the rebuild should prioritize **art direction, custom typography/color system, and imagery quality** over adding new navigation complexity.

### ✅ "Good" reference — castleboundtravel.com
- Single-level nav with **one obvious flyout** (Disney Destinations) — never more than one level deep visually.
- One dominant, repeated CTA: **"Request a Quote."** It appears in the header, hero, mid-page, and footer — never competes with anything else.
- Destination grid uses **large photography with minimal text** (place name + location) — visual-first browsing.
- Trust is built through **individually-attributed testimonials** ("Lilly Attar — Travel Advisor") rather than generic quotes — this doubles as recruiting proof for prospective agents.
- Credential/partner badges (Disney Earmarked, ASTA, IATAN-style logos) reinforce legitimacy.
- Newsletter capture is low-friction (single email field).

**Adopt:** single dominant CTA repeated at consistent intervals, large-format photography, agent-attributed testimonials, credential badges, one-level nav with a single flyout max. **Note:** credential/accreditation badges (Seller of Travel registration, IATAN/ASTA/CLIA-style certifications, Disney-authorized-agency status) are being elevated beyond "footer logos" for this rebuild — see §4 trust bar — since they carry double duty: consumer trust *and* proof of legitimacy for the prospective-agent recruiting persona.

### ❌ "Bad" reference — etfamilytravel.com
- Nav has **3 top-level items that each expand into 5–8 sub-links**, duplicated again in the footer — cognitive overload before the user does anything.
- Competing CTAs: phone number, "FREE Quote," cart icon, and search all fight for attention in the header.
- Destination browsing is a wall of small text links rather than visual entry points.
- Feels like an ever-growing content dump (dozens of destination/offer sub-pages) rather than a curated shortlist.

**Avoid:** multi-level flyout menus, more than one primary CTA competing in the header, dense text-link destination lists, unbounded page sprawl.

**Direct implication for IA:** Nav stays to **5–6 top-level items, one level of dropdown max**, and the destination catalog should read as a curated, photo-led shortlist rather than an exhaustive directory — consistent with "Destinations — not in scope for full itinerary detail" from discovery.

---

## 3. User Personas

1. **Family Vacation Planner (primary)** — 2 adults + kids, planning a Disney/Universal/cruise/all-inclusive trip. Budget-conscious to mid-range. Wants reassurance, free planning, and a fast way to describe their trip.
2. **Single-Parent Traveler** — same core need as above, form and copy should not assume a two-parent household (the intake form's "ages of anyone under 18" phrasing already supports this).
3. **Luxury / Book-of-Business Traveler** — higher budget tier ($7,000+), wants a white-glove, non-generic feel; often arrives via referral or an agent's personal following.
4. **Group Traveler** — larger party sizes, multiple rooms, weddings/honeymoons/reunions; needs the room-count and group-size fields from the intake form.
5. **Prospective Agent (secondary, recruiting persona)** — an experienced travel advisor evaluating whether PPP looks credible enough to bring their book of business to. This persona reads "Meet the Team," agent testimonials, and the "Work With Us" page as **proof of professionalism**, not just marketing copy.

---

## 4. Sitemap & Navigation Structure

Flat, single-flyout nav (Castlebound pattern, not ET Family Travel's):

```
Home
Destinations                     ← flyout: Theme Parks · Cruises · All-Inclusive & Beyond
Meet the Team                    (advisor bios — doubles as recruiting proof)
Plan Your Vacation                → Vacation Request Form (the one dominant CTA, repeated in header/hero/footer)
Work With Us                     (agent recruiting page)
Agent Portal                     (external link / gated area, unchanged from current)
Blog / Trip Inspiration
```

Footer: same primary links + Seller of Travel registration numbers (FL/CA — carry over from current site, legally required), social icons, newsletter signup, privacy/terms.

No third nav level anywhere. Destination content is organized into three **flagship
destination families**, decided with the client (see below) — not a directory of
individual itinerary pages.

### Flagship destination families (confirmed with client)
Modeled on Castlebound's flagship pattern (Disney Destinations / Universal / Cruise
Line as the whole top-level offer, not 100 individual sub-pages):

1. **Theme Parks** — Walt Disney World, Disneyland Resort, Universal Studios (FL & Hollywood), SeaWorld, Aulani. **Grouped together** per client direction — one family, not split by brand — since they're browsed the same way and compete for the same trip-planning decision.
2. **Cruise Lines** — Disney Cruise Line, Royal Caribbean.
3. **All-Inclusive Resorts** — resort/beach destinations outside the theme-park and cruise families.

**Client's UX recommendation, adopted:** each family is **one page, broken out by
location within that page** (photo + location name + a short line and a 1–2
sentence blurb, grouped in sections or via in-page anchors) — not a sub-page per
location. This directly avoids the
"sub-pages on sub-pages" pattern that made the ET Family Travel nav feel bloated,
and keeps text minimal per the client's direction. A location within a family links
straight to the Vacation Request Form (pre-filling that destination where possible),
not to a dedicated detail page.

**Image/copy alignment rule (client direction):** every location entry's image must
depict *that specific location* — no generic/stock stand-ins used just to fill a
grid slot. This is enforced as an editorial rule in the CMS field description (see
`destinationFamily.ts`), and should be a checklist item in `qa-agent` review before
a family page ships or gets edited.

### Trust / accreditation bar (elevated per client direction)
Accreditation badges move from a buried footer row to a **dedicated trust bar just
below the hero on the homepage** — Seller of Travel registration numbers
(**FL # ST46356, CA # 2173719-70 — confirmed with client**), plus any
IATAN/ASTA/CLIA or Disney-authorized-agency badges the agency holds. This does
double duty: it reassures travelers *and* signals legitimacy to the prospective-agent
persona evaluating whether to bring their book of business here. The footer keeps a
secondary copy of these badges/numbers (legally required placement), but the bar
is the primary, prominent placement.

```
Home
Destinations              ← flyout: Theme Parks · Cruise Lines · All-Inclusive Resorts
Meet the Team
Plan Your Vacation        → Vacation Request Form
Work With Us
Blog / Trip Inspiration

Footer (secondary/utility nav): Agent Portal · Accreditation badges & Seller of
Travel numbers · Privacy/Terms · Social icons · Newsletter signup
```

Agent Portal is **nested in the footer**, not the primary nav, per client
direction — it's a utility link for existing agents, not a discovery path for the
site's primary audiences (travelers or prospective agents).

---

## 5. Information Architecture — Destination Family Schema

Since itinerary detail pages are explicitly **not in scope**, and the client has
directed that locations be broken out *within* a destination-family page rather
than spun into their own sub-pages, Phase 1 needs only two lightweight document
types — no per-location documents/routes:

```
Destination Family (Sanity document)     ← powers one page + one nav flyout item
 ├─ title                   (e.g., "Disney Parks")
 ├─ slug
 ├─ heroImage               (+ inline `alt` string — warning-level, falls back to title on the frontend)
 ├─ shortDescription         (1–2 sentences, brand-voice copy, kept minimal per client direction)
 ├─ order                    (controls nav/homepage ordering — Disney Parks, Cruise Lines, All-Inclusive)
 └─ locations[]              (array of Location objects, see below — rendered as sections/anchors on the SAME page)

Location (object, not a standalone document/route)
 ├─ name                     (e.g., "Walt Disney World")
 ├─ image                    (+ inline `alt` string — warning-level, falls back to name on the frontend)
 ├─ searchKeywords           (NOT rendered — comma-separated SEO terms, fed into the page's JSON-LD `keywords`; was a visible `shortTag` eyebrow before 2026-09-09, repurposed per client direction that the terms are SEO triggers, not user-facing copy)
 ├─ blurb                    (1–2 sentences on what makes this location distinct — client-requested 2026-09-08; still short, schema max 200 chars)
 └─ ctaOverride               (optional, defaults to "Request a Quote," destination pre-filled)
```

All four image fields (`destinationFamily.heroImage`, `destinationLocation.image`,
`agentProfile.photo`, `accreditationBadge.badgeImage`) carry an inline `alt` string
(added 2026-09-09). It is warning-level, not required, so the images seeded before
this change stay valid; frontend `<SanityImage>` call sites fall back to the sibling
label (`name` / `title`) when `alt` is blank. `badgeImage.alt` is a plain optional
string (the trust bar renders text only today).

Held in reserve for Phase 2 (flagged, not built now): day-by-day timeline, interactive map pins, included/excluded checklists, difficulty rating, packing lists, photo/video galleries, price tiers, downloadable PDF, and standalone per-location pages/routes if the client later wants each location to have its own URL — these were offered as prompt options in discovery but marked "not in scope."

---

## 6. Booking & Inquiry Workflow

- No direct booking or payment on-site (confirmed out of scope).
- Primary conversion action across the entire site is the **Vacation Request Form**.
- On submit: send a formatted email notification to **hello@parksportsandparadise.com** (the business's main inbox, monitored by Paige and Ashley) — no CRM API integration required for MVP, since agents already work inside Vacation Creations independently. There is intentionally no separate general "Contact Us" page/form — all inbound contact is funneled through this one form, per client direction.
- Fire a GA4 **conversion event** on successful submission so the client can track inquiry-to-booking rate over time (their explicit ask under "success 6 months out").

### Vacation Request Form — field spec (from client's existing intake form)
| Field | Type | Required |
|---|---|---|
| First Name / Last Name | text | ✅ |
| Email | email | ✅ |
| Phone | tel | ✅ |
| Where are you wanting to visit? | single/multi-select (WDW, Universal FL, Disneyland, Universal Hollywood, Aulani, Disney Cruise, Royal Caribbean, All-Inclusive, Other) | ✅ |
| Preferred check-in / check-out date | date pickers | — |
| Are your dates flexible? | Yes/No | ✅ |
| Budget (excluding flights) | tiered select (<$2,500 → $7,000+) | ✅ |
| Celebrating anything special? | select (Birthday, Anniversary, Honeymoon, Other) | — |
| Discount eligibility | multi-select (FL/CA resident, Military, Disney+, Chase Visa, AP holder) | — |
| Trip priorities | multi-select (budget, kid-friendly, adults-only, relaxation, luxury, budget-with-splurges) | — |
| Party size + ages under 18 | text/number | ✅ |
| Rooms needed | select (1 / 2–5 / 5+) | — |
| Referral source | text | — |

Build this as a **multi-step form** (React Hook Form + Zod), not one long single-page form — matches the "custom multi-step inquiry form" already scoped in the README and reduces abandonment vs. the wall-of-fields pattern.

### Work With Us — prospective-advisor contact form

Distinct from the inquiry funnel above: different audience (the "Prospective Agent"
persona, §3), a short **single-step** form, and its own API route
(`/api/work-with-us` → same Resend notification helper, `lib/notify.ts`, to
`hello@parksportsandparadise.com`). Schema: `lib/workWithUsSchema.ts`. Per client
direction (2026-09-09) it's framed as a low-key "get in touch" — **not** an
"apply" flow.

| Field | Type | Required |
|---|---|---|
| First Name / Last Name | text | ✅ |
| Email | email | ✅ |
| Phone | tel | — |
| Currently a travel agent? How long / which company? | textarea | ✅ |
| What type of travel do you plan to book? | textarea | — |

**No résumé, no file upload** (confirmed client direction 2026-09-09) — it's a
conversation-starter, not a formal application. The section heading is
"Get in touch", the submit button is "Send message". The page also carries a
short **FAQ** (`<details>` list) covering experience, E&O insurance, culture,
and time-to-first-booking. Per client direction there is **no visible fee /
commission structure** on the page — compensation is covered during onboarding,
and the FAQ uses "onboarding" (not "interview") throughout.

---

## 7. CMS Expectations

- Editor: Ashley, self-described "basic, easy to manage" comfort level → Sanity Studio schema should be **kept intentionally small** for Phase 1 (destination cards, homepage featured content, team/agent bios, blog posts, Instagram feed toggle). Avoid deeply nested or overly flexible page-builder schemas that would overwhelm a non-technical editor.
- Only two access levels needed: **Admin** and generic content editor — no complex role matrix required.
- Instagram feed: pull via oEmbed/Instagram Basic Display or a lightweight third-party embed (e.g., SnapWidget/EmbedSocial) rather than building custom Instagram Graph API integration — cheaper to maintain given no dedicated dev on staff after launch. **Decided 2026-09-09: SnapWidget.** Config lives on a `siteSettings` **singleton** document (added to `sanity/schemaTypes/`, pinned as one editable doc via `sanity.config.ts` structure): `instagramFeedEnabled` (boolean) + `instagramWidgetId` (string). The homepage section renders only when the toggle is on and an ID is set. Keep `siteSettings` flat — it's the home for future cross-site toggles, not a page-builder.
- **Homepage hero (2026-09-09):** also on the `siteSettings` singleton — `heroPoster` (image, inline `alt`) + `heroVideo` (optional `file`, mp4/webm). The homepage renders a full-bleed image/video hero when `heroPoster` is set, otherwise a plain text hero; the muted looping video plays only on desktop-width viewports with `prefers-reduced-motion` not set (`components/hero.tsx` + `components/hero-video.tsx`). Real brand photography is still pending (CLAUDE.md embargo) — the editor drops the asset in via Studio, no deploy.

### "Meet the Team" — must be a self-service collection, not a hardcoded page
Client flagged that agents get added/removed regularly, and doesn't want to depend on developer time for that. This is built as an `agentProfile` document type (see `sanity/schemaTypes/agentProfile.ts`) — adding an agent is "create a document with a name, photo, title, and short bio"; removing one is either deleting the document or toggling `active` off (preferred, so a departed agent's profile isn't lost if they return, and history isn't destroyed). The team page itself queries all `active` agents and renders the grid automatically — the page template is never edited for routine roster changes, only the schema/template if the *shape* of an agent profile changes. Same self-service pattern applies to destination families and accreditation badges (§5, §2) — none of Phase 1's recurring content should require touching code to update.

### Blog / Trip Inspiration — in launch scope (client-confirmed 2026-09-09)

`post` document type (`sanity/schemaTypes/post.ts`), kept flat: `title`, `slug`,
`publishedAt` (datetime — the post is hidden until this time, so migrated posts
get back-dated and future posts schedule themselves), `excerpt`, `author`
(optional byline), `mainImage` (optional, inline `alt`), `body` (Portable Text —
headings/lists/quote/links + inline images with `alt`). No categories, tags, or
related-posts machinery in Phase 1. Routes: `/blog` (index, newest first) and
`/blog/[slug]` (`generateStaticParams` + ISR, `BlogPosting` JSON-LD, `prose`
body via `@portabletext/react`). Nav already carried "Blog / Trip Inspiration".
**Content migration** of the existing Squarespace posts is a hand task for the
client (export → recreate as `post` docs, re-upload images at proper resolution,
back-date `publishedAt`); refresh visuals on posts whose imagery predates the
brand refresh rather than migrating stale branding as-is (§11 #2/#7).

---

## 8. Integration Matrix

| System | Owner | Phase 1 Action |
|---|---|---|
| CRM (Vacation Creations) | Agents individually | No integration — agents work in VC independently. Note for Phase 2: optional lead-forwarding webhook if PPP wants a copy routed automatically. |
| Payments | Vacation Creations (CC auth form) | Not built — out of scope, no on-site payment. |
| Email delivery (form → hello@parksportsandparadise.com) | PPP | Build — transactional email via Resend/SendGrid from the Next.js API route or a Sanity/serverless function. |
| Analytics | New | Build — GA4 property + conversion event on form submit; optionally Meta Pixel if paid social becomes a channel. |
| Instagram feed | New | Build — lightweight embed widget, editor-togglable in CMS. |
| Hosting/Deploy | New | Vercel (per README) — confirm domain DNS cutover plan with client before go-live. |

---

## 9. Phase 1 (MVP) vs. Phase 2 Backlog

**Phase 1 — MVP (launch scope)**
- Homepage: hero, **prominent trust/accreditation bar** (elevated placement, not footer-only — see §4), curated destination-family grid (Theme Parks / Cruise Lines / All-Inclusive Resorts), Instagram feed, testimonials, newsletter signup, single dominant "Request a Quote" CTA repeated throughout.
- Three destination-family pages (Theme Parks / Cruise Lines / All-Inclusive Resorts), each showing its locations broken out on that single page — minimal text, image matched to each specific location (no generic stand-ins), no per-location sub-pages, no per-itinerary detail pages.
- Meet the Team / agent bio page (recruiting + trust asset).
- Work With Us (agent recruiting) page.
- Multi-step Vacation Request Form with email notification + GA4 conversion tracking.
- Blog (basic list + post template) **with full content migration from the current Squarespace blog** (confirmed, §11) — export/re-map existing posts, refresh visuals on any post whose imagery predates the brand refresh (§11 #7) rather than migrating stale branding as-is.
- Domain/DNS cutover plan: build and QA on a Vercel preview URL first, repoint DNS on a scheduled low-traffic window, target well under the client's one-week downtime tolerance (§11 #1).
- **Prerequisite, not a task:** refreshed brand kit (logo files, color values, photography/direction) from the client before Tailwind design tokens and UI component work begin — see `CLAUDE.md`. **Status (2026-09-08):** colour values, type families, and logo files delivered and wired (`BRAND_KIT.md`; tokens in `tailwind.config.ts` / `app/globals.css`, assets in `public/images/logos/` + favicon set). Global layout shell (header/footer/nav) built. Interim placeholder photography direction recorded in `BRAND_KIT.md`; the client's brand photography is still outstanding and the §4 location-image editorial rule still applies — see the embargo note in `CLAUDE.md`.
- Legal/footer: Seller of Travel numbers, privacy, terms.
- SEO basics: JSON-LD, sitemap.xml, metadata — per README.

**Phase 2 — Backlog (explicitly deferred by client)**
- Full itinerary detail pages (day-by-day timeline, interactive map pins, included/excluded checklists, difficulty rating, packing lists, photo/video galleries, price tiers, downloadable PDF).
- Direct booking/payment flow.
- CRM/API integration beyond simple email notification (e.g., automated lead push into an agency CRM if one is adopted).
- Multi-role/editor permission tiers if the team grows beyond Admin + single editor.
- Paid-social pixel/attribution build-out if ad spend starts.

---

## 10. Tech Stack Validation

The stack in the current README is a good fit for these requirements and is **confirmed as-is**:

| Layer | Choice | Why it fits this project |
|---|---|---|
| Framework | Next.js (App Router, TS) | SSR/ISR gives fast, SEO-friendly pages without needing a large dev team to maintain — matches "no dedicated technical staff post-launch." |
| CMS | Sanity.io | Structured content + a Studio UI simple enough for a non-technical editor, as long as the schema stays lean (see §7). |
| Styling/UI | Tailwind + shadcn/ui + Lucide | Fast to build a distinctive, non-template-feeling brand (directly addresses "looks made by someone who doesn't know what they're doing"). |
| Forms | React Hook Form + Zod | Needed for the multi-step, conditionally-validated Vacation Request Form. |
| Hosting | Vercel | Simple CI/CD from the same GitHub repo; no server ops burden. |

One thing that's now resolved rather than open: **stay on Squarespace vs. migrate**, as posed in the original brief. **Client decision: migrate to the custom Next.js + Sanity + Vercel stack**, based on ease of implementation and flexibility — the deciding factors were (1) no platform ceiling on the bespoke, non-template look the client is after, and (2) the "Team" page and other recurring content (destination families, accreditation badges) can be built as true self-service collections in Sanity Studio without requiring developer time for routine add/remove edits — see `agentProfile.ts`. This section's stack table stands as the confirmed build target, not a recommendation.

---

## 11. Open Questions for the Client (before implementation starts)

0. ~~Stay on Squarespace vs. migrate?~~ **Resolved:** migrating to the custom
   Next.js + Sanity + Vercel stack, per client decision based on ease of
   implementation and flexibility. See §10.
1. ~~Domain/DNS cutover plan and timeline — any downtime tolerance?~~
   **Resolved:** client can tolerate **up to one week of downtime, but less is
   preferred.** This gives room for a straightforward cutover (build on Vercel
   preview URL → final QA → repoint DNS → monitor propagation) rather than
   requiring a zero-downtime blue/green setup — but the build should still aim
   to minimize the window (low TTL set in advance, cutover scheduled for a
   low-traffic day/time) since "less is better" was the client's explicit framing.
2. ~~Blog content: migrate existing posts, or launch fresh?~~ **Resolved:**
   **migrate existing posts.** Add a content-migration pass to Phase 1 scope
   (§9) — export existing Squarespace blog content, map to the new blog schema,
   re-upload media at proper resolution. Flag any posts with outdated
   branding/imagery for the client to review given the brand refresh (see #7
   below) rather than migrating stale visuals as-is.
3. ~~Which destinations should be "featured" at launch?~~ **Resolved:** three
   flagship destination families — Theme Parks (Disney + Universal + SeaWorld,
   grouped together per client direction), Cruise Lines (Disney + Royal
   Caribbean), All-Inclusive Resorts — each as a single page with locations broken
   out within it, not individual sub-pages.
4. ~~Should Agent Portal and accreditation badges be primary nav / footer-only?~~
   **Resolved:** Agent Portal nests in the footer as a utility link; accreditation
   badges and Seller of Travel numbers get a prominent dedicated trust bar below
   the hero, with a secondary copy retained in the footer. **Confirmed by client:**
   FL # ST46356, CA # 2173719-70, plus CLIA, IATAN, TL Network Member, and
   Universal Orlando Authorized Retailer — full badge list, no longer open.
5. ~~Instagram account handle + embed tool preference~~ **Resolved:** handle is
   `@parksportsandparadise`. Embed tool decided 2026-09-09: **SnapWidget** (the
   lightweight third-party embed from §7). Wired as a lazy-loaded iframe in
   `components/instagram-feed.tsx`, toggled + configured via the `siteSettings`
   singleton (see §7).
6. ~~Confirm transactional email sender identity~~ **Resolved:** general contact
   is intentionally **not** a separate page/form — it's funneled entirely through
   the Vacation Request Form, per client. Business inbox for form notifications
   and any general "hello@" contact is **hello@parksportsandparadise.com** (not
   individual Paige/Ashley addresses as originally assumed from discovery notes —
   corrected here).
7. ~~Any brand assets in progress?~~ **Resolved:** the team **just completed a
   brand refresh** — logo, photography, and color palette should all be sourced
   fresh from the refreshed brand, not carried over from the current site. This
   is now a **build prerequisite, not a nice-to-have**: Tailwind design tokens
   (color system, type scale) and the `ui-agent`'s work in `CLAUDE.md` are
   blocked until the client delivers the refreshed brand kit (logo files, color
   values/hex codes, brand photography or a photography direction, type
   choices if any were part of the refresh). Recommend requesting this
   materially *before* UI work starts, not in parallel, so components aren't
   built against soon-to-be-wrong colors/type and then reworked. Also apply
   this to the blog migration in #2 — migrated posts should get refreshed
   brand treatment where visuals are outdated, not a like-for-like copy.

All open questions from this discovery round are now resolved. Any new
questions that surface during build go through the normal client-check
process, not into this list retroactively.

---

## 12. Delivery Approach — Claude Code Subagents & Context Hygiene

See `CLAUDE.md` in the repo root for the full subagent breakdown, context-isolation rules, and phase checklist used to keep this build clean as it grows (no single long-running context doing content, design, and implementation all at once).
