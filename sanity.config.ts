"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemaTypes";
import {
  apiVersion,
  dataset,
  projectId,
} from "./lib/sanity.env";

/**
 * Sanity Studio configuration, mounted in the Next.js app at /studio
 * (see app/studio/[[...tool]]/page.tsx).
 *
 * Schema types come from ./sanity/schemaTypes/index.ts — that file is the
 * single source of truth for content types and must not be forked here.
 * Per CLAUDE.md, no schema changes without an IMPLEMENTATION_PLAN.md update.
 */
export default defineConfig({
  name: "default",
  title: "Parks Ports & Paradise",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
  },
});
