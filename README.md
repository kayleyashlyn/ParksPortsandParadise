# Parks Ports and Paradise

A modern, high-performance web platform replacing the client's current Squarespace
site — **client-confirmed migration** (decided for ease of implementation and
design flexibility over staying on Squarespace; see `IMPLEMENTATION_PLAN.md` §10
for the comparison that informed the call). Built for fast page loads, a curated
destination showcase, and a high-converting inquiry (not booking) form.

## 📋 Scope at a glance

- **Inquiry-only site.** No direct booking or payment — every path leads to the
  Vacation Request Form. See implementation plan §6 for the full field spec.
- **Curated, not exhaustive, destination browsing.** Category landing pages
  (Theme Parks / Cruises / All-Inclusive & Beyond) with large photography — full
  per-itinerary detail pages are Phase 2, not MVP.
- **One-level navigation, one dominant CTA.** A hard brand constraint validated
  against a "good" and "bad" reference site — see implementation plan §2.
- **Non-technical primary editor.** Sanity schemas are intentionally kept small.

Full Phase 1 vs. Phase 2 breakdown: `IMPLEMENTATION_PLAN.md` §9.

## 🚀 Key Features
- **Curated Destination Showcase:** Powered by Sanity.io Headless CMS, kept to a
  lean, editor-friendly schema (destination category pages, not a full itinerary CMS).
- **Multi-Step Vacation Request Form:** React Hook Form + Zod, matching the
  client's existing intake-form fields exactly, emailing submissions to the
  business's main inbox and firing a GA4 conversion event.
- **Rich Media:** High-resolution optimized image delivery; a togglable Instagram
  feed embed on the homepage.
- **Travel SEO:** Automated JSON-LD (`Trip`/`TouristAttraction`), dynamic XML
  sitemaps, and optimized metadata.
- **Performance:** Next.js App Router with SSR + ISR.

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router, TypeScript)
- **CMS:** Sanity.io
- **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide Icons
- **Forms & Validation:** React Hook Form, Zod
- **Email (form notifications):** Resend (or SendGrid — TBD, see integration matrix)
- **Analytics:** Google Analytics 4 (new — not previously in place)
- **Deployment:** Vercel

## 📁 Project Structure
```
app/                    Next.js App Router pages & layouts
components/             Reusable UI (shadcn-based)
sanity/
  schemaTypes/          destinationFamily (Theme Parks / Cruise Lines / All-Inclusive),
                         accreditationBadge (trust bar), homepage, team/agent, blog post schemas
lib/                    Zod schemas, form-submission + email utilities
public/                 Static assets
IMPLEMENTATION_PLAN.md  Full functional spec, personas, sitemap, integration matrix
CLAUDE.md               Subagent roles & context-hygiene rules for Claude Code
BACKLOG.md              Phase 2 items logged during Phase 1 work
```

## Getting Started
```bash
npm install
cp .env.example .env.local   # fill in Sanity project ID, email API key, GA4 ID
npm run dev
```

## Documentation
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — discovery findings,
  personas, sitemap/IA, integration matrix, Phase 1/2 scope.
- [`CLAUDE.md`](./CLAUDE.md) — how work is split across Claude Code subagents to
  keep context clean and avoid scope creep as the build grows.
