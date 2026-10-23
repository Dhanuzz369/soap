# Photo hero ("the fan") report

Branch `feat/photo-hero`, 2026-10-23. The request was to use the emil-design-eng skill to build a photo-led home hero that matches the site, using the product photos. This replaces the Three.js cut-out hero.

## What it is

A hand of four real product photos, one for each main range, sits on the inline-end side of the dark forest hero. It is on the right in LTR and on the left in Arabic. The copy and the H1 are unchanged and sit in their own grid column, so the fan never covers them.

| Range | Photo | Crop (`object-position`) | Link |
|---|---|---|---|
| Bath & personal soaps | `herbal-ayurvedic-soap` | `72% 50%`: the carton and its label are fully in frame; the round bar's embossing is cut at the left | `/categories/bath-personal-soaps/` |
| Laundry | `liquid-detergent` | `50% 50%`: the middle bottle ("Front load") is fully in frame | `/categories/laundry-care/` |
| Kitchen | `dish-wash-liquid` | `62% 50%`: the lime bottle is centred, with the lemon and orange labels at the edges | `/categories/kitchen-care/` |
| Surface & home | `floor-cleaner` | `80% 50%`: the whole jug and its label | `/categories/surface-home-cleaners/` |

The photos are 4:3 and the cards are 4:5, so each card shows 60% of the photo's width. I checked every crop by eye in the screenshots below.

Files:

- `src/components/HeroFan.astro`: the markup. It renders static and fully linked without JS.
- `src/scripts/hero-fan.ts`: the behaviour.
- `src/lib/hero-fan.ts`: pure data and decisions, unit-tested.
- `home.css`: the hero section.
- `scripts/make-hero-images.mjs` (`npm run hero:images`): makes the 480/640px copies and the 64px pre-blurred glows.

## Decisions (Emil format)

| Before | After | Why |
| --- | --- | --- |
| Three.js cut-out hero; WebGL loaded after first interaction | Four real photos fanned like cards, built with CSS transforms only | Real products sell better than illustrations. It also means no WebGL and no 3D bundle; the home page ships 4.3 KB of hero JS |
| Hero object popped in with `opacity .01 → 1` | The front photo never fades. It paints at once and only rises 24px (`translateY`), 1100ms `cubic-bezier(.16,1,.3,1)`. The back cards come from `translateY(24px) scale(.94)` at opacity 0, staggered 90ms | The LCP image must paint immediately. The deal shows "a hand of cards" without hiding content |
| No range navigation in the hero | Four range dots act as tabs (`role=tab`, roving tabindex, ←/→/Home/End/Space, RTL-aware arrows). A back card's visible edge brings it forward, and the front card links to its range | Visitors choose a range directly. The fan is a region labelled by the current range's name |
| (new) auto-advance | Every 5s the front card slides out toward the inline start (420ms) and tucks behind, while the rest move up, over 750ms on `cubic-bezier(.77,0,.175,1)` | Ease-in-out suits movement on screen. Every move is a CSS **transition**, so a click mid-shuffle retargets smoothly instead of restarting |
| One duration for everything | Asymmetric timing: auto 750ms; user-triggered 280ms ease-out; caption exits in 160ms and enters in 320ms after an 80ms delay; press 120ms, release 400ms | The system can take its time, but a response to the visitor must be fast |
| Auto-advance always on | Pauses on mouse hover, on keyboard focus (`:focus-visible` only, so a mouse click does not freeze it), when the tab is hidden, when the fan is under 50% visible, under reduced motion, and on phones. Any interaction restarts the 5s idle wait | Never move something the visitor is reading or pointing at. These cases are handled invisibly, like Sonner pausing its timers |
| Caption swapped instantly | The captions cross-fade with a 2px blur mask (opacity, blur, translateY 4px). `aria-live="polite"` is set only for user-triggered changes and is `off` during auto-advance | The blur makes the swap read as one change rather than two overlapping labels. Screen readers are not spammed every 5s |
| Hover effects with no media query | Inside `(hover:hover) and (pointer:fine)`: the fan opens wider (`--open: 1.14`, a registered `@property` feeding the transforms) and the hovered card lifts 8px, both 400ms on the strong ease-out | No sticky hover on touch. The fan opening is a reward for pointing, not a requirement |
| No press state | `:active` scales the face to `.97` (120ms); the dots scale too | The interface acknowledges the press |
| `scale(0)` / opacity-only entrances | The smallest start value is `scale(.94)` | Nothing appears from nothing |
| Back cards dimmed with a `filter` | A dark overlay `::after` whose opacity follows the slot (.42/.58/.72). A shadow layer `::before` is visible on the front card only. Both change by opacity alone | Only transform and opacity animate. Filters and box-shadows are not interpolated |
| Static mint glow | A 64px pre-blurred copy of each photo, inlined as a data URI, is scaled up behind the fan and masked to a soft ellipse on the fan side. It cross-fades over 900ms `ease` when the front card changes | The field picks up the photo's colour. It costs no request and no runtime blur, and it is masked away from the copy, so text contrast is unchanged |
| Scroll: the object rose and turned | Over the first 100vh the fan drifts up 8vh, the back cards turn 35% further out (the `rotate` property, so it composes with the slot `transform`), and the glow fades. This uses CSS `animation-timeline: scroll()`, with the existing rAF fallback (`scroll-fallback.ts`) writing the same numbers from `FAN_DRIFT`, `fanScroll` and `spreadTurn` | Off the main thread where supported, and identical where not |
| Swipe threshold only | Phones: a horizontal swipe on the fan uses pointer capture, ignores a second finger, has damped drag past 96px, and counts a flick at **velocity > 0.11 px/ms** or a 64px drag. `touch-action: pan-y` keeps vertical scrolling native. A swipe toward the inline start deals the next card, mirrored in RTL | A quick flick should be enough, and the page must still scroll |
| Bubbles over everything | The bubbles sit in a layer under the hero grid (z 1 vs 2) and are placed around the fan | They never cover the text or the cards |
| `prefers-reduced-motion` ignored | Reduced motion: no deal, no auto-shuffle, no hover widening or lift. Slot changes are instant, and opacity still fades (200ms) | Fewer, gentler animations, while keeping the fades that help comprehension |
| Keyboard tab change animated? | Kept at 280ms | Emil's rule is not to animate actions repeated 100+ times a day. Picking a range here is rare, and the short move explains where the card went |

