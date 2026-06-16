'use client';

import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePrefersReducedMotion, useIsTouch } from '@/lib/hooks';

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** max translation toward the cursor, px (DESIGN.md §4.4 ≤ 12px) */
  strength?: number;
};

/**
 * Magnetic button (DESIGN.md §4.4): the button translates toward the cursor
 * (≤12px) and the inner label parallaxes slightly more; both spring back on
 * leave. Disabled under reduced motion / touch.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  strength = 12,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  const enabled = !reduced && !touch;

  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });
  // label parallaxes ~40% further than the button for depth
  const labelX = useTransform(springX, (v) => v * 0.4);
  const labelY = useTransform(springY, (v) => v * 0.4);

  const handleMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const clamp = (v: number) => Math.max(-strength, Math.min(strength, v));
    x.set(clamp(relX * 0.4));
    y.set(clamp(relY * 0.4));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span
      className="pointer-events-none inline-flex items-center justify-center"
      style={enabled ? { x: labelX, y: labelY } : undefined}
    >
      {children}
    </motion.span>
  );

  const baseClass =
    'relative inline-flex items-center justify-center rounded-md bg-ink px-7 py-3.5 ' +
    'font-body text-sm text-paper transition-colors duration-fast hover:bg-cobalt ' +
    className;

  const motionProps = {
    ref: ref as never,
    'data-cursor': 'hover',
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    style: enabled ? { x: springX, y: springY } : undefined,
    className: baseClass,
  };

  if (href) {
    return (
      <motion.a href={href} {...motionProps}>
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" onClick={onClick} {...motionProps}>
      {inner}
    </motion.button>
  );
}
