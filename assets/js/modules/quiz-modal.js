/**
 * Quiz Découverte — Modal
 * S'ouvre sur n'importe quelle page via le bouton nav "Quiz découverte"
 */

const QUESTIONS = [
  {
    q: "Combien de temps faut-il en moyenne pour retrouver sa concentration après une interruption ?",
    options: ["5 minutes", "14 minutes", "23 minutes"],
    correct: 2,
    expl: "Il faut en moyenne 23 minutes pour revenir pleinement à une tâche après une interruption. Dans des environnements de travail non maîtrisés (bruit, sollicitations), cela représente un coût invisible majeur sur la productivité cognitive.",
    source: "Gloria Mark, Université de Californie (2008)"
  },
  {
    q: "Les rencontres impromptues au bureau favorisent l'innovation ?",
    options: ["Vrai", "Faux"],
    correct: 0,
    expl: "Les rencontres informelles favorisent l'innovation en facilitant les échanges d'idées entre individus et équipes. Les travaux d'Alex Pentland montrent que les interactions informelles sont un prédicteur clé de performance et d'innovation. Structurer la sérendipité dans les espaces est un levier sous-estimé de performance.",
    source: "MIT Media Lab, étude sociométrique (Pentland, 2012)"
  },
  {
    q: "Quel est l'effet d'une simple proximité physique entre collègues ?",
    options: ["Diminution de la concentration", "Augmentation des affinités sociales", "Baisse de la productivité"],
    correct: 1,
    expl: "C'est l'effet de propinquité : plus deux personnes partagent un espace proche, plus elles développent naturellement des liens sociaux et de la coopération. L'implantation des équipes est un levier organisationnel stratégique.",
    source: "Effet de propinquité, Festinger, Schachter & Back (1950)"
  },
  {
    q: "Quel est l'impact d'un environnement végétalisé sur les collaborateurs ?",
    options: ["Faible", "Modéré", "Significatif"],
    correct: 2,
    expl: "La présence de végétaux dans les bureaux réduit significativement le stress, jusqu'à 15 % selon certaines méta-analyses, tout en améliorant la concentration et le bien-être. La nature n'est pas un « plus esthétique », c'est un facteur de performance neurocognitive.",
    source: "Gillis & Gatersleben (2015)"
  },
  {
    q: "Quel est l'effet d'une pause collective sur la performance d'une équipe ?",
    options: ["+20 % de performance", "-20 % de performance", "Aucun effet"],
    correct: 0,
    expl: "Les pauses collectives synchronisées améliorent la performance des équipes en renforçant les interactions sociales, la circulation de l'information et la cohésion. Les travaux de Pentland montrent une augmentation jusqu'à 20 % de la productivité. Le lien social est un actif productif, pas une perte de temps.",
    source: "Pentland, 2012"
  },
  {
    q: "Les salariés travaillant dans un bureau sans fenêtre dorment en moyenne…",
    options: ["46 minutes de moins par nuit", "5 minutes de moins par nuit", "30 minutes de plus par nuit"],
    correct: 0,
    expl: "L'exposition à la lumière naturelle régule le rythme circadien. Privés de fenêtres, les salariés perdent jusqu'à 46 minutes de sommeil par nuit, avec des effets directs sur leur performance et leur santé. Un espace sans lumière naturelle est un facteur de désengagement physiologique.",
    source: "Mohamed Boubekri, 2014"
  }
];

const SCORES = [
  { min: 0, max: 2, label: "Curieux en éveil",   desc: "Vous débutez votre exploration de la science des espaces. Saviez-vous qu'un environnement végétalisé réduit le stress de 15 % ou que 46 minutes de sommeil se jouent sur la présence d'une fenêtre ? Ces connaissances sont essentielles pour créer des lieux qui font vraiment la différence." },
  { min: 3, max: 3, label: "Curieux éclairé",    desc: "Vous commencez à percevoir l'impact concret des espaces sur vos équipes. Les recherches sur la propinquité, la lumière naturelle ou les pauses collectives montrent que l'environnement est un levier de performance trop souvent ignoré." },
  { min: 4, max: 4, label: "Explorateur averti", desc: "Vous avez une bonne sensibilité aux enjeux des espaces de travail. Il ne reste plus qu'à passer à la mesure scientifique pour transformer ces intuitions solides en décisions éclairées et argumentées." },
  { min: 5, max: 5, label: "Expert en devenir",  desc: "Votre connaissance est solide. Vous êtes prêt à mettre en place une évaluation structurée de vos espaces pour optimiser concrètement l'impact sur vos équipes et convaincre les décideurs." },
  { min: 6, max: 6, label: "Maître des espaces", desc: "Score parfait ! Vous maîtrisez la science des espaces de travail comme peu de personnes. Vous avez toutes les clés pour convaincre votre organisation d'investir dans des environnements véritablement performants." }
];