## Phones (< 760px) and portrait tablets

- The fan sits above the copy, centred and about 72vw wide, with three visible cards (the fourth waits at the back at opacity 0). The caption and dots sit underneath.
- **No auto-shuffle on phones.** This was my call. The fan is directly above the headline, and a card moving every 5s next to the text you are reading hurts readability. Swipe and the dots change the card instead.
- Portrait tablets (760–1100px, portrait) stack the same way with a larger card and keep the auto-shuffle.

## No JS

The fan sits in its fanned pose. Each card and each range dot is a plain link to its range, and the first caption is shown. Back-card photos come from `<noscript>` copies.

## Performance: the front photo is the LCP element

- It is preloaded with the same `imagesrcset`/`imagesizes` and `fetchpriority=high`. There is no `decoding=sync`, which delayed its first paint by about 60–100ms in tests.
- `sizes` is honest. A 4:3 photo covering a 4:5 card is drawn 5/3 as wide as the card: `(max-width: 759px) 84vw, clamp(400px, 38vw, 600px)`. New 480/640px copies give a phone a sharp front photo in 37 KB instead of 63 KB.
- The back cards show their inlined blurred colour until the deal settles, or until the visitor reaches for the fan, and then fade in their photos (400ms). They never compete with the LCP image.
- The back cards are smaller (scale .88/.84/.80), and the front card only rises during the deal. As a result, no turned back card's bounding box, including the hover widening, is larger than the front card's. Without this, a back photo arriving later became Chrome's LCP element. This is unit-tested (`boxArea`).
- Arabic: the answers' decorative "?" (`.answer::before`) was the only thing that made `/ar/` download Newsreader italic (63 KB). It now uses the Arabic face. Main itself scored 94 on `/ar/` before this.

### Lighthouse 13.5 (mobile, simulated throttling, `astro preview`, two runs each)

| Page | Performance | Accessibility | LCP | CLS | TBT | LCP element |
|---|---|---|---|---|---|---|
| `/` (en) | 97 / 98 | 100 / 100 | 2.5 s | 0 | 0–20 ms | `.fan-card` front `img` (herbal soap) |
| `/ar/` | 97 / 97 | 100 / 100 | 2.6 s | 0 | 0 ms | `.fan-card` front `img` (herbal soap) |

