/**
 * Embedded Sanity Studio route — https://<site>/studio
 * All Studio UI is client-rendered; this catch-all route just mounts it.
 */
import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
