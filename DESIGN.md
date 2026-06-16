# DESIGN.md — Davnoot Digital

Build spec for the Davnoot Digital marketing site. This document is the source of truth for art direction, design tokens, interaction systems, and section-by-section implementation. Build to it exactly. Where a value is marked `{{REPLACE}}`, leave a clearly-labeled placeholder for the owner to fill.

---

## 0. What we're building & assumptions

- **Product:** Single-page marketing site for Davnoot Digital, a full-stack growth studio (SEO, Meta Ads, Email, AI SEO / answer-engine ads, Custom Software) operating between Raipur and Montreal.
- **Audience:** Founders and marketing leads evaluating an agency. They decide on *credibility + results*, not novelty. The site must look award-tier but convert like a sales page.
- **The page's one job:** Make a qualified visitor request work via the contact CTA.
- **Architecture:** Primarily one long scroll page (`/`). Case studies live at `/work/[slug]` and are reached through a page transition; ship the routes as stubs in MVP, real content later.
- **Assumptions made here (change if wrong):**
  - Default fonts are the free Fontshare/Google set below so the build runs immediately. PP Neue Montreal is noted as a paid upgrade.
  - All client metrics and logos are placeholders until the owner supplies real data. Do not invent results.
  - Light theme, paper + ink + one electric blue, per brief. This is a deliberate choice, not a default — we are explicitly avoiding the cream/terracotta-serif and pure-black/acid-green AI clichés.

---

## 1. Art direction

**Thesis.** Premium does not mean dark here. The page is mostly warm paper and black ink with disciplined negative space — editorial, calm, expensive. All the drama is concentrated in **one signature** and two dark "punch" bands. Everything else stays quiet so the signature lands.

**The signature (spend the whole boldness budget here):** a **cursor-reactive cobalt ink blob** — a soft, slowly-warping fluid form in the hero rendered via a GLSL shader, that attracts and distorts toward the pointer. It reappears as the bookend at the closing CTA. This is the one thing the site is remembered by. Nothing else competes with it.

**Tension/release pacing.** Loud hero → quiet trust strip → loud pinned services → quiet work rows → quiet process → one loud blue impact band → quiet dual-continent → loud CTA. Never two loud sections back to back.

---

## 2. Design tokens

### 2.1 Color (6 core + tints)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F7F8FA` | Page background. Warm-cool, never pure white. |
| `--ink` | `#0A0A0B` | All primary text. |
| `--ink-muted` | `#5A5C63` | Secondary text, captions. |
| `--cobalt` | `#1B3CFF` | The one accent. Links, blob, key word in headlines. Use sparingly. |
| `--navy` | `#0A1F44` | Background of the two dark bands only. |
| `--hairline` | `#E4E6EB` | Borders, dividers, card edges (use at 0.5px feel). |
| `--cobalt-soft` | `#E8ECFF` | Tint fills, hover wash, blob highlight. |
| `--paper-on-dark` | `#F7F8FA` | Text on navy bands. |

Rule: cobalt appears at most once per viewport. If two cobalt things are on screen, make one of them ink.

### 2.2 Type (3 roles)

- **Display — Clash Display** (Fontshare, free). Headlines, kinetic type, section titles. Weights 500/600. *Paid upgrade: PP Neue Montreal (Pangram Pangram) — swap the `--font-display` var if licensed.*
- **Body / UI — Inter** (Google/`next/font`). Paragraphs, buttons, nav. Weights 400/500.
- **Mono / data — Geist Mono** (or JetBrains Mono). Section indices (01–05), metrics, eyebrow labels. This gives the numbers an editorial/technical edge and keeps them visually distinct from prose. Weight 400.

Type scale (clamp for fluid sizing):

```
--text-eyebrow: 0.75rem;                                   /* mono, uppercase, 0.12em tracking */
--text-body:    1rem;
--text-lead:    clamp(1.125rem, 1rem + 0.6vw, 1.375rem);
--text-h3:      clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
--text-h2:      clamp(2.25rem, 1.6rem + 3.2vw, 4rem);
--text-display: clamp(3rem, 1.5rem + 8vw, 9rem);            /* hero + closing CTA */
```

