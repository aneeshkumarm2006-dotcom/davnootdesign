import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';

/**
 * robots.txt (DESIGN.md §6) — allow everything, point crawlers at the sitemap.
 * Nothing on this marketing site is private.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
