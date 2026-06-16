import { ImageResponse } from 'next/og';
import { site } from '@/lib/content';

/**
 * Open Graph / social share image (DESIGN.md §6). Generated at build time with
 * next/og so it always matches the brand — warm paper, ink headline, the one
 * cobalt word. No external font fetch so the build never blocks on the network.
 */
export const runtime = 'edge';
export const alt = `${site.name} — full-stack growth studio`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#F7F8FA';
const INK = '#0A0A0B';
const INK_MUTED = '#5A5C63';
const COBALT = '#1B3CFF';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: PAPER,
          color: INK,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: INK,
            fontWeight: 600,
          }}
        >
          {site.shortName}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: 86,
            lineHeight: 1.0,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            maxWidth: 1000,
          }}
        >
          We grow brands across search, social &nbsp;
          <span style={{ color: COBALT }}>software</span>.
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 30, color: INK_MUTED }}>
            A full-stack growth studio.
          </div>
          <div style={{ fontSize: 28, color: INK_MUTED, letterSpacing: '0.04em' }}>
            Raipur · Montreal
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
