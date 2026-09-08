import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./sanity.env";

/**
 * Read-only content client for the public site. Studio uses its own client
 * from sanity.config.ts — do not reuse this one for authenticated writes.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
