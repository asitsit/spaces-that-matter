/**
 * Navigation — mobile menu + active link
 * Le scroll state est géré dans animations.js via ScrollTrigger
 */

export function initNav() {
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  const navLinks   = document.querySelectorAll('.nav-link');

  // Active link selon la page courante
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop().split('#')[0];
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  hamburger.addEventListener('click', () => {
    isOpen = !isOpen;
    mobileMenu.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(isOpen));

    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      gsap.to(spans[0], { y: 6,  rotation:  45, duration: 0.3, ease: 'power2.out' });
      gsap.to(spans[1], { opacity: 0, duration: 0.15 });
      gsap.to(spans[2], { y: -6, rotation: -45, duration: 0.3, ease: 'power2.out' });

      gsap.from(document.querySelectorAll('.nav-mobile-link'), {
        y: 24, opacity: 0, duration: 0.5,
        ease: 'power3.out', stagger: 0.07, delay: 0.05,
      });
    } else {
      gsap.to(spans[0], { y: 0, rotation: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to(spans[1], { opacity: 1, duration: 0.2 });
      gsap.to(spans[2], { y: 0, rotation: 0, duration: 0.3, ease: 'power2.out' });
    }

    // Stop/resume lenis
    if (window.lenis) {
      isOpen ? window.lenis.stop() : window.lenis.start();
    }
  });

  // Logo swap au scroll
  const logoImg = document.querySelector('.nav-logo-img');
  if (logoImg) {
    const navEl = document.querySelector('.nav');
    new MutationObserver(() => {
      logoImg.src = navEl.classList.contains('is-scrolled')
        ? logoImg.dataset.dark
        : logoImg.dataset.light;
    }).observe(navEl, { attributes: true, attributeFilter: ['class'] });
  }

  // Fermeture sur clic lien mobile
  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      const spans = hamburger.querySelectorAll('span');
      gsap.to(spans[0], { y: 0, rotation: 0, duration: 0.3 });
      gsap.to(spans[1], { opacity: 1, duration: 0.2 });
      gsap.to(spans[2], { y: 0, rotation: 0, duration: 0.3 });
      if (window.lenis) window.lenis.start();
    });
  });
}