/* ── État ── */
let current = 0;
let score   = 0;
let answered = false;

/* ── Injection du CSS ── */
function injectStyles() {
  if (document.getElementById('quiz-modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'quiz-modal-styles';
  style.textContent = `
/* ─── Overlay ─── */
.qm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20,25,45,.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease;
}
.qm-overlay.is-open {
  opacity: 1;
  pointer-events: all;
}

/* ─── Panel ─── */
.qm-panel {
  background: var(--color-bg, #FAFAF8);
  border-radius: 1.25rem;
  width: 100%;
  max-width: 620px;
  max-height: 98vh;
  overflow-y: auto;
  padding: 1.75rem 2.25rem;
  position: relative;
  transform: translateY(24px);
  transition: transform .35s cubic-bezier(.22,1,.36,1), max-width .35s ease;
  scrollbar-width: thin;
}
.qm-panel.is-results {
  max-width: 800px;
}
.qm-overlay.is-open .qm-panel {
  transform: translateY(0);
}

/* ─── Close ─── */
.qm-close {
  position: absolute;
  top: 1.25rem; right: 1.25rem;
  width: 2rem; height: 2rem;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text-muted);
  transition: background .15s, color .15s;
}
.qm-close:hover { background: var(--color-surface); color: var(--color-text); }
.qm-close svg { pointer-events: none; }

/* ─── Intro ─── */
.qm-icon {
  width: 3.5rem; height: 3.5rem;
  border-radius: 50%;
  background: var(--color-surface, #F3F0EA);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--color-primary);
}
.qm-intro-title {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 400;
  color: var(--color-primary);
  text-align: center;
  line-height: 1.2;
  margin-bottom: .75rem;
}
.qm-intro-subtitle {
  font-family: var(--font-sans);
  font-size: .88rem;
  font-weight: 600;
  color: var(--color-accent, #C9A84C);
  text-align: center;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.qm-intro-desc {
  font-size: .9rem;
  color: var(--color-text-muted);
  line-height: 1.75;
  text-align: center;
  max-width: 48ch;
  margin: 0 auto .9rem;
}
.qm-start-btn {
  display: flex; align-items: center; gap: .5rem;
  margin: 1.75rem auto 0;
}

/* ─── Progress ─── */
.qm-progress-wrap {
  height: 3px;
  background: var(--color-border);
  border-radius: 2px;
  margin-bottom: 1rem;
  overflow: hidden;
}
.qm-progress-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width .4s ease;
}
.qm-counter {
  font-size: .68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--color-text-muted);
  margin-bottom: .5rem;
}
.qm-q-text {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  color: var(--color-primary);
  line-height: 1.35;
  margin-bottom: 1.1rem;
}
.qm-options {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: .45rem;
}
.qm-option-btn {
  width: 100%;
  text-align: left;
  padding: .65rem 1.1rem;
  border: 1.5px solid var(--color-border);
  border-radius: .5rem;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: .88rem;
  cursor: pointer;
  transition: border-color .15s, background .15s;
}
.qm-option-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-surface);
}
.qm-option-btn.is-correct {
  border-color: #2e7d32; background: #f0faf0; color: #1b5e20; font-weight: 600;
}
.qm-option-btn.is-wrong {
  border-color: #c62828; background: #fff5f5; color: #b71c1c;
}
.qm-option-btn:disabled { cursor: default; }

/* ─── Feedback ─── */
.qm-feedback {
  margin-top: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--color-surface);
  border-radius: .75rem;
  display: flex; flex-direction: column; gap: .75rem;
}
.qm-fb-badge {
  font-size: .75rem; font-weight: 700;
  padding: .3rem .9rem; border-radius: 999px;
  display: inline-block; align-self: flex-start;
}
.qm-fb-badge.is-correct { background: #e8f5e9; color: #2e7d32; }
.qm-fb-badge.is-wrong   { background: #ffebee; color: #c62828; }
.qm-fb-expl  { font-size: .85rem; color: var(--color-text); line-height: 1.65; }
.qm-fb-src   { font-size: .68rem; color: var(--color-text-muted); font-style: italic; }
.qm-next-btn {
  align-self: flex-start; display: inline-flex;
  align-items: center; gap: .4rem; margin-top: .25rem;
}

/* ─── Results ─── */
.qm-results { text-align: left; }
.qm-results-top {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.qm-results-left {
  flex: 0 0 auto;
  width: 210px;
  text-align: center;
  padding-right: 1.25rem;
  border-right: 1px solid var(--color-border);
}
.qm-score-label {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-primary);
  margin-bottom: .15rem;
  line-height: 1.2;
}
.qm-score-num {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 7vw, 3.5rem);
  font-weight: 300;
  color: var(--color-accent, #C9A84C);
  line-height: 1;
  margin-bottom: .6rem;
}
.qm-score-desc {
  font-size: .75rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
  text-align: left;
}
.qm-cta-block {
  background: var(--color-primary);
  border-radius: 1rem;
  padding: 1.75rem 2rem;
  text-align: left;
  color: #FAFAF8;
}
.qm-cta-title {
  font-family: var(--font-serif);
  font-size: 1.2rem; font-weight: 400;
  margin-bottom: .6rem;
}
.qm-cta-desc {
  font-size: .8rem; line-height: 1.7;
  color: rgba(250,250,248,.7);
  margin-bottom: 1.25rem;
}
.qm-cta-actions {
  display: flex; gap: .75rem; flex-wrap: wrap; align-items: center;
}
/* ─── Closing text ─── */
.qm-closing-text {
  flex: 1;
  text-align: left;
  min-width: 0;
}
.qm-closing-intro {
  font-size: .82rem;
  color: var(--color-text);
  line-height: 1.65;
  font-weight: 500;
  margin-bottom: .65rem;
}
.qm-closing-lead {
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--color-text-muted);
  margin-bottom: .25rem;
}
.qm-closing-list {
  list-style: none;
  padding: 0;
  margin: 0 0 .6rem;
  display: flex;
  flex-direction: column;
  gap: .2rem;
}
.qm-closing-list li {
  font-size: .8rem;
  line-height: 1.45;
  padding-left: 1.1rem;
  position: relative;
  color: var(--color-text);
}
.qm-closing-list--neg li::before {
  content: "–";
  position: absolute;
  left: 0;
  color: #c62828;
  font-weight: 700;
}
.qm-closing-list--pos li::before {
  content: "+";
  position: absolute;
  left: 0;
  color: #2e7d32;
  font-weight: 700;
}
.qm-closing-more {
  font-size: .8rem;
  font-style: italic;
  color: var(--color-text-muted);
  margin: 0;
}

.qm-restart-btn {
  background: transparent; border: none;
  color: var(--color-text-muted); font-size: .8rem;
  cursor: pointer; text-decoration: underline;
  text-underline-offset: 2px; margin-top: .75rem;
  display: block; width: 100%; text-align: center;
}
.qm-restart-btn:hover { color: var(--color-text); }
.qm-email-block {
  background: var(--color-primary);
  border-radius: .75rem;
  padding: 1rem 1.25rem;
  text-align: left;
  color: #FAFAF8;
}
.qm-email-block .qm-cta-title { margin-bottom: .25rem; font-size: 1rem; }
.qm-email-block .qm-cta-desc  { margin-bottom: .75rem; }
.qm-email-row {
  display: flex; gap: .5rem; flex-wrap: wrap;
}
.qm-email-input {
  flex: 1; min-width: 0;
  padding: .6rem 1rem;
  border: 1.5px solid rgba(250,250,248,.3);
  border-radius: var(--radius-full, 999px);
  background: rgba(250,250,248,.1);
  color: #FAFAF8;
  font-family: var(--font-sans);
  font-size: .85rem;
  outline: none;
  transition: border-color .15s;
}
.qm-email-input::placeholder { color: rgba(250,250,248,.45); }
.qm-email-input:focus { border-color: rgba(250,250,248,.7); }
.qm-email-confirm {
  font-size: .78rem;
  color: rgba(250,250,248,.6);
  margin-top: .6rem;
  display: none;
}
.qm-email-confirm.is-sent { display: block; }

/* ─── Screen visibility ─── */
.qm-screen { display: none; }
.qm-screen.is-active { display: block; }

@media (max-width: 600px) {
  .qm-panel { padding: 1.25rem 1rem; }
  .qm-cta-block { padding: 1rem; }
}
  `;
  document.head.appendChild(style);
}

/* ── Root path helper ── */
function getRoot() {
  const p = window.location.pathname;
  if (p.includes('/pages/blog/')) return '../../';
  if (p.includes('/pages/'))      return '../';
  return '';
}

/* ── Injection du HTML ── */
function injectHTML() {
  if (document.getElementById('quiz-modal-overlay')) return;
  const root = getRoot();

  const el = document.createElement('div');
  el.innerHTML = `
<div class="qm-overlay" id="quiz-modal-overlay" role="dialog" aria-modal="true" aria-label="Quiz Découverte">
  <div class="qm-panel" id="quiz-modal-panel">
    <button class="qm-close" id="qm-close" aria-label="Fermer le quiz">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M1 1l12 12M13 1L1 13"/>
      </svg>
    </button>

    <!-- Intro -->
    <div class="qm-screen is-active" id="qm-intro">
      <div class="qm-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
        </svg>
      </div>
      <h2 class="qm-intro-title">Quiz Découverte</h2>
      <p class="qm-intro-subtitle">Testez vos connaissances sur les espaces de travail</p>
      <p class="qm-intro-desc">Savez-vous vraiment ce qui se cache derrière un espace de travail performant ? Découvrez à travers ce quiz basé sur des études scientifiques l'impact réel de l'environnement sur la productivité, le bien-être et la collaboration.</p>
      <p class="qm-intro-desc">Prêt à être surpris ?</p>
      <p class="qm-intro-desc" style="font-style:italic; font-size:.8rem; margin-top:.25rem;">⏱ Environ 2 minutes</p>
      <button id="qm-start" class="btn btn-primary qm-start-btn">
        Commencer le quiz
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>

    <!-- Question -->
    <div class="qm-screen" id="qm-question">
      <div class="qm-progress-wrap"><div class="qm-progress-bar" id="qm-bar"></div></div>
      <p class="qm-counter"   id="qm-counter"></p>
      <h3 class="qm-q-text"   id="qm-qtext"></h3>
      <ul class="qm-options"  id="qm-options" role="list"></ul>
      <div class="qm-feedback" id="qm-feedback" style="display:none;">
        <div class="qm-fb-badge" id="qm-fb-badge"></div>
        <p class="qm-fb-expl"   id="qm-fb-expl"></p>
        <p class="qm-fb-src"    id="qm-fb-src"></p>
        <button id="qm-next" class="btn btn-primary qm-next-btn">
          Question suivante
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>

    <!-- Results -->
    <div class="qm-screen qm-results" id="qm-results">
      <div class="qm-results-top">
        <div class="qm-results-left">
          <p class="qm-score-label" id="qm-score-label"></p>
          <div class="qm-score-num" id="qm-score-num"></div>
          <p class="qm-score-desc"  id="qm-score-desc"></p>
        </div>
        <div class="qm-closing-text">
          <p class="qm-closing-intro">Les espaces de travail sont aujourd'hui l'un des leviers les plus sous-exploités de performance.</p>
          <p class="qm-closing-lead">Un environnement de travail peut :</p>
          <ul class="qm-closing-list qm-closing-list--neg">
            <li>Dégrader silencieusement la concentration</li>
            <li>Éroder les relations sociales</li>
            <li>Réduire la capacité d'innovation</li>
          </ul>
          <p class="qm-closing-lead">Ou au contraire :</p>
          <ul class="qm-closing-list qm-closing-list--pos">
            <li>Amplifier la collaboration</li>
            <li>Accélérer la prise de décision</li>
            <li>Renforcer l'engagement collectif</li>
          </ul>
          <p class="qm-closing-more">Et bien plus encore !</p>
        </div>
      </div>
      <div class="qm-email-block">
        <p class="qm-cta-title">Vous souhaitez en savoir plus ?</p>
        <p class="qm-cta-desc">Laissez-nous votre adresse e-mail — nous pourrons vous recontacter pour vous présenter notre solution ou organiser une démo.</p>
        <div class="qm-email-row">
          <input type="email" id="qm-email-input" class="qm-email-input" placeholder="votre@email.com" autocomplete="email">
          <button id="qm-email-submit" class="btn btn-accent">Envoyer</button>
        </div>
        <p class="qm-email-confirm" id="qm-email-confirm">✓ Merci ! Nous vous recontacterons prochainement.</p>
      </div>
      <button class="qm-restart-btn" id="qm-restart">Recommencer le quiz</button>
    </div>
  </div>
</div>
  `.trim();

  document.body.appendChild(el.firstChild);
}

/* ── Navigation entre écrans ── */
function showScreen(id) {
  document.querySelectorAll('.qm-screen').forEach(s => s.classList.remove('is-active'));
  document.getElementById(id).classList.add('is-active');
  document.getElementById('quiz-modal-panel').scrollTop = 0;
}

/* ── Chargement d'une question ── */
function loadQuestion() {
  answered = false;
  const q = QUESTIONS[current];

  document.getElementById('qm-counter').textContent = `Question ${current + 1} / ${QUESTIONS.length}`;
  document.getElementById('qm-qtext').textContent   = q.q;
  document.getElementById('qm-bar').style.width     = `${(current / QUESTIONS.length) * 100}%`;

  const list = document.getElementById('qm-options');
  list.innerHTML = '';
  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button class="qm-option-btn" data-i="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>`;
    list.appendChild(li);
  });

  const fb = document.getElementById('qm-feedback');
  fb.style.display = 'none';

  list.querySelectorAll('.qm-option-btn').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.i)));
  });
}

