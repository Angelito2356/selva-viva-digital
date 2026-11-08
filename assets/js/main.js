// SELVA VIVA DIGITAL — main.js
// Comportamiento general del sitio: menú móvil, año del pie de página
// y marcado del enlace activo en la navegación.

document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const abierto = links.classList.toggle('abierto');
      toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });

    // Cierra el menú al elegir un enlace (útil en móvil)
    links.querySelectorAll('a').forEach((enlace) => {
      enlace.addEventListener('click', () => {
        links.classList.remove('abierto');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Año dinámico en el pie de página
  document.querySelectorAll('[data-anio]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Fecha de hoy en la barra superior (siempre con la hora de Ecuador)
  document.querySelectorAll('[data-fecha-hoy]').forEach((el) => {
    const zona = 'America/Guayaquil';
    const partes = Object.fromEntries(
      new Intl.DateTimeFormat('es-EC', { timeZone: zona, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        .formatToParts(new Date())
        .map((p) => [p.type, p.value])
    );
    const dia = partes.weekday.charAt(0).toUpperCase() + partes.weekday.slice(1);
    el.textContent = `${dia} ${partes.day} de ${partes.month} de ${partes.year}`;
    el.setAttribute('datetime', new Intl.DateTimeFormat('en-CA', { timeZone: zona }).format(new Date()));
  });

  // Marca el enlace activo según la página actual
  const rutaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((enlace) => {
    const href = enlace.getAttribute('href');
    if (href === rutaActual) {
      enlace.setAttribute('aria-current', 'page');
    }
  });
});

// Radio en línea: se abre en ventana aparte para que siga sonando al navegar por el sitio
document.querySelectorAll('[data-radio-popup]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var w = window.open(a.href, 'radio-adn', 'width=440,height=300,menubar=no,toolbar=no,location=no,status=no');
    if (w) { e.preventDefault(); w.focus(); }
  });
});

// Botón flotante de la radio (visible mientras se recorre la página)
(function () {
  var a = document.createElement('a');
  a.className = 'radio-flotante';
  a.href = 'https://zeno.fm/player/adnmediodigital';
  a.target = 'radio-adn';
  a.rel = 'noopener';
  a.setAttribute('data-radio-popup', '');
  a.setAttribute('aria-label', 'Escuchar la radio en vivo en una ventana aparte');
  a.innerHTML = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="txt">Radio en vivo</span>';
  document.body.appendChild(a);
  a.addEventListener('click', function (e) {
    var w = window.open(a.href, 'radio-adn', 'width=440,height=300,menubar=no,toolbar=no,location=no,status=no');
    if (w) { e.preventDefault(); w.focus(); }
  });
})();
