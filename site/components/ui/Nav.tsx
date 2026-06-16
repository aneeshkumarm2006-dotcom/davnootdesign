'use client';

import { nav, site } from '@/lib/content';
import MagneticButton from './MagneticButton';

/**
 * Top nav (DESIGN.md §1 / Phase 0): logo left; links Work · Services ·
 * Approach · Contact; magnetic "Start a project" CTA right. Sticky, backdrop
 * blur, hairline bottom border.
 */
export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-paper/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-container items-center justify-between px-gutter py-4">
        <a
          href="#top"
          data-cursor="hover"
          className="font-display text-xl font-semibold tracking-tight text-ink"
        >
          {site.shortName}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.links.map((link) => (
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

        <MagneticButton href={nav.cta.href} className="hidden md:inline-flex">
          {nav.cta.label}
        </MagneticButton>
      </div>
    </header>
  );
}
