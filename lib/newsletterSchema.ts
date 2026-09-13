import { z } from "zod";

/**
 * Single source of truth for the newsletter / freebie-download signup — the
 * footer field and the freebie popup (components/newsletter-form.tsx,
 * components/newsletter-popup.tsx) both validate against this and post to
 * `/api/newsletter`. Deliberately one field: email only, per CLAUDE.md's
 * "keep it flat" rule — no name/preferences fields here.
 */
export const newsletterSignupSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  // Which surface captured the email — distinguishes the footer field from
  // the freebie popup in the stored `newsletterSubscriber` docs. Not shown to
  // the visitor.
  source: z.enum(["footer", "freebie-popup"]),
});

export type NewsletterSignupInput = z.infer<typeof newsletterSignupSchema>;