Baseline on `main` the same day: en 98 (one cold run 70), ar 94.

## What I removed

- `src/components/HeroScene.astro` (the hero loader, cut-out, canvas and pop).
- `src/scripts/hero-env.ts` and `tests/unit/hero-scene.test.ts` (the WebGL/data-saver gate).
- The live part of `hero-scene.ts`: the rAF loop, pointer and scroll easing, IntersectionObserver and context-loss handling. Also `fanPose` and `approach` (with their tests), the `'live'` pack quality, the `range-cutout` preload on Home, and the `heroAlt` string in all 12 dictionaries.
- **Kept, because other code uses them:** `three`, `src/scripts/three/*` and the range still. `npm run renders` draws every pack cut-out on the site, and `range-cutout.webp` is still used by the Products and Export Process bands. The still now lives in `scripts/render/hero-still.ts` (render-only), and `three` moved to **devDependencies**. No Three.js code ships to the browser; a build test checks this.

## i18n

New strings, in `en.ts` and all 11 translations:

- `home.fanTabs`: the group label.
- `home.fanShow`: each dot's label, e.g. "Show {name}".
- `home.fanView`: "View range".
- `home.fanOpen`: each card's link label.

Range names and counts come from the localized category titles and `common.productsCount`. All dictionaries are restamped, and `npm run i18n:check -- --strict` reports everything complete and current.

RTL (ar) checks:

- The fan is on the left and the poses are mirrored (`--dir: -1`).
- The shuffle slides toward the right (the inline start).
- A swipe right deals the next card.
- ←/→ on the dots are swapped.
- The dots run right to left, and the arrow on "View range" points left.

## Checks

- `npm run build`, `npm test` (2,618), `npm run test:build` (642), `npm run check:placeholders` and `npm run i18n:check -- --strict` all pass.
- New unit tests in `tests/unit/hero-fan.test.ts` cover the shuffle order, the swipe axis and velocity decision with RTL, drag friction, the scroll mapping, the autoplay holds, the LCP box areas and that the image files exist.
- New build tests check the preload matching the front image, the no-JS links, localized links, the inlined glows, and that the 3D hero is gone.
- `npm run i18n:sweep` for en, ar, de, zh and es found no sideways scroll and no console errors.
- A Playwright check of all 12 languages at 1280/1440/1920/390/360 found no card covering the headline, text, eyebrow or actions.
- Interaction script results:
  - The tabs, arrow keys, Home and Space work.
  - Clicking a back card brings it forward.
  - Auto-advance resumes 5s after a mouse click.
  - No auto-advance under reduced motion or on phones.
  - Touch swipes deal next and previous, mirrored in Arabic.
  - A vertical drag scrolls the page.
  - Without JS, a dot click navigates to its range.

## Evidence (`docs/superpowers/screens/photo-hero/`)

- **First screen:** `first-{en,ar}-{1440,1280,1920,390,360}.jpg`.
- **The deal:** `deal-0000ms.jpg`, `deal-0300ms.jpg`, `deal-0700ms.jpg`, `deal-1400ms.jpg`. These frames are seeked with the Web Animations API, so the timings are exact.
- **Auto-shuffle, mid-transition:** `shuffle-1-180ms.jpg` (the front card leaving toward the inline start), `shuffle-2-460ms.jpg` (tucking behind) and `shuffle-3-640ms.jpg` (settling).
- **Hover (fan widened, card lifted):** `hover-1440.jpg`.
- **Scrolled 450px (drift, spread, glow fading):** `scroll-450.jpg`.

## Concerns

- **Back-card photos are deferred.** On a slow connection, the back cards show a blurred colour for up to about 1.4s before their photos fade in. This is deliberate, to protect LCP.
- **The soap crop cuts the round bar.** The front soap crop keeps the carton label whole, but the round bar's "GoodBiz" embossing is cut at the left. A 4:5 window cannot hold both packs in that photo.
- **Swipe needs real-device testing.** It was tested with CDP touch events, not on a physical phone.
- **Small jump in the scroll spread.** The spread uses `var(--r)` in scroll-timeline keyframes. If an auto-shuffle happens mid-scroll, a back card's extra turn jumps by a few degrees. Auto-advance pauses once the fan is under 50% visible, which limits this.
- **Lighthouse variance.** Earlier in this session, cold runs varied by about ±3. The numbers above are the final two runs each.