Display headlines: line-height 0.95, letter-spacing -0.02em. Body: line-height 1.6.

### 2.3 Spacing, radius, layout

```
--space-section-y: clamp(6rem, 10vh, 11rem);   /* vertical rhythm between sections */
--container: 1320px;                            /* max content width */
--gutter: clamp(1.25rem, 4vw, 4rem);            /* page side padding */
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 20px;
```

Grid: 12-col, gutter `--gutter`, max `--container`, centered. Most content sits in cols 2–11; hero type may bleed wider.

### 2.4 Motion tokens

```
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);   /* default reveal + UI */
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);  /* page transitions */
--dur-fast: 0.25s;
--dur-base: 0.6s;
--dur-slow: 0.9s;
```

Reveal primitive (used everywhere on scroll-in): opacity 0→1, translateY 24px→0, `--dur-slow`, `--ease-out-expo`, stagger 0.06s between siblings.

### 2.5 globals.css (drop in `app/globals.css`)

```css
:root {
  --paper:#F7F8FA; --ink:#0A0A0B; --ink-muted:#5A5C63;
  --cobalt:#1B3CFF; --navy:#0A1F44; --hairline:#E4E6EB;
  --cobalt-soft:#E8ECFF; --paper-on-dark:#F7F8FA;
  --font-display:'Clash Display',sans-serif;
  --font-body:'Inter',sans-serif;
  --font-mono:'Geist Mono',monospace;
  --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
  --ease-in-out:cubic-bezier(0.65,0,0.35,1);
  --dur-fast:.25s; --dur-base:.6s; --dur-slow:.9s;
  --container:1320px; --gutter:clamp(1.25rem,4vw,4rem);
}
* { box-sizing:border-box; margin:0; padding:0; }
html.lenis { height:auto; }
body { background:var(--paper); color:var(--ink); font-family:var(--font-body); -webkit-font-smoothing:antialiased; }
::selection { background:var(--cobalt); color:var(--paper); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.001ms !important; transition-duration:.001ms !important; }
}
```

Map these into Tailwind via `tailwind.config.ts` `theme.extend.colors`/`fontFamily` so utilities like `bg-paper text-ink text-cobalt font-display` exist. Wire Clash Display through Fontshare CSS in `<head>`; load Inter and Geist Mono with `next/font` and expose them as the `--font-body` / `--font-mono` vars.

---

## 3. Tech stack & dependencies

Matches the existing Davnoot stack.

- **Next.js 14** (App Router, TypeScript, RSC where possible; interactive sections are client components)
- **Tailwind CSS** (tokens mapped as above)
- **Framer Motion v11** — 90% of motion: reveals, magnetic button, custom cursor, page transitions, marquee
- **Lenis** (`lenis` / `@studio-freight/lenis`) — smooth scroll, the modern Locomotive successor
- **GSAP + ScrollTrigger** — used in exactly one place: the pinned services sequence (Section 5). Do not use GSAP elsewhere; Framer covers the rest.
- **React Three Fiber + drei** (`@react-three/fiber`, `@react-three/drei`, `three`) — only the hero/CTA blob shader
- **Work thumbnail distortion:** prefer `gl-image-hover` / Robin Delaporte's `hover-effect` (lightweight WebGL displacement) over a custom R3F plane. Fall back to a CSS/Framer crossfade if WebGL is unavailable.

```bash
npm i framer-motion lenis gsap three @react-three/fiber @react-three/drei
npm i -D @types/three
# thumbnail displacement (optional, lighter than R3F):
npm i hover-effect
```

Lenis + GSAP must share one RAF loop and `ScrollTrigger.update` must be called from Lenis's scroll event (see Section 4.1).

---

## 4. Global systems (build these first, before any section)

### 4.1 Smooth scroll (Lenis)

Wrap the app in a `SmoothScrollProvider` (client). Single RAF; drive GSAP from it:

