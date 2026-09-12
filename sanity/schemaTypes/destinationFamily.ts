import { defineField, defineType, defineArrayMember } from "sanity";

/**
 * Powers exactly THREE documents at launch — Theme Parks (Disney + Universal +
 * SeaWorld, grouped together per client direction), Cruise Lines, All-Inclusive
 * Resorts — confirmed with the client as the flagship destination families
 * (see IMPLEMENTATION_PLAN.md §4–5).
 *
 * Locations live as an in-document array, NOT as their own document type
 * or route. Per the client's explicit direction: break locations out
 * within a single family page (sections/anchors), never spin them into
 * sub-pages on sub-pages. Keep all copy minimal — this schema should stay
 * hard to overfill with paragraph text.
 */
export const locationObject = defineType({
  name: "destinationLocation",
  title: "Location",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Location Name",
      type: "string",
      description: 'e.g. "Walt Disney World", "Royal Caribbean"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Must depict THIS specific location — no generic/stock stand-ins used just to fill a grid slot (client editorial rule; qa-agent checks this before publish).",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            'Describe the image for screen readers and search engines (e.g. "Cinderella Castle at Walt Disney World at dusk"). Falls back to the location name if blank.',
          validation: (rule) =>
            rule
              .required()
              .warning("Add alt text — important for accessibility and SEO."),
        }),
      ],
    }),
    defineField({
      name: "searchKeywords",
      title: "Search keywords",
      type: "string",
      description:
        'Not shown on the page. Comma-separated search terms for this location (e.g. "WDW, Disney World, Orlando FL, theme park vacation") — used in the page\'s structured data.',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "blurb",
      title: "Blurb",
      type: "text",
      rows: 2,
      description:
        "One or two sentences on what makes this destination distinct (client-requested). Keep it punchy — this is a card, not a page.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label Override",
      type: "string",
      description: 'Defaults to "Request a Quote" (pre-filled with this destination) if left blank.',
    }),
    defineField({
      name: "officialWebsiteUrl",
      title: "Official Website (optional)",
      type: "url",
      description:
        'Optional "Learn more" link out to this location\'s own official site (e.g. Walt Disney World\'s or Royal Caribbean\'s site) — separate from, and secondary to, the "Request a Quote" button. Leave blank to hide the link on the page.',
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "name", media: "image", subtitle: "blurb" },
  },
});

export const destinationFamily = defineType({
  name: "destinationFamily",
  title: "Destination Family",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Theme Parks", "Cruise Lines", "All-Inclusive Resorts"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for screen readers and search engines. Falls back to the family title if blank.",
          validation: (rule) =>
            rule
              .required()
              .warning("Add alt text — important for accessibility and SEO."),
        }),
      ],
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      description: "1–2 sentences max, brand voice. Keep it minimal per client direction.",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls nav flyout and homepage grid order (Theme Parks, Cruise Lines, All-Inclusive).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      description: "Rendered as sections/anchors on THIS family's page — never as separate sub-pages.",
      of: [defineArrayMember({ type: "destinationLocation" })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", media: "heroImage" },
  },
});