/* ── Sélection d'une réponse ── */
function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const q = QUESTIONS[current];
  const ok = idx === q.correct;
  if (ok) score++;

  document.querySelectorAll('.qm-option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('is-correct');
    else if (i === idx && !ok) btn.classList.add('is-wrong');
  });

  const badge = document.getElementById('qm-fb-badge');
  badge.textContent = ok
    ? '✓ Bonne réponse !'
    : `✗ Incorrect — bonne réponse : ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}`;
  badge.className = `qm-fb-badge ${ok ? 'is-correct' : 'is-wrong'}`;

  document.getElementById('qm-fb-expl').textContent = q.expl;
  document.getElementById('qm-fb-src').textContent  = `Source : ${q.source}`;

  const btnNext = document.getElementById('qm-next');
  btnNext.childNodes[0].textContent = current + 1 >= QUESTIONS.length
    ? 'Voir mes résultats '
    : 'Question suivante ';

  document.getElementById('qm-feedback').style.display = 'flex';
  document.getElementById('qm-feedback').style.flexDirection = 'column';
}

/* ── Affichage des résultats ── */
function showResults() {
  const tier = SCORES.find(s => score >= s.min && score <= s.max);
  document.getElementById('qm-score-label').textContent = tier.label;
  document.getElementById('qm-score-num').textContent   = `${score} / ${QUESTIONS.length}`;
  document.getElementById('qm-score-desc').textContent  = tier.desc;
  document.getElementById('quiz-modal-panel').classList.add('is-results');
  showScreen('qm-results');
}

