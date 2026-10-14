/**
 * SPACES THAT MATTER — Analytics & Tracking
 *
 * Architecture :
 *   GTM (container) → Google Analytics 4 + Google Ads
 *
 * GTM_ID : à renseigner dans index.html (GTM-XXXXXXX)
 * GA4_ID : configuré dans GTM (pas ici)
 *
 * Ce fichier envoie des dataLayer events custom
 * que GTM intercepte pour les router vers GA4 / Ads
 */

// ── dataLayer helper ─────────────────────────────────────────

function pushEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

// ── Init ─────────────────────────────────────────────────────

export function initTracking() {

  // ── 1. Page view (géré automatiquement par GTM/GA4)
  // mais on log pour debug
  console.debug('[STM] tracking init — page:', document.title);

  // ── 2. CTA clicks
  document.querySelectorAll('[data-track-cta]').forEach(el => {
    el.addEventListener('click', () => {
      pushEvent('cta_click', {
        cta_label:    el.dataset.trackCta,
        cta_location: el.dataset.trackLocation || 'unknown',
        page_path:    window.location.pathname,
      });
    });
  });

  // ── 3. Formulaire contact — étapes
  const form = document.querySelector('[data-track-form]');
  if (form) {
    const formName = form.dataset.trackForm;

    // Premier focus = début d'interaction
    let formStarted = false;
    form.addEventListener('focusin', () => {
      if (!formStarted) {
        formStarted = true;
        pushEvent('form_start', { form_name: formName });
      }
    });

    // Soumission
    form.addEventListener('submit', (e) => {
      pushEvent('form_submit', {
        form_name: formName,
        page_path: window.location.pathname,
      });
      // Google Ads conversion (déclenché via GTM tag sur form_submit)
    });
  }

  // ── 4. Scroll depth milestones
  const milestones = [25, 50, 75, 90];
  const reached    = new Set();

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const pct = Math.round(self.progress * 100);
      milestones.forEach(m => {
        if (pct >= m && !reached.has(m)) {
          reached.add(m);
          pushEvent('scroll_depth', {
            depth_percent: m,
            page_path: window.location.pathname,
          });
        }
      });
    },
  });

  // ── 5. Portfolio / projet cliqué
  document.querySelectorAll('[data-track-project]').forEach(el => {
    el.addEventListener('click', () => {
      pushEvent('project_click', {
        project_name: el.dataset.trackProject,
        project_category: el.dataset.trackCategory || 'uncategorized',
      });
    });
  });

  // ── 6. Téléphone / email cliqués (micro-conversions)
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener('click', () => {
      pushEvent('phone_click', {
        phone_number: el.getAttribute('href').replace('tel:', ''),
        page_path: window.location.pathname,
      });
    });
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
    el.addEventListener('click', () => {
      pushEvent('email_click', {
        email: el.getAttribute('href').replace('mailto:', ''),
        page_path: window.location.pathname,
      });
    });
  });

  // ── 7. Temps passé sur la page (engagement)
  let engagementFired = false;
  setTimeout(() => {
    if (!engagementFired) {
      engagementFired = true;
      pushEvent('page_engagement', {
        time_seconds: 30,
        page_path: window.location.pathname,
      });
    }
  }, 30000);

  // ── 8. UTM params → sessionStorage (pour attribution)
  const urlParams = new URLSearchParams(window.location.search);
  const utmKeys   = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid'];

  utmKeys.forEach(key => {
    const val = urlParams.get(key);
    if (val) sessionStorage.setItem(key, val);
  });

  // Enrichir les events avec UTM si présents
  const utmData = {};
  utmKeys.forEach(k => {
    const v = sessionStorage.getItem(k);
    if (v) utmData[k] = v;
  });

  if (Object.keys(utmData).length > 0) {
    pushEvent('session_attribution', utmData);
  }
}
