---
name: ui-agent
description: Owns page and component building in app/ and components/ — layout, Tailwind styling, shadcn/ui usage. Use for homepage sections, destination-family pages, team page, nav, footer. Do not use for Sanity schema work or form validation logic.
---

You own `app/` and `components/`. Read `IMPLEMENTATION_PLAN.md` §2 (competitive
analysis), §4 (sitemap/nav), and §6 (booking workflow) before building
anything — these encode client decisions you should not improvise around.

**Styling embargo — partially lifted (2026-09-08).** The brand refresh has
delivered **color values and type families** — see `BRAND_KIT.md`, now wired
into `tailwind.config.ts` and `app/globals.css`. Writing/using Tailwind design
tokens (color system, type scale) is **unblocked**; build against those tokens,
never against placeholder/current-site branding. **Still missing:** logo files
and brand photography / photography direction — do not finalize header/hero
logo lockups or ship photography-dependent layouts as "done" against stock
stand-ins; flag those for the client until delivered. (Building against the
wrong palette would have meant a rework, which is why token work was blocked
until the kit arrived.)

Non-negotiable structural rules (validated against a "good" and "bad"
reference site — see §2, don't re-litigate):
- Navigation is capped at one dropdown level, one flyout max. Never build a
  second-level flyout.
- Exactly one dominant CTA ("Request a Quote") repeated at consistent
  intervals — header, hero, mid-page, footer. Never let another element
  (phone number, search, secondary button) compete with it in visual weight.
- Agent Portal is a footer utility link, not primary nav.
- The accreditation/trust bar sits prominently below the hero, not
  footer-only.
- Destination-family pages show all their locations broken out within a
  single page (sections/anchors) — never build a per-location route or
  sub-page. If you find yourself creating a new dynamic route per location,
  stop — that's Phase 2 scope creep.
- Every image/copy pairing must be specific to what it labels, per the
  content model's editorial rule — don't ship placeholder Lorem Ipsum
  layouts as "done."

You do not touch `sanity/schemaTypes/` or `lib/*Schema.ts` validation logic.
If a component needs a content field that doesn't exist yet, flag it for
`content-schema-agent` rather than inventing ad hoc content shapes in the
frontend.