/* ── Ouverture / Fermeture ── */
function openModal() {
  const overlay = document.getElementById('quiz-modal-overlay');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  if (window.lenis) window.lenis.stop();
}

function closeModal() {
  const overlay = document.getElementById('quiz-modal-overlay');
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  if (window.lenis) window.lenis.start();
}

function resetQuiz() {
  current  = 0;
  score    = 0;
  answered = false;
  document.getElementById('quiz-modal-panel').classList.remove('is-results');
  showScreen('qm-intro');
}

/* ── Init ── */
export function initQuizModal() {
  injectStyles();
  injectHTML();

  /* Boutons de la nav (injectés après) */
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-quiz-open]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  /* Fermeture */
  document.getElementById('qm-close').addEventListener('click', closeModal);
  document.getElementById('quiz-modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* Démarrage */
  document.getElementById('qm-start').addEventListener('click', () => {
    current = 0; score = 0;
    loadQuestion();
    showScreen('qm-question');
  });

  /* Question suivante / résultats */
  document.getElementById('qm-next').addEventListener('click', () => {
    current++;
    if (current < QUESTIONS.length) {
      loadQuestion();
    } else {
      showResults();
    }
  });

  /* Recommencer */
  document.getElementById('qm-restart').addEventListener('click', resetQuiz);

  /* Email capture résultats → Formspree */
  document.getElementById('qm-email-submit').addEventListener('click', async () => {
    const input   = document.getElementById('qm-email-input');
    const confirm = document.getElementById('qm-email-confirm');
    const btn     = document.getElementById('qm-email-submit');
    const email   = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.focus();
      return;
    }
    btn.disabled = true;
    btn.textContent = '…';
    try {
      await fetch('https://formspree.io/f/xlgoonlv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email,
          _subject: 'Demande de recontact — Quiz Découverte STM',
          source: 'quiz_decouverte',
          score: document.getElementById('qm-score-num').textContent
        })
      });
      input.style.display = 'none';
      btn.style.display   = 'none';
      confirm.classList.add('is-sent');
    } catch {
      btn.disabled = false;
      btn.textContent = 'Envoyer';
    }
  });
}
