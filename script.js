/* ============================================================
   DOND' JAVIER — script.js
   Versión: 3.6.0 (Mobile Ultra Compact)
   ============================================================ */

const WA_NUMBER = '51936594222';
const WA_BASE   = `https://wa.me/${WA_NUMBER}?text=`;

/* ── 0. AÑO DEL FOOTER ── */
(function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
})();

/* ── 1. PAGE LOADER ── */
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Inicializamos después de que el loader desaparezca
            initScrollReveal();
            initTableClickEvents();
            initCart();
            // Re-inicializar contadores si están visibles
            initCounters();
        }, 1800);
    } else {
        // Fallback si no hay loader
        initScrollReveal();
        initTableClickEvents();
        initCart();
        initCounters();
    }
});

/* ── 2. CURSOR PERSONALIZADO ── */
(function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    // Solo en pantallas no táctiles
    if (window.matchMedia('(pointer: coarse)').matches) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        return;
    }
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });
    function animRing() {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animRing);
    }
    animRing();

    const interactive = 'a, button, .card-plato, .filter-btn, .carta-tab-btn, .cart-item-remove, .variant-btn, .detail-quantity button, .btn-cart-send, .carta-table tbody tr';
    document.querySelectorAll(interactive).forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width = '60px';
            ring.style.height = '60px';
            ring.style.opacity = '0.3';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width = '36px';
            ring.style.height = '36px';
            ring.style.opacity = '0.5';
        });
    });
})();

/* ── 3. NAVBAR STICKY ── */
(function initStickyNav() {
    const sticky = document.getElementById('stickyNav');
    const hero   = document.getElementById('hero');
    if (!sticky || !hero) return;
    const observer = new IntersectionObserver(([entry]) => {
        sticky.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(hero);

    // Cerrar menú móvil al hacer clic en enlaces
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeMobileNav();
            }
        });
    });
})();

/* ── 4. HAMBURGER MENÚ ── */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav    = document.getElementById('mobileNav');

function closeMobileNav() {
    if (hamburgerBtn) hamburgerBtn.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        hamburgerBtn.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) closeMobileNav();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileNav();
            cerrarSelector();
        }
    });
}

/* ── 5. SCROLL REVEAL ── */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

    document.querySelectorAll('.sr').forEach(el => observer.observe(el));
}

/* ── 6. RIPPLE EFFECT ── */
function addRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.classList.add('ripple');
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

// Inyectar keyframes si no existen
if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
        @keyframes rippleAnim {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

document.querySelectorAll('.btn-pedir, .btn-primary, .navbar-cta, .carta-tab-btn, .btn-cart-send, #detailAddToCart')
    .forEach(btn => btn.addEventListener('click', addRipple));

/* ── 7. WHATSAPP DIRECTO (función auxiliar) ── */
function pedirPorWhatsApp(nombre, precio) {
    const msg = `¡Hola Dond' Javier! 👋\nMe gustaría pedir: *${nombre}* (S/ ${precio}).\n¿Está disponible?`;
    window.open(WA_BASE + encodeURIComponent(msg), '_blank', 'noopener');
}

/* ── 8. TABS CARTA COMPLETA ── */
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
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(12px)';
                requestAnimationFrame(() => {
                    panel.style.transition = 'opacity .35s ease, transform .35s ease';
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(0)';
                });
                // Reinicializar eventos de clic en filas si hay tabla
                if (panel.querySelector('table')) {
                    initTableClickEvents();
                }
            }
        });
    });
})();

/* ── 9. MODAL DE SELECCIÓN DE PRODUCTO ── */
const detailOverlay = document.getElementById('cardDetailOverlay');
const detailTitle   = document.getElementById('detailTitle');
const detailDesc    = document.getElementById('detailDesc');
const detailVariants = document.getElementById('detailVariants');
const detailImage   = document.getElementById('detailImg');
const qtyMinus      = document.getElementById('qtyMinus');
const qtyPlus       = document.getElementById('qtyPlus');
const qtyValue      = document.getElementById('qtyValue');
const detailAddToCart = document.getElementById('detailAddToCart');
const detailClose   = document.getElementById('detailClose');
const detailCloseX  = document.getElementById('detail-close-x');

