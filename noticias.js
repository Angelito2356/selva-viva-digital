// SELVA VIVA DIGITAL — noticias.js
// Carga assets/data/noticias.json y construye: ticker, héroe "Lo último",
// secciones de portada organizadas por FORMATO, página de archivo con
// filtros por formato, y página de reportaje individual.
//
// Nota para Angel: este archivo usa fetch(), por lo que el sitio necesita
// servirse por http (Netlify, o Live Server / npx serve en local).
// Abrir index.html con doble clic (file://) bloquea la carga del JSON.

const RUTA_DATOS = 'assets/data/noticias.json';

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

// Orden y títulos de las secciones por formato en portada y archivo.
const FORMATOS_ORDEN = ['Reportaje', 'Entrevista', 'Cobertura', 'Noticia Local', 'Producción Audiovisual'];
const FORMATO_TITULO = {
  'Reportaje': 'Reportajes',
  'Entrevista': 'Entrevistas',
  'Cobertura': 'Coberturas',
  'Noticia Local': 'Noticias Locales',
  'Producción Audiovisual': 'Producción Audiovisual'
};
const FORMATO_SLUG = {
  'Reportaje': 'reportaje',
  'Entrevista': 'entrevista',
  'Cobertura': 'cobertura',
  'Noticia Local': 'noticia-local',
  'Producción Audiovisual': 'produccion-audiovisual'
};

/**
 * Devuelve la imagen a usar como miniatura: la propia si existe,
 * o si no, la miniatura automática de YouTube derivada del video.
 */
function imagenNoticia(n) {
  if (n.imagen) return n.imagen;
  if (n.video) return `https://img.youtube.com/vi/${n.video}/hqdefault.jpg`;
  return '';
}

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

/**
 * Genera el HTML de una tarjeta de noticia.
 * media:true  -> tarjeta con imagen (usada en archivo.html y relacionadas)
 * media:false -> tarjeta compacta sin imagen (usada en secciones de portada)
 */
function tarjetaHTML(n, { media = true } = {}) {
  const mediaHTML = media
    ? `
      <a class="tarjeta__media" href="reportaje.html?id=${n.id}">
        <img src="${imagenNoticia(n)}" alt="${n.titulo}" loading="lazy">
        ${n.video ? '<div class="tarjeta__play"><span>▶</span></div>' : ''}
      </a>`
    : '';

  return `
    <article class="tarjeta">
      ${mediaHTML}
      <div class="tarjeta__cuerpo">
        <span class="etiqueta etiqueta--${n.colorFormato}">${n.formato}</span>
        <h3><a href="reportaje.html?id=${n.id}">${n.titulo}</a></h3>
        <p class="tarjeta__resumen">${n.resumen}</p>
        <p class="tarjeta__meta">${formatearFecha(n.fecha)} · ${n.autor}</p>
      </div>
    </article>
  `;
}

function iniciarTicker(noticias) {
  const pista = document.querySelector('[data-ticker]');
  if (!pista || noticias.length === 0) return;
  pista.innerHTML = noticias
    .slice(0, 5)
    .map((n) => `<span>${n.formato}:</span> <a href="reportaje.html?id=${n.id}">${n.titulo}</a>`)
    .join(' &nbsp; &nbsp; · &nbsp; &nbsp; ');
}

/**
 * Portada: rellena el bloque "Lo último" (destacada) y las secciones
 * agrupadas por formato debajo del video del héroe.
 */
function iniciarInicio(noticias) {
  const destacadaEl = document.querySelector('[data-destacada]');
  const seccionesEl = document.querySelector('[data-secciones-formato]');
  if (!destacadaEl && !seccionesEl) return;
  if (noticias.length === 0) return;

  const destacada = noticias.find((n) => n.destacada) || noticias[0];

  if (destacadaEl) {
    destacadaEl.innerHTML = `
      <div class="seccion-canal__cabecera">
        <div class="seccion-canal__titulo"><h2>Lo último</h2></div>
      </div>
      <article class="destacada">
        <a class="destacada__media" href="reportaje.html?id=${destacada.id}">
          <img src="${imagenNoticia(destacada)}" alt="${destacada.titulo}">
          ${destacada.video ? '<div class="tarjeta__play"><span>▶</span></div>' : ''}
        </a>
        <div class="destacada__cuerpo">
          <span class="etiqueta etiqueta--${destacada.colorFormato}">${destacada.formato}</span>
          <h2><a href="reportaje.html?id=${destacada.id}">${destacada.titulo}</a></h2>
          <p>${destacada.resumen}</p>
          <p class="destacada__meta">${formatearFecha(destacada.fecha)} · ${destacada.autor}</p>
          <a class="btn btn-primario" href="reportaje.html?id=${destacada.id}">Leer reportaje completo</a>
        </div>
      </article>
    `;
  }

  if (seccionesEl) {
    const presentes = FORMATOS_ORDEN.filter((f) => noticias.some((n) => n.formato === f && n.id !== destacada.id));

    if (!presentes.length) {
      seccionesEl.innerHTML = '';
      return;
    }

    seccionesEl.innerHTML = presentes
      .map((formato, i) => {
        const items = noticias.filter((n) => n.formato === formato && n.id !== destacada.id).slice(0, 3);
        if (!items.length) return '';
        const slug = FORMATO_SLUG[formato];
        const fondoAlterno = i % 2 === 1 ? ' style="background:#0e1310;"' : '';
        return `
          <section class="seccion-canal" id="seccion-${slug}"${fondoAlterno}>
            <div class="contenedor">
              <div class="seccion-canal__cabecera">
                <div class="seccion-canal__titulo"><h2>${FORMATO_TITULO[formato]}</h2></div>
                <a class="ver-todas" href="noticias.html?formato=${encodeURIComponent(formato)}">Ver todas →</a>
              </div>
              <div class="grid-tarjetas">${items.map((n) => tarjetaHTML(n, { media: false })).join('')}</div>
            </div>
          </section>
        `;
      })
      .join('');
  }
}

