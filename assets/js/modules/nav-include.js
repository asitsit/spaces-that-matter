/**
 * NAV HTML — snippet partagé
 * Appelé depuis chaque page pour injecter la nav identique
 *
 * Usage: import { buildNav } from './nav-include.js'; buildNav(root)
 * root = '' pour index.html, '../' pour pages/
 */

export function buildNav(root = '') {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  // Lien vers l'accueil sans /index.html (qui redirige vers /)
  const home = root || './';

  const isLightPage = document.body.dataset.navTheme === 'light';
  const logoLight = isLightPage
    ? `${root}assets/images/logo/logo-horizontal-dark.png`
    : `${root}assets/images/logo/logo-horizontal-beige.png`;
  const logoDark = `${root}assets/images/logo/logo-horizontal-dark.png`;

  nav.innerHTML = `
    <nav class="nav" role="navigation" aria-label="Navigation principale">

      <a href="${home}" class="nav-logo" aria-label="Spaces That Matter — Accueil">
        <img src="${logoLight}" alt="Spaces That Matter" height="44"
             class="nav-logo-img"
             data-light="${logoLight}"
             data-dark="${logoDark}">
      </a>

      <ul class="nav-links" role="list">
        <li><a href="${root}pages/label.html"        class="nav-link">Le label</a></li>
        <li><a href="${root}pages/methodologie.html"  class="nav-link">La méthodologie</a></li>
        <li><a href="${root}pages/equipe.html"        class="nav-link">L'équipe</a></li>
        <!-- <li><a href="${root}pages/entreprises.html"   class="nav-link">Entreprises</a></li> -->
        <li><a href="${root}pages/blog.html"          class="nav-link">Blog & Ressources</a></li>
        <li><a href="${root}pages/faq.html"           class="nav-link">FAQ</a></li>
        <li><a href="${root}pages/contact.html"       class="nav-link">Contact</a></li>
      </ul>

      <div class="nav-actions">
        <a href="#" data-quiz-open
           class="nav-link nav-contact-link"
           data-track-cta="nav_quiz"
           data-track-location="navigation">
          Quiz découverte
        </a>
        <a href="${home}#demo"
           class="nav-cta"
           data-track-cta="nav_demo"
           data-track-location="navigation">
          Demander une démo
        </a>
      </div>

      <button class="nav-hamburger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu">
        <span></span><span></span><span></span>
      </button>

    </nav>

    <div class="nav-mobile" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
      <nav>
        <ul role="list" class="nav-mobile-list">
          <li><a href="${home}"              class="nav-mobile-link">Accueil</a></li>
          <li><a href="${root}pages/label.html"        class="nav-mobile-link">Le label</a></li>
          <li><a href="${root}pages/methodologie.html" class="nav-mobile-link">La méthodologie</a></li>
          <li><a href="${root}pages/equipe.html"       class="nav-mobile-link">L'équipe</a></li>
          <!-- <li><a href="${root}pages/entreprises.html"  class="nav-mobile-link">Entreprises</a></li> -->
          <li><a href="${root}pages/blog.html"         class="nav-mobile-link">Blog & Ressources</a></li>
          <li><a href="${root}pages/faq.html"          class="nav-mobile-link">FAQ</a></li>
          <li><a href="${root}pages/contact.html"      class="nav-mobile-link">Contact</a></li>
          <li><a href="#" data-quiz-open class="nav-mobile-link">Quiz découverte</a></li>
          <li><a href="${home}#demo"          class="nav-mobile-link nav-mobile-cta">Demander une démo</a></li>
        </ul>
      </nav>
    </div>
  `;
}
