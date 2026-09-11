import { defineField, defineType, defineArrayMember } from "sanity";

/**
 * Blog / Trip Inspiration post (IMPLEMENTATION_PLAN.md §7, §9 — "Blog (basic
 * list + post template)"). In launch scope; the existing Squarespace posts are
 * migrated into this type by hand.
 *
 * Kept deliberately flat — title, slug, date, one hero image, a short excerpt,
 * an optional byline, and a body of block content (with inline images). No
 * categories/tags/related-posts machinery in Phase 1; add those only with an
 * IMPLEMENTATION_PLAN.md update (CLAUDE.md rule 5).
 */
export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description:
        "The post is hidden from the site until this date/time. Back-date migrated posts to their original date.",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "1–2 sentence summary shown on the blog index and used for search/social previews. Falls back to the start of the body if blank.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "author",
      title: "Byline",
      type: "string",
      description:
        'Optional — e.g. "Ashley Mackay". Leave blank to credit the agency.',
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      description: "Optional hero image for the top of the post and the index card.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for screen readers and search engines. Falls back to the post title if blank.",
          validation: (rule) =>
            rule
              .required()
              .warning("Add alt text — important for accessibility and SEO."),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule
                        .required()
                        .uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Describe what the image shows, for screen readers and search engines. Required — images in the body carry meaning.",
              // Hard requirement (not warning-level like the seeded content
              // images): body images are always informative, and there are no
              // legacy body images to grandfather in.
              validation: (rule) =>
                rule.required().error("Add alt text for this image."),
            }),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "mainImage", date: "publishedAt" },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date
          ? new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Unpublished",
      };
    },
  },
});
