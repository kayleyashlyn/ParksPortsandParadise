"use client";

/**
 * Sanity Studio config — mounted at /studio inside the Next.js app.
 * Keep `schema.types` sourced from ./sanity/schemaTypes (flat list, Phase 1
 * scope only — see IMPLEMENTATION_PLAN.md §7 before adding types).
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
