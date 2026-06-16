/**
 * lib/motion.ts — shared Framer Motion variants + easings (DESIGN.md §2.4).
 * Keep all motion constants here so timing is edited in one place.
 */
import type { Variants, Transition } from 'framer-motion';

export const easeOutExpo = [0.16, 1, 0.3, 1] as const; // --ease-out-expo
export const easeInOut = [0.65, 0, 0.35, 1] as const; // --ease-in-out

export const dur = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
} as const;

/** The reveal primitive: opacity 0→1, y 24→0, --dur-slow, --ease-out-expo. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.slow, ease: easeOutExpo },
  },
};

/** Stagger container — 0.06s between siblings (DESIGN.md §2.4). */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

/** Word/line rise used by SplitText. */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: '0.9em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.base, ease: easeOutExpo },
  },
};

/** Cobalt curtain wipe for page transitions (DESIGN.md §4.3). */
export const curtainTransition: Transition = {
  duration: 0.7,
  ease: easeInOut,
};

/** Shared viewport config for whileInView reveals. */
export const viewportOnce = { once: true, margin: '-10%' } as const;
