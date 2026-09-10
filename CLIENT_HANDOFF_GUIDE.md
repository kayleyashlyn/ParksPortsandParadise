# Parks Ports & Paradise — Client Handoff & Operations Guide

**Audience:** Paige, Ashley, and anyone at the agency who will run the site day to day.
**Purpose:** one place that explains how the new site is put together, every account
and sign-in involved, how to do the common jobs (edit content, check leads, read
analytics), and what to do when something looks wrong.

> **This is a living document.** It is updated as each part of the site is built.
> Sections marked 🟡 or ⬜ are not finished yet — they are here so nothing is a
> surprise at handoff. See the **Change log** at the bottom for what moved recently.

**Status legend:** ✅ done & live · 🟡 built, waiting on a client action · ⬜ not started

---

## 1. How the site is put together (plain-language overview)

The old site was Squarespace — one tool that did hosting, content, and design together.
The new site splits those jobs across a few specialised services that each do one thing
well. You do **not** need to understand the code. You mainly touch **one** of them
(Sanity, for content). The rest run themselves once set up.

| Piece | What it does | Do you touch it? |
|---|---|---|
| **Sanity Studio** | Where you edit words and images on the site (destinations, team, badges, settings) | **Yes — this is your main tool** |
| **Vercel** | Hosts the site and publishes updates automatically | Rarely — mostly just to check a deploy |
| **Domain / DNS** | Points `parksportsandparadise.com` at the new host | Once, at launch |
| **Google Workspace** | Your `hello@` email inbox (unchanged) | As you do today |
| **Resend** | Sends the site a notification email every time someone submits the Vacation Request Form | No — set up once |
| **Google Analytics 4** | Traffic and inquiry-conversion reporting | Read-only, when you want numbers |
| **SnapWidget** | The Instagram feed embedded on the homepage | Only if you change which account/layout shows |

---

## 2. Accounts & sign-ins (master list)

> Fill the "Login owner" column at handoff. Keep this table current — it is the
> single source of truth for "who can get into what."

| Service | Sign-in URL | Login owner | Used for | Status |
|---|---|---|---|---|
| Sanity | `https://parksportsandparadise.com/studio` (or `sanity.io/manage`) | `[TBD]` | Editing site content | 🟡 project exists (`kuk7exxj`), CORS + roles to finalise |
| Vercel | `https://vercel.com` | `[TBD]` | Hosting, deploys, environment variables | 🟡 |
| Domain registrar | `[registrar — currently Squarespace/Google Domains?]` | `[TBD]` | DNS records, nameservers | ⬜ cutover not scheduled |
| Google Workspace admin | `https://admin.google.com` | `[TBD]` | `hello@` mailbox, DNS for email (MX/SPF/DKIM/DMARC) | ✅ in use today |
| Resend | `https://resend.com` | `[TBD]` | Form-notification email delivery | ⬜ account not created |
| Google Analytics 4 | `https://analytics.google.com` | `[TBD]` | Site analytics (property "Parks Ports and Paradise") | 🟡 property + stream created, not yet receiving prod data |
| SnapWidget | `https://snapwidget.com` | `[TBD]` | Homepage Instagram embed | ⬜ account not created |
| GitHub | `https://github.com/kayleyashlyn/ParksPortsandParadise` | Developer | Source code, deploy trigger | ✅ (developer-managed) |

**Recommendation:** create a shared password manager vault (1Password / Bitwarden)
for the agency and store every login above in it, rather than in a spreadsheet or
browser. Give at least two people access so no account is locked to one person.

---

## 3. Sanity Studio — editing site content ✅ (usable now) / 🟡 (final setup pending)

### 3.1 Signing in
1. Go to **`https://parksportsandparadise.com/studio`** (before launch: the Vercel
   preview URL + `/studio`, or `http://localhost:3000/studio` in dev).
2. Sign in with the method attached to your Sanity account (Google, GitHub, or
   email). Your developer sends the invite from the Sanity project.
3. First time only: you may see a CORS / "not allowed" error if the address you're
   using hasn't been whitelisted yet — tell your developer which URL you're on.

