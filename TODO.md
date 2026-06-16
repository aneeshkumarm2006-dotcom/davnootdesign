# TODO — Davnoot Digital (Next.js rebuild)

Build a single-page marketing site for **Davnoot Digital**, a full-stack growth studio operating between **Raipur and Montreal**.

**Source of truth:** `DESIGN.md` (art direction, tokens, sections, motion). This is non-negotiable — build to it exactly.
**Content reference:** `index.html` (existing static prototype — mine copy/data from it, but DESIGN.md's design wins every conflict).

> ⚠️ **Design comes first.** The existing `index.html` uses an indigo/grey Material palette, Space Grotesk, and a 6-card sticky-stack services section. We are **replacing** that with DESIGN.md's direction: warm paper + ink + **one electric cobalt**, Clash Display, and a **cursor-reactive cobalt ink blob** as the signature. Do not carry over the old look.

---

## Design north star (read before writing any code)

- **Thesis:** Premium ≠ dark. Mostly warm paper (`#F7F8FA`) + black ink, disciplined negative space — editorial, calm, expensive.
- **The one signature:** a GLSL **cobalt ink blob** in the hero that attracts/distorts toward the cursor. It returns at the closing CTA. Nothing else competes with it.
- **Pacing (tension/release):** loud hero → quiet trust → loud pinned services → quiet work → quiet process → one loud blue impact band → quiet dual-continent → loud CTA. **Never two loud sections back-to-back.**
- **Cobalt rule:** appears at most **once per viewport**. If two cobalt things are on screen, make one ink.
- **Accessibility floor:** the site must look great with *all motion removed* (`prefers-reduced-motion`).

---

## Phase 0 — Foundation & design system

*Done when: a blank page scrolls smoothly, custom cursor works, reduced-motion path verified, reveals fire.*

### Scaffold
- [x] Init Next.js 14 (App Router, TypeScript, RSC by default; interactive sections are client components).
- [x] Install Tailwind CSS.
- [x] Install motion/3D deps: `framer-motion lenis gsap three @react-three/fiber @react-three/drei`; dev `@types/three`; optional `hover-effect`. *(hover-effect deferred to Phase 3.)*

### Design tokens (the critical design step)
- [x] Drop the token block from `DESIGN.md §2.5` into `app/globals.css` `:root` — colors, fonts, motion, layout vars.
  - Colors: `--paper #F7F8FA`, `--ink #0A0A0B`, `--ink-muted #5A5C63`, `--cobalt #1B3CFF`, `--navy #0A1F44`, `--hairline #E4E6EB`, `--cobalt-soft #E8ECFF`, `--paper-on-dark #F7F8FA`.
  - Add `::selection` (cobalt/paper) and the `prefers-reduced-motion` reset.
- [x] Map tokens into `tailwind.config.ts` (`theme.extend.colors` / `fontFamily`) so `bg-paper text-ink text-cobalt font-display` utilities exist.
- [x] Add the fluid type scale (`--text-eyebrow … --text-display`, clamp-based) per `DESIGN.md §2.2`.
- [x] Add spacing/radius/motion tokens (`--space-section-y`, `--container: 1320px`, `--gutter`, radii, easings, durations).

### Fonts (no layout shift — design + perf)
- [x] **Display — Clash Display** via Fontshare CSS in `<head>`, preloaded. (Paid upgrade path: PP Neue Montreal — swap `--font-display` only.)
- [x] **Body — Inter** via `next/font`, exposed as `--font-body`.
- [x] **Mono — Geist Mono** (or JetBrains Mono) via `next/font`, exposed as `--font-mono` — used for indices, metrics, eyebrows.

### Global systems (build before any section — `DESIGN.md §4`)
- [x] `components/providers/SmoothScroll.tsx` — Lenis (`lerp 0.1`), single RAF shared with GSAP; `lenis.on('scroll', ScrollTrigger.update)`. Disable smoothing under reduced motion.
- [x] `components/cursor/CustomCursor.tsx` — 10px ink dot w/ spring; grows to 56px cobalt ring over `[data-cursor="hover"]`; "View →" label over work rows. Off on touch + reduced motion.
- [x] `app/template.tsx` — page-transition wrapper: cobalt curtain wipe (`/` ↔ `/work/[slug]`), ~0.7s, `--ease-in-out`, via `AnimatePresence`.
- [x] `components/ui/MagneticButton.tsx` — translate toward cursor (≤12px), inner label parallax, spring back. Off under reduced motion.
- [x] `components/ui/Reveal.tsx` — reveal primitive (opacity 0→1, y 24→0, `--dur-slow`, `--ease-out-expo`, stagger 0.06s), `whileInView once`, margin `-10%`.
- [x] `components/ui/SplitText.tsx` — split headline into words/lines for staggered rise; plain text under reduced motion.
- [x] `components/ui/Marquee.tsx` — reusable infinite track.

### Content + shell
- [x] `lib/content.ts` — single source for all copy + services + placeholder case studies + nav (port real copy from `index.html`; see content map below).
- [x] `lib/motion.ts` — shared Framer variants/easings.
- [x] `app/layout.tsx` — fonts, metadata, providers (SmoothScroll, CustomCursor).
- [x] `app/page.tsx` — composes all sections in pacing order. *(Phase 0 shell exercising all global systems; real sections replace it in Phases 1–4.)*
- [x] Top nav: logo left; links **Work · Services · Approach · Contact**; magnetic **Start a project** CTA right. Sticky, backdrop blur, hairline border.

---

## Phase 1 — Hero + the signature blob

*Done when: blob reacts to cursor, hero `<h1>` is the LCP, preloader ≤1.5s, mobile looks right.*

- [x] `components/three/InkBlob.tsx` + `components/three/shaders/blob.glsl.ts`
  - R3F `<Canvas>`, transparent, `dpr={[1, 1.5]}`, `frameloop` paused offscreen (IntersectionObserver).
  - Fragment shader: domain-warped fbm noise → soft metaball, color-ramped `--cobalt`↔`--cobalt-soft` over `--paper`.
  - Uniforms: `uTime`, `uMouse` (smoothed/lerped), `uResolution`, `uHover`. Mouse = radial attractor displacing the field.
  - **Critical:** canvas is decorative and must NOT be the LCP or block first paint. *(client-only dynamic import, ssr:false; reduced-motion → static cobalt wash.)*
- [x] `components/sections/Hero.tsx`
  - Full viewport. Oversized kinetic `<h1>` center-left in ink; blob canvas bleeds off the right edge.
  - Headline (one word cobalt): **We grow brands across search, social & `software`.** (`software` = `--cobalt`).
  - Subhead (lead, ink-muted): *A full-stack growth studio working between Raipur and Montreal.*
  - Scroll hint bottom-center (mono): *Scroll*.
  - Real `<h1>` text is the **LCP** — paints before WebGL. SplitText word rise on reveal; subhead + CTA follow.
- [x] `components/sections/Preloader.tsx`
  - Full-screen paper; `DAVNOOT` logotype assembling + mono 0→100 counter. Cobalt panel wipes up to reveal hero.
  - Hard cap ≤1.5s; show once per session (sessionStorage); skip under reduced motion.

---

## Phase 2 — Trust marquee + Services pin

*Done when: pin is smooth on desktop, unpins to a clean list under reduced motion / mobile.*

- [x] `components/sections/TrustMarquee.tsx`
  - Full-bleed strip, hairline top/bottom, items monochrome `--ink-muted`, eyebrow (mono): *Trusted to deliver*.
  - Items: `{{CLIENT_LOGOS}}` placeholder → fallback `SEO · Meta Ads · Email · AI SEO · Custom Software`, repeated.
  - Infinite loop, speed coupled to Lenis scroll velocity. Pause/auto-only under reduced motion. *(Lenis velocity bridged via `lib/lenis.ts`; `Marquee` gained an optional `getBoost` prop.)*
- [x] `components/sections/Services.tsx` — **the centerpiece; the ONE GSAP ScrollTrigger pin in the project.**
  - Section pins; each service fills the viewport one at a time as you scroll.
  - Per service: large mono index `01–05`, display kinetic name, one-line value prop, self-drawing cobalt graphic; thin progress rail.
  - Value props (write this tight):
    - `01` **SEO** — Compounding organic growth that outlasts ad budgets.
    - `02` **Meta Ads** — Paid social that finds buyers, not just impressions.
    - `03` **Email** — Owned-audience revenue on autopilot.
    - `04` **AI SEO** — Get cited by ChatGPT, Perplexity, and AI Overviews.
    - `05` **Custom Software** — When off-the-shelf can't, we build it.
  - Graphics (each draws in cobalt): SEO = rising graph line; Meta Ads = audience cluster forming; Email = send-trail sweep; AI SEO = answer bubble + citation tick; Custom Software = code/grid assembling.
  - [x] **Reduced motion / mobile:** unpin → render the five as a normal stacked list, graphics static. *(Single stable DOM tree toggled by class — avoids the React/GSAP pin-spacer `removeChild` crash on breakpoint switch; verified both directions + reduced-motion emulation.)*
  - > Note: DESIGN.md specifies **5** services (merges the prototype's "ChatGPT Ads" into "AI SEO"). Use 5. Don't carry the old 6-card sticky stack.

---

## Phase 3 — Selected work + transitions

*Done when: hover reveal is fluid, no-WebGL fallback works, transition runs both directions.*

- [x] `components/sections/Work.tsx`
  - Case studies as large type rows: project name (display) + headline metric (mono, e.g. `+212% organic traffic`) + service tag. **Lead with the metric, not the image.**
  - Hover: thumbnail fades in + tracks cursor with GLSL displacement (`hover-effect`); row text shifts toward cobalt. *(Custom R3F displacement quad — `WorkThumb.tsx` + `shaders/displacement.glsl.ts` — reusing the existing three/R3F stack instead of adding the unmaintained `hover-effect` dep, which is built for fixed hover-swap not a cursor-tracked float. SVG placeholders rasterized to a CanvasTexture; warp replays on each row change. Hovered row dims its siblings and shifts to cobalt.)*
  - Click → cobalt curtain transition into `/work/[slug]`. *(Next `<Link>` → existing `template.tsx` curtain; verified both directions.)*
  - **No-WebGL / reduced motion:** static crossfade thumbnail, no tracking. *(Capability resolved after mount: `webgl` → tracked quad, `fallback` → static `<img>` crossfade card, `none` → no thumbnail on touch. SSR ships only the semantic rows.)*
  - Data = `{{CASE_STUDIES}}` placeholder. **Do NOT invent metrics** — use clearly-fake placeholders until owner supplies real data. *(Kept `+XXX%` / `X.Xx` placeholders + an explicit "Placeholder metrics" note; thumbnails are abstract cobalt SVGs in `public/work/`.)*
- [x] `app/work/[slug]/page.tsx` — stub route in MVP; reveal-stagger on enter; reachable by transition. *(Staggered `service → name (h1) → cobalt metric → note`; `notFound()` for unknown slugs; `Reveal`/`RevealItem` gained `h1` support. All three slugs prerender as SSG.)*

---

## Phase 4 — Process, Impact, Dual-continent, CTA, Footer

*Done when: full page reads top-to-bottom with correct tension/release pacing.*

- [x] `components/sections/Process.tsx` (Approach — quiet)
  - Four steps on a thin cobalt connecting line (animated SVG `pathLength`); per step mono index + title + one line. *(`id="approach"` for nav. Connecting line is the one cobalt motif — horizontal `motion.line` (`pathLength` 0→1) through the dot row on md+, vertical on mobile; cobalt nodes ringed in paper. `Reveal stagger` sequences the four steps. `Reveal` gained `ol` support.)*
    - `01` **Audit** — We find what's leaking and what's working.
    - `02` **Strategy** — A plan tied to revenue, not vanity metrics.
    - `03` **Build** — Pages, campaigns, and software that ship fast.
    - `04` **Grow** — We measure, iterate, and compound the wins.
  - `whileInView` stagger; restrained.
- [x] `components/sections/Impact.tsx` — **the one blue-dominant moment.**
  - Full-bleed `--navy`/`--cobalt` band, `--paper-on-dark` type, 3–4 big numbers with mono labels, count-up on scroll-in (once).
  - `{{IMPACT_NUMBERS}}` placeholders (replace with real figures): clients · revenue driven · avg traffic lift · projects shipped. Static under reduced motion. *(Full-bleed `bg-navy` band with faint cobalt radial echo. New `components/ui/CountUp.tsx` — framer `useInView` once + `animate`, parses prefix/number/suffix and preserves decimals/commas; renders non-numeric values (the `{{N}}` placeholders) and the reduced-motion path static, so it animates automatically once real figures land. Kept a "placeholder figures" note.)*
- [x] `components/sections/DualContinent.tsx` (Raipur ↔ Montreal — quiet, type-led)
  - Two dots joined by a thin cobalt arc (animated `pathLength`).
  - Eyebrow: *Two cities, one studio.* Headline (h2): *We work where you are — across India and North America.* Body (lead): *From Raipur to Montreal, we run growth and build software around the clock, so momentum never sleeps.* *(Centered, type-led. Inline SVG arc (`motion.path pathLength` 0→1) + two cobalt dots scaling in after the draw, labelled Raipur, IN / Montreal, QC. Headline reveals by word via `SplitText` — gained an `id` prop so the section's `aria-labelledby="dual-heading"` resolves.)*
- [x] `components/sections/CTA.tsx` (loud closer — bookend the signature)
  - Oversized closing line (display, `grow` in cobalt): **Let's `grow`.**
  - Returning blob (reuse `InkBlob`, lower intensity), magnetic **Start a project** button.
  - Contact: `info@davnoot.com` (mailto) · `+1 (438) 223-7131` (tel) · Montreal, QC · Raipur, IN. Form optional in v1. *(`id="contact"`. `InkBlob` reused via the same client-only dynamic import (ssr:false), centered behind at 70% opacity. Closing line rises by word on scroll-in (`whileInView`), `grow` cobalt + ink period; reduced-motion → plain text. `mailto:`/`tel:` links wired + locations; `mailto:` for MVP, no form.)*
- [x] `components/sections/Footer.tsx`
  - Huge faint `DAVNOOT` background logotype (slight scroll parallax); nav links, marquee once more, socials, legal.
  - Legal: `© 2026 Davnoot Digital.` Optional: *Made between Raipur & Montreal.* *(Replaces the temporary footer in `page.tsx`. Huge `DAVNOOT` logotype at `text-ink/[0.05]` parallaxing via `useScroll`/`useTransform` (static under reduced motion). Final `Marquee` pass of the service names, nav links, LinkedIn + email socials, legal + "Made between Raipur & Montreal.")*

---

## Phase 5 — Performance, SEO & accessibility (hard requirements, `DESIGN.md §6–7`)

*Done when: all hard requirements pass.*

### Performance / SEO (non-negotiable — we sell SEO)
- [x] LCP element is the real hero `<h1>`, not a canvas/image. *(Verified via Lighthouse — LCP element resolves to `main#top … h1`. Headline entrance moved from framer-motion to a CSS `heroRise` (transform-only, opaque) so the text paints at parse time, never gated on JS hydration.)*
- [x] Lazy-load all WebGL/below-the-fold canvases; mount on approach (IntersectionObserver); pause RAF offscreen. *(Both R3F canvases — hero/CTA `InkBlob` and `WorkThumb` — are `dynamic(ssr:false)` AND gated on the first real user interaction via `useInteractionMount` (pointer/wheel/touch/key; `scroll` excluded so Lenis's synthetic init-scroll doesn't trip it). A static cobalt wash holds the hero/CTA space until then. `InkBlob` still pauses its RAF offscreen via IntersectionObserver. Net: three.js stays entirely off the initial load.)*
- [x] Cap `dpr` at 1.5 on all R3F canvases. *(`InkBlob` and `WorkThumb` both `dpr={[1, 1.5]}`.)*
- [x] Lighthouse ≥ 90 mobile (Perf/SEO/Best-Practices/A11y); CLS < 0.1; LCP < 2.5s mid-tier mobile. *(Lighthouse 12 mobile, production `next start`: Perf 90–93 (warm), A11y 100, Best-Practices 100, SEO 100. CLS 0.007, LCP ~1.6–2.5s, TBT ~320ms. Got here by deferring three.js + Lenis/GSAP to first interaction, dynamic-importing GSAP in `SmoothScroll`/`Services`, and async-loading the Clash Display stylesheet.)*
- [x] `next/font` for Inter + Geist Mono; preload Clash Display. *(Inter via `next/font/google`, Geist Mono via `geist/font/mono`; Clash Display preconnected (api + cdn) + preloaded, then attached async/non-render-blocking with a `<noscript>` fallback.)*
- [x] `next/image` for all raster with explicit width/height. *(No raster content images on the page — work thumbnails are abstract cobalt SVGs, decorative/`aria-hidden`, with explicit width/height to avoid CLS. OG/Twitter/favicon images are generated via `next/og`.)*
- [x] Semantic landmarks, single `<h1>`, logical heading order, real `<a>`/`<button>`. *(One `<h1>` (hero); `<header>`/`<main>`/`<footer>` landmarks; sections h2, process steps h3; real links/buttons throughout. Verified single-h1 in the DOM.)*
- [x] Metadata: title/description, OpenGraph + Twitter card, `Organization` + `WebSite` JSON-LD (NAP: info@davnoot.com, +1 (438) 223-7131, Montreal). Sitemap + robots. *(`app/sitemap.ts` (home + 3 work slugs) and `app/robots.ts` added; JSON-LD upgraded to an `@graph` with linked `Organization` (NAP + ContactPoint) + `WebSite`; canonical + keywords + googleBot hints added; `app/opengraph-image.tsx` + `app/twitter-image.tsx` + `app/icon.tsx` generated via `next/og` — edge runtime to dodge a `@vercel/og` Node bug on the space in the project path.)*

### Accessibility
- [x] `prefers-reduced-motion` honored globally: no Lenis lerp, no SplitText transforms, no marquee velocity coupling, services unpinned, blob static/hidden, custom cursor off. *(Verified with emulated reduced-motion: 0 canvases mount even after interaction (three.js never loads), `<h1>` fully visible, Services renders the static list (no pin-spacer). `SmoothScroll` returns early; hero CSS entrance is neutralized by the global reduced-motion reset to its visible end state.)*
- [x] Visible cobalt keyboard focus ring on every interactive element. *(`:focus-visible` cobalt outline in globals.css; Lighthouse A11y 100.)*
- [x] WCAG AA contrast (ink on paper; paper-on-dark on navy). Never put body text in cobalt. *(Bumped the two placeholder captions off low-opacity tints to meet AA; Lighthouse A11y 100.)*
- [x] Tab order matches visual order; work rows keyboard-activatable. *(Added a "Skip to content" link as the first focus stop; work rows are real `<a href="/work/…">`, focus reveals their thumbnail. Verified DOM order.)*
- [x] Cross-browser pass (Safari WebGL especially); responsive 360px → 1440px. *(Responsive verified 360px → desktop in Chromium (hero/headline/CTA reflow cleanly). Chromium WebGL verified live. **Safari/WebKit WebGL not testable in this Windows env — verify on real Apple hardware/BrowserStack before launch.**)*

---

## Content map — porting from `index.html`

Usable as-is (port into `lib/content.ts`):
- Service descriptions/feature lists (SEO, Meta Ads, Email, AI SEO, Custom Software) — condense to DESIGN.md's one-liners; keep detail copy for `/work` or expandable detail.
- Process: 3-step "Audit & Architect / Execute & Engineer / Analyze & Amplify" → reconcile to DESIGN.md's 4-step **Audit → Strategy → Build → Grow**.
- FAQ copy (AI SEO vs traditional, custom software integration, engagement structure) — optional add; not in DESIGN.md sections, hold unless owner wants it.
- Contact email in prototype is `hello@davnoot.com`; **DESIGN.md says `info@davnoot.com` — use DESIGN.md.**

Do NOT port:
- Indigo/grey Material color tokens, Space Grotesk, the 6-card sticky-stack services, `cdn.tailwindcss.com`, Material Symbols icon font, the "Global Reach 12+/$50M+/5/24-7" invented metrics (replace with `{{IMPACT_NUMBERS}}` placeholders).

---

## Open items for the owner (leave labeled placeholders — do NOT invent)
- [ ] `{{CLIENT_LOGOS}}` — real logos, or keep service-name fallback.
- [ ] `{{CASE_STUDIES}}` — project names, real metrics, thumbnails, slugs.
- [ ] `{{IMPACT_NUMBERS}}` — real impact-band figures.
- [ ] Font decision: ship free Clash Display, or license PP Neue Montreal and swap `--font-display`.
- [ ] Contact CTA: `mailto:` (MVP default) vs. a form.