let currentProduct = null;
let selectedVariant = 0;
let currentQuantity = 1;

function abrirSelectorProducto(productData) {
    if (!productData || !productData.opciones || productData.opciones.length === 0) {
        console.warn('Producto sin opciones');
        return;
    }
    currentProduct = productData;
    selectedVariant = 0;
    currentQuantity = 1;

    detailTitle.textContent = productData.nombre;
    detailDesc.textContent = productData.descripcion || '';

    if (productData.imagen) {
        detailImage.src = productData.imagen;
        detailImage.alt = productData.nombre;
        detailImage.style.display = 'block';
    } else {
        detailImage.src = 'assets/platos/placeholder-plato.jpg';
        detailImage.alt = 'Producto';
        detailImage.style.display = 'block';
    }

    detailVariants.innerHTML = '';
    productData.opciones.forEach((op, idx) => {
        const btn = document.createElement('button');
        btn.className = 'variant-btn' + (idx === 0 ? ' active' : '');
        btn.textContent = `${op.label} (S/ ${op.precio})`;
        btn.dataset.index = idx;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedVariant = idx;
        });
        detailVariants.appendChild(btn);
    });

    qtyValue.textContent = '1';
    detailOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    detailTitle.focus();
}

function cerrarSelector() {
    detailOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

if (qtyMinus && qtyPlus && qtyValue) {
    qtyMinus.addEventListener('click', () => {
        let val = parseInt(qtyValue.textContent) || 1;
        if (val > 1) qtyValue.textContent = val - 1;
    });
    qtyPlus.addEventListener('click', () => {
        let val = parseInt(qtyValue.textContent) || 1;
        qtyValue.textContent = val + 1;
    });
}

if (detailAddToCart) {
    detailAddToCart.addEventListener('click', () => {
        if (!currentProduct) return;
        const opcion = currentProduct.opciones[selectedVariant];
        const cantidad = parseInt(qtyValue.textContent) || 1;
        // Validar que el precio sea numérico
        const precio = typeof opcion.precio === 'number' ? opcion.precio : parseFloat(opcion.precio);
        if (isNaN(precio)) {
            alert('El precio de esta opción no está disponible. Por favor, consulta directamente.');
            return;
        }
        agregarAlPedido(currentProduct.nombre, opcion.label, precio, cantidad);
        cerrarSelector();
    });
}

if (detailClose) detailClose.addEventListener('click', cerrarSelector);
if (detailCloseX) detailCloseX.addEventListener('click', cerrarSelector);
if (detailOverlay) {
    detailOverlay.addEventListener('click', (e) => {
        if (e.target === detailOverlay) cerrarSelector();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarSelector();
});

/* ── 10. SISTEMA DE PEDIDO (CARRITO) ── */
let pedido = [];

function agregarAlPedido(nombre, variante, precio, cantidad) {
    if (!nombre || !variante || typeof precio !== 'number' || cantidad < 1) return;
    const existing = pedido.find(item => item.nombre === nombre && item.variante === variante);
    if (existing) {
        existing.cantidad += cantidad;
    } else {
        pedido.push({ nombre, variante, precio, cantidad });
    }
    actualizarCarrito();
    // Abrir sidebar en móviles o desktop
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) sidebar.classList.add('open');
}

function eliminarDelPedido(index) {
    if (index >= 0 && index < pedido.length) {
        pedido.splice(index, 1);
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const badge = document.getElementById('cartBadge');
    const sendBtn = document.getElementById('cartSendWhatsApp');

    if (!container || !totalEl || !badge || !sendBtn) return;

    if (pedido.length === 0) {
        container.innerHTML = '<div class="cart-empty">Aún no has agregado productos.</div>';
        totalEl.textContent = 'S/ 0.00';
        badge.textContent = '0';
        sendBtn.disabled = true;
        localStorage.removeItem('dondjavier_pedido');
        return;
    }

    let html = '';
    let total = 0;
    pedido.forEach((item, idx) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-header">
                    <div>
                        <span class="cart-item-name">${item.nombre}</span>
                        <span class="cart-item-variant">${item.variante}</span>
                    </div>
                    <button class="cart-item-remove" data-index="${idx}" aria-label="Eliminar producto">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-price">S/ ${item.precio.toFixed(2)} x ${item.cantidad}</span>
                    <span class="cart-item-subtotal">S/ ${subtotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalEl.textContent = `S/ ${total.toFixed(2)}`;
    badge.textContent = pedido.reduce((sum, i) => sum + i.cantidad, 0);
    sendBtn.disabled = false;

    // Eventos para eliminar
    container.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.index, 10);
            if (!isNaN(idx)) eliminarDelPedido(idx);
        });
    });

    // Guardar en localStorage
    try {
        localStorage.setItem('dondjavier_pedido', JSON.stringify(pedido));
    } catch (e) { /* ignore */ }
}

