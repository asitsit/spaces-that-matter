/**
 * SPACES THAT MATTER — GSAP Animations
 * SplitType (gratuit) + ScrollTrigger + Lenis
 */

export function initAnimations() {

  gsap.registerPlugin(ScrollTrigger);

  // ── 1. Split text line by line ────────────────────────────
  // SplitType wraps chaque ligne dans un .line
  // On anime chaque .line avec y + opacity

  document.querySelectorAll('[data-split="lines"]').forEach(el => {
    // Si le titre contient des éléments inline (em, strong…), SplitType les clipe.
    // On bascule sur un simple fade-up dans ce cas.
    if (el.querySelector('em, strong, span, a')) {
      const inVP = el.getBoundingClientRect().top < window.innerHeight;
      gsap.from(el, {
        opacity: 0, y: 30, duration: 1.0, ease: 'power3.out',
        scrollTrigger: inVP ? undefined : { trigger: el, start: 'top 88%' },
      });
      return;
    }

    // Remplace les <br> par des espaces pour que SplitType calcule les lignes naturellement
    el.querySelectorAll('br').forEach(br => br.replaceWith(' '));

    const split = new SplitType(el, { types: 'lines' });

    // Wrap chaque ligne dans un masque — width:100% évite le clip horizontal
    // padding + margin négatif pour ne pas clipper les ascendants/descendants
    split.lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.style.width = '100%';
      wrapper.style.display = 'block';
      wrapper.style.paddingBottom = '0.25em';
      wrapper.style.marginBottom = '-0.25em';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Si l'élément est déjà dans le viewport (above-fold), on joue sans ScrollTrigger
    const alreadyVisible = el.getBoundingClientRect().top < window.innerHeight;

    gsap.from(split.lines, {
      y: '105%',
      opacity: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.08,
      scrollTrigger: alreadyVisible ? undefined : {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // Chars (titres hero animés lettre par lettre)
  document.querySelectorAll('[data-split="chars"]').forEach(el => {
    const split = new SplitType(el, { types: 'chars,words' });

    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.025,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    });
  });

  // ── 2. Reveals génériques ─────────────────────────────────

  document.querySelectorAll('[data-reveal]').forEach(el => {
    const type  = el.dataset.reveal;
    const delay = parseFloat(el.dataset.delay || 0);
    let fromVars = {};

    // hero-title : animation directe sans ScrollTrigger (above-fold)
    if (type === 'hero-title') {
      gsap.from(el, { opacity: 0, y: 30, duration: 1.2, delay: 0.1, ease: 'power3.out' });
      return;
    }

    switch (type) {
      case 'fade-up':   fromVars = { opacity: 0, y: 40 }; break;
      case 'fade-in':   fromVars = { opacity: 0 }; break;
      case 'scale-in':  fromVars = { opacity: 0, scale: 0.94 }; break;
      case 'clip-up':   fromVars = { clipPath: 'inset(100% 0 0 0)' }; break;
      case 'clip-right':fromVars = { clipPath: 'inset(0 100% 0 0)' }; break;
    }

    const inViewport = el.getBoundingClientRect().top < window.innerHeight;
    gsap.from(el, {
      ...fromVars,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: inViewport ? undefined : { trigger: el, start: 'top 88%' },
    });
  });

  // ── 3. Stagger groupes ────────────────────────────────────

  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = Array.from(parent.children);
    const staggerDelay = parseFloat(parent.dataset.staggerDelay || 0.1);

    gsap.from(children, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      stagger: staggerDelay,
      scrollTrigger: { trigger: parent, start: 'top 85%' },
    });
  });

  // ── 4. Parallax images ────────────────────────────────────

  document.querySelectorAll('.parallax-img').forEach(img => {
    const speed = parseFloat(img.dataset.parallaxSpeed || 0.25);
    gsap.to(img, {
      yPercent: speed * 30,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.parallax-wrap') || img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // ── 5. Counters ───────────────────────────────────────────

  document.querySelectorAll('[data-counter]').forEach(el => {
    const target   = parseFloat(el.dataset.counter);
    const decimals = parseInt(el.dataset.decimals || 0);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const obj      = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
          },
          onComplete: () => {
            el.textContent = prefix + target.toFixed(decimals) + suffix;
          },
        });
      },
    });
  });

  // ── 6. Horizontal scroll portfolio ───────────────────────

  const hTrack = document.querySelector('.h-scroll-track');
  if (hTrack) {
    const hSection = hTrack.closest('[data-h-scroll]') || hTrack.parentElement;
    gsap.to(hTrack, {
      x: () => -(hTrack.scrollWidth - window.innerWidth + 80),
      ease: 'none',
      scrollTrigger: {
        trigger: hSection,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => '+=' + (hTrack.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true,
      },
    });
  }

  // ── 7. Hero intro ─────────────────────────────────────────

  const hero = document.querySelector('.hero');
  if (hero) {
    const label    = hero.querySelector('.hero-label');
    const subtitle = hero.querySelector('.hero-subtitle');
    const actions  = hero.querySelector('.hero-actions');
    const scroll   = hero.querySelector('.hero-scroll');
    const heroBg   = hero.querySelector('.hero-bg img, .hero-bg video');

    const tl = gsap.timeline({ delay: 0.1 });

    if (heroBg) tl.from(heroBg, { scale: 1.1, duration: 2, ease: 'power3.out' }, 0);
    if (label)    tl.to(label,    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);
    if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.7);
    if (actions)  tl.to(actions,  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.9);
    if (scroll)   tl.to(scroll,   { opacity: 1, duration: 0.6 }, 1.3);

    // Parallax scroll hero bg
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  // ── 8. Nav scroll indicator ───────────────────────────────

  ScrollTrigger.create({
    start: 80,
    onEnter:     () => document.querySelector('.nav')?.classList.add('is-scrolled'),
    onLeaveBack: () => document.querySelector('.nav')?.classList.remove('is-scrolled'),
  });

  // ── 9. Refresh après chargement images ───────────────────

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
