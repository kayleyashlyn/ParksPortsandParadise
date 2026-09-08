import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./lib/sanity.env";

export default defineCliConfig({
  api: { projectId, dataset },
  /**
   * Studio is embedded in the Next.js app (/studio) and deployed with it on
   * Vercel, so `sanity deploy` (studio hosting) is not part of the pipeline.
   */
  autoUpdates: true,
});
