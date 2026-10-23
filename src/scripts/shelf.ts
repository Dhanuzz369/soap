/**
 * The /products/ shelf (ProductsHero.astro): pauses the CSS marquee while the shelf is off-screen,
 * while the tab is hidden, and when the visitor presses the pause button. The marquee itself is
 * CSS and runs without this script; the button stays hidden without JS and with reduced motion.
 */
const shelf = document.querySelector<HTMLElement>('[data-shelf]');
const toggle = document.querySelector<HTMLButtonElement>('[data-shelf-toggle]');

if (shelf) {
  const state = { offscreen: false, hidden: document.hidden, user: false };
  const apply = () => shelf.toggleAttribute('data-paused', state.offscreen || state.hidden || state.user);

  new IntersectionObserver(([entry]) => {
    state.offscreen = !entry.isIntersecting;
    apply();
  }).observe(shelf);

  document.addEventListener('visibilitychange', () => {
    state.hidden = document.hidden;
    apply();
  });

  if (toggle) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const showToggle = () => (toggle.hidden = reduce.matches);
    showToggle();
    reduce.addEventListener('change', showToggle);
    toggle.addEventListener('click', () => {
      state.user = !state.user;
      toggle.setAttribute('aria-pressed', String(state.user));
      apply();
    });
  }
  apply();
}