```ts
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

Disable smoothing entirely under `prefers-reduced-motion`.

### 4.2 Custom cursor

A small `--ink` dot (10px) that follows the pointer with a slight spring (Framer `useSpring`, stiffness ~300, damping ~30). States:
- default: 10px dot
- over interactive (`[data-cursor="hover"]`): grows to 56px, becomes `--cobalt` at 15% opacity ring with the element label optionally inside
- over work rows: shows a small "View →" mono label
Hide entirely on touch devices and under reduced motion (fall back to native cursor).

### 4.3 Page transitions

Cobalt curtain wipe between routes (`/` ↔ `/work/[slug]`). A full-screen `--cobalt` panel slides up to cover, route swaps, panel slides up and away to reveal. `--ease-in-out`, ~0.7s total. Implement with Framer `AnimatePresence` + Next route events (or a template.tsx transition). New page content does a reveal stagger on enter.

### 4.4 Magnetic button

Reusable `<MagneticButton>`: on pointer move within bounds, translate the button toward the cursor (max ~12px) and the inner label slightly more (parallax); spring back on leave. Used on primary CTAs and the closing "Let's grow." Disabled under reduced motion.

### 4.5 Reveal + SplitText primitives

- `<Reveal>` wrapper: applies the reveal primitive (2.4) via Framer `whileInView`, `once: true`, viewport margin `-10%`.
- `<SplitText>`: splits a headline into words (and optionally lines) wrapped in spans for staggered rise. Use for hero, section titles, CTA. Respect reduced motion (render plain text, no transform).

---

## 5. Sections (top to bottom)

Each section: **purpose · layout · copy · motion · implementation**. Copy is real and final unless marked `{{REPLACE}}` — write in sentence case, active voice.

### Section 0 — Preloader

- **Purpose:** Set the premium tone and mask asset/WebGL load. The intro *is* part of the experience.
- **Layout:** Full-screen `--paper`. Centered: `DAVNOOT` logotype assembling, a mono 0→100 counter bottom-corner.
- **Motion:** Counter ticks 0→100 (~1.2s). Logotype letters rise/settle via SplitText. On complete, a `--cobalt` panel wipes up and off to reveal the hero (hands off into the page-transition system). Hard cap total ≤ 1.5s; if assets aren't ready, reveal anyway.
- **Impl:** Show once per session (sessionStorage flag). Skip immediately under reduced motion.

### Section 1 — Hero (make-or-break)

- **Purpose:** State the promise + plant the signature.
- **Layout:** Full viewport. Oversized kinetic headline center-left in `--ink`. The cobalt blob canvas occupies the right/behind region, bleeding off the right edge. Minimal top nav (logo left; links: Work, Services, Approach, Contact; right). Scroll hint bottom-center (mono).
- **Copy:**
  - Headline (display, one word cobalt): **We grow brands across search, social & `software`.** (`software` in `--cobalt`)
  - Subhead (lead, ink-muted): A full-stack growth studio working between Raipur and Montreal.
  - Nav CTA (magnetic): Start a project
  - Scroll hint: Scroll
- **Motion:** On reveal (post-preloader): headline words rise with SplitText stagger; subhead + CTA follow. Blob is alive immediately, drifting slowly; it attracts/distorts toward the cursor.
- **Impl — the blob shader:** Full-quad plane in an R3F `<Canvas>` (transparent, `dpr={[1, 1.5]}`, `frameloop` paused when offscreen via IntersectionObserver). Fragment shader = domain-warped fbm noise forming a soft metaball, color-ramped between `--cobalt` and `--cobalt-soft` over `--paper`. Uniforms: `uTime`, `uMouse` (vec2, smoothed/lerped), `uResolution`, `uHover`. Mouse adds a radial attractor that displaces the noise field toward the pointer. **Critical:** the LCP element is the real `<h1>` text, never the canvas. Canvas is decorative and must not block first paint.

### Section 2 — Trust marquee

- **Purpose:** Instant credibility right after the hero.
- **Layout:** Single full-bleed horizontal strip. Client logos (or service names as fallback) in monochrome `--ink-muted`, generous spacing, hairline top/bottom.
- **Copy:** Eyebrow (mono): Trusted to deliver. Items: `{{CLIENT_LOGOS}}` — fall back to: SEO · Meta Ads · Email · AI SEO · Custom Software, repeated.
- **Motion:** Infinite loop. Base auto-scroll, with speed coupled to scroll velocity (scroll fast → marquee whips). Locomotive trick.
- **Impl:** Duplicate the track for seamless loop; drive with Framer + a velocity value from Lenis. Pause/auto only (no velocity coupling) under reduced motion.

### Section 3 — Services (centerpiece, pinned scroll sequence)

- **Purpose:** The hero moment of the scroll. Show the five offerings with weight.
- **Layout:** Section pins for its duration; each service takes the full viewport one at a time as you scroll through. Per service: large mono index (`01`–`05`), service name in display kinetic type, one-line value prop, and an abstract cobalt graphic that draws itself. A thin progress rail (left or bottom) shows position in the five.
- **Numbering note:** Indices here are justified — they encode scroll position within the pin (1 of 5), so they carry real information, not decoration.
- **Copy (write the value props this tight):**
  - `01` **SEO** — Compounding organic growth that outlasts ad budgets.
  - `02` **Meta Ads** — Paid social that finds buyers, not just impressions.
  - `03` **Email** — Owned-audience revenue on autopilot.
  - `04` **AI SEO** — Get cited by ChatGPT, Perplexity, and AI Overviews.
  - `05` **Custom Software** — When off-the-shelf can't, we build it.
- **Graphics (each draws in `--cobalt` on scroll):** SEO = rising graph line; Meta Ads = a target/audience cluster forming; Email = a send-trail sweeping across; AI SEO = an answer bubble with a citation tick; Custom Software = a code/grid assembling.
- **Motion:** Pinned vertical swap (clean) — each service crossfades/slides as the pin progresses; index and graphic animate per panel. (Horizontal scroll-jack is the more dramatic alternative; default to vertical for reliability.)
- **Impl:** The *one* GSAP ScrollTrigger pin in the project. Under reduced motion: unpin and render the five as a normal stacked list, graphics static.

### Section 4 — Selected work / results (the sales engine)

- **Purpose:** Prove outcomes. This closes deals.
- **Layout:** A list of case studies as large type rows. Each row: project name (display) + headline metric (mono, e.g. `+212% organic traffic`) + service tag. Hovering a row floats a project thumbnail that follows the cursor.
- **Copy:** Eyebrow (mono): Selected work. Rows = `{{CASE_STUDIES}}`. Lead each with the **metric**, not the image. Example row format (replace with real data): `Project name — +XXX% {metric} — {service}`. Do not ship invented numbers; use clearly-fake placeholders until real results are supplied.
- **Motion:** On hover, thumbnail fades in and tracks the pointer with a fluid GLSL displacement (`hover-effect`). Row text shifts color toward `--cobalt`. Click → cobalt curtain transition into `/work/[slug]`.
- **Impl:** Thumbnails preloaded small; displacement map shared. Under reduced motion / no-WebGL: thumbnail is a simple static crossfade, no tracking.

### Section 5 — Approach / process

- **Purpose:** Deliberate calm after the services intensity. Show how you work.
- **Layout:** Four steps connected by a thin vertical/horizontal `--cobalt` line. Per step: mono index, title, one line.
- **Numbering note:** This *is* a true sequence, so numbering is correct here.
- **Copy:**
  - `01` **Audit** — We find what's leaking and what's working.
  - `02` **Strategy** — A plan tied to revenue, not vanity metrics.
  - `03` **Build** — Pages, campaigns, and software that ship fast.
  - `04` **Grow** — We measure, iterate, and compound the wins.
- **Motion:** Steps reveal in sequence on scroll-in; the connecting line draws itself; any counts tick up. Restrained on purpose.
- **Impl:** Framer `whileInView` stagger + an SVG line with animated `pathLength`.

### Section 6 — Impact band (the one blue-dominant moment)

- **Purpose:** Single visual punch; break the paper rhythm exactly once.
- **Layout:** Full-bleed `--navy`/`--cobalt` band, `--paper-on-dark` type. 3–4 big numbers with mono labels.
- **Copy (replace with real figures):** `{{N}}` clients · `{{$N}}` revenue driven · `{{N}}%` avg traffic lift · `{{N}}` projects shipped.
- **Motion:** Numbers count up when the band scrolls into view (once). Subtle grain or a faint blob echo behind, very low contrast.
- **Impl:** Count-up via Framer `useInView` + animated value. Static final numbers under reduced motion.

### Section 7 — Raipur ↔ Montreal

- **Purpose:** The differentiator almost no agency can claim. Two continents, one studio.
- **Layout:** Editorial, type-led. A subtle two-point motif (two dots joined by a thin cobalt arc/line) suggesting the two cities. Light, lots of space.
- **Copy:** Eyebrow (mono): Two cities, one studio. Headline (h2): We work where you are — across India and North America. Body (lead): From Raipur to Montreal, we run growth and build software around the clock, so momentum never sleeps.
- **Motion:** The arc draws between the two points on scroll-in; headline reveals by line.
- **Impl:** Inline SVG arc with animated `pathLength`; `<Reveal>` for text.

### Section 8 — CTA / contact (loud closer)

- **Purpose:** The conversion moment. Bookend the signature.
- **Layout:** Oversized closing line, the blob returns behind/beside it, magnetic primary button, contact details below.
- **Copy:**
  - Closing line (display, `grow` in cobalt): Let's `grow`.
  - Primary (magnetic): Start a project
  - Email: info@davnoot.com
  - Phone: +1 (438) 223-7131
  - Location: Montreal, QC · Raipur, IN
- **Motion:** Closing line rises via SplitText on scroll-in; blob re-enters and reacts to cursor; button is magnetic.
- **Impl:** Reuse the hero blob component (lower intensity). `mailto:` and `tel:` links wired. Form optional in v1 — email link is fine for MVP.

### Section 9 — Footer

- **Purpose:** Quiet, confident exit.
- **Layout:** Huge faint `DAVNOOT` background logotype. Nav links, the marquee once more, socials, legal line. Custom cursor still playful here.
- **Copy:** Links: Work · Services · Approach · Contact. Legal: © 2026 Davnoot Digital. Optional: Made between Raipur & Montreal.
- **Motion:** Background logotype parallaxes slightly on scroll. Minimal otherwise.

---

## 6. Performance & SEO (hard requirements — non-negotiable)

You sell SEO; the site must out-perform the award sites it borrows from, which are notoriously poor on Core Web Vitals.

- **LCP element is real `<h1>` text**, not a canvas or image. Hero text paints before any WebGL.
- **Lazy-load all WebGL/below-the-fold canvases.** Blob canvas mounts after first paint; services/work WebGL mounts on approach (IntersectionObserver). Pause RAF when offscreen.
- **Cap `dpr` at 1.5** on all R3F canvases. No 4K shader work.
- Targets: **Lighthouse ≥ 90** mobile across Performance/SEO/Best-Practices/Accessibility; CLS < 0.1; LCP < 2.5s on mid-tier mobile.
- Self-host/`next/font` for Inter & Geist Mono (no layout shift); preload Clash Display.
- `next/image` for all raster; explicit width/height to prevent CLS.
- Semantic landmarks, one `<h1>`, logical heading order, real `<a>`/`<button>`.
- Metadata: title/description, Open Graph + Twitter card, `Organization` + `WebSite` JSON-LD (NAP: info@davnoot.com, +1 (438) 223-7131, Montreal). Sitemap + robots.

---

## 7. Accessibility (quality floor)

- **`prefers-reduced-motion`** honored globally: no smooth-scroll lerp, no SplitText transforms, no marquee velocity coupling, services unpinned to a static list, blob static or hidden, custom cursor off. The site must be fully usable and good-looking with all motion removed.
- Visible keyboard focus on every interactive element (cobalt focus ring).
- Color contrast: ink on paper and paper-on-dark on navy both meet WCAG AA. Don't put body text in `--cobalt`.
- Custom cursor never hides the real one on touch/keyboard; pointer states are enhancement only.
- Respect `tabindex` order matching visual order; case-study rows reachable and activatable by keyboard.

---

## 8. Project structure

```
app/
  layout.tsx                # fonts, metadata, providers
  template.tsx              # page-transition wrapper
  page.tsx                  # the single-page experience (composes sections)
  globals.css
  work/[slug]/page.tsx      # case study (stub in MVP)
