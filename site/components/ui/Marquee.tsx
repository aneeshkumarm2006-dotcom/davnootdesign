'use client';

import { ReactNode, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

type Props = {
  children: ReactNode;
  /** base pixels/second */
  speed?: number;
  className?: string;
  /**
   * Optional per-frame speed boost in px/s, added to `speed` (DESIGN.md §5.2).
   * TrustMarquee passes scroll velocity here so a fast scroll whips the track.
   * Always non-negative — direction is owned by the marquee, not the caller.
   */
  getBoost?: () => number;
};

/**
 * Reusable infinite marquee track (DESIGN.md §4 / Phase 0). The track is
 * duplicated so it loops seamlessly; it translates on a single RAF and wraps
 * at -50%. An optional `getBoost` couples speed to Lenis scroll velocity
 * (TrustMarquee, Phase 2). Under reduced motion the track is static.
 */
export default function Marquee({ children, speed = 40, className = '', getBoost }: Props) {
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (half === 0) return;
    const boost = getBoost ? getBoost() : 0;
    let next = x.get() - ((speed + boost) * delta) / 1000;
    if (next <= -half) next += half;
    // guard against a large boost overshooting past the wrap point
    if (next > 0) next -= half;
    x.set(next);
  });

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <motion.div
        ref={trackRef}
        className="flex w-max flex-nowrap"
        style={reduced ? undefined : { x }}
      >
        {children}
        {/* duplicate for seamless loop */}
        <span aria-hidden className="flex flex-nowrap">
          {children}
        </span>
      </motion.div>
    </div>
  );
}
