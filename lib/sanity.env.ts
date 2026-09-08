/**
 * Centralized Sanity environment access. Values come from env vars (see
 * .env.example). `projectId` falls back to a placeholder so the scaffold builds
 * before a real Sanity project is provisioned — set NEXT_PUBLIC_SANITY_PROJECT_ID
 * to use live content. TODO.md tracks tightening this (fail loud in prod).
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-08";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
