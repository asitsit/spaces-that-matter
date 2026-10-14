/**
 * Lenis — Smooth scroll
 * @studio-freight/lenis@1.0.42 (UMD global = Lenis)
 */

export function initLenis() {
  if (typeof Lenis === 'undefined') {
    console.warn('[STM] Lenis non disponible');
    return null;
  }

  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  });

  // Sync GSAP ticker → ScrollTrigger fonctionne correctement
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  window.lenis = lenis;
  return lenis;
}
