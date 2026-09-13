import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./sanity.env";

/**
 * Authenticated, write-capable Sanity client — server-only (API routes under
 * `app/api/*`, never imported by a Client Component). Separate from the
 * read-only CDN client in `lib/sanity.client.ts` on purpose: that one must
 * never carry a token, this one always needs one.
 *
 * `SANITY_API_WRITE_TOKEN` (no `NEXT_PUBLIC_` prefix — server-only) comes from
 * Sanity's manage console → API → Tokens, with "Editor" permissions. See
 * CLIENT_HANDOFF_GUIDE.md for how to create one. Without it, `mutate()` throws;
 * callers should catch that the same way the other forms treat a missing
 * `RESEND_API_KEY` — log the valid submission and keep responding `ok: true`.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