### 3.2 What you can edit
The content models are deliberately small and flat — there is no drag-and-drop
page builder (that was a conscious decision so the site can't drift off-brand).

| Model | What it controls | Notes |
|---|---|---|
| **Destination Family** | The three destination pages: Theme Parks, Cruise Lines, All-Inclusive Resorts | Each has a hero image, short description, display order, and a list of **Locations** shown as sections on that one page. Locations never become their own pages. |
| **Location** (inside a Destination Family) | One entry on a destination page — name, image, blurb, optional button label | **Search keywords** field is **not shown on the page** — it feeds behind-the-scenes SEO data only. |
| **Agent** | The "Meet the Team" grid | Name, photo, title, short bio, specialties, plus separate **Location**, **Contact email**, and **Instagram handle** fields — put contact info in those, not in the bio (the card turns them into a pin, an email link, and an Instagram link). Instagram handle is just the username (e.g. `alyssaatthecastle`). Set **Active** off (don't delete) when someone leaves — keeps their history. Display order optional. |
| **Blog Post** | The `/blog` ("Trip Inspiration") index and each post page | Title, slug, **Published at** (the post is hidden until this date — back-date migrated posts, or set a future date to schedule), excerpt, optional byline, optional main image, and a rich-text body. The index stays on an "empty" message until at least one post is published. |
| **Accreditation Badge** | The trust bar (Seller of Travel numbers, CLIA, IATAN, etc.) | Text-only unless you upload official logo art. |
| **Site Settings** (single document) | Site-wide bits: the **Homepage hero** (image + optional background video) and the **Instagram feed** (on/off + SnapWidget ID) | There is only ever **one** of these; you can't create or delete it. Set the hero image under "Homepage hero" — until you do, the homepage shows a plain text headline. The optional hero video auto-plays muted on desktop only (phones and reduced-motion visitors see just the image); keep it a few seconds and well under ~5 MB. |

### 3.3 Images — always add "Alt text"
Every image field now has an **Alt text** box under it. Write a short, literal
description ("Cinderella Castle at Walt Disney World at dusk"). It matters for
accessibility and search. Studio will show a **warning** (not an error) if you
leave it blank — the site falls back to the location/person's name, but real alt
text is better. Please backfill alt text on the images already loaded.

### 3.4 Publishing
- Edits are **drafts** until you click **Publish**. Nothing is live until then.
- The website picks up published changes within about a minute (it re-checks on a
  short timer). A hard refresh after a minute or two will show your change.
- **Site Settings** and other single-document types only show **Publish / Discard
  changes / Restore** — no delete, by design.

### 3.5 Common Sanity issues
| Symptom | Likely cause | Fix |
|---|---|---|
| Can't log in / "origin not allowed" | The URL you're on isn't whitelisted in Sanity CORS | Send your developer the exact address; they add it |
| Published a change, site still old | Cache timer hasn't elapsed | Wait ~1–2 min, hard refresh (Cmd/Ctrl+Shift+R) |
| Image looks cropped oddly | Hotspot/crop not set | Open the image, drag the hotspot circle to the important part |
| A destination page says "guide coming soon" | That family has no Locations yet | Add at least one Location and publish |

---

## 4. Vercel — hosting & deploys 🟡

- **What it is:** the service that runs the website and re-publishes it whenever
  the developer pushes a code change (usually within ~1–2 minutes, automatically).
- **You generally don't need to log in.** When you do: `vercel.com` → the
  `parksportsandparadise` project → **Deployments** shows every publish and
  whether it succeeded.
- **Environment variables** (API keys, IDs) live under **Project → Settings →
  Environment Variables**, split into **Production** / **Preview** / **Development**.
  Analytics and form email are deliberately turned **on only in Production** so
  test traffic doesn't pollute real data or send real emails.
- **Rolling back:** any previous successful deployment can be promoted back to
  production from the Deployments list ("Promote to Production") — useful if a
  change causes a problem.

---

## 5. Domain & DNS — the Squarespace cutover ⬜

**Approach (client decision, 2026-09-10): the launch is a fresh start on Vercel.**
The domain and its DNS management move to Vercel at cutover. We are **not** editing
the current Squarespace/Google DNS in the run-up — any new records (e.g. Resend
email verification) wait and get added in Vercel's DNS panel after the move.

Current state (2026-09-10): DNS zone is at Google Domains / Squarespace
(nameservers `ns-cloud-b*.googledomains.com`); the live site is still Squarespace
(`198.49.23.144`); email is Google Workspace; Vercel has no domain attached yet.

Cutover sequence (detailed steps to be written when it's scheduled):

1. Add `parksportsandparadise.com` to the Vercel project; point the domain's
   nameservers (or an `A` / `CNAME`) at Vercel per Vercel's instructions.
2. **Re-create the Google Workspace email records in Vercel DNS first** — MX,
   SPF, DKIM, DMARC — so `hello@` keeps flowing without a gap. Email is the
   thing most likely to break in a nameserver move; do it before/with the
   website switch, not after.
3. Add Resend's sending-domain records (SPF/DKIM/DMARC for the verified domain
   or `send.` subdomain) in Vercel DNS, then click **Verify** in Resend.
4. Set the Vercel env vars (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`).
5. Plan for a short window where the site/email may be intermittent as DNS
   propagates (minutes to a few hours). Schedule it for a low-traffic time.

---

## 6. Email — how form submissions reach you 🟡

Two separate things, often confused:

1. **Your inbox — Google Workspace (unchanged).** `hello@parksportsandparadise.com`
   is still your normal mailbox. Nothing about how you read email changes.
2. **Resend — the site's outbound sender.** When someone submits the Vacation
   Request Form, the site asks Resend to email a formatted summary of that
   submission **to** `hello@parksportsandparadise.com`. The reply-to is set to the
   person who filled the form, so you can just hit Reply.

### Setup still required (developer + client)
- [ ] Create a Resend account; generate an API key; developer adds it to Vercel
      (Production).
- [ ] Verify a sending domain in Resend (likely `send.parksportsandparadise.com`)
      — this adds a few DNS records. **Deferred until the Vercel cutover** (see
      §5): the records go in Vercel's DNS panel once the domain is on Vercel,
      not in the current Squarespace/Google zone. The SPF/DKIM/DMARC values from
      Resend are in hand; nothing to do with them until then.
      Until this is done, the form still works and still validates, it just
      doesn't send the notification.
- [ ] Decide the "from" address (default proposed: `no-reply@parksportsandparadise.com`).

### If form emails stop arriving
| Check | How |
|---|---|
| Is the key set? | Vercel → Settings → Environment Variables → `RESEND_API_KEY` present in Production |
| Is the domain still verified? | Resend dashboard → Domains → should be green |
| Are they going to spam? | Search the `hello@` mailbox for the sender; add to safe senders |
| Did the submission actually happen? | Google Analytics → Realtime, look for a `generate_lead` event around that time |

---

## 7. Google Analytics 4 🟡

- **Property:** "Parks Ports and Paradise" · **Measurement ID:** `G-31KW1BQLNR` ·
  **Stream ID:** `15748056048`.
- **How it's installed:** directly in the site code (via a standard Google tag).
  It is **not** through Google Tag Manager — there is nothing to manage in a GTM
  container.
- **It only runs in Production**, and only once the developer sets the Measurement
  ID in Vercel. Preview/dev visits are not counted.
- **Analytics is opt-in.** Visitors see a small cookie banner; GA4 loads **only**
  if they press "Accept." Declining, ignoring it, or sending a browser
  "Global Privacy Control" signal means no analytics loads at all — so your
  numbers reflect visitors who accepted, not total traffic. Visitors can change
  their choice any time via the **"Cookie settings"** link in the site footer.
- **The key number for you:** a **`generate_lead`** event fires each time the
  Vacation Request Form is submitted *and the notification email is confirmed
  sent*. This is your inquiry count. In GA4 Admin it should be marked as a
  **key event** so it shows up in conversion reports. (Note: a `generate_lead`
  only reaches GA4 if that visitor accepted analytics cookies.)

### Remaining setup
- [ ] Developer sets `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in Vercel Production.
- [ ] In GA4 Admin → Events, mark `generate_lead` as a **key event**.
- [x] Cookie-consent banner — **built** (opt-in, GPC-aware, "Cookie settings" in
      the footer to change the choice). The Privacy Policy §6 describes it.
      Remaining wording to confirm with counsel at legal review: none specific —
      §6 now reads as final pending the overall legal pass.

### Reading it
`analytics.google.com` → **Reports → Realtime** for live activity;
**Reports → Engagement → Events** for `generate_lead` counts over time;
**Acquisition** for where visitors come from.

---

## 8. Instagram feed — SnapWidget ⬜

- **What it is:** a small embedded widget that shows your latest Instagram posts on
  the homepage. Third-party, so it can be turned off entirely from Site Settings.
- **Setup:**
  1. Create a SnapWidget account, connect the `@parksportsandparadise` Instagram.
  2. Build a widget (grid layout recommended), copy its **Widget ID**.
  3. In Sanity → **Site Settings**, paste the ID into **Instagram Widget ID** and
     turn **Instagram feed enabled** on. Publish.
- **To hide it:** Site Settings → toggle **Instagram feed enabled** off → Publish.
- **Known limitation:** free SnapWidgets show a small "SnapWidget" mark; a paid
  plan removes it. Not required for launch.
- Also pending: a site security-header rule must allow the SnapWidget frame — a
  developer task, tracked in `TODO.md`.

---

## 9. Forms — how submissions reach you

Two forms, both emailing the same inbox (`hello@`) through Resend (Section 6):

**Vacation Request Form** (`/plan-your-vacation`) — the traveller lead path.

- It's the **only** customer contact path — there is deliberately no separate
  "Contact Us" form, and no booking or payment happens on the site.
- 5-step form. On submit: validates, emails you the summary, records a
  `generate_lead` analytics event (Section 7).
- Every "Request a Quote" button leads here, some pre-filling the destination.

**Work With Us — "Get in touch"** (`/work-with-us`) — the recruiting path.

- A short **contact form** for prospective advisors (name, email, phone,
  travel-agent experience, what they plan to book) — framed as a
  conversation-starter, **not** a formal application, and **no résumé**. On
  submit it emails you a summary subject-lined "New Work With Us message —
  {name}," reply-to the sender.
- The page has a short FAQ (experience, E&O, culture, time to first booking).
  Per your direction there is **no fee or commission information** on the page —
  compensation is covered during onboarding. The FAQ uses "onboarding," not
  "interview."

**Spam:** both forms have a hidden field that traps bots; those submissions are
silently dropped and never emailed.

---

## 10. Legal pages — `/privacy` and `/terms` 🟡 DRAFT

- Both pages exist and are linked in the footer, but currently show a **"Draft —
  pending legal review"** banner and contain `[BRACKETED]` placeholders.
- **Before launch:** a travel-industry / privacy attorney must review both,
  fill every placeholder (legal entity name, mailing address, phone, effective
  dates, data-retention periods, governing-law state, whether the agency charges
  planning fees, cookie-consent wording), then the developer removes the draft
  banner and sets the dates.
- Nothing about these pages should be treated as legal advice as-is.

---

## 11. Troubleshooting quick reference

| Something looks wrong | First thing to check |
|---|---|
| A content change isn't showing | Did you click **Publish** in Sanity? Then wait ~1–2 min and hard-refresh. |
| Whole site is down | Vercel → Deployments — is the latest one failed? Promote the last good one to Production. |
| Form notification emails stopped | Section 6 table (key set? domain verified? spam folder?). |
| Analytics shows no data | Is `NEXT_PUBLIC_GA4_MEASUREMENT_ID` set in Vercel Production? Data also has a 24–48h lag in standard reports (Realtime is instant). |
| Instagram feed is blank | Site Settings → is it enabled and is the Widget ID correct? Is the Instagram account still connected in SnapWidget? |
| Can't log into Studio | The URL you're on may not be whitelisted — send it to your developer. |
| Someone left the team | Sanity → that Agent → **Active** off → Publish. Don't delete. |

**Who to contact:** `[developer name + email]` for anything code/deploy/DNS.
Keep this line current.

---

## 12. Pre-launch checklist (summary — full technical list in `TODO.md`)

- [ ] Sanity: add Vercel preview + production URLs to CORS; confirm editor
      account(s) invited with the right role.
- [ ] Sanity: backfill **Alt text** on all existing images; re-enter the two
      location "search keywords" values that were migrated.
- [ ] Sanity: populate **Locations** on each Destination Family (they show "coming
      soon" until then); swap interim photography for the client's real brand
      photos.
- [ ] Sanity: on each **Agent**, move the location / email / Instagram out of the
      bio text into the new **Location**, **Contact email**, and **Instagram
      handle** fields; trim the bio to just the short blurb.
- [ ] Resend: account + API key + verified sending domain (DNS).
- [ ] GA4: Measurement ID set in Vercel Production; `generate_lead` marked as key
      event. (Cookie-consent banner is built — opt-in, GPC-aware.)
- [ ] SnapWidget: account created, widget built, ID entered in Site Settings
      (or feed left disabled for launch).
- [ ] Homepage hero: upload a hero **image** (and optionally a short muted loop
      **video**, well under ~5 MB) in Site Settings → Homepage hero. Until then
      the homepage shows a plain text headline.
- [ ] Legal: `/privacy` + `/terms` reviewed by counsel, placeholders filled,
      draft banner removed.
- [ ] Domain: website DNS pointed at Vercel; email (MX/SPF/DKIM/DMARC) left
      intact; done at a low-traffic time.
- [x] Security headers — baseline set + Content-Security-Policy are live and
      enforced (verified against the deployed site). If anything on the site ever
      fails to load after a future change, check the browser console for a
      "Content Security Policy" error and send it to your developer.
- [ ] Default social-share (OG) image supplied and set.
- [ ] Favicon — supply a transparent square PNG/SVG of just the gold sparkle
      mark (the full seal is unreadable at tab size). Also: a horizontal logo
      lockup (mark + wordmark) would improve the site header — right now the
      header falls back to a text wordmark on mobile.
- [x] `/work-with-us` — built; copy finalised (low-key "Get in touch" contact
      form, no résumé, no fee info, "onboarding" terminology).
- [ ] `/blog` — **in scope for launch.** Pages + "Blog Post" model built. Still
      needs: the existing Squarespace posts recreated in Studio (back-date each
      one's **Published at**) and at least one published before launch, or hide
      "Blog" from the nav for day one.

---

## Change log

| Date | Change |
|---|---|
| 2026-09-09 | Guide created. Seeded from current build state: Sanity content models (incl. new per-image Alt text + hidden Search keywords), Vercel hosting, Resend form email, GA4 (`G-31KW1BQLNR`), SnapWidget plan, draft legal pages. |
| 2026-09-09 | §7 — analytics is now **opt-in** behind a cookie-consent banner (GPC-aware; "Cookie settings" link in the footer). Privacy Policy §6 rewritten from placeholders to final-pending-legal wording. |
| 2026-09-09 | §9 — `/work-with-us` recruiting page + application form built (second Resend-backed form → `hello@`; résumé by email, no upload). Copy finalised per client: no fee/commission info on the page, "onboarding" terminology. |
| 2026-09-09 | §3 — added the **Blog Post** content model + `/blog` + `/blog/[slug]` pages. Migration of the existing Squarespace posts is a client content task. |
| 2026-09-09 | Security headers added in `next.config.mjs` (HSTS, nosniff, frame options, Referrer-Policy, Permissions-Policy). CSP is report-only pending a check against the deployed Studio / forms / Instagram embed, then it gets enforced. |
| 2026-09-09 | CSP now **enforced** — verified against the deployed site (no violations; the Studio WebSocket error there was a Sanity CORS gap, fixed separately). Split into a strict policy for the public site and a looser one for `/studio`. |
| 2026-09-09 | UI polish from client review (header wordmark on mobile, form Back button on every step, smaller Instagram section, no card-image zoom on touch). Added a pre-launch item: supply a transparent sparkle favicon + a horizontal logo lockup asset. |
| 2026-09-09 | Work With Us reframed as a low-key "Get in touch" contact form per client — dropped the "Apply" heading and all résumé asks; submit button now "Send message"; notification subject "New Work With Us message — {name}". |
| 2026-09-09 | Homepage hero is now CMS-driven — set a hero **image** (and an optional short **video**) under Site Settings → Homepage hero. Plain text headline until an image is set. Video auto-plays muted on desktop only. |
| 2026-09-10 | §5 — cutover approach confirmed: **fresh start on Vercel**, DNS management moves to Vercel at launch, current Squarespace/Google DNS left untouched until then. Documented the cutover sequence (email records first). §6 — Resend sending-domain DNS records are **deferred to the cutover** and added in Vercel's DNS panel; values are in hand. |
| 2026-09-10 | §3 — **Agent** model gained **Location**, **Contact email**, and **Instagram handle** fields. Contact info goes in these (rendered as a pin / `mailto:` link / Instagram link on the team card), not in the bio. One-time content task added to move existing agents' details out of their bios. |
