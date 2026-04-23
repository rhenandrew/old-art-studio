// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== PORTFOLIO 3×3 CYCLING =====
const PORTFOLIO_MEDIA = {
  pretoecinza: [
    { t:'v', s:'black_and_grey_1.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_2.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_3.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_4.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_5.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_6.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_7.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_8.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_9.mp4',  label:'Preto e Cinza' },
    { t:'v', s:'black_and_grey_10.mp4', label:'Preto e Cinza' },
    { t:'i', s:'black_and_grey_11.jpg', label:'Preto e Cinza' },
    { t:'i', s:'black_and_grey_12.jpg', label:'Preto e Cinza' },
    { t:'i', s:'black_and_grey_13.jpg', label:'Preto e Cinza' },
  ],
  fineline: [
    { t:'i', s:'fineline_1.jpg',  label:'Fine Line' },
    { t:'i', s:'fineline_2.jpg',  label:'Fine Line' },
    { t:'i', s:'fineline_3.jpg',  label:'Fine Line' },
    { t:'i', s:'fineline_4.webp', label:'Fine Line' },
  ],
  colorido: [
    { t:'i', s:'colorida_1.jpg',  label:'Colorido' },
    { t:'v', s:'colorida_2.mp4',  label:'Colorido' },
    { t:'v', s:'colorida_3.mp4',  label:'Colorido' },
    { t:'v', s:'colorida_4.mp4',  label:'Colorido' },
    { t:'v', s:'colorida_5.mp4',  label:'Colorido' },
    { t:'v', s:'colorida_6.mp4',  label:'Colorido' },
  ],
  comercial: [
    { t:'i', s:'comercial_1.jpg',  label:'Comercial' },
    { t:'i', s:'comercial_2.jpg',  label:'Comercial' },
    { t:'i', s:'comercial_3.jpg',  label:'Comercial' },
    { t:'i', s:'comercial_4.jpg',  label:'Comercial' },
    { t:'i', s:'comercial_5.jpg',  label:'Comercial' },
    { t:'i', s:'comercial_6.jpg',  label:'Comercial' },
    { t:'v', s:'comercial_7.mp4',  label:'Comercial' },
    { t:'v', s:'comercial_8.mp4',  label:'Comercial' },
    { t:'v', s:'comercial_9.mp4',  label:'Comercial' },
    { t:'i', s:'comercial_10.webp',label:'Comercial' },
  ],
};

// Posições 1,3,5,7,9 no grid (índice 0-based: 0,2,4,6,8) → VÍDEO
// Posições 2,4,6,8   no grid (índice 0-based: 1,3,5,7)   → IMAGEM
const VID_CELLS = new Set([0, 2, 4, 6, 8]); // 5 células de vídeo
const IMG_CELLS = new Set([1, 3, 5, 7]);     // 4 células de imagem

const ptGrid  = document.getElementById('portfolioGrid');
const SWAP_MS = 18000; // 18s — todos juntos, bem suave

let ptCells    = [];
let ptTimer    = null;
let imgIndices = [0, 1, 2, 3];    // 4 img cells
let vidIndices = [0, 1, 2, 3, 4]; // 5 vid cells

// Pool all = intercala categorias para variedade
const allMedia = Object.values(PORTFOLIO_MEDIA).flat();

function buildPools(filter) {
  const src  = (filter === 'all') ? allMedia : (PORTFOLIO_MEDIA[filter] || allMedia);
  const imgs = src.filter(m => m.t === 'i');
  const vids = src.filter(m => m.t === 'v');
  return {
    imgs: imgs.length ? imgs : allMedia.filter(m => m.t === 'i'),
    vids: vids.length ? vids : allMedia.filter(m => m.t === 'v'),
  };
}

function createMediaEl(item) {
  let el;
  if (item.t === 'v') {
    el = document.createElement('video');
    el.src         = item.s;
    el.autoplay    = true;
    el.muted       = true;
    el.loop        = true;
    el.playsInline = true;
  } else {
    el = document.createElement('img');
    el.src = item.s;
    el.alt = item.label || '';
  }
  el.className = 'portfolio-media';
  return el;
}

function swapCell(cell, item) {
  const oldEl = cell.querySelector('.portfolio-media');
  const newEl = createMediaEl(item);
  newEl.style.opacity    = '0';
  newEl.style.transition = 'none';
  cell.insertBefore(newEl, cell.querySelector('.portfolio-overlay'));
  const tag = cell.querySelector('.portfolio-tag');
  if (tag) tag.textContent = item.label || '';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    newEl.style.transition = 'opacity 2s ease';
    newEl.style.opacity    = '1';
    if (oldEl) {
      oldEl.style.transition = 'opacity 2s ease';
      oldEl.style.opacity    = '0';
      setTimeout(() => oldEl.remove(), 2100);
    }
  }));
}

// Reconstrói o grid 3×3 com 9 células fixas
function restoreGrid() {
  ptGrid.innerHTML = '';
  ptGrid.className = 'portfolio-grid';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'portfolio-cell';
    cell.innerHTML = '<div class="portfolio-overlay"><span class="portfolio-tag"></span></div>';
    ptGrid.appendChild(cell);
  }
  ptCells = [...ptGrid.querySelectorAll('.portfolio-cell')];
}

