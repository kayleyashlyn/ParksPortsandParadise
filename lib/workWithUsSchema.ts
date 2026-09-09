import { z } from "zod";

/**
 * Work With Us — agent-recruiting application form (IMPLEMENTATION_PLAN.md §9).
 * Distinct from the Vacation Request Form: different audience (prospective
 * advisors, not travellers) and a much shorter, single-step form.
 *
 * Fields mirror the agency's current intake, minus the résumé file upload —
 * applicants are asked to email their résumé to hello@ instead, so the site
 * needs no file-storage integration. (Résumé upload is a possible follow-up —
 * see TODO.md.)
 *
 * This schema is the single source of truth for the form's fields; keep it in
 * step with `components/work-with-us-form.tsx` and the plan.
 */
export const workWithUsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  /** "Are you currently a travel agent? If so, how long and which company?" */
  experience: z
    .string()
    .min(1, "Let us know about your travel-agent experience")
    .max(1000),
  /** "What type of travel do you plan to book?" — optional free text. */
  travelFocus: z.string().max(1000).optional(),
});

export type WorkWithUsInput = z.infer<typeof workWithUsSchema>;
