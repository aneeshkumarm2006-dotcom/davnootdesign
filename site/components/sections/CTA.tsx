'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import { cta, nav, site } from '@/lib/content';
import { riseVariants, viewportOnce } from '@/lib/motion';
import { usePrefersReducedMotion, useInteractionMount } from '@/lib/hooks';

// Decorative WebGL — client-only so it stays off the SSR / LCP path (§6),
// matching the hero. This is the signature bookend (DESIGN.md §5.8).
const InkBlob = dynamic(() => import('@/components/three/InkBlob'), { ssr: false });

const contact = [
  { label: site.email, href: `mailto:${site.email}` },
  { label: site.phone, href: `tel:${site.phoneHref}` },
];

/**
 * CTA / contact (DESIGN.md §5.8 / Phase 4) — the loud closer that bookends the
 * signature. The cobalt blob returns at lower intensity behind the oversized
 * closing line ("Let's grow.", `grow` in cobalt), which rises by word on
 * scroll-in; a magnetic "Start a project" button and the contact NAP sit below.
 * Under reduced motion the line is plain text and the blob is a static wash.
 */
export default function CTA() {
  const reduced = usePrefersReducedMotion();
  // Same deferral as the hero (§6): three.js loads on first interaction, with a
  // static cobalt wash holding the space so the closer is never blank.
  const blobReady = useInteractionMount();

  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      className="relative flex min-h-[90svh] items-center overflow-hidden py-section-y"
    >
      {/* Returning blob — lower intensity than the hero (§5.8), centered behind. */}
      <div className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center">
        <div className="relative h-[90vw] w-[90vw] max-w-[820px] opacity-70 md:h-[60vw] md:w-[60vw]">
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-1000 ease-out-expo"
            style={{
              opacity: blobReady && !reduced ? 0 : 1,
              background:
                'radial-gradient(closest-side, rgba(27,60,255,0.16), rgba(232,236,255,0.10) 55%, transparent 76%)',
            }}
          />
          {blobReady && !reduced && <InkBlob />}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-container px-gutter text-center">
        <h2
          id="cta-heading"
          className="mx-auto font-display text-display font-semibold text-ink"
        >
          {reduced ? (
            <span>
              Let&rsquo;s <span className="text-cobalt">grow</span>.
            </span>
          ) : (
            <motion.span
              className="inline"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {["Let's", 'grow'].map((word, i) => {
                const isCobalt = word === 'grow';
                return (
                  <span key={word} className="inline">
                    <span className="relative inline-block overflow-hidden align-bottom">
                      <motion.span
                        className={`inline-block ${isCobalt ? 'text-cobalt' : ''}`}
                        variants={riseVariants}
                      >
                        {word}
                        {isCobalt && <span className="text-ink">.</span>}
                      </motion.span>
                    </span>
                    {i === 0 ? ' ' : ''}
                  </span>
                );
              })}
            </motion.span>
          )}
        </h2>

        <motion.div
          className="mt-12 flex flex-col items-center gap-8"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <MagneticButton href={nav.cta.href}>{nav.cta.label}</MagneticButton>

          <div className="flex flex-col items-center gap-x-8 gap-y-3 font-body text-body text-ink-muted sm:flex-row">
            {contact.map((c) => (
              <a
                key={c.href}
                href={c.href}
                data-cursor="hover"
                className="transition-colors duration-fast hover:text-ink"
              >
                {c.label}
              </a>
            ))}
            <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted/80">
              {site.locations.join(' · ')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
