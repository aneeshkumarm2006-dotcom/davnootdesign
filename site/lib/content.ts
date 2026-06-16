/**
 * lib/content.ts — single source of truth for all copy + data.
 * Ported from index.html where usable; DESIGN.md wins every conflict.
 * Placeholders ({{...}}) are intentional — do NOT invent client data or metrics.
 */

export const site = {
  name: 'Davnoot Digital',
  shortName: 'Davnoot',
  tagline: 'A full-stack growth studio working between Raipur and Montreal.',
  description:
    'Davnoot Digital is a full-stack growth studio working between Raipur and Montreal. We grow brands across search, social, email, AI SEO, and custom software.',
  url: 'https://davnoot.com',
  email: 'info@davnoot.com', // DESIGN.md §2/§8 — overrides prototype's hello@
  phone: '+1 (438) 223-7131',
  phoneHref: '+14382237131',
  locations: ['Montreal, QC', 'Raipur, IN'],
} as const;

export const nav = {
  links: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Approach', href: '#approach' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: { label: 'Start a project', href: '#contact' },
} as const;

export const hero = {
  // `software` renders in --cobalt; everything else in --ink.
  headline: ['We grow brands across search, social &', { cobalt: 'software' }, '.'],
  headlinePlain: 'We grow brands across search, social & software.',
  subhead: 'A full-stack growth studio working between Raipur and Montreal.',
  scrollHint: 'Scroll',
} as const;

export const trust = {
  eyebrow: 'Trusted to deliver',
  // {{CLIENT_LOGOS}} — fall back to service names, repeated (DESIGN.md §2 / Phase 2).
  items: ['SEO', 'Meta Ads', 'Email', 'AI SEO', 'Custom Software'],
} as const;

export type Service = {
  index: string;
  name: string;
  valueProp: string;
  /** abstract cobalt graphic key — drawn per panel in Phase 2 */
  graphic: 'graph-line' | 'audience-cluster' | 'send-trail' | 'answer-bubble' | 'code-grid';
};

export const services: Service[] = [
  {
    index: '01',
    name: 'SEO',
    valueProp: 'Compounding organic growth that outlasts ad budgets.',
    graphic: 'graph-line',
  },
  {
    index: '02',
    name: 'Meta Ads',
    valueProp: 'Paid social that finds buyers, not just impressions.',
    graphic: 'audience-cluster',
  },
  {
    index: '03',
    name: 'Email',
    valueProp: 'Owned-audience revenue on autopilot.',
    graphic: 'send-trail',
  },
  {
    index: '04',
    name: 'AI SEO',
    valueProp: 'Get cited by ChatGPT, Perplexity, and AI Overviews.',
    graphic: 'answer-bubble',
  },
  {
    index: '05',
    name: 'Custom Software',
    valueProp: "When off-the-shelf can't, we build it.",
    graphic: 'code-grid',
  },
];

export type CaseStudy = {
  slug: string;
  name: string;
  metric: string;
  service: string;
  thumbnail: string;
  placeholder: true;
};

// {{CASE_STUDIES}} — clearly-fake placeholders. Do NOT ship invented numbers (DESIGN.md §5.4).
export const work = {
  eyebrow: 'Selected work',
  studies: [
    {
      slug: 'placeholder-project-one',
      name: 'Project Placeholder',
      metric: '+XXX% organic traffic',
      service: 'SEO',
      thumbnail: '/work/placeholder-1.svg',
      placeholder: true,
    },
    {
      slug: 'placeholder-project-two',
      name: 'Project Placeholder',
      metric: 'X.Xx ROAS',
      service: 'Meta Ads',
      thumbnail: '/work/placeholder-2.svg',
      placeholder: true,
    },
    {
      slug: 'placeholder-project-three',
      name: 'Project Placeholder',
      metric: '+XXX% list revenue',
      service: 'Email',
      thumbnail: '/work/placeholder-3.svg',
      placeholder: true,
    },
  ] as CaseStudy[],
} as const;

export const process = {
  eyebrow: 'Approach',
  steps: [
    { index: '01', title: 'Audit', line: "We find what's leaking and what's working." },
    { index: '02', title: 'Strategy', line: 'A plan tied to revenue, not vanity metrics.' },
    { index: '03', title: 'Build', line: 'Pages, campaigns, and software that ship fast.' },
    { index: '04', title: 'Grow', line: 'We measure, iterate, and compound the wins.' },
  ],
} as const;

// {{IMPACT_NUMBERS}} — replace with real figures. Placeholders only (DESIGN.md §5.6).
export const impact = {
  numbers: [
    { value: '{{N}}', label: 'Clients' },
    { value: '{{$N}}', label: 'Revenue driven' },
    { value: '{{N}}%', label: 'Avg traffic lift' },
    { value: '{{N}}', label: 'Projects shipped' },
  ],
} as const;

export const dualContinent = {
  eyebrow: 'Two cities, one studio.',
  headline: 'We work where you are — across India and North America.',
  body: 'From Raipur to Montreal, we run growth and build software around the clock, so momentum never sleeps.',
} as const;

export const cta = {
  // `grow` renders in --cobalt.
  headline: ["Let's ", { cobalt: 'grow' }, '.'],
  headlinePlain: "Let's grow.",
  button: { label: 'Start a project', href: `mailto:${site.email}` },
} as const;

export const footer = {
  links: nav.links,
  legal: '© 2026 Davnoot Digital.',
  tagline: 'Made between Raipur & Montreal.',
  socials: [{ label: 'LinkedIn', href: '#' }],
} as const;
