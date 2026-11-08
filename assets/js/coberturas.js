// SELVA VIVA DIGITAL — coberturas.js
// Sección "Coberturas" de la portada: pantalla principal (video de YouTube o
// foto) + recuadro "Más coberturas". Lee assets/data/noticias.json y toma las
// notas con "formato": "Cobertura", de la más reciente a la más antigua.
// Para agregar una: añade la nota en noticias.json con "formato": "Cobertura"
// (y su ID de YouTube en "video" si tiene video). Aparece sola aquí.

document.addEventListener('DOMContentLoaded', async () => {
  const seccion = document.querySelector('[data-coberturas]');
  if (!seccion) return;

  const pantalla = seccion.querySelector('[data-cob-pantalla]');
  const lista = seccion.querySelector('[data-cob-lista]');
  const fTitulo = seccion.querySelector('[data-cob-titulo]');
  const fMeta = seccion.querySelector('[data-cob-meta]');
  const fResumen = seccion.querySelector('[data-cob-resumen]');
  const bNota = seccion.querySelector('[data-cob-nota]');
  const bYoutube = seccion.querySelector('[data-cob-youtube]');

  let notas;
  try {
    const resp = await fetch('assets/data/noticias.json', { cache: 'no-cache' });
    notas = await resp.json();
  } catch (e) {
    return; // si falla, la sección queda oculta
  }
  notas = (Array.isArray(notas) ? notas : [])
    .filter((n) => n.formato === 'Cobertura')
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
  if (notas.length === 0) return;

  const formatoFecha = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
  const fechaLegible = (iso) => {
    const [a, m, d] = String(iso).split('-').map(Number);
    return a ? formatoFecha.format(new Date(a, m - 1, d)) : '';
  };
  const miniatura = (n) =>
    n.video ? `https://i.ytimg.com/vi/${encodeURIComponent(n.video)}/mqdefault.jpg` : n.imagen;

  const botones = [];

  function mostrarPantalla(n, reproducir) {
    pantalla.innerHTML = '';
    if (n.video) {
      const marco = document.createElement('div');
      marco.className = 'video-wrapper';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(n.video)}?rel=0${reproducir ? '&autoplay=1' : ''}`;
      iframe.title = n.titulo;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      marco.appendChild(iframe);
      pantalla.appendChild(marco);
    } else {
      const a = document.createElement('a');
      a.className = 'cob-foto';
      a.href = `reportaje.html?id=${encodeURIComponent(n.id)}`;
      a.setAttribute('aria-label', `Leer la nota: ${n.titulo}`);
      const img = document.createElement('img');
      img.src = n.imagen;
      img.alt = n.titulo;
      a.appendChild(img);
      pantalla.appendChild(a);
    }
  }

  function seleccionar(i, reproducir) {
    const n = notas[i];
    mostrarPantalla(n, reproducir);
    fTitulo.textContent = n.titulo;
    fMeta.textContent = (i === 0 ? 'Más reciente · ' : '') + fechaLegible(n.fecha);
    fResumen.textContent = n.resumen || '';
    bNota.href = `reportaje.html?id=${encodeURIComponent(n.id)}`;
    if (n.video) {
      bYoutube.href = `https://youtu.be/${encodeURIComponent(n.video)}`;
      bYoutube.hidden = false;
    } else {
      bYoutube.hidden = true;
    }
    botones.forEach((b, k) => {
      b.classList.toggle('activo', k === i);
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
    });
  }

  notas.forEach((n, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cob-item';

    const img = document.createElement('img');
    img.src = miniatura(n);
    img.alt = '';
    img.loading = 'lazy';

    const titulo = document.createElement('span');
    titulo.className = 'cob-item__titulo';
    titulo.textContent = n.titulo;

    const fecha = document.createElement('span');
    fecha.className = 'cob-item__fecha';
    fecha.textContent = fechaLegible(n.fecha) + (n.video ? ' · Video' : '');

    const texto = document.createElement('span');
    texto.className = 'cob-item__texto';
    texto.append(titulo, fecha);
    b.append(img, texto);
    b.addEventListener('click', () => seleccionar(i, true));
    lista.appendChild(b);
    botones.push(b);
  });

  seleccionar(0, false);
  seccion.hidden = false;
});
