"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/sanity.queries";

const ROTATE_MS = 6500;

/**
 * Client leaf for the homepage testimonials rotation — interval/state only,
 * kept small per CLAUDE.md's "use client only where required, small and
 * leaf-ward" rule. The section shell/heading live in the server component
 * `components/testimonials.tsx`.
 *
 * - Auto-advances on ROTATE_MS, paused on hover/focus and disabled entirely
 *   under `prefers-reduced-motion: reduce`.
 * - `aria-live` on the quote region is toggled "off" for auto-advances and
 *   "polite" for manual nav, so screen readers hear prev/next/dot changes
 *   but aren't spammed every few seconds by autoplay.
 * - No CTA here — this is pure social proof (CLAUDE.md's single dominant-CTA
 *   rule).
 */
export function TestimonialsRotator({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [live, setLive] = useState<"off" | "polite">("off");

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = () => setReducedMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || count <= 1) return;
    const id = setInterval(() => {
      setLive("off");
      setIndex((current) => (current + 1) % count);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion, count]);

  const goTo = useCallback(
    (next: number) => {
      setLive("polite");
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  if (count === 0) return null;

  const current = testimonials[index];

  return (
    <div
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div aria-live={live} aria-atomic="true" className="min-h-[11rem] text-center sm:min-h-[9rem]">
        <blockquote className="text-balance text-lg italic text-foreground sm:text-xl">
          &ldquo;{current.quote}&rdquo;
        </blockquote>
        <footer className="mt-4 text-sm font-medium text-muted-foreground">
          <p>
            &mdash; {current.clientName}
            {current.tripLabel ? `, ${current.tripLabel}` : ""}
          </p>
          {current.advisorName ? (
            <p className="mt-1 text-xs text-muted-foreground/80">
              &mdash; booked with {current.advisorName}
            </p>
          ) : null}
        </footer>
      </div>

      {count > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => goTo(index - 1)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((testimonial, i) => (
              <button
                key={testimonial._id}
                type="button"
                aria-label={`View testimonial ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  i === index
                    ? "bg-primary"
                    : "bg-border hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => goTo(index + 1)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
