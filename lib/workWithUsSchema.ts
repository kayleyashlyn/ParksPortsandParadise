import { z } from "zod";

/**
 * Work With Us — a lightweight "get in touch" contact form for prospective
 * advisors (IMPLEMENTATION_PLAN.md §9). Distinct from the Vacation Request
 * Form: different audience (prospective advisors, not travellers), a much
 * shorter single-step form, and framed as a conversation-starter — **no
 * résumé, no file upload** (confirmed client direction 2026-09-09).
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
