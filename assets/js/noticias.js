// SELVA VIVA DIGITAL — noticias.js
// Carga assets/data/noticias.json y construye el ticker, las tarjetas de
// noticias, los filtros por categoría y la página de reportaje individual.
//
// Nota para Angel: este archivo usa fetch(), por lo que el sitio necesita
// servirse por http (Netlify, o un servidor local como `npx serve`).
// Abrir index.html con doble clic (file://) bloquea la carga del JSON
// por seguridad del navegador.

const RUTA_DATOS = 'assets/data/noticias.json';

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

function formatearFecha(iso) {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}

async function obtenerNoticias() {
  try {
    const res = await fetch(RUTA_DATOS);
    if (!res.ok) throw new Error('No se pudo cargar noticias.json');
    const datos = await res.json();
    return datos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  } catch (err) {
    console.error('Selva Viva Digital — error al cargar noticias:', err);
    return [];
  }
}

function tarjetaHTML(n) {
  return `
    <article class="card">
      <a class="card__media" href="reportaje.html?id=${n.id}">
        <img src="${n.imagen}" alt="${n.titulo}" loading="lazy">
      </a>
      <div class="card__cuerpo">
        <span class="etiqueta etiqueta--${n.colorCategoria}">${n.categoria}</span>
        <h3><a href="reportaje.html?id=${n.id}">${n.titulo}</a></h3>
        <p class="card__resumen">${n.resumen}</p>
        <p class="card__meta">${formatearFecha(n.fecha)} · ${n.autor}</p>
      </div>
    </article>
  `;
}

function iniciarTicker(noticias) {
  const pista = document.querySelector('[data-ticker]');
  if (!pista || noticias.length === 0) return;
  pista.innerHTML = noticias
    .slice(0, 5)
    .map((n) => `<span>${n.categoria}:</span> <a href="reportaje.html?id=${n.id}">${n.titulo}</a>`)
    .join(' &nbsp; ');
}

function iniciarInicio(noticias) {
  const heroEl = document.querySelector('[data-hero]');
  const gridEl = document.querySelector('[data-grid-inicio]');
  if (!heroEl && !gridEl) return;
  if (noticias.length === 0) return;

  const destacada = noticias.find((n) => n.destacada) || noticias[0];
  const resto = noticias.filter((n) => n.id !== destacada.id).slice(0, 3);

  if (heroEl) {
    heroEl.innerHTML = `
      <div class="hero__tarjeta">
        <a class="hero__media" href="reportaje.html?id=${destacada.id}">
          <img src="${destacada.imagen}" alt="${destacada.titulo}">
        </a>
        <div class="hero__contenido">
          <span class="etiqueta etiqueta--${destacada.colorCategoria}">${destacada.categoria}</span>
          <h1><a href="reportaje.html?id=${destacada.id}" style="color:inherit;">${destacada.titulo}</a></h1>
          <p>${destacada.resumen}</p>
          <p class="hero__meta">${formatearFecha(destacada.fecha)} · ${destacada.autor}</p>
          <a class="btn btn-primario" href="reportaje.html?id=${destacada.id}">Leer reportaje completo</a>
        </div>
      </div>
    `;
  }

  if (gridEl) {
    gridEl.innerHTML = resto.map(tarjetaHTML).join('');
  }
}

function iniciarPaginaNoticias(noticias) {
  const gridEl = document.querySelector('[data-grid-noticias]');
  const filtrosEl = document.querySelector('[data-filtros]');
  if (!gridEl || !filtrosEl) return;

  if (noticias.length === 0) {
    gridEl.innerHTML = '<p class="estado-vacio">Todavía no hay noticias publicadas. Vuelve pronto.</p>';
    return;
  }

  const categorias = ['Todas', ...new Set(noticias.map((n) => n.categoria))];

  filtrosEl.innerHTML = categorias
    .map(
      (cat, i) => `<button class="filtro-btn" type="button" data-cat="${cat}" aria-pressed="${i === 0}">${cat}</button>`
    )
    .join('');

  function render(cat) {
    const lista = cat === 'Todas' ? noticias : noticias.filter((n) => n.categoria === cat);
    gridEl.innerHTML = lista.length
      ? lista.map(tarjetaHTML).join('')
      : '<p class="estado-vacio">No hay noticias en esta categoría todavía.</p>';
  }

  filtrosEl.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.filtro-btn');
    if (!btn) return;
    filtrosEl.querySelectorAll('.filtro-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    render(btn.dataset.cat);
  });

  render('Todas');
}

function iniciarReportaje(noticias) {
  const contenedor = document.querySelector('[data-articulo]');
  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const noticia = noticias.find((n) => n.id === id);

  if (!noticia) {
    contenedor.innerHTML = `
      <div class="no-encontrado">
        <h1>No encontramos ese reportaje</h1>
        <p>Puede que el enlace esté incompleto o la noticia ya no esté disponible.</p>
        <a class="btn btn-primario" href="noticias.html">Ver todas las noticias</a>
      </div>
    `;
    document.title = 'Reportaje no encontrado · Selva Viva Digital';
    return;
  }

  document.title = `${noticia.titulo} · Selva Viva Digital`;

  contenedor.innerHTML = `
    <div class="articulo__cabecera">
      <span class="etiqueta etiqueta--${noticia.colorCategoria}">${noticia.categoria}</span>
      <h1>${noticia.titulo}</h1>
      <p class="articulo__meta">
        <span>${formatearFecha(noticia.fecha)}</span>
        <span>${noticia.autor}</span>
      </p>
    </div>
    <div class="articulo__media">
      <img src="${noticia.imagen}" alt="${noticia.titulo}">
    </div>
    <div class="articulo__cuerpo">
      ${noticia.cuerpo.map((p) => `<p>${p}</p>`).join('')}
    </div>
    <div class="compartir">
      <span>Compartir:</span>
      <a target="_blank" rel="noopener" href="https://api.whatsapp.com/send?text=${encodeURIComponent(noticia.titulo + ' - ' + window.location.href)}">WhatsApp</a>
      <a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}">Facebook</a>
    </div>
  `;

  const relacionadasEl = document.querySelector('[data-relacionadas]');
  if (relacionadasEl) {
    const relacionadas = noticias
      .filter((n) => n.id !== noticia.id)
      .sort((a, b) => (a.categoria === noticia.categoria ? -1 : 1))
      .slice(0, 3);
    relacionadasEl.innerHTML = `
      <h2>Más noticias</h2>
      <div class="noticias-grid">${relacionadas.map(tarjetaHTML).join('')}</div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const noticias = await obtenerNoticias();
  iniciarTicker(noticias);
  iniciarInicio(noticias);
  iniciarPaginaNoticias(noticias);
  iniciarReportaje(noticias);
});
