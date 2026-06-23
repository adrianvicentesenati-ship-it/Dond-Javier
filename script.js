/* ============================================================
   DOND' JAVIER — script.js
   Versión: 3.4.0 (Fase 3: mapeo de imágenes para todas las tablas, corrección z-index)
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
    setTimeout(() => {
        loader.classList.add('hidden');
        initScrollReveal();
        generarDestacados();
        initTableClickEvents();
        initCart();
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
    const interactive = 'a, button, .card-plato, .filter-btn, .carta-tab-btn, .cart-item-remove, .variant-btn, .detail-quantity button, .btn-cart-send, .carta-table tbody tr';
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
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMobileNav(); cerrarSelector(); } });

/* ── 5. SCROLL REVEAL ── */
function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });
    document.querySelectorAll('.sr').forEach(el => obs.observe(el));
}

/* ── 6. RIPPLE ── */
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
document.querySelectorAll('.btn-pedir, .btn-primary, .navbar-cta, .carta-tab-btn, .btn-cart-send, #detailAddToCart').forEach(b => b.addEventListener('click', addRipple));

/* ── 7. WHATSAPP (directo) ── */
function pedirPorWhatsApp(nombre, precio) {
    const msg = `¡Hola Dond' Javier! 👋\nMe gustaría pedir: *${nombre}* (S/ ${precio}).\n¿Está disponible?`;
    window.open(WA_BASE + encodeURIComponent(msg), '_blank', 'noopener');
}

/* ── 8. GENERAR GRID DE DESTACADOS ── */
const platosDestacados = [
    { id: 1, nombre: 'Ceviche de Filete', categoria: 'Entradas', precio: 25, descripcion: 'Filete fresco marinado en limón sutil, ají limo, cebolla roja y choclo. El clásico de la casa.', imagen: 'assets/platos/Ceviche Filete.jpg', badge: 'Estrella' },
    { id: 2, nombre: 'Ceviche Mixto c/ Conchas', categoria: 'Entradas', precio: 28, descripcion: 'Mixtura de mariscos frescos con conchas negras marinados en nuestra salsa secreta de ají limo.', imagen: 'assets/platos/Ceviche Mixto.jpg', badge: 'Popular' },
    { id: 3, nombre: 'Parihuela con Cabrilla', categoria: 'Fondos', precio: 50, descripcion: 'Caldo marino concentrado con cabrilla fresca, mariscos, ají panka y hierbas aromáticas. Un abrazo del mar.', imagen: 'assets/platos/Parihuela Cabrilla.jpg', badge: 'Recomendado' },
    { id: 4, nombre: 'Ronda Criolla', categoria: 'Fondos', precio: 60, descripcion: 'Majadito de yuca c/ costillas, seco de Chabelo, cecina, chorizo y rellenas. Para compartir.', imagen: 'assets/platos/ronda marina.jpg', badge: 'Para Compartir' },
    { id: 5, nombre: 'Chicharrón Mixto', categoria: 'Crocantes', precio: 25, descripcion: 'El mejor chicharrón mixto de la ciudad: pollo y pescado crujientes con yuca frita y salsa criolla.', imagen: 'assets/platos/Chicharron Mixto.jpg', badge: 'Crujiente' },
    { id: 6, nombre: 'Chaufa de Mariscos', categoria: 'Fondos', precio: 25, descripcion: 'Arroz chaufa wok con mix de mariscos frescos del Pacífico al estilo chifa. Fusión perfecta.', imagen: 'assets/platos/Chaufa Mariscos.jpg', badge: 'Nuevo' },
    { id: 7, nombre: 'Limonada Frozen 1 Lt', categoria: 'Bebidas', precio: 10, descripcion: 'Limonada frozen de limón sutil de la región, helada y refrescante. La compañera perfecta.', imagen: 'assets/platos/Limonada Frozen.png', badge: 'Artesanal' },
    { id: 8, nombre: 'Jalea Mixta', categoria: 'Crocantes', precio: 45, descripcion: 'Jalea mixta de mariscos y pescado frita en su punto perfecto, con yuca y ensalada criolla.', imagen: 'assets/platos/Jalea Mixta.jpg', badge: 'Especial' }
];