function swapAll(imgs, vids) {
  let ic = 0, vc = 0;
  ptCells.forEach((cell, i) => {
    if (VID_CELLS.has(i)) {
      swapCell(cell, vids[vidIndices[vc] % vids.length]);
      vidIndices[vc] = (vidIndices[vc] + 1) % vids.length;
      vc++;
    } else {
      swapCell(cell, imgs[imgIndices[ic] % imgs.length]);
      imgIndices[ic] = (imgIndices[ic] + 1) % imgs.length;
      ic++;
    }
  });
}

// Modo "Todos" — grid 3×3 com cycling
function startCycling() {
  clearInterval(ptTimer);
  restoreGrid();
  const { imgs, vids } = buildPools('all');
  imgIndices = [0,1,2,3].map((_, i) => i % imgs.length);
  vidIndices = [0,1,2,3,4].map((_, i) => i % vids.length);
  swapAll(imgs, vids);
  ptTimer = setInterval(() => swapAll(imgs, vids), SWAP_MS);
}

// Modo filtro — mostra TODOS os itens da categoria, sem cycling
function showFiltered(filter) {
  clearInterval(ptTimer);
  const items = PORTFOLIO_MEDIA[filter] || [];
  ptGrid.innerHTML = '';
  ptGrid.className = 'portfolio-grid portfolio-grid--list';
  items.forEach(item => {
    const cell = document.createElement('div');
    cell.className = 'portfolio-cell';
    const el = createMediaEl(item);
    cell.appendChild(el);
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-overlay';
    overlay.innerHTML = `<span class="portfolio-tag">${item.label || ''}</span>`;
    cell.appendChild(overlay);
    ptGrid.appendChild(cell);
  });
}

// Botões de filtro
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    if (f === 'all') startCycling();
    else showFiltered(f);
  });
});

// Inicia
startCycling();

// ===== SHOW TATTOO EXTRA FIELD =====
const servicoSelect = document.getElementById('servico');
const tattooExtra = document.getElementById('tattooExtra');
servicoSelect.addEventListener('change', () => {
  tattooExtra.style.display = servicoSelect.value === 'tatuagem' ? 'flex' : 'none';
});

// ===== FORM → WHATSAPP =====
const WA_DERICK  = '5542999621201'; // Tatuagem e Barbearia
const WA_KAUANA  = '5542999922276'; // Cabelo e Compra de Cabelo

document.getElementById('agendamentoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome');
  const telefone = document.getElementById('telefone');
  const servico = document.getElementById('servico');
  const mensagem = document.getElementById('mensagem');

  let valid = true;

  // Validate
  [nome, telefone, servico].forEach(field => {
    const errorEl = document.getElementById(field.id + 'Error');
    if (!field.value.trim()) {
      field.classList.add('error');
      errorEl.textContent = 'Campo obrigatório.';
      valid = false;
    } else {
      field.classList.remove('error');
      errorEl.textContent = '';
    }
  });

  if (!valid) return;

  const servicoLabel = {
    'tatuagem': 'Tatuagem',
    'barbearia': 'Barbearia',
    'corte-feminino': 'Corte Feminino',
    'compra-cabelo': 'Compra de Cabelo',
  }[servico.value] || servico.value;

  const estilo = document.getElementById('estilo')?.value;
  const estiloLine = estilo ? `\n🎨 Estilo: ${estilo}` : '';
  const msgLine = mensagem.value.trim() ? `\n📝 Obs: ${mensagem.value.trim()}` : '';

  const text = `Olá! Gostaria de agendar um horário no Old Art Studio.\n\n👤 Nome: ${nome.value.trim()}\n📱 WhatsApp: ${telefone.value.trim()}\n✂️ Serviço: ${servicoLabel}${estiloLine}${msgLine}\n\nVim pelo site!`;

  const numero = ['corte-feminino', 'compra-cabelo'].includes(servico.value) ? WA_KAUANA : WA_DERICK;
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(text)}`, '_blank');
});

// ===== SCROLL FADE-IN =====
const fadeEls = document.querySelectorAll(
  '.service-card, .portfolio-item, .faq-item, .testimonial-card, .stat, .sobre-content, .sobre-img-wrap'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// ===== BEFORE/AFTER VIDEOS =====
function toggleVid(id) {
  const video = document.getElementById(id);
  const btn = video.nextElementSibling.nextElementSibling;
  if (video.paused) {
    video.play();
    btn.classList.add('hidden');
  } else {
    video.pause();
    btn.classList.remove('hidden');
  }
}

// ===== WHATSAPP FLOAT POPUP =====
const waBtn  = document.getElementById('waBtn');
const waMenu = document.getElementById('waMenu');

waBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = waMenu.classList.toggle('open');
  waBtn.classList.toggle('open', open);
  waBtn.setAttribute('aria-expanded', String(open));
  waMenu.setAttribute('aria-hidden', String(!open));
});

document.addEventListener('click', () => {
  waMenu.classList.remove('open');
  waBtn.classList.remove('open');
  waBtn.setAttribute('aria-expanded', 'false');
  waMenu.setAttribute('aria-hidden', 'true');
});

waMenu.querySelectorAll('.wa-option').forEach(opt => {
  opt.addEventListener('click', () => {
    waMenu.classList.remove('open');
    waBtn.classList.remove('open');
    waBtn.setAttribute('aria-expanded', 'false');
  });
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });
