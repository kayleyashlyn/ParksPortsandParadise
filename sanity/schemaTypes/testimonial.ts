import { defineField, defineType } from "sanity";

/**
 * Powers the homepage revolving testimonials section (`app/page.tsx`,
 * between the destination-family grid / Instagram feed and the newsletter
 * section). Individually-attributed per §3's "Lilly Attar — Travel Advisor"
 * principle, not generic quotes — kept flat per the CMS-editor-is-non-technical
 * rule. See IMPLEMENTATION_PLAN.md §5.
 *
 * No rating/star field and no featured/active toggle — not requested; an
 * editor can just delete a document to pull it from rotation.
 *
 * Five real client quotes were confirmed 2026-09-14 (client-provided text,
 * unedited). For all five, `clientName` stays the "Verified PPP client"
 * placeholder — no client gave permission to use their real name yet — and
 * `tripLabel` is left blank (not confirmed). Paige/Ashley: paste these in
 * via Studio, in this order (`order` 1–5):
 *
 * 1. order: 1, advisorName: (blank)
 *    quote: "I called Parks Ports and Paradise to book a birthday vacation
 *    for my notoriously vacation-logistics averse husband and I. Thankfully,
 *    they were happy to talk at any length necessary about this logistics
 *    with me! Whether by email or a quick phone call, they calmed all my
 *    nerves and made sure to help stretch our dollars wisely to maximize our
 *    trips value. Not only were they incredibly responsive, they beat the
 *    pricing from other services I used preciously for booking! Even as
 *    someone who enjoys logistics, it was such a relief to have the team at
 *    the helm handling them for me. If you need someone to trust to plan a
 *    great time, and shop with your wallet- Parks Ports and Paradise are the
 *    team for you!"
 *
 * 2. order: 2, advisorName: "Ashley"
 *    quote: "Ashley was the best, from helping me decide what boat, what
 *    packages, what time frame, (rebooking my trip at midnight on
 *    Thanksgiving), finding me the best possible deal (no pestering me to
 *    upgrade or up-sell me), making awesome suggestions that genuinely added
 *    to our vacation and answering every question I could possibly throw at
 *    her. This was my first cruise experience as an adult, and booking on my
 *    own. I didn't have a lot of free time before hand to do my own
 *    research, but I didn't need to, Ashley provided me with everything I
 *    needed to know, usually within minutes of me asking. Half the time she
 *    already had the answer and information before I asked (or would even
 *    think of) the question. I can't thank her enough, we had such a great
 *    time and we'll definitely be booking with her again."
 *
 * 3. order: 3, advisorName: (blank)
 *    quote: "This was our first cruise, and we would have been completely
 *    overwhelmed without Parks Ports and Paradise. They walked us through
 *    everything from selecting the right ship and stateroom to check-in and
 *    what to expect onboard. We felt prepared, confident, and genuinely
 *    cared for even after our cruise!"
 *
 * 4. order: 4, advisorName: (blank)
 *    quote: "Working with Parks Ports & Paradise was such an easy and
 *    enjoyable experience. We received personalized recommendations, clear
 *    communication, and support throughout the entire process. We can't
 *    wait to book our next trip!!"
 *
 * 5. order: 5, advisorName: "Paige"
 *    quote: "From the initial planning stages through the day we traveled,
 *    Paige was responsive, organized, and incredibly helpful. She thought of
 *    details we never would have considered and made our family vacation one
 *    we will always remember."
 *
 * Not written to the dataset by this change — no write access from this
 * session. Enter manually in Studio.
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      description: "The client's words, unedited.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      description:
        'Leave as "Verified PPP client" until the client has given permission to use their real name/initials.',
      initialValue: "Verified PPP client",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tripLabel",
      title: "Trip Label (optional)",
      type: "string",
      description: 'Short context, e.g. "First Cruise".',
    }),
    defineField({
      name: "advisorName",
      title: "Advisor Name (optional)",
      type: "string",
      description: "Which PPP advisor handled the trip, if named in the quote.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Display order in the rotation.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "clientName", subtitle: "quote" },
  },
});
