'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { easeInOut } from '@/lib/motion';

/**
 * Page-transition wrapper (DESIGN.md §4.3): a full-screen --cobalt curtain
 * wipes up to cover, the route swaps, then it wipes up and away to reveal
 * (~0.7s, --ease-in-out). template.tsx remounts on every navigation, so the
 * enter animation replays per route. Skipped under reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <>
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9998] origin-bottom bg-cobalt"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.7, ease: easeInOut }}
        style={{ transformOrigin: 'top' }}
      />
    </>
  );
}
