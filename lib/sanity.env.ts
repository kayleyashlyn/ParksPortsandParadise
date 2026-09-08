/**
 * Centralized Sanity environment access. Values are supplied via env vars
 * (see .env.example). Falls back to a harmless placeholder projectId so the
 * scaffold builds before a real Sanity project is provisioned — replace by
 * setting NEXT_PUBLIC_SANITY_PROJECT_ID in the environment.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-08";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
