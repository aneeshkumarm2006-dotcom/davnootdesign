'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { work } from '@/lib/content';
import { usePrefersReducedMotion, useIsTouch, useInteractionMount } from '@/lib/hooks';

// WebGL canvas is client-only and decorative — never SSR'd, never the LCP.
const WorkThumb = dynamic(() => import('./WorkThumb'), { ssr: false });

const thumbnails = work.studies.map((s) => s.thumbnail);

/** Capability probe: does this browser have a usable WebGL context? */
function webglSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

type Mode = 'pending' | 'webgl' | 'fallback' | 'none';

/**
 * Selected work (DESIGN.md §5.4 / Phase 3): case studies as large type rows,
 * each leading with its headline metric. Hovering a row floats a thumbnail that
 * tracks the cursor with a fluid GLSL displacement and shifts the row toward
 * --cobalt; clicking runs the cobalt curtain transition into /work/[slug].
 *
 * Three rendering modes, resolved after mount (so SSR ships only the semantic
 * rows — the LCP-safe, crawlable core):
 *  - webgl   → cursor-tracked displacement thumbnail
 *  - fallback→ static <img> crossfade card, no tracking (no-WebGL / reduced motion)
 *  - none    → no thumbnail at all (touch / coarse pointer)
 */
export default function Work() {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  // The displacement thumbnail (three.js) only ever shows on hover — a pointer
  // interaction. Hold its WebGL mount until the first interaction so three.js
  // stays off the initial load (§6); the row hover/colour shift works regardless.
  const interacted = useInteractionMount();
  const [mode, setMode] = useState<Mode>('pending');
  const [active, setActive] = useState(-1);

  // cursor-following position for the webgl thumbnail (trails down-right)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (touch) setMode('none');
    else if (reduced) setMode('fallback');
    else setMode(webglSupported() ? 'webgl' : 'fallback');
  }, [reduced, touch]);

  useEffect(() => {
    if (mode !== 'webgl') return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX + 28);
      y.set(e.clientY + 28);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mode, x, y]);

  const showThumb = active >= 0;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative mx-auto max-w-container px-gutter py-section-y"
      onMouseLeave={() => setActive(-1)}
    >
      <Reveal>
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
          {work.eyebrow}
        </p>
      </Reveal>
      <Reveal>
        <h2 id="work-heading" className="mt-4 max-w-[14ch] font-display text-h2 text-ink">
          Results that close deals.
        </h2>
      </Reveal>

      <ul className="mt-14 border-t border-hairline md:mt-20">
        {work.studies.map((study, i) => {
          const dimmed = active >= 0 && active !== i;
          const index = String(i + 1).padStart(2, '0');
          return (
            <li key={study.slug}>
              <Link
                href={`/work/${study.slug}`}
                data-cursor="view"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(-1)}
                style={{ opacity: dimmed ? 0.4 : 1 }}
                className="group grid grid-cols-1 items-baseline gap-2 border-b border-hairline py-7 transition-opacity duration-base ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-4 focus-visible:ring-offset-paper md:grid-cols-[auto_1fr_auto] md:gap-8 md:py-9"
              >
                <span className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-mono text-eyebrow text-ink-muted">{index}</span>
                  <span className="font-display text-h3 font-medium text-ink transition-colors duration-fast group-hover:text-cobalt group-focus-visible:text-cobalt">
                    {study.name}
                  </span>
                </span>

                {/* Lead with the metric (DESIGN.md §5.4) — mono, prominent. */}
                <span className="font-mono text-h3 tabular-nums text-ink md:justify-self-end md:text-right">
                  {study.metric}
                </span>

                <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted md:justify-self-end md:pl-6">
                  {study.service}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
        Placeholder metrics — real case studies coming soon.
      </p>

      {/* WebGL: cursor-tracked displacement thumbnail (mounts on first interaction) */}
      {mode === 'webgl' && interacted && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 aspect-[4/3] w-[clamp(200px,24vw,340px)] overflow-hidden rounded-md bg-paper shadow-2xl ring-1 ring-hairline"
          style={{ x: springX, y: springY }}
          initial={false}
          animate={{ opacity: showThumb ? 1 : 0, scale: showThumb ? 1 : 0.92 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <WorkThumb thumbnails={thumbnails} activeIndex={active} />
        </motion.div>
      )}

      {/* No-WebGL / reduced motion: static crossfade card, no tracking */}
      {mode === 'fallback' && (
        <div
          aria-hidden
          className="pointer-events-none fixed bottom-8 right-[var(--gutter)] z-40 hidden aspect-[4/3] w-[clamp(200px,22vw,320px)] overflow-hidden rounded-md bg-paper shadow-2xl ring-1 ring-hairline md:block"
          style={{ opacity: showThumb ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out-expo)' }}
        >
          {work.studies.map((study, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={study.slug}
              src={study.thumbnail}
              alt=""
              width={640}
              height={480}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-base ease-out-expo"
              style={{ opacity: active === i ? 1 : 0 }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