/* ── 11. ENVIAR PEDIDO POR WHATSAPP ── */
document.getElementById('cartSendWhatsApp')?.addEventListener('click', () => {
    if (pedido.length === 0) return;

    let mensaje = 'Hola, quiero realizar el siguiente pedido:\n\n';
    pedido.forEach((item, i) => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `${i+1}. ${item.nombre}\n`;
        mensaje += `   * Presentación: ${item.variante}\n`;
        mensaje += `   * Cantidad: ${item.cantidad}\n`;
        mensaje += `   * Precio unitario: S/ ${item.precio.toFixed(2)}\n`;
        mensaje += `   * Subtotal: S/ ${subtotal.toFixed(2)}\n\n`;
    });
    const total = pedido.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);
    mensaje += `Total: S/ ${total.toFixed(2)}\n\n`;
    mensaje += 'Quedo atento/a para confirmar disponibilidad y entrega.';

    const url = WA_BASE + encodeURIComponent(mensaje);
    window.open(url, '_blank', 'noopener');

    // Cerrar sidebar en móviles
    if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar) sidebar.classList.remove('open');
    }
});

/* ── 12. MAPEO DE IMÁGENES PARA PRODUCTOS ── */
const productImageMap = {
    // ── Para Picar ──
    'Ceviche de Filete': 'assets/platos/Ceviche Filete.jpg',
    'Ceviche Mixto': 'assets/platos/Ceviche Mixto.jpg',
    'Ceviche Mixto c/ Conchas': 'assets/platos/ceviche-mixto-conchas.jpg',
    'Ceviche de Congrio': 'assets/platos/ceviche-congrio.jpg',
    'Ceviche de Caballa': 'assets/platos/ceviche-caballa.jpg',
    'Ceviche de Conchas Negras': 'assets/platos/ceviche-conchas-negras.jpg',
    'Ceviche de Filete y Conchas N.': 'assets/platos/ceviche-filete-conchas.jpg',
    'Tiradito de Filete': 'assets/platos/tiradito-filete.jpg',
    'Causa c/ Langostino': 'assets/platos/causa-langostino.jpg',
    'Causa c/ Pollo': 'assets/platos/causa-pollo.jpg',

    // ── Rondas ──
    'Ronda Criolla': 'assets/platos/ronda-criolla.jpg',
    'Ronda Marina': 'assets/platos/ronda-marina.jpg',
    'Ronda Mar y Tierra': 'assets/platos/ronda-mar-tierra.jpg',
    'Ronda de Barrio': 'assets/platos/ronda-barrio.jpg',
    'Costillas de Cerdo': 'assets/platos/costillas-cerdo.jpg',
    'Seco de Chavelo': 'assets/platos/seco-chavelo.jpg',

    // ── Duos y Trios ──
    'Duo Marino / Criollo': 'assets/platos/duo-marino-criollo.jpg',
    'Duo Marino (Ceviche y Arroz)': 'assets/platos/duo-marino-ceviche-arroz.jpg',
    'Duo Marino (Ceviche y Chicharrón)': 'assets/platos/duo-marino-ceviche-chicharron.jpg',
    'Trio Marino': 'assets/platos/trio-marino.jpg',
    'Trio Marino / Criollo': 'assets/platos/trio-marino-criollo.jpg',

    // ── Crocantes ──
    'Chicharrón de Pollo': 'assets/platos/chicharron-pollo.jpg',
    'Chicharrón de Pescado': 'assets/platos/chicharron-pescado.jpg',
    'El Chicharrón Mixto': 'assets/platos/Chicharron Mixto.jpg',
    'Jalea Mixta': 'assets/platos/Jalea Mixta.jpg',
    'Cabrilla Frita c/ Yuca o Patacones': 'assets/platos/cabrilla-frita.jpg',

    // ── Engreídos Marinos ──
    'Parihuela con Cabrilla': 'assets/platos/Parihuela Cabrilla.jpg',
    'Parihuela con Mero': 'assets/platos/parihuela-mero.jpg',
    'Sudado de Mero': 'assets/platos/sudado-mero.jpg',
    'Sudado de Cabrillón': 'assets/platos/sudado-cabrillon.jpg',
    'Chupe de Cangrejo': 'assets/platos/chupe-cangrejo.jpg',
    'Sudado de Cabrilla': 'assets/platos/sudado-cabrilla.jpg',
    'Arroz con Mariscos': 'assets/platos/arroz-mariscos.jpg',
    'Arroz con Conchas': 'assets/platos/arroz-conchas.jpg',

    // ── Carnes y Pollo ──
    'Lomo Saltado c/ Arroz y Papa': 'assets/platos/lomo-saltado.jpg',
    'Pollo Saltado c/ Arroz y Papa': 'assets/platos/pollo-saltado.jpg',
    'Fetuccini a la H. con Lomo Saltado': 'assets/platos/fetuccini-lomo.jpg',
    'Milanesa de Pollo c/ Arroz y Papa': 'assets/platos/milanesa-pollo.jpg',
    'Cecina c/ Arroz y Patacones': 'assets/platos/cecina.jpg',

    // ── Toque Chifa ──
    'Chaufa de Pollo': 'assets/platos/chaufa-pollo.jpg',
    'Chaufa de Tres Sabores': 'assets/platos/chaufa-tres-sabores.jpg',
    'Chaufa de Mariscos': 'assets/platos/Chaufa Mariscos.jpg',
    'Aeropuerto': 'assets/platos/aeropuerto-chifa.jpg',
    'Alitas Agridulce o Acevichada': 'assets/platos/alitas-agridulce.jpg',
    'Costillas Agridulce': 'assets/platos/costillas-agridulce.jpg',

    // ── Cilindro ──
    'Pollo Entero': 'assets/platos/pollo-entero-cilindro.jpg',
    '1/2 Pollo': 'assets/platos/medio-pollo-cilindro.jpg',
    '1/4 Pollo': 'assets/platos/cuarto-pollo-cilindro.jpg',
    'Mostrito': 'assets/platos/mostrito.jpg',
    'Broaster': 'assets/platos/broaster.jpg',
    'Porción de Arroz': 'assets/platos/porcion-arroz.jpg',

    // ── Bebidas ──
    'Limonada Frozen 1 Lt': 'assets/platos/Limonada Frozen.png',
    'Jugos de Fruta Natural': 'assets/platos/jugos-naturales.jpg',
    'Gaseosa': 'assets/platos/gaseosa.jpg',
    'Cerveza': 'assets/platos/cerveza.jpg'
};

