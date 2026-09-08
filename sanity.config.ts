"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemaTypes";
import { dataset, projectId } from "./lib/sanity.env";

/**
 * Sanity Studio configuration, mounted in the Next.js app at /studio
 * (see app/studio/[[...tool]]/page.tsx).
 *
 * - Schema types come from ./sanity/schemaTypes/index.ts — the single source of
 *   truth for content types; do not fork the list here. Per CLAUDE.md, no
 *   schema changes without an IMPLEMENTATION_PLAN.md update.
 * - projectId / dataset are read from NEXT_PUBLIC_SANITY_* via ./lib/sanity.env,
 *   never hardcoded.
 * - Only structureTool is loaded — that is what renders the document list and
 *   editor so the three content types are visible and creatable. No Vision or
 *   other tooling (kept minimal).
 */
export default defineConfig({
  name: "default",
  title: "Parks Ports & Paradise",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
