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

function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
