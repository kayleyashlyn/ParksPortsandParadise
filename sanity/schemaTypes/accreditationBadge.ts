import { defineField, defineType } from "sanity";

/**
 * Powers the homepage trust bar (elevated per client direction — accreditation
 * moved out of footer-only placement) and its secondary copy in the footer.
 * See IMPLEMENTATION_PLAN.md §2 and §4.
 *
 * Keep this list short and high-signal: Seller of Travel registration numbers
 * and genuine certifications/authorized-agency badges only — this is a
 * legitimacy signal for travelers AND prospective agents, not a general
 * badge-collection widget.
 *
 * Confirmed launch entries (seed these first, text-only/no badgeImage needed
 * unless the client supplies official seal artwork):
 *   1. "FL Seller of Travel #ST46356"          order: 1
 *   2. "CA Seller of Travel #2173719-70"       order: 2
 *   3. "CLIA"                                  order: 3
 *   4. "IATAN"                                 order: 4
 *   5. "TL Network Member"                     order: 5
 *   6. "Universal Orlando Authorized Retailer" order: 6
 * Full list confirmed by client — no longer open. Badge artwork (CLIA/IATAN/
 * TL Network/Universal logos) to be supplied by client at build time.
 */
export const accreditationBadge = defineType({
  name: "accreditationBadge",
  title: "Accreditation Badge",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'e.g. "FL Seller of Travel #ST46356", "IATAN Accredited", "Disney Authorized Agency"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badgeImage",
      title: "Badge Image / Logo",
      type: "image",
      description: "Optional — leave blank to render as text-only (e.g. a registration number).",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkUrl",
      title: "Link (optional)",
      type: "url",
      description: "e.g. link to the verifying body (ASTA, IATAN) if applicable.",
    }),
  ],
  preview: {
    select: { title: "label", media: "badgeImage" },
  },
});
