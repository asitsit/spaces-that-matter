/**
 * SPACES THAT MATTER — Main JS
 */

import { initLoader }     from './modules/loader.js';
import { initCursor }     from './modules/cursor.js';
import { initNav }        from './modules/nav.js';
import { initAnimations } from './animations.js';
import { initTracking }   from './tracking.js';
import { initLenis }      from './modules/lenis.js';
import { buildNav }       from './modules/nav-include.js';
import { initQuizModal }  from './modules/quiz-modal.js';

// Langue de la page : les pages anglaises vivent sous /en/ avec <html lang="en">
const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';

// Détermine le root path selon la profondeur de la page (relatif à la racine de la langue)
let root = '';
if (window.location.pathname.includes('/pages/blog/') ||
    window.location.pathname.includes('/pages/legal/')) {
  root = '../../';
} else if (window.location.pathname.includes('/pages/')) {
  root = '../';
}
// Les assets sont partagés à la racine du site : un niveau de plus depuis /en/
const assetRoot = lang === 'en' ? `${root}../` : root;

document.addEventListener('DOMContentLoaded', () => {

  // 1. Inject nav
  buildNav(root, assetRoot, lang);
  initPageTransitions();

  // 2. Loader, puis tout le reste
  initLoader(() => {
    initLenis();
    initCursor();
    initNav();
    initAnimations();
    initTracking();
    initAnchorScroll();
    setFooterYear();
    initQuizModal(lang);
  });

});

function initAnchorScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      const hashIdx = href.indexOf('#');
      if (hashIdx === -1) return;

      const hash = href.slice(hashIdx);
      const pagePart = href.slice(0, hashIdx);

      // Ancre sur la même page
      if (!pagePart || window.location.pathname.endsWith(pagePart)) {
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        if (window.lenis) {
          window.lenis.scrollTo(target, { offset: -offset });
        } else {
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      }
    });
  });
}

/* Mini fondu de sortie avant de quitter la page pour une autre page du site */
function initPageTransitions() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const html = document.documentElement;

  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download') || link.hasAttribute('data-quiz-open')) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    // Ancre sur la même page : pas de transition
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;

    e.preventDefault();
    html.classList.add('is-page-leaving');
    setTimeout(() => { window.location.href = url.href; }, 200);
  });

  // Retour arrière depuis le cache du navigateur : réafficher la page
  window.addEventListener('pageshow', ev => {
    if (ev.persisted) html.classList.remove('is-page-leaving');
  });
}

function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
