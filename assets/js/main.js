/**
 * SPACES THAT MATTER — Main JS
 */

import { initConsent }    from './modules/consent.js';
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

  // 1. Navigation, puis consentement (Google Analytics ne se charge qu'après accord)
  buildNav(root, assetRoot, lang);
  initConsent(lang, root);

  // 2. Le reste, sans écran de chargement : la page s'affiche immédiatement.
  //    Les transitions entre pages sont gérées par le navigateur (@view-transition dans style.css).
  initLenis();
  initCursor();
  initNav();
  initAnimations();
  initTracking();
  initAnchorScroll();
  setFooterYear();
  initQuizModal(lang);
  prefillContactForm();

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
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: target.offsetTop - offset, behavior: reduce ? 'auto' : 'smooth' });
        }
        // Le focus clavier suit l'ancre (indispensable pour le lien « Aller au contenu »)
        if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}

function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* Page contact : message prérempli selon le lien d'origine (ex. « Demander toutes les références » du blog) */
function prefillContactForm() {
  const message = document.getElementById('message');
  if (!message || new URLSearchParams(location.search).get('demande') !== 'references') return;
  if (!message.value) {
    message.value = lang === 'en'
      ? 'Hello, I would like to receive the full list of scientific references behind the Spaces That Matter framework.'
      : 'Bonjour, je souhaite recevoir la liste complète des références scientifiques sur lesquelles repose le référentiel Spaces That Matter.';
  }
}
