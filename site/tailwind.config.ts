import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        cobalt: 'var(--cobalt)',
        navy: 'var(--navy)',
        hairline: 'var(--hairline)',
        'cobalt-soft': 'var(--cobalt-soft)',
        'paper-on-dark': 'var(--paper-on-dark)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        eyebrow: ['var(--text-eyebrow)', { lineHeight: '1', letterSpacing: '0.12em' }],
        body: ['var(--text-body)', { lineHeight: '1.6' }],
        lead: ['var(--text-lead)', { lineHeight: '1.5' }],
        h3: ['var(--text-h3)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['var(--text-h2)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        display: ['var(--text-display)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        container: 'var(--container)',
      },
      spacing: {
        gutter: 'var(--gutter)',
        'section-y': 'var(--space-section-y)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'in-out-quint': 'var(--ease-in-out)',
      },
      transitionDuration: {
        fast: '250ms',
        base: '600ms',
        slow: '900ms',
      },
    },
  },
  plugins: [],
};

export default config;
