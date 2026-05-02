// State
let currentPage = 'guide';
let sightings = JSON.parse(localStorage.getItem('birdSightings') || '[]');
let selectedBird = null;
let filterDifficulty = 'Tümü';
let searchQuery = '';

// Utility
function saveSightings() {
  localStorage.setItem('birdSightings', JSON.stringify(sightings));
}

function getSeenBirdIds() {
  return new Set(sightings.map(s => s.birdId));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getDifficultyColor(diff) {
  const map = { 'Kolay': '#4caf50', 'Orta': '#ff9800', 'Zor': '#f44336', 'Çok Zor': '#9c27b0' };
  return map[diff] || '#888';
}

// Navigation
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add('active');
  renderPage();
}

function renderPage() {
  const main = document.getElementById('main-content');
  if (currentPage === 'guide') renderGuide(main);
  else if (currentPage === 'sightings') renderSightings(main);
  else if (currentPage === 'collection') renderCollection(main);
}

// ─── BIRD GUIDE ───────────────────────────────────────────────────────────────
function renderGuide(container) {
  const seenIds = getSeenBirdIds();
  const difficulties = ['Tümü', 'Kolay', 'Orta', 'Zor', 'Çok Zor'];

  const filtered = BIRDS.filter(b => {
    const matchDiff = filterDifficulty === 'Tümü' || b.difficulty === filterDifficulty;
    const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.habitat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDiff && matchSearch;
  });

  container.innerHTML = `
    <div class="page-header">
      <h2>🔭 Kuş Rehberi</h2>
      <p class="subtitle">${BIRDS.length} kuş türünü keşfet!</p>
    </div>

    <div class="controls">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="search-input" placeholder="Kuş ara..." value="${searchQuery}" />
      </div>
      <div class="filter-chips">
        ${difficulties.map(d => `
          <button class="chip ${filterDifficulty === d ? 'active' : ''}" data-diff="${d}">
            ${d}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="bird-grid">
      ${filtered.length === 0 ? '<p class="no-results">Hiç kuş bulunamadı 😔</p>' :
        filtered.map(bird => renderBirdCard(bird, seenIds.has(bird.id))).join('')
      }
    </div>
  `;

  document.getElementById('search-input').addEventListener('input', e => {
    searchQuery = e.target.value;
    renderPage();
  });

  container.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => {
      filterDifficulty = c.dataset.diff;
      renderPage();
    });
  });

  container.querySelectorAll('.bird-card').forEach(card => {
    card.addEventListener('click', () => openBirdDetail(parseInt(card.dataset.id)));
  });
}

function renderBirdCard(bird, seen) {
  return `
    <div class="bird-card ${seen ? 'seen' : ''}" data-id="${bird.id}" style="--bird-color: ${bird.color}">
      <div class="bird-emoji">${bird.emoji}</div>
      ${seen ? '<div class="seen-badge">✓ Gördüm!</div>' : ''}
      <div class="bird-info">
        <h3>${bird.name}</h3>
        <p class="bird-english">${bird.englishName}</p>
        <div class="bird-tags">
          <span class="tag habitat-tag">📍 ${bird.habitat}</span>
          <span class="tag diff-tag" style="background:${getDifficultyColor(bird.difficulty)}20; color:${getDifficultyColor(bird.difficulty)}">
            ${bird.difficulty}
          </span>
        </div>
      </div>
    </div>
  `;
}

function openBirdDetail(birdId) {
  const bird = BIRDS.find(b => b.id === birdId);
  if (!bird) return;
  selectedBird = bird;
  const seen = getSeenBirdIds().has(birdId);
  const birdSightings = sightings.filter(s => s.birdId === birdId);

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="--bird-color: ${bird.color}">
      <button class="modal-close" id="modal-close">✕</button>
      <div class="modal-header">
        <div class="modal-emoji">${bird.emoji}</div>
        <div>
          <h2>${bird.name}</h2>
          <p class="bird-english">${bird.englishName}</p>
        </div>
      </div>

      <div class="modal-tags">
        <span class="tag habitat-tag">📍 ${bird.habitat}</span>
        <span class="tag size-tag">📏 ${bird.size}</span>
        <span class="tag season-tag">🗓️ ${bird.season}</span>
        <span class="tag diff-tag" style="background:${getDifficultyColor(bird.difficulty)}20; color:${getDifficultyColor(bird.difficulty)}">
          ${bird.difficulty}
        </span>
      </div>

      <div class="modal-body">
        <div class="info-block">
          <span class="info-icon">📖</span>
          <p>${bird.description}</p>
        </div>
        <div class="info-block fun-fact">
          <span class="info-icon">💡</span>
          <p><strong>Eğlenceli Bilgi:</strong> ${bird.funFact}</p>
        </div>
        <div class="info-block">
          <span class="info-icon">🎵</span>
          <p><strong>Sesi:</strong> <em>${bird.sound}</em></p>
        </div>
      </div>

      ${birdSightings.length > 0 ? `
        <div class="sighting-count">
          <span>👁️ ${birdSightings.length} kez gözlemledin!</span>
        </div>
      ` : ''}

      <button class="log-btn ${seen ? 'seen' : ''}" id="log-btn">
        ${seen ? '✓ Tekrar Gördüm!' : '🎯 Gördüm! Kaydet'}
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.getElementById('log-btn').addEventListener('click', () => {
    logSighting(birdId);
    modal.remove();
    showToast(`${bird.emoji} ${bird.name} gözlemlendi!`);
    checkAndShowBadge();
    renderPage();
  });
}

// ─── SIGHTINGS ────────────────────────────────────────────────────────────────
function renderSightings(container) {
  container.innerHTML = `
    <div class="page-header">
      <h2>📓 Gözlem Günlüğüm</h2>
      <p class="subtitle">${sightings.length} gözlem kaydedildi</p>
    </div>

    ${sightings.length === 0 ? `
      <div class="empty-state">
        <div class="empty-emoji">🌿</div>
        <h3>Henüz gözlem yok!</h3>
        <p>Kuş Rehberi'nden bir kuş gördüğünde "Gördüm! Kaydet" düğmesine bas.</p>
        <button class="go-btn" id="go-guide">Kuş Rehberine Git 🔭</button>
      </div>
    ` : `
      <div class="sightings-list">
        ${[...sightings].reverse().map(s => renderSightingItem(s)).join('')}
      </div>
      <button class="danger-btn" id="clear-all">🗑️ Tüm Kayıtları Sil</button>
    `}
  `;

  container.querySelector('#go-guide')?.addEventListener('click', () => navigate('guide'));
  container.querySelectorAll('.delete-sighting').forEach(btn => {
    btn.addEventListener('click', () => {
      sightings = sightings.filter(s => s.id !== btn.dataset.id);
      saveSightings();
      renderPage();
    });
  });
  container.querySelector('#clear-all')?.addEventListener('click', () => {
    if (confirm('Tüm gözlem kayıtlarını silmek istediğine emin misin?')) {
      sightings = [];
      saveSightings();
      renderPage();
    }
  });
}

function renderSightingItem(sighting) {
  const bird = BIRDS.find(b => b.id === sighting.birdId);
  if (!bird) return '';
  return `
    <div class="sighting-item" style="--bird-color: ${bird.color}">
      <div class="sighting-emoji">${bird.emoji}</div>
      <div class="sighting-info">
        <h4>${bird.name}</h4>
        <p>📍 ${sighting.location || 'Konum belirtilmedi'}</p>
        <p class="sighting-date">🕐 ${formatDate(sighting.date)}</p>
        ${sighting.note ? `<p class="sighting-note">💬 ${sighting.note}</p>` : ''}
      </div>
      <button class="delete-sighting" data-id="${sighting.id}" title="Sil">✕</button>
    </div>
  `;
}

function logSighting(birdId) {
  const location = prompt('Nerede gördün? (isteğe bağlı)') || '';
  const note = prompt('Notun var mı? (isteğe bağlı)') || '';
  const newSighting = {
    id: Date.now().toString(),
    birdId,
    date: new Date().toISOString(),
    location,
    note
  };
  sightings.push(newSighting);
  saveSightings();
}

// ─── COLLECTION ───────────────────────────────────────────────────────────────
function renderCollection(container) {
  const seenIds = getSeenBirdIds();
  const earnedBadges = BADGES.filter(b => b.condition(sightings));
  const unearnedBadges = BADGES.filter(b => !b.condition(sightings));

  container.innerHTML = `
    <div class="page-header">
      <h2>🏆 Koleksiyonum</h2>
      <p class="subtitle">${seenIds.size} / ${BIRDS.length} kuş görüldü</p>
    </div>

    <div class="progress-section">
      <div class="progress-label">
        <span>İlerleme</span>
        <span>${Math.round(seenIds.size / BIRDS.length * 100)}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${seenIds.size / BIRDS.length * 100}%"></div>
      </div>
    </div>

    <h3 class="section-title">🎖️ Rozetlerim</h3>
    <div class="badges-grid">
      ${earnedBadges.length === 0 ? `<p class="no-results">Henüz rozet kazanmadın. Kuşları gözlemlemeye başla!</p>` :
        earnedBadges.map(b => `
          <div class="badge earned">
            <div class="badge-emoji">${b.emoji}</div>
            <div class="badge-name">${b.name}</div>
            <div class="badge-desc">${b.description}</div>
          </div>
        `).join('')
      }
      ${unearnedBadges.map(b => `
        <div class="badge unearned">
          <div class="badge-emoji">❓</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.description}</div>
        </div>
      `).join('')}
    </div>

    <h3 class="section-title">🐦 Kuş Albümüm</h3>
    <div class="album-grid">
      ${BIRDS.map(bird => `
        <div class="album-card ${seenIds.has(bird.id) ? 'seen' : 'unseen'}">
          <div class="album-emoji">${seenIds.has(bird.id) ? bird.emoji : '❓'}</div>
          <div class="album-name">${seenIds.has(bird.id) ? bird.name : '???'}</div>
          ${seenIds.has(bird.id) ? `<div class="album-check">✓</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

// ─── BADGES ───────────────────────────────────────────────────────────────────
let shownBadges = JSON.parse(localStorage.getItem('shownBadges') || '[]');

function checkAndShowBadge() {
  const newBadges = BADGES.filter(b => b.condition(sightings) && !shownBadges.includes(b.id));
  newBadges.forEach(badge => {
    shownBadges.push(badge.id);
    localStorage.setItem('shownBadges', JSON.stringify(shownBadges));
    setTimeout(() => showBadgePopup(badge), 600);
  });
}

function showBadgePopup(badge) {
  const popup = document.createElement('div');
  popup.className = 'badge-popup';
  popup.innerHTML = `
    <div class="badge-popup-inner">
      <div class="badge-popup-emoji">${badge.emoji}</div>
      <div class="badge-popup-title">Yeni Rozet!</div>
      <div class="badge-popup-name">${badge.name}</div>
      <div class="badge-popup-desc">${badge.description}</div>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 50);
  setTimeout(() => { popup.classList.remove('show'); setTimeout(() => popup.remove(), 400); }, 3000);
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });
  renderPage();
});