/**
 * Página de archivo (noticias.html): filtros por formato + grid con imagen.
 * Soporta preselección vía ?formato=Reportaje en la URL (usado por los
 * enlaces "Ver todas →" de la portada).
 */
function iniciarPaginaNoticias(noticias) {
  const gridEl = document.querySelector('[data-grid-noticias]');
  const filtrosEl = document.querySelector('[data-filtros]');
  if (!gridEl || !filtrosEl) return;

  if (noticias.length === 0) {
    gridEl.innerHTML = '<p class="estado-vacio">Todavía no hay noticias publicadas. Vuelve pronto.</p>';
    return;
  }

  const formatosPresentes = FORMATOS_ORDEN.filter((f) => noticias.some((n) => n.formato === f));
  const params = new URLSearchParams(window.location.search);
  const formatoParam = params.get('formato');
  const formatoInicial = formatoParam && formatosPresentes.includes(formatoParam) ? formatoParam : 'Todas';

  const opciones = ['Todas', ...formatosPresentes];

  filtrosEl.innerHTML = opciones
    .map(
      (f) =>
        `<button class="filtro-btn" type="button" data-formato="${f}" aria-pressed="${f === formatoInicial}">${
          f === 'Todas' ? 'Todas' : FORMATO_TITULO[f]
        }</button>`
    )
    .join('');

  function render(formato) {
    const lista = formato === 'Todas' ? noticias : noticias.filter((n) => n.formato === formato);
    gridEl.innerHTML = lista.length
      ? lista.map((n) => tarjetaHTML(n, { media: true })).join('')
      : '<p class="estado-vacio">No hay noticias en este formato todavía.</p>';
  }

  filtrosEl.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.filtro-btn');
    if (!btn) return;
    filtrosEl.querySelectorAll('.filtro-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    render(btn.dataset.formato);
  });

  render(formatoInicial);
}

/**
 * Página de reportaje individual. Si la noticia trae un ID de video de
 * YouTube en el campo "video", se muestra el video embebido; si no,
 * se muestra la imagen (compatibilidad con las noticias actuales).
 */
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

  const mediaHTML = noticia.video
    ? `<div class="video-wrapper"><iframe src="https://www.youtube-nocookie.com/embed/${noticia.video}" title="${noticia.titulo}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`
    : `<img src="${noticia.imagen}" alt="${noticia.titulo}">`;

  contenedor.innerHTML = `
    <div class="articulo-hero__cabecera">
      <span class="etiqueta etiqueta--${noticia.colorFormato}">${noticia.formato}</span>
      <h1>${noticia.titulo}</h1>
      <p class="articulo-hero__meta">
        <span>${formatearFecha(noticia.fecha)}</span>
        <span>${noticia.autor}</span>
      </p>
    </div>
    <div class="articulo-hero__media">${mediaHTML}</div>
  `;

  const cuerpoEl = document.querySelector('[data-articulo-cuerpo]');
  if (cuerpoEl) {
    cuerpoEl.innerHTML = `
      <div class="articulo__cuerpo">
        ${noticia.cuerpo.map((p) => `<p>${p}</p>`).join('')}
      </div>
      <div class="compartir">
        <span>Compartir:</span>
        <a target="_blank" rel="noopener" href="https://api.whatsapp.com/send?text=${encodeURIComponent(noticia.titulo + ' - ' + window.location.href)}">WhatsApp</a>
        <a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}">Facebook</a>
        <a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(noticia.titulo)}">X</a>
      </div>
    `;
  }

  const relacionadasEl = document.querySelector('[data-relacionadas]');
  if (relacionadasEl) {
    const relacionadas = noticias
      .filter((n) => n.id !== noticia.id)
      .sort((a, b) => (a.formato === noticia.formato ? -1 : 1))
      .slice(0, 3);
    relacionadasEl.innerHTML = `
      <h2>Más noticias</h2>
      <div class="grid-tarjetas">${relacionadas.map((n) => tarjetaHTML(n, { media: true })).join('')}</div>
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
