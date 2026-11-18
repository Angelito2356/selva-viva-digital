// SELVA VIVA DIGITAL — contador.js
// Muestra "👁 12.345 visitas" en el pie de página con el total que lleva
// GoatCounter. El conteo en sí lo hace el script count.js (en cada página).
// Requisito en GoatCounter: Settings → "Allow adding visitor counts on your website".
// Si el servicio no responde, el contador simplemente no se muestra.

(function () {
  const CODIGO = 'selvaviva'; // código de la cuenta en goatcounter.com
  const base = `https://${CODIGO}.goatcounter.com/counter/TOTAL`;

  function iniciar() {
    const el = document.querySelector('[data-visitas]');
    if (!el) return;

    const mostrar = (n) => {
      el.textContent = `👁 ${n.toLocaleString('es-EC')} visitas`;
      el.hidden = false;
    };

    // Opción A: el número como texto (se ve con el estilo del sitio)
    fetch(`${base}.json`)
      .then((r) => {
        if (!r.ok) throw new Error('sin respuesta');
        return r.json();
      })
      .then((d) => {
        const n = parseInt(String(d.count).replace(/\D/g, ''), 10);
        if (Number.isNaN(n)) throw new Error('dato inválido');
        mostrar(n);
      })
      .catch(() => {
        // Opción B (respaldo): la imagen oficial del contador
        const img = new Image();
        img.alt = 'Visitas al sitio';
        img.height = 22;
        img.onload = () => { el.textContent = ''; el.appendChild(img); el.hidden = false; };
        img.onerror = () => { el.hidden = true; };
        img.src = `${base}.svg?no_branding=1`;
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
