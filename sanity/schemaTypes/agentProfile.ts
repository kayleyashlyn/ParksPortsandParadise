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
 *
 * `location` / `email` / `instagramHandle` are structured contact fields, not
 * prose — the team card renders them with their own treatment (a pin, a
 * `mailto:` link, an Instagram link), so contact info never has to be
 * hand-typed into the bottom of `bio`.
 *
 * `teamGroup` splits the "Meet the Team" grid into two rows — founders /
 * leadership above the advisors. Defaults to "advisor"; the frontend
 * coalesces a missing value so existing profiles need no edit.
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
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            'Describe the photo (e.g. "Ashley Mackay, headshot"). Falls back to the agent name if blank.',
          validation: (rule) =>
            rule
              .required()
              .warning("Add alt text — important for accessibility and SEO."),
        }),
      ],
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Travel Advisor", "Owner / Lead Advisor"',
    }),
    defineField({
      name: "teamGroup",
      title: "Team section",
      type: "string",
      options: {
        list: [
          { title: "Founder / leadership", value: "leadership" },
          { title: "Advisor", value: "advisor" },
        ],
        layout: "radio",
      },
      initialValue: "advisor",
      description:
        'Founders / leadership appear in their own row at the top of the "Meet the Team" page, above the advisors.',
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description:
        'Where this advisor is based, e.g. "Orlando, FL". Shown under their name on the team card. Leave blank to hide it.',
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      description:
        "Public contact email for this advisor — shown on the team card as a clickable email link. Leave blank to hide it.",
      validation: (rule) =>
        rule
          .email()
          .warning("That doesn't look like a valid email address."),
    }),
    defineField({
      name: "instagramHandle",
      title: "Instagram handle",
      type: "string",
      description:
        'Just the username, e.g. "alyssaatthecastle" (a leading "@" is fine too) — not a full URL. Shown on the team card as a link to the Instagram profile. Leave blank to hide it.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true; // optional — the link just doesn't render
          return /^@?[A-Za-z0-9._]{1,30}$/.test(value)
            ? true
            : 'Enter just the Instagram username (letters, numbers, "." and "_"), not a full URL or embed code.';
        }),
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
