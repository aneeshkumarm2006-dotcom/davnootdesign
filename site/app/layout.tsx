import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { site } from '@/lib/content';
import SmoothScroll from '@/components/providers/SmoothScroll';
import CustomCursor from '@/components/cursor/CustomCursor';

// Body — Inter via next/font, exposed as --font-body (no layout shift)
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

// Mono — Geist Mono via next/font, exposed as --font-mono
const geistMono = GeistMono;

// Display — Clash Display (Fontshare). Loaded async (see <head>) to avoid blocking paint.
const CLASH_CSS = 'https://api.fontshare.com/v2/css?f[]=clash-display@500,600&display=swap';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Full-stack growth studio`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: ['SEO', 'Meta Ads', 'email marketing', 'AI SEO', 'custom software', 'growth studio', 'Raipur', 'Montreal'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: `${site.name} — Full-stack growth studio`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Full-stack growth studio`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F8FA',
  width: 'device-width',
  initialScale: 1,
};

// Organization + WebSite JSON-LD (DESIGN.md §6) — NAP matches the contact block.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      description: site.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Montreal',
        addressRegion: 'QC',
        addressCountry: 'CA',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: site.email,
        telephone: site.phone,
        areaServed: ['CA', 'US', 'IN'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      name: site.name,
      url: site.url,
      description: site.description,
      publisher: { '@id': `${site.url}/#organization` },
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <head>
        {/* Display — Clash Display via Fontshare. Preconnect both the CSS API and
            the font-file CDN, then load the stylesheet asynchronously (preload +
            JS-attach) so it never blocks first paint; the <h1> paints in the
            fallback face and swaps to Clash Display on arrival (§6). */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="preload" as="style" href={CLASH_CSS} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(
              CLASH_CSS,
            )};l.media='print';l.onload=function(){l.media='all'};document.head.appendChild(l);})();`,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link rel="stylesheet" href={CLASH_CSS} />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Skip link — first tab stop, jumps past the nav to the content (§7). */}
        <a
          href="#top"
          className="sr-only z-[100] rounded-sm bg-ink px-4 py-2 font-body text-sm text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <CustomCursor />
      </body>
    </html>
  );
}
