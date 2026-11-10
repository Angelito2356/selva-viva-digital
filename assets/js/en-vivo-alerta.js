// SELVA VIVA DIGITAL — en-vivo-alerta.js
// Avisos de transmisión en vivo, controlados por horario desde
// assets/data/en-vivo.json. Sin tocar nada el día del evento:
//
//   {
//     "activo": true,                              interruptor general (false = todo apagado)
//     "titulo": "Voces de la Selva: ...",           texto del aviso
//     "descripcion": "Invitado: ...",               (opcional) línea secundaria
//     "inicio": "2026-11-10T19:30:00-05:00",        hora de inicio de la transmisión
//     "desde":  "2026-11-10T19:30:00-05:00",        (opcional) cuándo pasa a "EN VIVO AHORA" (por defecto = inicio)
//     "hasta":  "2026-11-10T21:30:00-05:00",        cuándo se apaga el aviso
//     "anunciarHoras": 72,                          (opcional) cuántas horas antes muestra "Próxima transmisión"
//     "enlace": "en-vivo.html"
//   }
//
// Antes de "desde": franja "PRÓXIMA TRANSMISIÓN" con cuenta regresiva (solo en el inicio).
// Entre "desde" y "hasta": "EN VIVO AHORA" (barra superior, botón flotante y franja del inicio).
// Después de "hasta": no se muestra nada. Si quieres encenderlo a mano, deja
// "desde"/"hasta" vacíos y pon "activo": true.

(async function () {
  let cfg;
  try {
    const resp = await fetch('assets/data/en-vivo.json', { cache: 'no-cache' });
    if (!resp.ok) return;
    cfg = await resp.json();
  } catch (e) {
    return;
  }
  if (!cfg || cfg.activo !== true) return;

  const analizar = (v) => (v ? Date.parse(v) : NaN);
  const inicio = analizar(cfg.inicio);
  const desde = analizar(cfg.desde) || inicio || null;
  const hasta = analizar(cfg.hasta) || null;
  const anunciarMs = (Number(cfg.anunciarHoras) > 0 ? Number(cfg.anunciarHoras) : 72) * 3600 * 1000;
  const enlace = cfg.enlace || 'en-vivo.html';
  const titulo = cfg.titulo || 'Transmisión en vivo';
  const descripcion = cfg.descripcion || '';

  const estado = () => {
    const ahora = Date.now();
    if (hasta && ahora > hasta) return 'fin';
    if (!desde || ahora >= desde) return 'vivo';
    if (ahora >= desde - anunciarMs) return 'proxima';
    return 'oculto';
  };

  const esInicio = !!document.querySelector('[data-destacada]') || /(^|\/)(index\.html)?$/.test(window.location.pathname);
  const esEnVivo = /en-vivo(\.html)?$/.test(window.location.pathname);
  const crear = (clase, html) => {
    const a = document.createElement('a');
    a.className = clase;
    a.href = enlace;
    a.title = titulo;
    a.setAttribute('aria-label', `En vivo ahora: ${titulo}`);
    a.innerHTML = html;
    return a;
  };

  /* ---------- Piezas "EN VIVO AHORA" (todas las páginas) ---------- */
  function mostrarVivo() {
    const radio = document.querySelector('.topbar__radio');
    if (radio && !document.querySelector('.topbar__envivo')) {
      const grupo = document.createElement('div');
      grupo.className = 'topbar__acciones';
      radio.parentNode.insertBefore(grupo, radio);
      grupo.append(crear('topbar__envivo', '<span class="envivo__punto"></span> EN VIVO AHORA'), radio);
    }
    if (!esEnVivo && !document.querySelector('.envivo-flotante')) {
      document.body.appendChild(
        crear('envivo-flotante', '<span class="envivo__punto"></span><span class="txt">EN VIVO AHORA</span>')
      );
    }
  }

  /* ---------- Franja destacada del inicio ---------- */
  let franja = null;
  const cuenta = { el: null };
  function asegurarFranja() {
    if (franja || !esInicio) return franja;
    const ticker = document.querySelector('.ticker');
    if (!ticker) return null;
    franja = document.createElement('section');
    franja.className = 'envivo-franja';
    franja.setAttribute('aria-live', 'polite');
    ticker.insertAdjacentElement('afterend', franja);
    return franja;
  }
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const formatoCuenta = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    const dos = (n) => String(n).padStart(2, '0');
    return (d > 0 ? `${d} d ` : '') + `${dos(h)}:${dos(m)}:${dos(x)}`;
  };
  const fechaLarga = () => {
    if (!inicio) return '';
    const t = new Intl.DateTimeFormat('es-EC', {
      timeZone: 'America/Guayaquil', weekday: 'long', day: 'numeric', month: 'long',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).format(new Date(inicio));
    return t.charAt(0).toUpperCase() + t.slice(1) + ' (hora de Ecuador)';
  };

  function pintarFranja(modo) {
    const f = asegurarFranja();
    if (!f) return;
    f.dataset.modo = modo;
    if (modo === 'vivo') {
      f.innerHTML = `
        <div class="contenedor envivo-franja__in">
          <span class="envivo-franja__etiqueta"><span class="envivo__punto"></span> EN VIVO AHORA</span>
          <p class="envivo-franja__texto"><strong>${esc(titulo)}</strong>${descripcion ? ` <span>${esc(descripcion)}</span>` : ''}</p>
          <a class="btn btn-suscribir envivo-franja__btn" href="${esc(enlace)}">▶ Ver la transmisión</a>
        </div>`;
      cuenta.el = null;
    } else {
      f.innerHTML = `
        <div class="contenedor envivo-franja__in">
          <span class="envivo-franja__etiqueta envivo-franja__etiqueta--proxima">PRÓXIMA TRANSMISIÓN</span>
          <p class="envivo-franja__texto"><strong>${esc(titulo)}</strong> <span>${esc(fechaLarga())}</span></p>
          <span class="envivo-franja__cuenta" aria-label="Tiempo restante"><small>Comienza en</small> <b data-cuenta>--:--:--</b></span>
          <a class="btn btn-claro envivo-franja__btn" href="${esc(enlace)}">Ir a En Vivo</a>
        </div>`;
      cuenta.el = f.querySelector('[data-cuenta]');
    }
  }

  let ultimo = null;
  function actualizar() {
    const e = estado();
    if (e !== ultimo) {
      ultimo = e;
      if (e === 'vivo') { mostrarVivo(); pintarFranja('vivo'); }
      else if (e === 'proxima') { pintarFranja('proxima'); }
      else {
        document.querySelectorAll('.topbar__envivo, .envivo-flotante, .envivo-franja').forEach((n) => n.remove());
        franja = null;
      }
    }
    if (e === 'proxima' && cuenta.el && desde) cuenta.el.textContent = formatoCuenta(desde - Date.now());
    if (e === 'fin' && reloj) clearInterval(reloj);
  }
  let reloj = null;
  actualizar();
  reloj = setInterval(actualizar, 1000);
})();
