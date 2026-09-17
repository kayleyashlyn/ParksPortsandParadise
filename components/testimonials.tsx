import { TestimonialsRotator } from "@/components/testimonials-rotator";
import type { Testimonial } from "@/lib/sanity.queries";

/**
 * Homepage revolving testimonials section (IMPLEMENTATION_PLAN.md §5 / §9) —
 * sits between the destination-family grid / Instagram feed and the (still
 * unbuilt) newsletter section. Server Component; `testimonials` is fetched by
 * the page (`getTestimonials()`) and passed down, matching the existing
 * `app/page.tsx` data-fetching pattern. Pure social proof — no CTA button, so
 * it doesn't compete with the single dominant "Request a Quote" CTA.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8"
    >
      <p className="flex items-center justify-center gap-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
        What clients say
      </p>
      <h2
        id="testimonials-heading"
        className="mt-2 text-center text-3xl sm:text-4xl"
      >
        Trips our clients still talk about
      </h2>

      <div className="mt-10">
        <TestimonialsRotator testimonials={testimonials} />
      </div>
    </section>
  );
}
