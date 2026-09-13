import { defineField, defineType } from "sanity";

/**
 * One document per email captured by the newsletter / freebie-download signup
 * (footer field and the popup both post to `/api/newsletter`, which writes
 * here — see `app/api/newsletter/route.ts`). Editors never create these by
 * hand in Studio; it's a read-only list for Paige/Ashley to check or export.
 *
 * Kept deliberately flat (CLAUDE.md) — no subscriber preferences, tags, or
 * segmentation. If the client wants real email-marketing features later
 * (campaigns, segments, automations), that's a job for a dedicated ESP
 * (Mailchimp, ConvertKit, ...), not more fields here — log it to BACKLOG.md
 * instead of growing this schema.
 */
export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description:
        'Where the signup came from — e.g. "footer" or "freebie-popup".',
      readOnly: true,
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed at",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "source" },
  },
});
