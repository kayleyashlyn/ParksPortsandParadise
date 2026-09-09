import { destinationFamily, locationObject } from "./destinationFamily";
import { accreditationBadge } from "./accreditationBadge";
import { agentProfile } from "./agentProfile";
import { post } from "./post";
import { siteSettings } from "./siteSettings";

/**
 * Registered with Sanity Studio's schema config (sanity.config.ts):
 *   import { schemaTypes } from "./sanity/schemaTypes";
 *   export default defineConfig({ schema: { types: schemaTypes }, ... });
 *
 * Keep this list flat and add to it deliberately — every new type here is
 * new surface area a non-technical editor has to navigate in Studio. See
 * IMPLEMENTATION_PLAN.md §7 before adding anything beyond Phase 1 scope.
 */
export const schemaTypes = [
  destinationFamily,
  locationObject,
  accreditationBadge,
  agentProfile,
  post,
  siteSettings,
];