/* ── 13. CLIC EN FILAS DE TABLA (con imagen específica) ── */
function initTableClickEvents() {
    document.querySelectorAll('.carta-table tbody tr').forEach(row => {
        if (row.dataset.listenerAdded) return;
        row.dataset.listenerAdded = 'true';

        row.addEventListener('click', function() {
            const celdas = this.querySelectorAll('td');
            if (celdas.length < 2) return;

            const nombre = celdas[0].textContent.trim();
            let descripcion = '';
            let opciones = [];

            const table = this.closest('table');
            const headers = table.querySelectorAll('thead th');
            const headerTexts = Array.from(headers).map(th => th.textContent.trim().toLowerCase());

            const precioIndices = [];
            headerTexts.forEach((text, idx) => {
                if (idx === 0) return;
                if (text.includes('incluye')) return;
                precioIndices.push(idx);
            });

            if (precioIndices.length === 0) {
                opciones.push({ label: 'Porción', precio: 'Consultar' });
            } else {
                precioIndices.forEach(idx => {
                    const label = headerTexts[idx];
                    const precioStr = celdas[idx].textContent.trim();
                    if (precioStr === '—' || precioStr === 'Consultar' || precioStr === 'Precio a consultar') return;
                    const precioNum = parseFloat(precioStr.replace(/[^0-9.]/g, ''));
                    if (!isNaN(precioNum)) {
                        opciones.push({ label: label, precio: precioNum });
                    } else {
                        opciones.push({ label: label, precio: precioStr });
                    }
                });
            }

            if (opciones.length === 0) {
                opciones.push({ label: 'Porción', precio: 'Consultar' });
            }

            const descIndex = headerTexts.findIndex(t => t.includes('incluye'));
            if (descIndex !== -1 && celdas[descIndex]) {
                descripcion = celdas[descIndex].textContent.trim();
            }

            let imagen = productImageMap[nombre] || 'assets/platos/placeholder-plato.jpg';

            abrirSelectorProducto({
                nombre: nombre,
                descripcion: descripcion || '',
                opciones: opciones,
                imagen: imagen
            });
        });
    });
}

