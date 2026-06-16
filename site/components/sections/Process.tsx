'use client';

import { motion } from 'framer-motion';
import Reveal, { RevealItem } from '@/components/ui/Reveal';
import { process } from '@/lib/content';
import { dur, easeOutExpo, viewportOnce } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

const lineTransition = { duration: dur.slow, ease: easeOutExpo } as const;

/**
 * Process / Approach (DESIGN.md §5.5 / Phase 4) — deliberate calm after the
 * services intensity. Four steps strung along a thin cobalt connecting line that
 * draws itself on scroll-in (SVG `pathLength` 0→1); the steps reveal in
 * sequence. Restrained on purpose. The line is the one cobalt motif here
 * (cobalt-once-per-viewport, §2.1) — index, title and copy stay ink.
 *
 * The line is horizontal on desktop (md+) and vertical on mobile; under reduced
 * motion both render fully drawn and the reveals collapse to a plain list.
 */
export default function Process() {
  const reduced = usePrefersReducedMotion();

  const draw = reduced
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: viewportOnce,
        transition: lineTransition,
      };

  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="mx-auto max-w-container px-gutter py-section-y"
    >
      <Reveal>
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
          {process.eyebrow}
        </p>
      </Reveal>
      <Reveal>
        <h2 id="approach-heading" className="mt-4 max-w-[16ch] font-display text-h2 text-ink">
          How we turn audits into compounding growth.
        </h2>
      </Reveal>

      <div className="relative mt-16 md:mt-24">
        {/* Horizontal connecting line through the dot row (md+), inset to span
            from the first dot center to the last. */}
        <svg
          aria-hidden
          preserveAspectRatio="none"
          viewBox="0 0 100 2"
          className="absolute left-[12.5%] right-[12.5%] top-[7px] hidden h-0.5 md:block"
        >
          <motion.line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke="var(--cobalt)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            {...draw}
          />
        </svg>

        {/* Vertical connecting line down the dot column (mobile). */}
        <svg
          aria-hidden
          preserveAspectRatio="none"
          viewBox="0 0 2 100"
          className="absolute left-[7px] top-3 bottom-3 w-0.5 md:hidden"
        >
          <motion.line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="var(--cobalt)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            {...draw}
          />
        </svg>

        <Reveal
          stagger
          as="ol"
          className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-4"
        >
          {process.steps.map((step) => (
            <RevealItem
              as="li"
              key={step.index}
              className="relative pl-9 md:pl-0 md:pt-9"
            >
              {/* node on the line — cobalt dot ringed in paper so the line reads
                  as passing behind it */}
              <span
                aria-hidden
                className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full bg-cobalt ring-4 ring-paper md:left-0 md:top-0"
              />
              <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
                {step.index}
              </span>
              <h3 className="mt-3 font-display text-h3 font-medium text-ink">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[28ch] font-body text-body text-ink-muted">
                {step.line}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
