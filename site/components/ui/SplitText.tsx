'use client';

import { ElementType } from 'react';
import { motion } from 'framer-motion';
import { riseVariants, viewportOnce } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

type Props = {
  text: string;
  className?: string;
  as?: ElementType;
  id?: string;
  /** start the rise immediately (hero post-preloader) vs. on scroll-in */
  animateOnMount?: boolean;
};

/**
 * SplitText (DESIGN.md §4.5): splits a headline into words wrapped in spans
 * for a staggered rise. Each word sits in an overflow-hidden mask so it rises
 * from below the baseline. Under reduced motion it renders plain text — no
 * transforms, no per-word spans driving layout shift.
 */
export default function SplitText({
  text,
  className,
  as = 'span',
  id,
  animateOnMount = false,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const Tag = as as ElementType;

  if (reduced) {
    return (
      <Tag className={className} id={id}>
        {text}
      </Tag>
    );
  }

  const words = text.split(' ');
  const animateProps = animateOnMount
    ? ({ initial: 'hidden', animate: 'visible' } as const)
    : ({ initial: 'hidden', whileInView: 'visible', viewport: viewportOnce } as const);

  return (
    <Tag className={className} id={id}>
      <motion.span
        className="inline"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        {...animateProps}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline">
            {/* mask clips the rising word; the space lives outside it so it
                isn't trimmed by overflow-hidden */}
            <span className="relative inline-block overflow-hidden align-bottom">
              <motion.span className="inline-block" variants={riseVariants}>
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
