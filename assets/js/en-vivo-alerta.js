// SELVA VIVA DIGITAL — en-vivo-alerta.js
// Muestra el aviso rojo "EN VIVO AHORA" (barra superior + botón flotante)
// cuando hay una transmisión activa. Se controla desde assets/data/en-vivo.json:
//
//   { "activo": true,
//     "desde": "2026-11-12T19:00:00-05:00",   (opcional)
//     "hasta": "2026-11-12T21:00:00-05:00",   (opcional)
//     "titulo": "Voces de la Selva en vivo",  (opcional)
//     "enlace": "en-vivo.html" }              (opcional)
//
// Con "desde" y "hasta" la alerta aparece y desaparece sola, sin que tengas
// que volver a editar el archivo cuando termina la transmisión.

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

  const ahora = Date.now();
  const desde = cfg.desde ? Date.parse(cfg.desde) : null;
  const hasta = cfg.hasta ? Date.parse(cfg.hasta) : null;
  if ((desde && ahora < desde) || (hasta && ahora > hasta)) return;

  const enlace = cfg.enlace || 'en-vivo.html';
  const titulo = cfg.titulo || 'Transmisión en vivo';
  const crear = (clase, html) => {
    const a = document.createElement('a');
    a.className = clase;
    a.href = enlace;
    a.title = titulo;
    a.setAttribute('aria-label', `En vivo ahora: ${titulo}`);
    a.innerHTML = html;
    return a;
  };

  // Barra superior: junto al botón de la radio
  const radio = document.querySelector('.topbar__radio');
  if (radio && !document.querySelector('.topbar__envivo')) {
    const grupo = document.createElement('div');
    grupo.className = 'topbar__acciones';
    radio.parentNode.insertBefore(grupo, radio);
    grupo.append(crear('topbar__envivo', '<span class="envivo__punto"></span> EN VIVO AHORA'), radio);
  }

  // Botón flotante (no se repite dentro de la propia página En Vivo)
  if (!/en-vivo\.html$/.test(window.location.pathname) && !document.querySelector('.envivo-flotante')) {
    document.body.appendChild(
      crear('envivo-flotante', '<span class="envivo__punto"></span><span class="txt">EN VIVO AHORA</span>')
    );
  }
})();
