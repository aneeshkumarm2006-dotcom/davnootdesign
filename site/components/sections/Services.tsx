'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { services, type Service } from '@/lib/content';
import { usePrefersReducedMotion } from '@/lib/hooks';
import ServiceGraphic from '@/components/sections/ServiceGraphic';

const TOTAL = services.length;

/**
 * One service panel: large mono index, display name, one-line value prop, and
 * the self-drawing cobalt graphic (DESIGN.md §5.3). Shared by the pinned
 * sequence and the static fallback list. Per the cobalt-once-per-viewport rule
 * the only cobalt on screen is the graphic — index, name, prop and rail stay
 * ink.
 */
function Panel({ service, drawn }: { service: Service; drawn: boolean }) {
  return (
    <div className="mx-auto grid w-full max-w-container grid-cols-1 items-center gap-10 px-gutter lg:grid-cols-2 lg:gap-16">
      <div>
        <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
          {service.index} / {TOTAL.toString().padStart(2, '0')}
        </span>
        <h2 className="mt-5 font-display font-semibold leading-[0.95] tracking-[-0.02em] text-ink text-[clamp(2.75rem,1.8rem+5vw,6.5rem)]">
          {service.name}
        </h2>
        <p className="mt-6 max-w-[26ch] font-body text-lead text-ink-muted">
          {service.valueProp}
        </p>
      </div>
      <div className="relative aspect-square w-full max-w-[300px] justify-self-center md:max-w-[400px] lg:justify-self-end">
        <ServiceGraphic graphic={service.graphic} drawn={drawn} className="h-full w-full" />
      </div>
    </div>
  );
}

/** Vertical progress rail — the active index in ink, the rest faint (§5.3).
 * Always mounted (only its visibility class changes) so the DOM stays
 * structurally stable across the pin/static breakpoint. */
function ProgressRail({ active, show }: { active: number; show: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute left-gutter top-1/2 z-20 -translate-y-1/2 flex-col gap-4 ${
        show ? 'hidden lg:flex' : 'hidden'
      }`}
    >
      {services.map((s, i) => (
        <div key={s.index} className="flex items-center gap-3">
          <span
            className="h-px transition-all duration-base ease-out-expo"
            style={{
              width: i === active ? 28 : 14,
              background: i === active ? 'var(--ink)' : 'var(--hairline)',
            }}
          />
          <span
            className={`font-mono text-[11px] tracking-[0.12em] transition-colors duration-base ${
              i === active ? 'text-ink' : 'text-ink-muted/40'
            }`}
          >
            {s.index}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Services (DESIGN.md §5.3 / Phase 2) — the centerpiece and the ONE GSAP
 * ScrollTrigger pin in the project. The section pins while each service fills
 * the viewport in turn; panels crossfade on scrub and the active graphic draws
 * itself. Under reduced motion or on mobile it unpins to a clean stacked list
 * with static graphics.
 */
export default function Services() {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 1023px)');
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const pinned = mounted && !reduced && !mobile;

  useLayoutEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    const pin = pinRef.current;
    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!section || !pin || panels.length !== TOTAL) return;

    // GSAP + ScrollTrigger are loaded on demand (this is the one pin in the
    // project, always below the fold) so they stay out of the initial JS parse
    // and off the hero's critical path (DESIGN.md §6).
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.set(panels[0], { autoAlpha: 1, yPercent: 0 });
        gsap.set(panels.slice(1), { autoAlpha: 0, yPercent: 6 });

        let last = -1;
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + window.innerHeight * TOTAL,
            scrub: 0.6,
            pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(TOTAL - 1, Math.floor(self.progress * TOTAL));
              if (idx !== last) {
                last = idx;
                setActive(idx);
              }
            },
          },
        });

        // Each service holds for ~a viewport, then crossfades to the next.
        for (let i = 1; i < panels.length; i++) {
          tl.to(panels[i - 1], { autoAlpha: 0, yPercent: -6 }, i).fromTo(
            panels[i],
            { autoAlpha: 0, yPercent: 6 },
            { autoAlpha: 1, yPercent: 0 },
            i,
          );
        }
      }, section);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [pinned]);

  // One stable DOM tree for both modes — only classes/props differ. Swapping
  // the whole subtree across the breakpoint would let React remove nodes GSAP
  // reparented into its pin-spacer (removeChild crash); toggling classes lets
  // ctx.revert() unwind the pin cleanly first. Pinned: outer section provides
  // scroll distance, inner 100svh layer is pinned, panels stack absolutely and
  // crossfade. Static (mobile / reduced motion, §5.3 / §7): normal flow, every
  // graphic drawn.
  return (
    <section
      id="services"
      aria-label="Services"
      ref={sectionRef}
      className={pinned ? 'relative' : 'mx-auto max-w-container px-gutter py-section-y'}
    >
      <div ref={pinRef} className={pinned ? 'relative h-[100svh] overflow-hidden' : ''}>
        <ProgressRail active={active} show={pinned} />
        {services.map((s, i) => (
          <div
            key={s.index}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={
              pinned
                ? 'absolute inset-0 flex items-center'
                : 'flex items-center py-16 md:py-24'
            }
          >
            <Panel service={s} drawn={pinned ? i === active : true} />
          </div>
        ))}
      </div>
    </section>
  );
}
