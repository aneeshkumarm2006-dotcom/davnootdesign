'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { easeInOut, easeOutExpo } from '@/lib/motion';
import { site } from '@/lib/content';

const KEY = 'davnoot-preloaded';
const LETTERS = site.shortName.toUpperCase().split(''); // DAVNOOT

// useLayoutEffect on the client (covers before paint → no hero flash), useEffect
// on the server (no-op) to silence React's SSR warning.
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Preloader (DESIGN.md §5.0 / Phase 1): full-screen --paper with the DAVNOOT
 * logotype assembling and a mono 0→100 counter, then a --cobalt panel wipes up
 * to reveal the hero. Hard-capped at ≤1.5s, shown once per session
 * (sessionStorage), and skipped entirely under reduced motion.
 */
export default function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const [scope, animateScope] = useAnimate();
  const coverRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  // Decide synchronously before first paint so the hero never flashes.
  useIsoLayoutEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem(KEY)) return;
    setActive(true);
    document.documentElement.style.overflow = 'hidden';
  }, [reduced]);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;

    let cancelled = false;

    const finish = () => {
      sessionStorage.setItem(KEY, '1');
      document.documentElement.style.overflow = '';
      setActive(false);
    };

    const run = async () => {
      // Counter 0→100 (~0.7s) — the bulk of the hold.
      await animate(0, 100, {
        duration: 0.7,
        ease: 'easeOut',
        onUpdate: (v) => setCount(Math.round(v)),
      });
      if (cancelled || !coverRef.current || !scope.current) return;

      // Cobalt panel wipes up to cover the paper + logotype.
      await animateScope(
        coverRef.current,
        { transform: 'translateY(0%)' },
        { duration: 0.3, ease: easeInOut },
      );
      if (cancelled) return;

      // The whole overlay slides up and off to reveal the hero.
      await animateScope(
        scope.current,
        { transform: 'translateY(-100%)' },
        { duration: 0.4, ease: easeInOut },
      );
      if (cancelled) return;

      finish();
    };

    run();

    // Hard cap: never hold the page past 1.5s, whatever the sequence is doing.
    const cap = window.setTimeout(() => {
      cancelled = true;
      finish();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, [active, animateScope, scope]);

  if (!active) return null;

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-paper"
    >
      {/* Logotype — letters rise/settle on a stagger */}
      <motion.span
        className="font-display text-[clamp(2.5rem,10vw,7rem)] font-semibold tracking-tight text-ink"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        aria-label={site.shortName}
      >
        {LETTERS.map((letter, i) => (
          <span key={i} className="relative inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '0.9em', opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.5, ease: easeOutExpo },
                },
              }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </motion.span>

      {/* Mono counter, bottom-corner */}
      <span className="absolute bottom-gutter right-gutter font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted tabular-nums">
        {count.toString().padStart(3, '0')}
      </span>

      {/* Cobalt reveal panel — starts below, wipes up to cover */}
      <div
        ref={coverRef}
        className="absolute inset-0 origin-bottom bg-cobalt"
        style={{ transform: 'translateY(100%)' }}
      />
    </motion.div>
  );
}
