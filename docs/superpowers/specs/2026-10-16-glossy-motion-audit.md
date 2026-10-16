# Glossy & motion audit (Emil Kowalski) — GoodBiz Hygiene

User ask (2026-10-16): "audit the whole UI and make it look glossy and attractive, from colours to objects which can be animated, like how the object in the hero section pops up and moves while scrolling on https://floria-landing-page.vercel.app — according to our product."

## What Floria actually does (read from its production bundle)
- Hero accent: a transparent cut-out bouquet, `h-[120vh] aspect-square translate-x-1/4`, absolutely positioned top-24/right-0 in a z-10 layer inside the z-20 hero, so it overflows the hero bottom and sits over the next section.
  Motion: `initial {opacity:0, scale:0.9, rotate:-85}` → `animate {opacity:1, scale:1.1, rotate:-90}`, duration 1.5s, ease [0.16,1,0.3,1], delay 0.3s. Hover: scale 1.15, rotate -92, filter brightness(0.9) contrast(1.1). drop-shadow-2xl, brightness-75.
- Hero copy: opacity 0, y 30 → 0.
- Featured cards: each card y 40 → 0, stagger 0.15s, 0.8s, ease [0.16,1,0.3,1], viewport margin -100px. Image `group-hover:scale-110` 700ms. "Quick Add" pill slides from translateY(100%) → 0 in 500ms ease-out, white/90 + backdrop-blur. Arrow chip nudges -1/+1 on hover.
- Process: decorative cut-out flowers slide in x -100 → 0 over 1.2s, masked with a radial gradient, mix-blend-lighten; a large blurred accent glow circle sits behind; the heading column is sticky.
- Testimonials: glass cards (zinc-900/30, backdrop-blur-sm, 1px white/5 border → white/10 on hover), big faint quote glyph, y 40 stagger 0.1s.
- Statement: icon scale 0.8 → 1; heading y30 delay .2; paragraph fade delay .4; background cut-out at 40% mix-blend-screen under a gradient.

## Audit of our current UI
| Before | After | Why |
| --- | --- | --- |
| Hero still `range-hero.webp` is a flat full-bleed picture that only cross-fades (`.stage-canvas` opacity 1200ms) | A transparent, glossy cut-out of the range (`range-cutout.webp` with alpha) that pops in: opacity 0 → 1, scale .9 → 1.05, rotate -8° → 0°, 1.4s, `cubic-bezier(.16,1,.3,1)`, delay 300ms; it overflows the hero into "The Range." like Floria's bouquet | The reference's signature is an object arriving, not a picture fading; overlap creates depth |
| Hero objects ignore scroll | Scroll-linked drift: the cut-out rises ~12vh, turns +6° and scales to 0.94 across the first 100vh (CSS `animation-timeline: scroll()` with a tiny rAF fallback writing `transform` only) | The user asked for movement while scrolling; transform-only keeps it on the compositor |
| Live Three.js loads only on first interaction and then just floats | When it takes over, its first frame matches the cut-out's final pose; scroll then fans the packs apart slightly and turns them (camera dolly + per-object yaw driven by scroll progress, eased with a spring-like lerp, paused off-screen) | Seamless hand-off; scroll gives the 3D a reason to exist |
| Renders read as matte illustrations (transmission removed for runtime cost) | Re-render with full glossy studio quality: transmission + thickness on PET bottles, clearcoat 1 on caps, specular rim light, soft contact shadow and a faint floor reflection; labels with a slight gloss | Pre-rendered stills have no runtime cost; gloss is what makes packaging look premium |
| Product cards: image scales 1.04 on hover | Render "pops" out of the card: card image lifts translateY(-10px) scale(1.06) with a 600ms ease-out, a light sheen sweeps across once (transform on a pseudo-element, 700ms), "Add to enquiry" pill slides up from translateY(100%) in 300ms; gated by `(hover:hover) and (pointer:fine)`; :active scale(.98) | Gives each product the hero's object-popping language; one sheen pass, not a loop |
| Process section has a port photo but no decorative object | Botanical cut-out (neem leaves from the public-domain plate, background removed) slides in from x -100 → 0, 1.2s, radial mask, `mix-blend-mode: lighten`; plus one large blurred mint glow behind the steps | Mirrors the reference; herbal leaves are our world |
| Straight-answers cards are flat dark tiles | Glass cards: forest-800/40 with backdrop-blur(8px), 1px white/6% border → 12% on hover (200ms ease), faint large question-mark glyph, y 40 stagger 100ms | Gloss and depth; matches the reference's testimonial cards |
| No brand objects in motion | Glossy soap bubbles: 6–10 CSS spheres (radial-gradient highlight + thin iridescent rim via conic-gradient), drifting slowly upward in the hero and the quote card, parallax with scroll; none on phones under 480px; off under reduced motion | Bubbles are the honest visual signature of soap and detergent |
| Statement band leaf icon is static | Icon scale .8 → 1 + opacity, heading y30 delay 200ms, text fade delay 400ms | Same choreography as the reference |
| Flat forest fields | Add depth: a soft radial mint glow behind hero products (8–12% opacity), a subtle vignette, and very fine noise (2–3% opacity PNG) on dark fields | Removes the "flat vector" feel; gives a glossy, photographic ground |
| Buttons: correct press scale, flat fill | Keep press scale(.97) 160ms; add a 1px inner highlight (inset box-shadow top white/25%) on the off-white and forest pills, and a sheen on hover (pointer devices) | Glossy, tactile pills without gradients on text |
| Category bento tiles scale 1.04 | Tile render floats up 8px and scales 1.05; label slides 4px; scrim deepens 200ms | Same pop language across the site |
| Inner-page hero renders are static | Same pop-in (scale .92 → 1, rotate -6° → 0, 1.2s) + light scroll drift for the product/category render | Consistency across all 49 pages |

## Guardrails
- Transform and opacity only for anything that moves; filters only on hover (brightness/contrast) and never animated on scroll.
- Ease: entrances `cubic-bezier(.16,1,.3,1)` (Floria) or `--ease-out`; UI ≤ 300ms; marketing entrances may be 700–1500ms.
- Every move has a `prefers-reduced-motion` fallback (opacity only ≤ 200ms, no travel, no bubbles, no scroll drift).
- Hover effects gated by `(hover:hover) and (pointer:fine)`.
- Performance budget unchanged: home mobile Lighthouse ≥ 95 performance, CLS 0 (the hero object is absolutely positioned and sized before load), LCP stays the hero image (preloaded). Bubbles: ≤ 10 elements, no JS per frame unless scroll-linked fallback.
- Honesty unchanged: renders labelled "Illustration of …".
