'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { revealVariants, staggerContainer, viewportOnce } from '@/lib/motion';

type Tag = 'div' | 'section' | 'span' | 'li' | 'ul' | 'ol' | 'p' | 'h1' | 'h2' | 'h3';

const motionTags = {
  div: motion.div,
  section: motion.section,
  span: motion.span,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type Props = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** when true, children wrapped in <RevealItem> stagger in (0.06s) */
  stagger?: boolean;
  delay?: number;
};

/**
 * Reveal primitive (DESIGN.md §4.5): opacity 0→1, y 24→0, --dur-slow,
 * --ease-out-expo, whileInView once, margin -10%. Under reduced motion the
 * global CSS reset collapses the transition, so content simply appears.
 */
export default function Reveal({
  children,
  className,
  as = 'div',
  stagger = false,
  delay = 0,
}: Props) {
  const MotionTag = motionTags[as];

  if (stagger) {
    return (
      <MotionTag
        className={className}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

/** Child element for a staggered <Reveal stagger>. */
export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const MotionTag = motionTags[as];
  return (
    <MotionTag className={className} variants={revealVariants}>
      {children}
    </MotionTag>
  );
}
