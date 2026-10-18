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
