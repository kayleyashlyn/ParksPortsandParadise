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
 *   editor. `Site Settings` is pinned as a singleton (one fixed document); every
 *   other type keeps the default create-many list. No Vision or other tooling.
 */
const SINGLETON_TYPES = new Set(["siteSettings"]);

export default defineConfig({
  name: "default",
  title: "Parks Ports & Paradise",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Day-to-day content first, singleton settings below the divider.
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETON_TYPES.has(item.getId() ?? ""),
            ),
            S.divider(),
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
          ]),
    }),
  ],
  // Hide "create" / "duplicate" / "delete" for the singleton.
  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : input,
  },
  schema: {
    types: schemaTypes,
  },
});
