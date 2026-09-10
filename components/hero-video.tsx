"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Decorative looping background video for the homepage hero. Mounts only when a
 * source exists, the viewport is desktop-width, and the visitor has not asked
 * for reduced motion — otherwise the poster image behind it carries the hero on
 * its own (no wasted mobile bandwidth, respects the OS motion preference).
 *
 * `muted` + `playsInline` are required for autoplay; `aria-hidden` + `tabIndex`
 * keep it out of the a11y tree (it conveys nothing the headline doesn't).
 */
export function HeroVideo({
  src,
  type,
}: {
  src: string;
  type?: string | null;
}) {
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(!reduce && desktop);
  }, []);

  useEffect(() => {
    // Some browsers ignore the `autoPlay` attribute on a late-mounted element.
    if (enabled) void ref.current?.play().catch(() => {});
  }, [enabled]);

  if (!enabled || !src) return null;

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
    >
      <source src={src} type={type ?? "video/mp4"} />
    </video>
  );
}
