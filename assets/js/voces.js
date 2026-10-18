// SELVA VIVA DIGITAL — voces.js
// Reproductor + carrusel de entrevistas de "Voces de la Selva".
// Lee assets/data/voces.json (la primera entrevista es la más reciente).
// Para agregar una nueva: súbela a YouTube y añade una línea AL PRINCIPIO de voces.json.

document.addEventListener('DOMContentLoaded', async () => {
  const cont = document.querySelector('[data-voces]');
  if (!cont) return;
  const iframe = cont.querySelector('iframe');
  const lista = cont.querySelector('[data-voces-lista]');
  const fichaTitulo = cont.querySelector('[data-voces-titulo]');
  const fichaFecha = cont.querySelector('[data-voces-fecha]');
  const fichaEnlace = cont.querySelector('[data-voces-enlace]');

  let episodios;
  try {
    const resp = await fetch('assets/data/voces.json', { cache: 'no-cache' });
    episodios = await resp.json();
  } catch (e) {
    return; // si falla, queda el video por defecto del HTML
  }
  if (!Array.isArray(episodios) || episodios.length === 0) return;

  const formatoFecha = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
  const fechaLegible = (iso) => {
    const [a, m, d] = String(iso).split('-').map(Number);
    return a ? formatoFecha.format(new Date(a, m - 1, d)) : '';
  };

  const botones = [];

  function seleccionar(i, reproducir) {
    const ep = episodios[i];
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(ep.id)}?rel=0${reproducir ? '&autoplay=1' : ''}`;
    iframe.title = ep.titulo;
    if (fichaTitulo) fichaTitulo.textContent = ep.titulo;
    if (fichaFecha) fichaFecha.textContent = (i === 0 ? 'Más reciente · ' : '') + fechaLegible(ep.fecha);
    if (fichaEnlace) fichaEnlace.href = `https://youtu.be/${encodeURIComponent(ep.id)}`;
    botones.forEach((b, k) => {
      b.classList.toggle('activo', k === i);
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
    });
  }

  episodios.forEach((ep, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'voces-item';

    const img = document.createElement('img');
    img.src = `https://i.ytimg.com/vi/${encodeURIComponent(ep.id)}/mqdefault.jpg`;
    img.alt = '';
    img.loading = 'lazy';

    const titulo = document.createElement('span');
    titulo.className = 'voces-item__titulo';
    titulo.textContent = ep.titulo;

    const fecha = document.createElement('span');
    fecha.className = 'voces-item__fecha';
    fecha.textContent = fechaLegible(ep.fecha);

    const texto = document.createElement('span');
    texto.className = 'voces-item__texto';
    texto.append(titulo, fecha);
    b.append(img, texto);
    b.addEventListener('click', () => seleccionar(i, true));
    lista.appendChild(b);
    botones.push(b);
  });

  seleccionar(0, false);
});
