import { z } from "zod";

/**
 * Field-for-field match of the client's existing intake form
 * (see IMPLEMENTATION_PLAN.md §6). Do not add/remove/rename fields without
 * updating the implementation plan in the same change — they must never drift.
 *
 * The option lists are exported so the form UI iterates them instead of
 * re-typing the strings (a second source of truth that would drift).
 */

export const DESTINATION_OPTIONS = [
  "Walt Disney World Resort, FL",
  "Universal Studios, FL",
  "Disneyland Resorts, CA",
  "Universal Studios Hollywood, CA",
  "Aulani, Hawaii",
  "Disney Cruise Line",
  "Royal Caribbean Cruise Line",
  "All-Inclusive Resort",
  "Other",
] as const;

export const DATES_FLEXIBLE_OPTIONS = ["Yes", "No"] as const;

export const BUDGET_OPTIONS = [
  "<$2,500",
  "$2,500 - $3,500",
  "$3,500 - $5,000",
  "$5,000 - $7,000",
  "$7,000+",
] as const;

export const CELEBRATING_OPTIONS = [
  "Birthday",
  "Anniversary",
  "Honeymoon",
  "Other",
] as const;

export const DISCOUNT_OPTIONS = [
  "FL Resident",
  "CA Resident",
  "Military",
  "Disney+ Subscriber",
  "Disney Chase Visa cardholder",
  "Annual Passholder",
] as const;

export const PRIORITY_OPTIONS = [
  "Sticking to a budget",
  "Kid friendly",
  "Adult focused/adults only",
  "Relaxation/resort time",
  "Luxury experience with luxury amenities",
  "Budget friendly with a few splurges",
] as const;

export const ROOMS_OPTIONS = ["1", "2-5", "5+"] as const;

/**
 * An optional single-select. React Hook Form reports an untouched radio group
 * as `null` (and a cleared native select as `""`); coerce both to `undefined`
 * so the field stays genuinely optional.
 */
function optionalEnum<const T extends readonly [string, ...string[]]>(values: T) {
  return z.preprocess(
    (v) => (v === null || v === "" ? undefined : v),
    z.enum(values).optional(),
  );
}

export const vacationRequestSchema = z.object({
  // Step 1 — Contact info
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),

  // Step 2 — Destination
  destinations: z
    .array(z.enum(DESTINATION_OPTIONS))
    .min(1, "Select at least one destination"),

  // Step 3 — Dates & budget
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  datesFlexible: z.enum(DATES_FLEXIBLE_OPTIONS, {
    errorMap: () => ({ message: "Let us know if your dates are flexible" }),
  }),
  budget: z.enum(BUDGET_OPTIONS, {
    errorMap: () => ({ message: "Pick a budget range" }),
  }),

  // Step 4 — Trip details
  celebrating: optionalEnum(CELEBRATING_OPTIONS),
  discounts: z.array(z.enum(DISCOUNT_OPTIONS)).optional(),
  priorities: z.array(z.enum(PRIORITY_OPTIONS)).optional(),

  // Step 5 — Party
  partySize: z.string().min(1, "Let us know how many are traveling"),
  agesUnder18: z.string().optional(),
  roomsNeeded: optionalEnum(ROOMS_OPTIONS),
  referral: z.string().optional(),
});

export type VacationRequestInput = z.infer<typeof vacationRequestSchema>;

/**
 * Best-effort map of a destination-page deep-link name (`?destination=`, set by
 * `components/destination-locations.tsx` from a CMS location `name`) to one of
 * the form's fixed options. Unmatched names simply don't pre-fill.
 */
export function matchDestinationOption(
  raw: string | null | undefined,
): (typeof DESTINATION_OPTIONS)[number] | undefined {
  const q = raw?.trim().toLowerCase();
  if (!q) return undefined;
  return DESTINATION_OPTIONS.find((option) => {
    const o = option.toLowerCase();
    return o === q || o.includes(q) || q.includes(o.split(",")[0].trim());
  });
}
