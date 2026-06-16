'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion, useIsTouch } from '@/lib/hooks';

type CursorState = 'default' | 'hover' | 'view';

/**
 * Custom cursor (DESIGN.md §4.2):
 *  - default: 10px --ink dot
 *  - over [data-cursor="hover"]: grows to 56px --cobalt ring (15% opacity)
 *  - over [data-cursor="view"] (work rows): shows a "View →" mono label
 * Disabled on touch + reduced motion — native cursor is restored.
 */
export default function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  const enabled = !reduced && !touch;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.3 });

  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.removeAttribute('data-custom-cursor');
      return;
    }
    root.setAttribute('data-custom-cursor', 'on');

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = (e.target as Element)?.closest?.('[data-cursor]');
      const next = target?.getAttribute('data-cursor');
      setState(next === 'view' ? 'view' : next === 'hover' ? 'hover' : 'default');
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      root.removeAttribute('data-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const isHover = state === 'hover' || state === 'view';

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: isHover ? 56 : 10,
        height: isHover ? 56 : 10,
        backgroundColor: isHover ? 'rgba(27, 60, 255, 0.15)' : 'var(--ink)',
        border: isHover ? '1px solid var(--cobalt)' : '1px solid transparent',
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {state === 'view' && (
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cobalt">
          View →
        </span>
      )}
    </motion.div>
  );
}
