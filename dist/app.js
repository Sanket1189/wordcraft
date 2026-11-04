const app = document.querySelector('#app');
const completed = new Set(JSON.parse(localStorage.getItem('wordcraft-completed') || '[]'));

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const saveProgress = () => localStorage.setItem('wordcraft-completed', JSON.stringify([...completed]));

function renderHome() {
  app.innerHTML = '';
  app.append(document.querySelector('#homeTemplate').content.cloneNode(true));
  const grid = document.querySelector('#dayGrid');
  DAYS.forEach((day, i) => {
    const button = document.createElement('button');
    button.className = `day-card ${completed.has(i + 1) ? 'done' : ''}`;
    button.innerHTML = `<span class="day-num">${String(i + 1).padStart(2,'0')}</span><h3>${escapeHtml(day.theme)}</h3><p>${escapeHtml(day.note)}</p>`;
    button.addEventListener('click', () => goToDay(i + 1));
    grid.append(button);
  });
  document.querySelector('#progressNumber').textContent = completed.size;
  document.querySelector('#progressBar').style.width = `${completed.size / DAYS.length * 100}%`;
  document.querySelector('#startBtn').addEventListener('click', () => {
    const next = DAYS.findIndex((_, i) => !completed.has(i + 1));
    goToDay(next === -1 ? 1 : next + 1);
  });
  document.title = 'Wordcraft — 100 Days to Better English';
  window.scrollTo({top: 0, behavior: 'instant'});
}

function goToDay(dayNumber) {
  location.hash = `day-${dayNumber}`;
}

function renderDay(dayNumber) {
  const day = DAYS[dayNumber - 1];
  if (!day) return renderHome();
  const words = day.words.map(item => `
    <article class="word-card">
      <h3>${escapeHtml(item.word)}</h3>
      <div class="word-definition">
        <p>${escapeHtml(item.meaning)}</p>
        <blockquote>“${escapeHtml(item.example)}”</blockquote>
      </div>
    </article>`).join('');
  const lessons = day.lessons.map((item, i) => `
    <article class="lesson-card ${i === 0 ? 'open' : ''}">
      <button class="lesson-toggle" aria-expanded="${i === 0}">
        <span class="lesson-index">0${i + 1}</span><h3>${escapeHtml(item.title)}</h3><span class="plus">+</span>
      </button>
      <div class="lesson-body"><div class="lesson-inner">
        <p>${escapeHtml(item.idea)}</p>
        <div class="pattern-box"><small>REMEMBER THE PATTERN</small><code>${escapeHtml(item.pattern)}</code><em>“${escapeHtml(item.example)}”</em></div>
      </div></div>
    </article>`).join('');
  app.innerHTML = `
    <section class="day-page">
      <button class="back-link" id="backHome">← All one hundred days</button>
      <div class="day-hero">
        <span class="day-big-num ${dayNumber >= 100 ? 'triple' : ''}">${String(dayNumber).padStart(2,'0')}</span>
        <div><h1>${escapeHtml(day.theme)}</h1><p>${escapeHtml(day.note)}</p></div>
        <div class="lesson-count"><strong>10 WORDS</strong><strong>3 LESSONS</strong>≈ 15 MINUTES</div>
      </div>
      <div class="content-label"><h2>Today's vocabulary</h2><span>READ • SAY • USE</span></div>
      <div class="word-list">${words}</div>
      <div class="content-label"><h2>Three useful lessons</h2><span>TAP TO EXPAND</span></div>
      <div class="lesson-list">${lessons}</div>
      <div class="day-footer">
        <button class="nav-btn" id="prevDay" ${dayNumber === 1 ? 'disabled' : ''}>← Previous day</button>
        <button class="complete-btn ${completed.has(dayNumber) ? 'done' : ''}" id="completeDay">${completed.has(dayNumber) ? '✓ Day completed' : 'Mark day complete'}</button>
        <button class="nav-btn" id="nextDay" ${dayNumber === DAYS.length ? 'disabled' : ''}>Next day →</button>
      </div>
    </section>`;
  document.querySelector('#backHome').addEventListener('click', () => location.hash = 'home');
  document.querySelectorAll('.lesson-toggle').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.lesson-card');
    card.classList.toggle('open');
    button.setAttribute('aria-expanded', card.classList.contains('open'));
  }));
  document.querySelector('#prevDay').addEventListener('click', () => dayNumber > 1 && goToDay(dayNumber - 1));
  document.querySelector('#nextDay').addEventListener('click', () => dayNumber < DAYS.length && goToDay(dayNumber + 1));
  document.querySelector('#completeDay').addEventListener('click', (event) => {
    completed.has(dayNumber) ? completed.delete(dayNumber) : completed.add(dayNumber);
    saveProgress();
    event.currentTarget.classList.toggle('done', completed.has(dayNumber));
    event.currentTarget.textContent = completed.has(dayNumber) ? '✓ Day completed' : 'Mark day complete';
  });
  document.title = `Day ${dayNumber}: ${day.theme} — Wordcraft`;
  window.scrollTo({top: 0, behavior: 'instant'});
}

function route() {
  const match = location.hash.match(/^#day-(\d+)$/);
  if (match) renderDay(Number(match[1])); else renderHome();
}

const dialog = document.querySelector('#searchDialog');
const input = document.querySelector('#searchInput');
const results = document.querySelector('#searchResults');

function searchWords(query = '') {
  const q = query.trim().toLowerCase();
  if (!q) {
    results.innerHTML = '<p class="empty">Search all 200 words by word or meaning.</p>';
    return;
  }
  const matches = [];
  DAYS.forEach((day, i) => day.words.forEach(item => {
    if (`${item.word} ${item.meaning}`.toLowerCase().includes(q)) matches.push({...item, day: i + 1, theme: day.theme});
  }));
  results.innerHTML = matches.length ? matches.slice(0, 30).map(item => `
    <button class="search-result" data-day="${item.day}"><span><strong>${escapeHtml(item.word)}</strong><br><small>${escapeHtml(item.meaning)}</small></span><small>DAY ${String(item.day).padStart(2,'0')} →</small></button>`).join('') : '<p class="empty">No matching word yet. Try a simpler meaning.</p>';
  results.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => {
    dialog.close();
    goToDay(Number(button.dataset.day));
  }));
}

document.querySelector('#searchBtn').addEventListener('click', () => {
  dialog.showModal(); searchWords(input.value); setTimeout(() => input.focus(), 50);
});
document.querySelector('#closeSearch').addEventListener('click', () => dialog.close());
input.addEventListener('input', () => searchWords(input.value));
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

const savedTheme = localStorage.getItem('wordcraft-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
document.querySelector('#themeBtn').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('wordcraft-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

window.addEventListener('hashchange', route);
route();
