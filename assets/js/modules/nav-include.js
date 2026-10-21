/**
 * NAV HTML — snippet partagé
 * Appelé depuis chaque page pour injecter la nav identique
 *
 * Usage: import { buildNav } from './nav-include.js'; buildNav(root, assetRoot, lang)
 * root      = chemin vers la racine de la langue ('' pour index.html, '../' pour pages/)
 * assetRoot = chemin vers la racine du site (root + '../' pour les pages /en/)
 * lang      = 'fr' | 'en'
 */

const LABELS = {
  fr: {
    navAria:   'Navigation principale',
    homeAria:  'Spaces That Matter — Accueil',
    home:      'Accueil',
    label:     'Le label',
    methodo:   'La méthodologie',
    team:      "L'équipe",
    blog:      'Blog & Ressources',
    faq:       'FAQ',
    contact:   'Contact',
    quiz:      'Quiz découverte',
    demo:      'Demander une démo',
    openMenu:  'Ouvrir le menu',
    menu:      'Menu',
    langAria:  'Choix de la langue',
  },
  en: {
    navAria:   'Main navigation',
    homeAria:  'Spaces That Matter — Home',
    home:      'Home',
    label:     'The label',
    methodo:   'Methodology',
    team:      'The team',
    blog:      'Blog & Resources',
    faq:       'FAQ',
    contact:   'Contact',
    quiz:      'Discovery quiz',
    demo:      'Book a demo',
    openMenu:  'Open menu',
    menu:      'Menu',
    langAria:  'Language selection',
  },
};

/* URL de la même page dans l'autre langue (FR : /x  ↔  EN : /en/x) */
export function getAlternateUrl(targetLang) {
  const { pathname, search, hash } = window.location;
  const isEn = /^\/en(\/|$)/.test(pathname);
  let path = pathname;
  if (targetLang === 'en' && !isEn) path = `/en${pathname}`;
  if (targetLang === 'fr' && isEn)  path = pathname.replace(/^\/en(\/|$)/, '/');
  return path + search + hash;
}

function langSwitch(lang, t) {
  const item = (code) => code === lang
    ? `<span class="nav-lang-item is-active" aria-current="true" lang="${code}">${code.toUpperCase()}</span>`
    : `<a href="${getAlternateUrl(code)}" class="nav-lang-item" hreflang="${code}" lang="${code}">${code.toUpperCase()}</a>`;
  return `
      <div class="nav-lang" role="group" aria-label="${t.langAria}">
        ${item('fr')}<span class="nav-lang-sep" aria-hidden="true">/</span>${item('en')}
      </div>`;
}

export function buildNav(root = '', assetRoot = root, lang = 'fr') {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const t = LABELS[lang] || LABELS.fr;

  const isLightPage = document.body.dataset.navTheme === 'light';
  const logoLight = isLightPage
    ? `${assetRoot}assets/images/logo/logo-horizontal-dark.png`
    : `${assetRoot}assets/images/logo/logo-horizontal-beige.png`;
  const logoDark = `${assetRoot}assets/images/logo/logo-horizontal-dark.png`;

  nav.innerHTML = `
    <nav class="nav" role="navigation" aria-label="${t.navAria}">

      <a href="${root}index.html" class="nav-logo" aria-label="${t.homeAria}">
        <img src="${logoLight}" alt="Spaces That Matter" height="44"
             class="nav-logo-img"
             data-light="${logoLight}"
             data-dark="${logoDark}">
      </a>

      <ul class="nav-links" role="list">
        <li><a href="${root}pages/label.html"        class="nav-link">${t.label}</a></li>
        <li><a href="${root}pages/methodologie.html"  class="nav-link">${t.methodo}</a></li>
        <li><a href="${root}pages/equipe.html"        class="nav-link">${t.team}</a></li>
        <!-- <li><a href="${root}pages/entreprises.html"   class="nav-link">Entreprises</a></li> -->
        <li><a href="${root}pages/blog.html"          class="nav-link">${t.blog}</a></li>
        <li><a href="${root}pages/faq.html"           class="nav-link">${t.faq}</a></li>
        <li><a href="${root}pages/contact.html"       class="nav-link">${t.contact}</a></li>
      </ul>

      <div class="nav-actions">
        <a href="#" data-quiz-open
           class="nav-link nav-contact-link"
           data-track-cta="nav_quiz"
           data-track-location="navigation">
          ${t.quiz}
        </a>
        <a href="${root}index.html#demo"
           class="nav-cta"
           data-track-cta="nav_demo"
           data-track-location="navigation">
          ${t.demo}
        </a>
      </div>
${langSwitch(lang, t)}

      <button class="nav-hamburger" aria-label="${t.openMenu}" aria-expanded="false" aria-controls="mobile-menu">
        <span></span><span></span><span></span>
      </button>

    </nav>

    <div class="nav-mobile" id="mobile-menu" role="dialog" aria-modal="true" aria-label="${t.menu}">
      <nav>
        <ul role="list" class="nav-mobile-list">
          <li><a href="${root}index.html"              class="nav-mobile-link">${t.home}</a></li>
          <li><a href="${root}pages/label.html"        class="nav-mobile-link">${t.label}</a></li>
          <li><a href="${root}pages/methodologie.html" class="nav-mobile-link">${t.methodo}</a></li>
          <li><a href="${root}pages/equipe.html"       class="nav-mobile-link">${t.team}</a></li>
          <!-- <li><a href="${root}pages/entreprises.html"  class="nav-mobile-link">Entreprises</a></li> -->
          <li><a href="${root}pages/blog.html"         class="nav-mobile-link">${t.blog}</a></li>
          <li><a href="${root}pages/faq.html"          class="nav-mobile-link">${t.faq}</a></li>
          <li><a href="${root}pages/contact.html"      class="nav-mobile-link">${t.contact}</a></li>
          <li><a href="#" data-quiz-open class="nav-mobile-link">${t.quiz}</a></li>
          <li><a href="${root}index.html#demo"          class="nav-mobile-link nav-mobile-cta">${t.demo}</a></li>
        </ul>
      </nav>
    </div>
  `;
}
