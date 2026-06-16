'use client';

import { Fragment } from 'react';
import Marquee from '@/components/ui/Marquee';
import { trust } from '@/lib/content';
import { getLenisVelocity } from '@/lib/lenis';

// Repeat the fallback items so the track overflows the viewport before Marquee
// duplicates it — that's what makes the loop seam invisible.
const REPEAT = 4;

/**
 * Scroll velocity → extra px/s. Lenis velocity is small at rest and spikes when
 * you flick the page; |velocity| keeps the whip direction owned by the marquee,
 * and the cap stops a violent scroll from tearing the loop.
 */
function scrollBoost(): number {
  return Math.min(Math.abs(getLenisVelocity()) * 8, 600);
}

/**
 * Trust marquee (DESIGN.md §5.2 / Phase 2): a single full-bleed strip with
 * hairline top/bottom for instant credibility after the hero. Items are
 * monochrome --ink-muted (client logos when supplied; service names as the
 * {{CLIENT_LOGOS}} fallback). The track auto-scrolls and whips with scroll
 * velocity; under reduced motion Marquee renders it static.
 */
export default function TrustMarquee() {
  const items = Array.from({ length: REPEAT }).flatMap(() => trust.items);

  return (
    <section
      aria-label={trust.eyebrow}
      className="relative overflow-hidden border-y border-hairline bg-paper py-7 md:py-9"
    >
      <h2 className="sr-only">{trust.eyebrow}</h2>

      {/* eyebrow pinned left, masking the marquee that scrolls under it */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full items-center bg-[linear-gradient(to_right,var(--paper)_0%,var(--paper)_78%,transparent_100%)] pl-gutter pr-24 md:flex">
        <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
          {trust.eyebrow}
        </span>
      </div>
      {/* symmetric fade on the right edge */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-[linear-gradient(to_left,var(--paper),transparent)] md:w-24" />

      <Marquee speed={40} getBoost={scrollBoost}>
        <ul className="flex flex-nowrap items-center">
          {items.map((item, i) => (
            <Fragment key={`${item}-${i}`}>
              <li className="whitespace-nowrap px-7 font-display text-h3 font-medium text-ink-muted md:px-10">
                {item}
              </li>
              <li aria-hidden className="select-none text-ink-muted/40">
                &middot;
              </li>
            </Fragment>
          ))}
        </ul>
      </Marquee>
    </section>
  );
}
