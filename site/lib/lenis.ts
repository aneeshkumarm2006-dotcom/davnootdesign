/**
 * lib/lenis.ts — tiny bridge to the live Lenis instance.
 *
 * SmoothScroll owns the Lenis lifecycle; consumers that need the instantaneous
 * scroll velocity (the TrustMarquee whip, DESIGN.md §5.2) read it from here
 * without importing Lenis or threading a context through the tree. Returns 0
 * when Lenis isn't running (SSR, reduced motion), so callers stay branch-free.
 */
import type Lenis from 'lenis';

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null): void {
  instance = l;
}

/** Signed px/frame-ish velocity from Lenis; 0 when smoothing is off. */
export function getLenisVelocity(): number {
  return instance?.velocity ?? 0;
}
