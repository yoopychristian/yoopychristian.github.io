// ==========================================================================
// Yoopy Christian Portfolio — Script
// Renders data-driven sections from content.json + handles interactions
// ==========================================================================

const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`;

const TYPE_LABELS = {
  lead: 'Leading',
  build: 'Built',
  contract: 'Freelance',
  personal: 'Side Project'
};

// --------------------------------------------------------------------------
// Data Fetching
// --------------------------------------------------------------------------

async function loadContent() {
  try {
    const res = await fetch('data/content.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to load content:', err);
    return null;
  }
}

// --------------------------------------------------------------------------
// Renderers
// --------------------------------------------------------------------------

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid || !projects) return;

  grid.innerHTML = projects.map(p => {
    const hasLink = !!p.url;
    const titleContent = hasLink
      ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.title)}</a>`
      : escapeHtml(p.title);

    return `
      <article class="project-card">
        ${p.type ? `<div class="project-card__meta">${escapeHtml(TYPE_LABELS[p.type] || p.type)}</div>` : ''}
        <h3 class="project-card__title">${titleContent}</h3>
        <p class="project-card__desc">${escapeHtml(p.description)}</p>
        <div class="project-card__footer">
          <div class="project-card__tags">
            ${p.tech.map(t => `<span class="project-card__tag">${escapeHtml(t)}</span>`).join('')}
          </div>
          ${hasLink ? `<span class="project-card__arrow">${ARROW_SVG}</span>` : ''}
        </div>
      </article>
    `;
  }).join('');
}

function renderExperience(experience) {
  const list = document.getElementById('experience-list');
  if (!list || !experience) return;

  list.innerHTML = experience.map(exp => {
    const period = exp.current ? computeDuration(exp.startDate) : exp.period;

    const highlights = exp.highlights
      ? `<div class="experience-item__highlights">
           ${exp.highlights.map(h => `<div class="experience-item__highlight">${escapeHtml(h)}</div>`).join('')}
         </div>`
      : '';

    return `
      <div class="experience-item">
        <div class="experience-item__period">${escapeHtml(period)}</div>
        <div class="experience-item__body">
          <div class="experience-item__role">${escapeHtml(exp.role)}</div>
          <div class="experience-item__company">${escapeHtml(exp.company)}</div>
          <div class="experience-item__desc">${escapeHtml(exp.description)}</div>
          ${highlights}
        </div>
      </div>
    `;
  }).join('');
}

function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  if (!grid || !skills) return;

  grid.innerHTML = Object.entries(skills).map(([category, items]) => `
    <div class="skill-row">
      <div class="skill-row__label">${escapeHtml(category)}</div>
      <div class="skill-row__items">
        ${items.map(item => `<span class="skill-row__item">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function computeDuration(startDate) {
  const [startYear, startMonth] = startDate.split('-').map(Number);
  const now = new Date();
  let months = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMonth);
  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let duration = 'Jan 2023 — Present';
  if (years > 0 && remainingMonths > 0) {
    duration += ` · ${years}y ${remainingMonths}m`;
  } else if (years > 0) {
    duration += ` · ${years}y`;
  } else if (remainingMonths > 0) {
    duration += ` · ${remainingMonths}m`;
  }

  return duration;
}

// --------------------------------------------------------------------------
// Starfield
// --------------------------------------------------------------------------

function createStarfield() {
  // Respect reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const container = document.createElement('div');
  container.className = 'starfield';
  container.setAttribute('aria-hidden', 'true');

  const starCount = 120;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // ~20% of stars get a twinkle animation
    if (!prefersReduced && Math.random() < 0.2) {
      star.classList.add('star--twinkle');
    }

    const size = Math.random() * 1.5 + 0.5;
    const opacity = Math.random() * 0.4 + 0.08;

    star.style.cssText =
      `left:${Math.random() * 100}%;` +
      `top:${Math.random() * 100}%;` +
      `width:${size}px;` +
      `height:${size}px;` +
      `opacity:${opacity};` +
      `animation-delay:${Math.random() * 5}s;`;

    container.appendChild(star);
  }

  document.body.prepend(container);
}

// --------------------------------------------------------------------------
// Navigation
// --------------------------------------------------------------------------

function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    links.classList.toggle('is-open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}

// --------------------------------------------------------------------------
// Init
// --------------------------------------------------------------------------

async function init() {
  createStarfield();
  initNav();

  const data = await loadContent();
  if (!data) return;

  renderProjects(data.projects);
  renderExperience(data.experience);
  renderSkills(data.skills);
}

init();
