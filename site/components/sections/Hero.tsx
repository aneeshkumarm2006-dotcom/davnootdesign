'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { hero, nav } from '@/lib/content';
import MagneticButton from '@/components/ui/MagneticButton';
import { usePrefersReducedMotion, useInteractionMount } from '@/lib/hooks';

// Decorative WebGL — client-only so it never enters SSR / the LCP path (§6).
const InkBlob = dynamic(() => import('@/components/three/InkBlob'), {
  ssr: false,
});

// The headline split into words so each rises on a stagger. "software" is the
// one cobalt word (DESIGN.md §5.1); the trailing period stays ink.
const WORDS = ['We', 'grow', 'brands', 'across', 'search,', 'social', '&', 'software'];

/**
 * Hero (DESIGN.md §5.1 / Phase 1): full viewport, oversized kinetic <h1>
 * center-left in ink with the cobalt blob bleeding off the right edge. The real
 * <h1> text is the LCP — it paints before the WebGL canvas mounts. Words rise
 * via a SplitText-style stagger on mount; subhead and CTA follow. Under reduced
 * motion the headline renders as plain, static text.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  // Hold the WebGL blob (three.js) off the initial load until the visitor first
  // interacts, so the <h1> wins the LCP and TBT stays low (§6). A static cobalt
  // wash fills the space until then; the canvas fades in over it on engagement.
  const blobReady = useInteractionMount();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Blob — absolute, behind the type, bleeding off the right edge */}
      <div className="pointer-events-none absolute inset-0 -z-0 w-full">
        {/* Static wash placeholder — paints instantly, no JS, no layout shift */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-1000 ease-out-expo"
          style={{
            opacity: blobReady && !reduced ? 0 : 1,
            background:
              'radial-gradient(closest-side, rgba(27,60,255,0.16), rgba(232,236,255,0.10) 55%, transparent 76%)',
          }}
        />
        {blobReady && !reduced && <InkBlob />}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-container px-gutter">
        {/* CSS-driven entrance (not framer) so the headline is real, visible
            text at parse time and wins the LCP. Each word rises on a stagger via
            --i; the heavy JS bundle never gates it. */}
        <h1 className="max-w-[16ch] font-display text-display font-semibold text-ink">
          {WORDS.map((word, i) => {
            const isCobalt = word === 'software';
            return (
              <span key={`${word}-${i}`} className="inline">
                <span
                  className={`inline-block hero-rise ${isCobalt ? 'text-cobalt' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  {word}
                  {isCobalt && <span className="text-ink">.</span>}
                </span>
                {i < WORDS.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </h1>

        <p
          className="mt-8 max-w-[40ch] font-body text-lead text-ink-muted hero-rise-fade"
          style={{ '--i': WORDS.length + 1 } as React.CSSProperties}
        >
          {hero.subhead}
        </p>

        <div
          className="mt-10 hero-rise-fade"
          style={{ '--i': WORDS.length + 3 } as React.CSSProperties}
        >
          <MagneticButton href={nav.cta.href}>{nav.cta.label}</MagneticButton>
        </div>
      </div>

      {/* Scroll hint — bottom-center, mono (§5.1) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <motion.span
          className="flex flex-col items-center gap-2 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted"
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {hero.scrollHint}
          <motion.span
            aria-hidden
            className="block h-8 w-px bg-hairline"
            animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.span>
      </div>
    </section>
  );
}
