import { defineField, defineType } from "sanity";

/**
 * Single "Site Settings" document — pinned as a singleton in the Studio (see
 * `sanity.config.ts` structure, fixed `_id: "siteSettings"`). Holds cross-site
 * toggles that don't belong to any one page.
 *
 * Keep this FLAT — one screen of plain fields, never a page-builder
 * (CLAUDE.md). Phase 1 use: the homepage Instagram feed is a lightweight
 * third-party embed (SnapWidget), turned on/off here per IMPLEMENTATION_PLAN.md
 * §7 / §8.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "instagramFeedEnabled",
      title: "Show the Instagram feed on the homepage",
      type: "boolean",
      initialValue: false,
      description:
        "Turn on once the SnapWidget below is set up. Off hides the whole section.",
    }),
    defineField({
      name: "instagramWidgetId",
      title: "SnapWidget widget ID",
      type: "string",
      description:
        'From snapwidget.com after you create the widget for @parksportsandparadise — just the code after "embed/" in the embed URL (e.g. "1a2b3c4d5e"), not the whole snippet.',
      validation: (rule) =>
        rule
          .regex(/^[a-z0-9]+$/i, { name: "widget id" })
          .warning("Should be only the ID (letters and numbers)."),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
