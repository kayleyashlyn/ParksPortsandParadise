import { z } from "zod";

/**
 * Field-for-field match of the client's existing intake form
 * (see IMPLEMENTATION_PLAN.md §6). Do not add fields without updating
 * the implementation plan first — this form is intentionally scoped
 * to exactly what the client already collects today.
 */
export const vacationRequestSchema = z.object({
  // Step 1 — Contact info
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),

  // Step 2 — Destination
  destinations: z
    .array(
      z.enum([
        "Walt Disney World Resort, FL",
        "Universal Studios, FL",
        "Disneyland Resorts, CA",
        "Universal Studios Hollywood, CA",
        "Aulani, Hawaii",
        "Disney Cruise Line",
        "Royal Caribbean Cruise Line",
        "All-Inclusive Resort",
        "Other",
      ])
    )
    .min(1, "Select at least one destination"),

  // Step 3 — Dates & budget
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  datesFlexible: z.enum(["Yes", "No"]),
  budget: z.enum([
    "<$2,500",
    "$2,500 - $3,500",
    "$3,500 - $5,000",
    "$5,000 - $7,000",
    "$7,000+",
  ]),

  // Step 4 — Trip details
  celebrating: z.enum(["Birthday", "Anniversary", "Honeymoon", "Other", "None"]).optional(),
  discounts: z
    .array(
      z.enum([
        "FL Resident",
        "CA Resident",
        "Military",
        "Disney+ Subscriber",
        "Disney Chase Visa cardholder",
        "Annual Passholder",
      ])
    )
    .optional(),
  priorities: z
    .array(
      z.enum([
        "Sticking to a budget",
        "Kid friendly",
        "Adult focused/adults only",
        "Relaxation/resort time",
        "Luxury experience with luxury amenities",
        "Budget friendly with a few splurges",
      ])
    )
    .optional(),

  // Step 5 — Party
  partySize: z.string().min(1, "Let us know how many are traveling"),
  agesUnder18: z.string().optional(),
  roomsNeeded: z.enum(["1", "2-5", "5+"]).optional(),
  referral: z.string().optional(),
});

export type VacationRequestInput = z.infer<typeof vacationRequestSchema>;
