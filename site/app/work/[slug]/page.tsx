import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal, { RevealItem } from '@/components/ui/Reveal';
import { work } from '@/lib/content';

/**
 * Case-study stub (DESIGN.md §0/§8): the route exists in the MVP so the cobalt
 * curtain transition has somewhere to land. Real content arrives in Phase 3.
 */
export function generateStaticParams() {
  return work.studies.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const study = work.studies.find((s) => s.slug === params.slug);
  return { title: study ? study.name : 'Work' };
}

export default function WorkCaseStudy({ params }: { params: { slug: string } }) {
  const study = work.studies.find((s) => s.slug === params.slug);
  if (!study) notFound();

  return (
    <main className="mx-auto max-w-container px-gutter py-section-y">
      <Reveal>
        <Link
          href="/#work"
          data-cursor="hover"
          className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink"
        >
          ← Back to work
        </Link>
      </Reveal>

      {/* reveal-stagger on enter (DESIGN.md §4.3 — new page content reveals on arrival) */}
      <Reveal stagger className="mt-10">
        <RevealItem as="p" className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
          {study.service}
        </RevealItem>
        <RevealItem as="h1" className="mt-4 font-display text-display leading-[0.95] text-ink">
          {study.name}
        </RevealItem>
        <RevealItem as="p" className="mt-6 font-mono text-h2 tabular-nums text-cobalt">
          {study.metric}
        </RevealItem>
        <RevealItem as="p" className="mt-8 max-w-[48ch] font-body text-lead text-ink-muted">
          Case-study detail is coming soon.{' '}
          {study.placeholder && '(Placeholder data — awaiting real metrics.)'}
        </RevealItem>
      </Reveal>
    </main>
  );
}