function generarDestacados() {
    const grid = document.getElementById('destacadosGrid');
    if (!grid) return;
    grid.innerHTML = '';

    platosDestacados.forEach((plato, index) => {
        const card = document.createElement('article');
        card.className = 'card-plato sr';
        card.setAttribute('role', 'listitem');
        card.dataset.id = plato.id;
        card.dataset.nombre = plato.nombre;
        card.dataset.precio = plato.precio;
        card.dataset.desc = plato.descripcion;
        card.dataset.categoria = plato.categoria;
        card.dataset.imagen = plato.imagen;
        card.style.transitionDelay = (index * 60) + 'ms';
        card.tabIndex = 0;

        const imgArea = document.createElement('div');
        imgArea.className = 'card-img-area';
        imgArea.setAttribute('aria-hidden', 'true');

        const badge = document.createElement('span');
        badge.className = 'card-badge';
        badge.textContent = plato.badge;

        const img = document.createElement('img');
        img.src = plato.imagen;
        img.alt = plato.nombre;
        img.className = 'card-plato-img';
        img.onerror = function() {
            this.onerror = null;
            this.src = 'assets/platos/placeholder-plato.jpg';
        };
        imgArea.appendChild(badge);
        imgArea.appendChild(img);

        const body = document.createElement('div');
        body.className = 'card-body';

        const cat = document.createElement('p');
        cat.className = 'card-categoria';
        cat.textContent = plato.categoria;

        const nombre = document.createElement('h3');
        nombre.className = 'card-nombre';
        nombre.textContent = plato.nombre;

        const desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.textContent = plato.descripcion;

        const footer = document.createElement('div');
        footer.className = 'card-footer';

        const precio = document.createElement('div');
        precio.className = 'card-precio';
        precio.innerHTML = `<sup>S/</sup>${plato.precio}`;

        const pedirBtn = document.createElement('button');
        pedirBtn.className = 'btn-pedir';
        pedirBtn.dataset.nombre = plato.nombre;
        pedirBtn.dataset.precio = plato.precio;
        pedirBtn.dataset.desc = plato.descripcion;
        pedirBtn.dataset.imagen = plato.imagen;
        pedirBtn.setAttribute('aria-label', `Agregar ${plato.nombre} al pedido`);
        pedirBtn.innerHTML = `<i class="fas fa-plus"></i> Agregar`;
        pedirBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirSelectorProducto({
                nombre: plato.nombre,
                descripcion: plato.descripcion,
                opciones: [{ label: 'Porción', precio: plato.precio }],
                imagen: plato.imagen
            });
        });

        footer.appendChild(precio);
        footer.appendChild(pedirBtn);
        body.appendChild(cat);
        body.appendChild(nombre);
        body.appendChild(desc);
        body.appendChild(footer);
        card.appendChild(imgArea);
        card.appendChild(body);

        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-pedir')) return;
            abrirSelectorProducto({
                nombre: plato.nombre,
                descripcion: plato.descripcion,
                opciones: [{ label: 'Porción', precio: plato.precio }],
                imagen: plato.imagen
            });
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirSelectorProducto({
                    nombre: plato.nombre,
                    descripcion: plato.descripcion,
                    opciones: [{ label: 'Porción', precio: plato.precio }],
                    imagen: plato.imagen
                });
            }
        });
        grid.appendChild(card);
    });
    initScrollReveal();
}

/* ── 9. TABS CARTA COMPLETA ── */
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
                panel.style.opacity = '0'; panel.style.transform = 'translateY(12px)';
                requestAnimationFrame(() => {
                    panel.style.transition = 'opacity .35s ease, transform .35s ease';
                    panel.style.opacity = '1'; panel.style.transform = 'translateY(0)';
                });
                if (panel.querySelector('table')) {
                    initTableClickEvents();
                }
            }
        });
    });
})();

/* ── 10. SELECCIONAR PRODUCTO (modal con imagen) ── */
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

qtyMinus.addEventListener('click', () => {
    let val = parseInt(qtyValue.textContent) || 1;
    if (val > 1) qtyValue.textContent = val - 1;
});
qtyPlus.addEventListener('click', () => {
    let val = parseInt(qtyValue.textContent) || 1;
    qtyValue.textContent = val + 1;
});

detailAddToCart.addEventListener('click', () => {
    if (!currentProduct) return;
    const opcion = currentProduct.opciones[selectedVariant];
    const cantidad = parseInt(qtyValue.textContent) || 1;
    agregarAlPedido(currentProduct.nombre, opcion.label, opcion.precio, cantidad);
    cerrarSelector();
});

