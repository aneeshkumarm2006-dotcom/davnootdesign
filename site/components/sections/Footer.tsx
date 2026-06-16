'use client';

import { Fragment, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Marquee from '@/components/ui/Marquee';
import { footer, site, trust } from '@/lib/content';
import { usePrefersReducedMotion } from '@/lib/hooks';

const REPEAT = 4;

/**
 * Footer (DESIGN.md §5.9 / Phase 4) — a quiet, confident exit. A huge faint
 * DAVNOOT logotype parallaxes slightly behind the content; nav links, the
 * marquee once more, socials, and the legal line sit on top. Under reduced
 * motion the logotype is static and the marquee stops.
 */
export default function Footer() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });
  // gentle vertical drift as the footer scrolls into view (§5.9)
  const y = useTransform(scrollYProgress, [0, 1], ['12%', '-8%']);

  const items = Array.from({ length: REPEAT }).flatMap(() => trust.items);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-hairline bg-paper">
      {/* final marquee pass (§5.9) */}
      <div className="border-b border-hairline py-6">
        <Marquee speed={30}>
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
      </div>

      <div className="relative mx-auto max-w-container px-gutter pb-16 pt-16 md:pt-24">
        <div className="relative z-10 flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <a
              href="#top"
              data-cursor="hover"
              className="font-display text-2xl font-semibold tracking-tight text-ink"
            >
              {site.shortName}
            </a>
            <p className="mt-4 max-w-[32ch] font-body text-body text-ink-muted">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {footer.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor="hover"
                className="font-body text-sm text-ink-muted transition-colors duration-fast hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            {footer.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                data-cursor="hover"
                className="font-body text-sm text-ink-muted transition-colors duration-fast hover:text-ink"
              >
                {social.label}
              </a>
            ))}
            <a
              href={`mailto:${site.email}`}
              data-cursor="hover"
              className="font-body text-sm text-ink-muted transition-colors duration-fast hover:text-ink"
            >
              {site.email}
            </a>
          </div>
        </div>

        {/* huge faint logotype — slight scroll parallax (§5.9) */}
        <motion.span
          aria-hidden
          style={reduced ? undefined : { y }}
          className="pointer-events-none mt-16 block select-none text-center font-display font-semibold leading-none tracking-[-0.02em] text-ink/[0.05] text-[clamp(4rem,18vw,16rem)]"
        >
          {site.name.split(' ')[0].toUpperCase()}
        </motion.span>

        <div className="relative z-10 mt-8 flex flex-col gap-2 border-t border-hairline pt-8 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted md:flex-row md:items-center md:justify-between">
          <span>{footer.legal}</span>
          <span>{footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
