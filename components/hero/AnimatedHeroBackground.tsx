"use client";

import { useEffect, useRef } from "react";

export function AnimatedHeroBackground() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canParallax =
      !media.matches &&
      window.matchMedia("(min-width: 1024px)").matches &&
      window.matchMedia("(pointer:fine)").matches;

    if (!canParallax) return;

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const dx = (x - 0.5) * 10;
      const dy = (y - 0.5) * 8;
      root.style.setProperty("--bg-parallax-x", `${dx.toFixed(2)}px`);
      root.style.setProperty("--bg-parallax-y", `${dy.toFixed(2)}px`);
    };

    const onLeave = () => {
      root.style.setProperty("--bg-parallax-x", "0px");
      root.style.setProperty("--bg-parallax-y", "0px");
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-bg absolute inset-0 -z-0 overflow-hidden rounded-3xl"
      aria-hidden="true"
    >
      <div className="hero-bg-image absolute inset-0" />
      <div className="hero-bg-glow absolute inset-0" />
      <div className="hero-bg-matrix absolute inset-0" />
      <div className="hero-bg-vignette absolute inset-0" />
    </div>
  );
}

