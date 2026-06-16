'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { dur, easeOutExpo } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

type Props = {
  value: string;
  className?: string;
};

// Pull the first numeric run (with optional thousands commas / decimals) out of
// a value string: "$1.2M" → { prefix:'$', num:1.2, suffix:'M', decimals:1 }.
// Strings with no digit (the {{N}} placeholders) return null and render static.
function parse(value: string) {
  const match = value.match(/[\d,]*\.?\d+/);
  if (!match) return null;
  const raw = match[0];
  const num = parseFloat(raw.replace(/,/g, ''));
  if (Number.isNaN(num)) return null;
  const dot = raw.indexOf('.');
  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice((match.index ?? 0) + raw.length),
    num,
    decimals: dot === -1 ? 0 : raw.length - dot - 1,
    grouped: raw.includes(','),
  };
}

/**
 * Count-up number for the Impact band (DESIGN.md §5.6): animates from 0 to its
 * value once the band scrolls into view. Values with no digit (the {{N}}
 * placeholders) and the reduced-motion path render the final string statically.
 */
export default function CountUp({ value, className }: Props) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const parsed = parse(value);
  const [display, setDisplay] = useState(parsed ? '' : value);

  useEffect(() => {
    if (!parsed) return;
    const format = (v: number) => {
      const fixed = v.toFixed(parsed.decimals);
      const grouped = parsed.grouped
        ? Number(fixed).toLocaleString('en-US', {
            minimumFractionDigits: parsed.decimals,
            maximumFractionDigits: parsed.decimals,
          })
        : fixed;
      return `${parsed.prefix}${grouped}${parsed.suffix}`;
    };

    if (reduced || !inView) {
      setDisplay(reduced ? format(parsed.num) : format(0));
      return;
    }

    const controls = animate(0, parsed.num, {
      duration: dur.slow,
      ease: easeOutExpo,
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, parsed]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
