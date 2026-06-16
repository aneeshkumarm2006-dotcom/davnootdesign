'use client';

import { useEffect, useState } from 'react';

/** True when the user prefers reduced motion. SSR-safe (defaults false, syncs on mount). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Defers a heavy/decorative WebGL mount until the user first engages with the
 * page (pointer move, scroll, touch, wheel, or key). This keeps three.js off the
 * initial load entirely — the real <h1> is the LCP and TBT stays low (DESIGN.md
 * §6, the non-negotiable perf floor) — while still bringing the signature blob
 * alive the instant a real visitor interacts. A static cobalt wash holds the
 * space until then, so there is never an empty state. Returns false until the
 * first interaction, then true.
 */
// Genuine user-intent events only. 'scroll' is intentionally excluded — Lenis
// emits synthetic scroll events on init, which would fire this immediately;
// 'wheel'/'touchstart' already cover real scroll intent.
const INTERACTION_EVENTS = [
  'pointermove',
  'pointerdown',
  'touchstart',
  'wheel',
  'keydown',
] as const;

export function useInteractionMount(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onFirst = () => setReady(true);
    for (const evt of INTERACTION_EVENTS) {
      window.addEventListener(evt, onFirst, { once: true, passive: true });
    }
    return () => {
      for (const evt of INTERACTION_EVENTS) {
        window.removeEventListener(evt, onFirst);
      }
    };
  }, []);

  return ready;
}

/** True on touch / coarse-pointer devices (no hover). Used to disable cursor + magnetic FX. */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setTouch(mq.matches);
    const onChange = () => setTouch(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return touch;
}
