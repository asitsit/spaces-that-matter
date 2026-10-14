/**
 * Page Loader — barre de progression + sortie
 */

export function initLoader(onComplete) {
  const loader = document.querySelector('.loader');
  const bar    = document.querySelector('.loader-bar');
  const numEl  = document.querySelector('.loader-num');

  if (!loader) { onComplete?.(); return; }

  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      if (bar)   bar.style.width = '100%';
      if (numEl) numEl.textContent = '100%';
      setTimeout(leave, 250);
    } else {
      if (bar)   bar.style.width = progress + '%';
      if (numEl) numEl.textContent = Math.round(progress) + '%';
    }
  }, 60);

  function leave() {
    gsap.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        loader.remove();
        document.body.classList.add('is-ready');
        onComplete?.();
      },
    });
  }
}
