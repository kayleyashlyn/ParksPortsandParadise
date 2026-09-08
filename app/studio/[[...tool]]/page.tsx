/**
 * Embedded Sanity Studio. Serves the Studio UI at /studio using the config at
 * the repo root (sanity.config.ts), which pulls its schema from
 * sanity/schemaTypes/index.ts.
 */
import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