components/
  providers/SmoothScroll.tsx
  cursor/CustomCursor.tsx
  ui/MagneticButton.tsx
  ui/Reveal.tsx
  ui/SplitText.tsx
  ui/Marquee.tsx
  three/InkBlob.tsx         # R3F canvas + shader
  three/shaders/blob.glsl.ts
  sections/Preloader.tsx
  sections/Hero.tsx
  sections/TrustMarquee.tsx
  sections/Services.tsx     # the one GSAP pin
  sections/Work.tsx
  sections/Process.tsx
  sections/Impact.tsx
  sections/DualContinent.tsx
  sections/CTA.tsx
  sections/Footer.tsx
lib/
  content.ts                # all copy + services + (placeholder) case studies, single source
  motion.ts                 # shared variants/easings
```

Keep all copy and data in `lib/content.ts` so it's edited in one place.

---

## 9. Build plan (phased — follow this order)

**Phase 0 — Foundation.** Scaffold Next 14 + TS + Tailwind. Tokens into `globals.css` + `tailwind.config`. Fonts wired. `SmoothScroll`, `CustomCursor`, page-transition `template.tsx`, `Reveal`, `SplitText`, `MagneticButton`. Layout shell + nav + `lib/content.ts`.
*Done when:* a blank page scrolls smoothly, custom cursor works, reduced-motion path verified, reveals fire.

**Phase 1 — Hero + signature.** `InkBlob` shader (cursor-reactive, lazy, dpr-capped). Hero kinetic headline (real `<h1>` LCP). Preloader handing off to hero.
*Done when:* blob reacts to cursor, hero text is LCP, preloader ≤1.5s, mobile looks right.

**Phase 2 — Marquee + Services pin.** TrustMarquee with velocity coupling. The single GSAP ScrollTrigger pinned five-service sequence with self-drawing graphics + progress rail.
*Done when:* pin is smooth on desktop, unpins to a clean list under reduced motion / mobile.

**Phase 3 — Work + transitions.** Case-study rows with cursor-tracking displacement thumbnails. Cobalt curtain transition into `/work/[slug]` stubs.
*Done when:* hover reveal is fluid, no-WebGL fallback works, transition runs both directions.

**Phase 4 — Process, Impact, Dual-continent, CTA, Footer.** Process step reveals + drawn line. Navy impact band with count-up. Raipur↔Montreal arc. Closing CTA with returning blob + magnetic button + contact. Footer.
*Done when:* full page reads top-to-bottom with correct tension/release pacing.

**Phase 5 — Polish.** Lighthouse pass to the Section 6 targets. Full reduced-motion audit. Keyboard pass. Metadata + JSON-LD + sitemap/robots. Cross-browser (Safari WebGL especially) + responsive 360px→1440px.
*Done when:* all hard requirements in Sections 6 & 7 pass.

---

## 10. Open items for the owner

Leave labeled placeholders; do not invent:

- `{{CLIENT_LOGOS}}` — real client logos (or keep service-name fallback).
- `{{CASE_STUDIES}}` — project names, real metrics, thumbnails, slugs.
- `{{IMPACT_NUMBERS}}` — real figures for the impact band.
- Font decision: ship on free Clash Display + Inter + Geist Mono, or license PP Neue Montreal and swap `--font-display`.
- Whether the contact CTA opens a form or stays a `mailto:` for v1 (MVP: `mailto:`).