/* ============================================================
   DOND' JAVIER — script.js
   Lógica del sitio (antes incluida inline en index.php)
   Versión: 2.1.0 (migrado de PHP a HTML estático)
   ============================================================ */

const WA_NUMBER = '51936594222';
const WA_BASE   = `https://wa.me/${WA_NUMBER}?text=`;

/* ── 0. AÑO DEL FOOTER (antes generado con date('Y') en PHP) ── */
(function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
})();

/* ── 1. PAGE LOADER ── */
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        initScrollReveal();
    }, 1800);
});

/* ── 2. CURSOR PERSONALIZADO ── */
(function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });
    function animRing() {
        ringX += (mouseX - ringX) * .14;
        ringY += (mouseY - ringY) * .14;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animRing);
    }
    animRing();
    const interactive = 'a, button, .card-plato, .filter-btn, .carta-tab-btn';
    document.querySelectorAll(interactive).forEach(el => {
        el.addEventListener('mouseenter', () => { ring.style.width = '60px'; ring.style.height = '60px'; ring.style.opacity = '.3'; });
        el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.opacity = '.5'; });
    });
})();

/* ── 3. NAVBAR STICKY ── */
(function initStickyNav() {
    const sticky = document.getElementById('stickyNav');
    const hero   = document.getElementById('hero');
    new IntersectionObserver(([e]) => sticky.classList.toggle('visible', !e.isIntersecting), { threshold: 0 }).observe(hero);
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const t = document.querySelector(link.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); closeMobileNav(); }
        });
    });
})();

/* ── 4. HAMBURGER ── */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav    = document.getElementById('mobileNav');
function closeMobileNav() {
    hamburgerBtn.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}
hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileNav.addEventListener('click', e => { if (e.target === mobileNav) closeMobileNav(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMobileNav(); closeDetailModal(); } });

/* ── 5. SCROLL REVEAL ── */
function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });
    document.querySelectorAll('.sr').forEach(el => obs.observe(el));
}

/* ── 6. FILTROS MENÚ ── */
(function initMenuFilters() {
    const btns  = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card-plato');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
            const filter = btn.dataset.filter;
            cards.forEach((card, i) => {
                const show = filter === 'all' || card.dataset.categoria === filter;
                if (show) {
                    card.style.display = '';
                    card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.transition = 'opacity .35s ease, transform .35s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, i * 40);
                } else { card.style.display = 'none'; }
            });
        });
    });
})();

/* ── 7. RIPPLE ── */
function addRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.classList.add('ripple');
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}
document.querySelectorAll('.btn-pedir, .btn-primary, .navbar-cta, .carta-tab-btn').forEach(b => b.addEventListener('click', addRipple));

/* ── 8. WHATSAPP ── */
function pedirPorWhatsApp(nombre, precio) {
    const msg = `¡Hola Dond' Javier! 👋\nMe gustaría pedir: *${nombre}* (S/ ${precio}).\n¿Está disponible?`;
    window.open(WA_BASE + encodeURIComponent(msg), '_blank', 'noopener');
}
document.getElementById('menuGrid').addEventListener('click', e => {
    const btn = e.target.closest('.btn-pedir');
    if (!btn) return;
    e.stopPropagation();
    pedirPorWhatsApp(btn.dataset.nombre, btn.dataset.precio);
});

/* ── 9. MODAL DETALLE ── */
const detailOverlay = document.getElementById('cardDetailOverlay');
const detailEmoji   = document.getElementById('detailEmoji');
const detailTitle   = document.getElementById('detailTitle');
const detailDesc    = document.getElementById('detailDesc');
const detailPedir   = document.getElementById('detailPedir');

function openDetailModal(card) {
    const { nombre, desc, emoji, precio } = card.dataset;
    detailEmoji.textContent  = emoji;
    detailTitle.textContent  = nombre;
    detailDesc.textContent   = desc;
    detailPedir.dataset.nombre = nombre;
    detailPedir.dataset.precio = precio;
    detailPedir.onclick = () => { pedirPorWhatsApp(nombre, precio); closeDetailModal(); };
    detailOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    detailTitle.focus();
}
function closeDetailModal() {
    detailOverlay.classList.remove('open');
    document.body.style.overflow = '';
}
document.getElementById('menuGrid').addEventListener('click', e => {
    const card = e.target.closest('.card-plato');
    if (!card || e.target.closest('.btn-pedir')) return;
    openDetailModal(card);
});
document.getElementById('menuGrid').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.card-plato');
        if (card) { e.preventDefault(); openDetailModal(card); }
    }
});
document.getElementById('detailClose').addEventListener('click', closeDetailModal);
document.getElementById('detail-close-x').addEventListener('click', closeDetailModal);
detailOverlay.addEventListener('click', e => { if (e.target === detailOverlay) closeDetailModal(); });

/* ── 10. CONTADORES ANIMADOS ── */
(function initCounters() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target, target = +el.dataset.target;
            const step = target / (1800 / 16);
            let current = 0;
            const tick = () => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current).toLocaleString('es-PE');
                if (current < target) requestAnimationFrame(tick);
            };
            tick(); obs.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(c => obs.observe(c));
})();

/* ── 11. PARALLAX HERO ── */
(function initParallax() {
    const video = document.querySelector('.hero-video-wrap video');
    if (!video) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight)
            video.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    }, { passive: true });
})();

/* ── 12. HOVER CARDS ── */
document.querySelectorAll('.card-plato').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const emoji = card.querySelector('.card-img-area span');
        if (emoji) { emoji.style.transform = 'scale(1.15) rotate(6deg)'; emoji.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)'; }
    });
    card.addEventListener('mouseleave', () => {
        const emoji = card.querySelector('.card-img-area span');
        if (emoji) { emoji.style.transform = 'scale(1) rotate(0deg)'; }
    });
});

/* ── 13. ACTIVE LINKS STICKY ── */
(function initActiveLinks() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar-sticky nav a');
    sections.forEach(s => {
        const obs2 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.style.color = link.getAttribute('href') === '#' + entry.target.id ? 'var(--naranja-claro)' : '';
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        obs2.observe(s);
    });
})();

/* ── 14. TABS CARTA COMPLETA ── */
(function initCartaTabs() {
    const tabBtns  = document.querySelectorAll('.carta-tab-btn');
    const panels   = document.querySelectorAll('.carta-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById('panel-' + btn.dataset.tab);
            if (panel) {
                panel.classList.add('active');
                // Animación de entrada
                panel.style.opacity = '0'; panel.style.transform = 'translateY(12px)';
                requestAnimationFrame(() => {
                    panel.style.transition = 'opacity .35s ease, transform .35s ease';
                    panel.style.opacity = '1'; panel.style.transform = 'translateY(0)';
                });
            }
        });
    });
})();
