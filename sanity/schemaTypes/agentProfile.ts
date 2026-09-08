import { defineField, defineType } from "sanity";

/**
 * Powers the "Meet the Team" page as a repeatable collection — NOT hardcoded
 * page markup. Client explicitly needs to add/remove agents regularly without
 * developer involvement (see IMPLEMENTATION_PLAN.md §7). Adding an agent is
 * "create a new document"; removing one is "delete the document" — the page
 * itself never needs to be touched.
 *
 * `active` (rather than deleting on departure) lets the client unpublish an
 * agent without losing their bio/photo history, and keeps this list useful as
 * recruiting proof (see Prospective Agent persona) without stale profiles
 * showing on the live page.
 */
export const agentProfile = defineType({
  name: "agentProfile",
  title: "Agent",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Travel Advisor", "Owner / Lead Advisor"',
    }),
    defineField({
      name: "bio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description: "A couple of sentences, brand voice. Keep it short — this is a grid card, not a long-form page.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "specialties",
      title: "Specialties",
      type: "array",
      of: [{ type: "string" }],
      description: 'Short tags, e.g. "Disney", "Cruises", "Luxury travel" — not paragraphs.',
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Toggle off instead of deleting to unpublish without losing the profile.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Optional — controls position in the grid. Leave blank to sort alphabetically.",
    }),
  ],
  preview: {
    select: { title: "name", media: "photo", subtitle: "title" },
  },
});
