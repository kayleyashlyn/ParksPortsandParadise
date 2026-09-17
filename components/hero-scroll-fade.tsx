"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps the hero's photo/scrim layer so it dims as the visitor scrolls
 * through the hero, instead of cutting off sharply into the Trust Bar below.
 * Opacity is 1 at the top of the hero and eases to 0 once the section has
 * scrolled fully past — a plain scroll-linked fade, not a parallax (the
 * layer stays in normal flow, sized to match the section via `absolute
 * inset-0` on the parent).
 *
 * Client leaf, same pattern as `HeroVideo`: skips the effect entirely for
 * `prefers-reduced-motion`, so those visitors just get the photo at full
 * opacity throughout.
 */
export function HeroScrollFade({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const { top, height } = el.getBoundingClientRect();
      if (height === 0) return;
      const progress = Math.min(Math.max(-top / height, 0), 1);
      setOpacity(1 - progress);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 -z-10" style={{ opacity }}>
      {children}
    </div>
  );
}
