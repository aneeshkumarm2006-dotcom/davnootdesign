'use client';

import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import SplitText from '@/components/ui/SplitText';
import { dualContinent } from '@/lib/content';
import { dur, easeOutExpo, viewportOnce } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Raipur ↔ Montreal (DESIGN.md §5.7 / Phase 4) — the differentiator, played
 * quiet and type-led with lots of space. A subtle two-point motif (the two
 * cities) joined by a thin cobalt arc that draws itself on scroll-in; the
 * headline reveals by line. The arc + dots are the one cobalt motif here
 * (§2.1). Under reduced motion the arc renders fully drawn and text is plain.
 */
export default function DualContinent() {
  const reduced = usePrefersReducedMotion();

  const draw = reduced
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: viewportOnce,
        transition: { duration: dur.slow, ease: easeOutExpo },
      };

  const dot = reduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: viewportOnce,
        transition: { duration: dur.base, ease: easeOutExpo, delay: dur.slow },
      };

  return (
    <section
      aria-labelledby="dual-heading"
      className="mx-auto max-w-container px-gutter py-section-y text-center"
    >
      <Reveal>
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
          {dualContinent.eyebrow}
        </p>
      </Reveal>

      <SplitText
        as="h2"
        id="dual-heading"
        text={dualContinent.headline}
        className="mx-auto mt-6 block max-w-[20ch] font-display text-h2 text-ink"
      />

      <Reveal>
        <p className="mx-auto mt-8 max-w-[52ch] font-body text-lead text-ink-muted">
          {dualContinent.body}
        </p>
      </Reveal>

      {/* two-point arc motif: Raipur ↔ Montreal */}
      <div className="relative mx-auto mt-16 w-full max-w-[520px] md:mt-20">
        <svg
          aria-hidden
          viewBox="0 0 400 140"
          fill="none"
          className="w-full overflow-visible"
        >
          <motion.path
            d="M44 104 Q200 -4 356 104"
            stroke="var(--cobalt)"
            strokeWidth="2"
            strokeLinecap="round"
            {...draw}
          />
          <motion.circle cx="44" cy="104" r="7" fill="var(--cobalt)" {...dot} />
          <motion.circle cx="356" cy="104" r="7" fill="var(--cobalt)" {...dot} />
        </svg>

        <div className="mt-4 flex items-center justify-between font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
          <span>Raipur, IN</span>
          <span>Montreal, QC</span>
        </div>
      </div>
    </section>
  );
}
