import { defineField, defineType } from "sanity";

/**
 * Single "Site Settings" document — pinned as a singleton in the Studio (see
 * `sanity.config.ts` structure, fixed `_id: "siteSettings"`). Holds cross-site
 * toggles that don't belong to any one page.
 *
 * Keep this FLAT — one screen of plain fields, never a page-builder
 * (CLAUDE.md). Phase 1 use: the homepage hero image/video and the Instagram
 * feed embed (SnapWidget), per IMPLEMENTATION_PLAN.md §7 / §8.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "hero", title: "Homepage hero" },
    { name: "instagram", title: "Instagram feed" },
  ],
  fields: [
    defineField({
      name: "heroPoster",
      title: "Homepage hero image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description:
        "The big image behind the homepage headline. Shown as-is on phones and for visitors who prefer reduced motion, and as the fallback while the video (if any) loads. Leave blank to keep the plain text hero.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for screen readers and search engines. Leave blank if it's purely decorative (it sits behind the headline).",
        }),
      ],
    }),
    defineField({
      name: "heroVideo",
      title: "Homepage hero video (optional)",
      type: "file",
      group: "hero",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Optional short looping background video (muted, auto-plays on desktop only). Keep it a few seconds and well under ~5 MB — big files make the page slow. MP4 or WebM. Falls back to the hero image above when empty.",
    }),
    defineField({
      name: "instagramFeedEnabled",
      group: "instagram",
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
      group: "instagram",
      description:
        'From snapwidget.com after you create the widget for @parksportsandparadise — just the code after "embed/" in the embed URL (e.g. "1a2b3c4d5e"), not the whole snippet.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true; // optional — feed just stays hidden
          return /^[A-Za-z0-9]{6,24}$/.test(value)
            ? true
            : "Paste only the widget ID (6–24 letters/numbers) from the SnapWidget embed URL — not the whole <iframe> snippet or a URL.";
        }),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
