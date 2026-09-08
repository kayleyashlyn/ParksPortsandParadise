# CLAUDE.md — Build Instructions for This Repo

This file is read automatically by Claude Code at the start of every session in this
repo. It exists so that implementation work stays consistent and clean across many
sessions and multiple contributors (human or agent), instead of degrading as context
fills up over a long build.

Full requirements live in `IMPLEMENTATION_PLAN.md` — read that first for *what* to
build. This file is about *how* to build it without losing quality as the codebase grows.

## Project facts an agent should never re-derive from scratch
- Stack: Next.js (App Router, TS), Sanity.io, Tailwind + shadcn/ui, React Hook Form + Zod, Vercel.
- **Platform decision is final:** migrating off Squarespace (client-confirmed, IMPLEMENTATION_PLAN.md §10). Don't re-litigate or hedge on this.
- **Hard blocker for `ui-agent`:** the client just completed a brand refresh. Do not start Tailwind design-token work (colors, type scale) or build UI components against placeholder/current-site branding until the refreshed brand kit (logo files, color values, photography/direction) has actually been delivered — building against the old brand means a rework, not a head start. Confirm the kit is in hand before this subagent's first commit.
- No direct booking/payment on-site — every conversion path ends at the Vacation
  Request Form, not a checkout.
- CMS editor is non-technical — keep Sanity schemas flat and few. Do not introduce
  a page-builder pattern without explicit sign-off; it will not get adopted by the client.
- Nav is capped at one dropdown level, one dominant CTA ("Request a Quote") repeated
  across the page — this is a hard brand constraint, not a style preference (see
  competitive analysis in the implementation plan for why).
- Itinerary detail pages, direct booking, and CRM API integration are Phase 2 —
  do not build them "while you're in there" even if it looks easy.

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
5. **No schema or nav changes without updating the implementation plan.** The plan
   is the source of truth; code and docs should never silently diverge.

## Definition of done (per feature)
- Matches the field/behavior spec in `IMPLEMENTATION_PLAN.md` exactly — no
  unrequested extra fields or pages.
- Passes `qa-agent` review against the nav/CTA brand constraints above.
- Lighthouse/perf and basic a11y check before merge (fast pages were a stated
  business goal, not just a tech preference).
