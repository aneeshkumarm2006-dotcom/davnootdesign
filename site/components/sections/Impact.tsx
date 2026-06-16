'use client';

import Reveal, { RevealItem } from '@/components/ui/Reveal';
import CountUp from '@/components/ui/CountUp';
import { impact } from '@/lib/content';

/**
 * Impact band (DESIGN.md §5.6 / Phase 4) — the one blue-dominant moment that
 * breaks the paper rhythm exactly once. Full-bleed --navy with --paper-on-dark
 * type and 3–4 big numbers that count up when the band scrolls into view (once);
 * a faint cobalt blob echo sits behind at very low contrast. Figures are
 * {{IMPACT_NUMBERS}} placeholders — CountUp renders non-numeric values static,
 * so it animates only once real figures are supplied. Static under reduced
 * motion.
 */
export default function Impact() {
  return (
    <section
      aria-label="Impact by the numbers"
      className="relative w-full overflow-hidden bg-navy py-section-y text-paper-on-dark"
    >
      {/* faint blob echo behind the numbers (§5.6 — very low contrast) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 60% at 70% 50%, rgba(27,60,255,0.35), transparent 70%)',
        }}
      />

      <Reveal
        stagger
        as="ul"
        className="relative mx-auto grid max-w-container grid-cols-2 gap-x-8 gap-y-12 px-gutter md:grid-cols-4"
      >
        {impact.numbers.map((item) => (
          <RevealItem as="li" key={item.label} className="flex flex-col">
            <CountUp
              value={item.value}
              className="font-display text-[clamp(2.75rem,1.8rem+5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-paper-on-dark tabular-nums"
            />
            <span className="mt-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-paper-on-dark/60">
              {item.label}
            </span>
          </RevealItem>
        ))}
      </Reveal>

      <p className="relative mx-auto mt-12 max-w-container px-gutter font-mono text-eyebrow uppercase tracking-[0.12em] text-paper-on-dark/70">
        Placeholder figures — real impact numbers coming soon.
      </p>
    </section>
  );
}
