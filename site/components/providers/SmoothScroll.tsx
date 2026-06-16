'use client';

import { ReactNode, useEffect } from 'react';
import { usePrefersReducedMotion, useInteractionMount } from '@/lib/hooks';
import { setLenis } from '@/lib/lenis';

/**
 * Lenis smooth scroll on a single RAF loop shared with GSAP (DESIGN.md §4.1).
 * ScrollTrigger.update is driven from Lenis's scroll event so the one pin
 * (Services) stays in sync. Smoothing is disabled under reduced motion.
 *
 * Lenis + GSAP (the two heaviest non-essential libs) are imported and started
 * on the first real scroll/pointer intent rather than at load, keeping them off
 * the initial JS parse so the hero <h1> wins the LCP and TBT stays low (§6 —
 * the non-negotiable perf floor). Until then the page scrolls natively.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const ready = useInteractionMount();

  useEffect(() => {
    if (reduced || !ready) return; // native scroll, no lerp (§7) until engaged

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      setLenis(lenis); // expose velocity to the marquee (§5.2)
      lenis.on('scroll', ScrollTrigger.update);

      const onTick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(onTick);
        lenis.destroy();
        setLenis(null);
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced, ready]);

  return <>{children}</>;
}
