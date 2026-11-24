/**
 * Consentement aux cookies de mesure d'audience (Google Analytics)
 *
 * Google Analytics n'est chargé qu'après un « Accepter » explicite. Tant que le visiteur
 * n'a pas choisi, ou s'il refuse, aucun script ni cookie Google n'est déposé.
 * Le choix est conservé 6 mois, puis redemandé. Un bouton « Gérer les cookies »
 * ([data-consent-open], en pied de page) rouvre le bandeau à tout moment.
 */

const GA_ID = 'G-MDW588TY2T';
const KEY = 'stm-consent';
const VALIDITY_MS = 1000 * 60 * 60 * 24 * 182;    // 6 mois
const GA_COOKIE_SECONDS = 60 * 60 * 24 * 395;       // 13 mois, durée maximale recommandée par la CNIL

const TEXT = {
  fr: {
    label: 'Gestion des cookies',
    message: 'Nous utilisons des cookies de mesure d\'audience (Google Analytics) pour comprendre comment le site est utilisé. Ils ne sont déposés qu\'avec votre accord.',
    more: 'En savoir plus',
    refuse: 'Refuser',
    accept: 'Accepter',
    policy: 'pages/legal/cookies.html',
  },
  en: {
    label: 'Cookie settings',
    message: 'We use audience measurement cookies to understand how the site is used. They are only set with your consent.',
    more: 'Learn more',
    refuse: 'Decline',
    accept: 'Accept',
    policy: 'pages/legal/cookies.html',
  },
};

let banner = null;

function readChoice() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && Date.now() - saved.date < VALIDITY_MS && ['granted', 'denied'].includes(saved.choice)) return saved.choice;
  } catch { /* stockage indisponible : on redemande */ }
  return null;
}

function saveChoice(choice) {
  try { localStorage.setItem(KEY, JSON.stringify({ choice, date: Date.now() })); } catch { /* navigation privée stricte */ }
}

function loadAnalytics() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { cookie_expires: GA_COOKIE_SECONDS });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

/* Retrait du consentement : suppression des cookies _ga* déjà déposés */
function deleteAnalyticsCookies() {
  const host = location.hostname.replace(/^www\./, '');
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith('_ga')) continue;
    for (const domain of ['', `; domain=.${host}`, `; domain=${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

function buildBanner(t, root) {
  const el = document.createElement('aside');
  el.className = 'consent-banner';
  el.setAttribute('aria-label', t.label);
  el.hidden = true;
  el.innerHTML = `
    <p>${t.message} <a href="${root}${t.policy}">${t.more}</a></p>
    <div class="consent-actions">
      <button type="button" class="btn btn-primary" data-consent="denied">${t.refuse}</button>
      <button type="button" class="btn btn-primary" data-consent="granted">${t.accept}</button>
    </div>`;
  el.addEventListener('click', e => {
    const button = e.target.closest('[data-consent]');
    if (!button) return;
    const previous = readChoice();
    const choice = button.dataset.consent;
    saveChoice(choice);
    el.hidden = true;
    if (choice === 'granted') loadAnalytics();
    else if (previous === 'granted' || window.gtag) {
      // Google Analytics était actif : on efface ses cookies et on recharge pour l'arrêter
      deleteAnalyticsCookies();
      location.reload();
    }
  });
  document.body.appendChild(el);
  return el;
}

/**
 * @param {'fr'|'en'} lang
 * @param {string} root chemin relatif vers la racine de la langue
 */
export function initConsent(lang = 'fr', root = '') {
  const t = TEXT[lang] || TEXT.fr;
  banner = buildBanner(t, root);

  const choice = readChoice();
  if (choice === 'granted') loadAnalytics();
  else if (choice === null) banner.hidden = false; // non bloquant : le site reste utilisable

  // « Gérer les cookies » : rouvre le bandeau et y place le focus clavier
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-consent-open]')) return;
    e.preventDefault();
    banner.hidden = false;
    banner.querySelector('[data-consent="denied"]').focus();
  });
}
