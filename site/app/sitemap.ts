import type { MetadataRoute } from 'next';
import { site, work } from '@/lib/content';

/**
 * sitemap.xml (DESIGN.md §6) — the single-page experience plus the case-study
 * routes. Slugs come from lib/content so the sitemap tracks real data once the
 * owner replaces the placeholders.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap[number] = {
    url: site.url,
    changeFrequency: 'monthly',
    priority: 1,
  };

  const caseStudies = work.studies.map((study) => ({
    url: `${site.url}/work/${study.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [home, ...caseStudies];
}
