// SELVA VIVA DIGITAL — hero-carrusel.js
// Alterna automáticamente entre el video del héroe y las imágenes
// publicitarias. Independiente de main.js y noticias.js.

document.addEventListener('DOMContentLoaded', () => {
  const carrusel = document.querySelector('[data-hero-carrusel]');
  if (!carrusel) return;

  const slides = Array.from(carrusel.querySelectorAll('.hero-carrusel__slide'));
  const puntosEl = carrusel.querySelector('[data-hero-carrusel-puntos]');
  if (slides.length < 2) return; // nada que alternar con una sola diapositiva

  let indiceActual = 0;
  let temporizador;

  // Genera los puntos de navegación (uno por diapositiva)
  puntosEl.innerHTML = slides
    .map(
      (_, i) =>
        `<button class="hero-carrusel__punto${i === 0 ? ' activo' : ''}" aria-label="Ir a la diapositiva ${i + 1}" data-indice="${i}"></button>`
    )
    .join('');
  const puntos = Array.from(puntosEl.querySelectorAll('.hero-carrusel__punto'));

  function irA(indice) {
    // Si salimos de la diapositiva de video mientras se reproducía,
    // recargar el iframe detiene el audio/video en seco.
    const slideAnterior = slides[indiceActual];
    if (slideAnterior.dataset.tipo === 'video') {
      const iframe = slideAnterior.querySelector('iframe');
      if (iframe) iframe.src = iframe.src;
    }

    slides[indiceActual].classList.remove('activa');
    puntos[indiceActual].classList.remove('activo');
    indiceActual = indice;
    slides[indiceActual].classList.add('activa');
    puntos[indiceActual].classList.add('activo');
  }

  function siguiente() {
    irA((indiceActual + 1) % slides.length);
  }

  function iniciarAutoplay() {
    clearInterval(temporizador);
    temporizador = setInterval(siguiente, 7000);
  }

  puntos.forEach((btn) => {
    btn.addEventListener('click', () => {
      irA(Number(btn.dataset.indice));
      iniciarAutoplay(); // reinicia el conteo tras un clic manual
    });
  });

  iniciarAutoplay();
});
