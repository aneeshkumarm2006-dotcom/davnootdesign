'use client';

import { CSSProperties } from 'react';
import type { Service } from '@/lib/content';

/**
 * Abstract cobalt graphics for the Services pin (DESIGN.md §5.3). Each draws
 * itself when its panel becomes active: stroked shapes use a normalized
 * `pathLength={1}` with `stroke-dashoffset` 1→0, filled accents fade/scale in.
 * `drawn` is driven by the active index (pinned) or forced true (static list /
 * reduced motion), where the global CSS reset collapses the transition so the
 * graphic simply renders complete.
 */
type Props = {
  graphic: Service['graphic'];
  drawn: boolean;
  className?: string;
};

// Stroke that draws on with a per-element stagger.
const stroke = (drawn: boolean, i = 0): CSSProperties => ({
  strokeDasharray: 1,
  strokeDashoffset: drawn ? 0 : 1,
  transition: `stroke-dashoffset var(--dur-slow) var(--ease-out-expo) ${i * 0.1}s`,
});

// Filled accent that fades + scales in.
const fill = (drawn: boolean, i = 0): CSSProperties => ({
  opacity: drawn ? 1 : 0,
  transform: drawn ? 'scale(1)' : 'scale(0.4)',
  transformOrigin: 'center',
  transformBox: 'fill-box',
  transition: `opacity var(--dur-base) var(--ease-out-expo) ${i * 0.1}s, transform var(--dur-base) var(--ease-out-expo) ${i * 0.1}s`,
});

export default function ServiceGraphic({ graphic, drawn, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="presentation"
      aria-hidden
      className={className}
      fill="none"
      stroke="var(--cobalt)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {graphic === 'graph-line' && (
        <>
          {/* axis */}
          <path d="M34 28 V166 H176" pathLength={1} style={stroke(drawn, 0)} opacity={0.4} />
          {/* rising line */}
          <path
            d="M40 150 L74 132 L104 142 L134 96 L170 44"
            pathLength={1}
            style={stroke(drawn, 1)}
          />
          {/* arrow head */}
          <path d="M154 44 L170 44 L170 60" pathLength={1} style={stroke(drawn, 2)} />
          {/* data points */}
          {[
            [40, 150],
            [74, 132],
            [104, 142],
            [134, 96],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={3.5} fill="var(--cobalt)" stroke="none" style={fill(drawn, 2 + i * 0.4)} />
          ))}
        </>
      )}

      {graphic === 'audience-cluster' && (
        <>
          {/* concentric target */}
          <circle cx={100} cy={100} r={60} pathLength={1} style={stroke(drawn, 0)} opacity={0.4} />
          <circle cx={100} cy={100} r={34} pathLength={1} style={stroke(drawn, 1)} />
          {/* spokes to the cluster nodes */}
          {[
            [100, 40],
            [156, 86],
            [134, 158],
            [60, 158],
            [44, 86],
          ].map(([x, y], i) => (
            <path key={`s${i}`} d={`M100 100 L${x} ${y}`} pathLength={1} style={stroke(drawn, 1 + i * 0.3)} opacity={0.5} />
          ))}
          {/* center + nodes */}
          <circle cx={100} cy={100} r={6} fill="var(--cobalt)" stroke="none" style={fill(drawn, 1)} />
          {[
            [100, 40],
            [156, 86],
            [134, 158],
            [60, 158],
            [44, 86],
          ].map(([cx, cy], i) => (
            <circle key={`n${i}`} cx={cx} cy={cy} r={7} fill="var(--cobalt)" stroke="none" style={fill(drawn, 2 + i * 0.3)} />
          ))}
        </>
      )}

      {graphic === 'send-trail' && (
        <>
          {/* sweeping trail */}
          <path d="M24 150 C70 150 70 70 116 70 S176 110 176 56" pathLength={1} style={stroke(drawn, 0)} opacity={0.45} />
          {/* paper plane */}
          <path d="M150 40 L182 54 L156 78 Z" pathLength={1} style={stroke(drawn, 1)} />
          <path d="M150 40 L162 64 L156 78" pathLength={1} style={stroke(drawn, 2)} opacity={0.6} />
        </>
      )}

      {graphic === 'answer-bubble' && (
        <>
          {/* speech bubble */}
          <path
            d="M40 50 H160 Q172 50 172 62 V120 Q172 132 160 132 H78 L52 156 V132 H40 Q28 132 28 120 V62 Q28 50 40 50 Z"
            pathLength={1}
            style={stroke(drawn, 0)}
          />
          {/* answer lines */}
          <path d="M50 78 H150" pathLength={1} style={stroke(drawn, 1)} opacity={0.5} />
          <path d="M50 96 H120" pathLength={1} style={stroke(drawn, 1.4)} opacity={0.5} />
          {/* citation tick */}
          <path d="M96 112 L106 122 L128 96" pathLength={1} style={stroke(drawn, 2)} />
        </>
      )}

      {graphic === 'code-grid' && (
        <>
          {/* window */}
          <rect x={32} y={40} width={136} height={120} rx={10} pathLength={1} style={stroke(drawn, 0)} />
          <path d="M32 66 H168" pathLength={1} style={stroke(drawn, 0.6)} opacity={0.5} />
          {/* grid */}
          {[88, 116, 144].map((y, i) => (
            <path key={`h${i}`} d={`M32 ${y} H168`} pathLength={1} style={stroke(drawn, 1 + i * 0.3)} opacity={0.25} />
          ))}
          {[78, 124].map((x, i) => (
            <path key={`v${i}`} d={`M${x} 66 V160`} pathLength={1} style={stroke(drawn, 1.2 + i * 0.3)} opacity={0.25} />
          ))}
          {/* </> brackets */}
          <path d="M64 96 L52 112 L64 128" pathLength={1} style={stroke(drawn, 2)} />
          <path d="M136 96 L148 112 L136 128" pathLength={1} style={stroke(drawn, 2.3)} />
          <path d="M108 92 L92 132" pathLength={1} style={stroke(drawn, 2.6)} />
          {/* window dots */}
          {[44, 56, 68].map((cx, i) => (
            <circle key={`d${i}`} cx={cx} cy={53} r={3} fill="var(--cobalt)" stroke="none" style={fill(drawn, i * 0.3)} opacity={0.6} />
          ))}
        </>
      )}
    </svg>
  );
}