/* ── 14. CONTADORES ANIMADOS ── */
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.target;
            if (!target || isNaN(target)) return;
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;
            const tick = () => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current).toLocaleString('es-PE');
                if (current < target) {
                    requestAnimationFrame(tick);
                }
            };
            tick();
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(c => observer.observe(c));
}

/* ── 15. PARALLAX HERO ── */
(function initParallax() {
    const video = document.querySelector('.hero-video-wrap video');
    if (!video) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (scrollY < window.innerHeight) {
                    video.style.transform = `translateY(${scrollY * 0.35}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

/* ── 16. ACTIVE LINKS EN STICKY NAV ── */
(function initActiveLinks() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar-sticky nav a');
    if (!navLinks.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === '#' + id) {
                        link.style.color = 'var(--naranja-claro)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => observer.observe(s));
})();

/* ── 17. INICIALIZAR CARRITO (sidebar, toggle y recuperación) ── */
function initCart() {
    // Recuperar carrito guardado
    const saved = localStorage.getItem('dondjavier_pedido');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length) {
                pedido = parsed;
                actualizarCarrito();
            }
        } catch (e) { /* ignore */ }
    }

    const sidebar = document.getElementById('cartSidebar');
    const toggleBtn = document.getElementById('cartToggleFloat');
    const closeBtn = document.getElementById('cartCloseBtn');

    if (!sidebar || !toggleBtn || !closeBtn) return;

    // Inicialmente cerrado
    sidebar.classList.remove('open');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // Cerrar al hacer clic fuera en móviles
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

/* ── 18. MEJORA: TOUCH FEEDBACK PARA BOTONES EN MÓVILES ── */
document.addEventListener('touchstart', () => {}, { passive: true });

/* ── 19. INICIALIZACIÓN ADICIONAL ── */
// Llamar a initCounters nuevamente por si se cargan dinámicamente
document.addEventListener('DOMContentLoaded', () => {
    initCounters();
});

// Exponer funciones globalmente para depuración si es necesario
window.dondJavier = {
    pedido,
    agregarAlPedido,
    eliminarDelPedido,
    actualizarCarrito,
    abrirSelectorProducto,
    cerrarSelector
};

console.log('✅ Dond\' Javier — script cargado correctamente (v3.6.0)');
