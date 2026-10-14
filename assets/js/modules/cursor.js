/**
 * Custom Cursor — dot + ring avec lag
 */

export function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  // Touch = pas de cursor custom
  if (!dot || window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('.cursor-dot, .cursor-ring').forEach(el => el.remove());
    document.body.style.cursor = 'auto';
    return;
  }

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  // Position dot — immédiate, via left/top (position:fixed → viewport coords)
  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.set(dot, { x: mx, y: my, xPercent: -50, yPercent: -50, force3D: true });
  });

  // Ring — lerp via GSAP ticker (synchronisé avec Lenis) plutôt qu'un RAF indépendant
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry, xPercent: -50, yPercent: -50, force3D: true });
  });

  // États
  document.addEventListener('mousedown',  () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',    () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-out'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-out'));

  function bindState(sel, cls) {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add(cls));
      el.addEventListener('mouseleave', () => document.body.classList.remove(cls));
    });
  }

  bindState('a, button, [role="button"], label', 'cursor-hover');
  bindState('[data-cursor="view"]',               'cursor-view');
  bindState('[data-cursor="drag"]',               'cursor-drag');
}