detailClose.addEventListener('click', cerrarSelector);
detailCloseX.addEventListener('click', cerrarSelector);
detailOverlay.addEventListener('click', (e) => {
    if (e.target === detailOverlay) cerrarSelector();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarSelector();
});

/* ── 11. SISTEMA DE PEDIDO (carrito) ── */
let pedido = [];

function agregarAlPedido(nombre, variante, precio, cantidad) {
    const existing = pedido.find(item => item.nombre === nombre && item.variante === variante);
    if (existing) {
        existing.cantidad += cantidad;
    } else {
        pedido.push({ nombre, variante, precio, cantidad });
    }
    actualizarCarrito();
    document.getElementById('cartSidebar').classList.add('open');
}

function eliminarDelPedido(index) {
    pedido.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const badge = document.getElementById('cartBadge');
    const sendBtn = document.getElementById('cartSendWhatsApp');

    if (pedido.length === 0) {
        container.innerHTML = '<div class="cart-empty">Aún no has agregado productos.</div>';
        totalEl.textContent = 'S/ 0.00';
        badge.textContent = '0';
        sendBtn.disabled = true;
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
                    <span class="cart-item-price">S/ ${item.precio} x ${item.cantidad}</span>
                    <span class="cart-item-subtotal">S/ ${subtotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalEl.textContent = `S/ ${total.toFixed(2)}`;
    badge.textContent = pedido.reduce((sum, i) => sum + i.cantidad, 0);
    sendBtn.disabled = false;

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.index);
            eliminarDelPedido(idx);
        });
    });

    localStorage.setItem('dondjavier_pedido', JSON.stringify(pedido));
}

/* ── 12. ENVIAR PEDIDO POR WHATSAPP ── */
document.getElementById('cartSendWhatsApp').addEventListener('click', () => {
    if (pedido.length === 0) return;

    let mensaje = 'Hola, quiero realizar el siguiente pedido:\n\n';
    pedido.forEach((item, i) => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `${i+1}. ${item.nombre}\n`;
        mensaje += `   * Presentación: ${item.variante}\n`;
        mensaje += `   * Cantidad: ${item.cantidad}\n`;
        mensaje += `   * Precio: S/ ${item.precio}\n`;
        mensaje += `   * Subtotal: S/ ${subtotal.toFixed(2)}\n\n`;
    });
    const total = pedido.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);
    mensaje += `Total: S/ ${total.toFixed(2)}\n\n`;
    mensaje += 'Quedo atento/a para confirmar disponibilidad y entrega.';

    const url = WA_BASE + encodeURIComponent(mensaje);
    window.open(url, '_blank', 'noopener');

    if (window.innerWidth <= 1024) {
        document.getElementById('cartSidebar').classList.remove('open');
    }
});

/* ══════════════════════════════════════════════════════════
     MAPEO DE IMÁGENES PARA TODOS LOS PRODUCTOS DE TABLAS
     (Fase 3: permitir insertar imagen en cada producto)
══════════════════════════════════════════════════════════ */
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

/* ── 13. CLIC EN FILAS DE TABLA (AHORA CON IMAGEN ESPECÍFICA) ── */
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

            // Obtener la imagen específica del producto
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

/* ── 15. PARALLAX HERO ── */
(function initParallax() {
    const video = document.querySelector('.hero-video-wrap video');
    if (!video) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight)
            video.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    }, { passive: true });
})();

/* ── 16. HOVER CARDS ── */
document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.card-plato');
    if (card) {
        const img = card.querySelector('.card-plato-img');
        if (img) {
            img.style.transform = 'scale(1.08)';
            img.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
        }
    }
});
document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.card-plato');
    if (card) {
        const img = card.querySelector('.card-plato-img');
        if (img) img.style.transform = 'scale(1)';
    }
});

/* ── 17. ACTIVE LINKS STICKY ── */
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

/* ── 18. INICIALIZAR CARRITO (sidebar oculto, toggle) ── */
function initCart() {
    const saved = localStorage.getItem('dondjavier_pedido');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length) {
                pedido = parsed;
                actualizarCarrito();
            }
        } catch (e) {}
    }

    const sidebar = document.getElementById('cartSidebar');
    const toggleBtn = document.getElementById('cartToggleFloat');
    const closeBtn = document.getElementById('cartCloseBtn');

    sidebar.classList.remove('open');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}
