/**
 * social-links.js
 * Fuente única de verdad para los enlaces de redes sociales y contacto
 * de Selva Viva Digital / ADN Medio Digital.
 *
 * Si cambias un handle, correo, teléfono o agregas una red nueva,
 * edítalo SOLO aquí (objeto SOCIAL_LINKS) — se actualiza automáticamente
 * en todas las páginas que incluyan este script.
 */

const SOCIAL_LINKS = {
  youtube:   { url: "https://www.youtube.com/@ADNMedioDigital", label: "YouTube" },
  facebook:  { url: "https://facebook.com/selvavivadigital",    label: "Facebook" },
  instagram: { url: "https://instagram.com/selvaviva.ec",       label: "Instagram" },
  tiktok:    { url: "https://tiktok.com/@adnmediodigital",      label: "TikTok" },
  x:         { url: "https://x.com/adnmediodigital",            label: "X" },
  whatsapp:  { url: "https://wa.me/593999316910",               label: "+593 99 931 6910" },
  email:     { url: "mailto:info.adnmediodigital@gmail.com",    label: "info.adnmediodigital@gmail.com" }
};

/**
 * Rellena TODOS los contenedores que coincidan con el selector
 * (usa querySelectorAll, así funciona aunque el bloque se repita
 * varias veces en la misma página, como pasa en contacto.html).
 */
function renderSocialLinks(selector, platforms) {
  const containers = document.querySelectorAll(selector);
  if (!containers.length) return;

  const html = platforms
    .map((key) => {
      const link = SOCIAL_LINKS[key];
      if (!link) return "";
      const isMailto = link.url.startsWith("mailto:");
      const attrs = isMailto ? "" : ' target="_blank" rel="noopener"';
      return `<a href="${link.url}"${attrs}>${link.label}</a>`;
    })
    .join("");

  containers.forEach((c) => (c.innerHTML = html));
}

/**
 * Rellena la lista simple de contacto del footer
 * (requiere <ul class="footer__contacto-lista">).
 */
function renderContactList(selector, ubicacion = "Loreto, Orellana, Ecuador") {
  const containers = document.querySelectorAll(selector);
  if (!containers.length) return;

  const html = `
    <li><a href="${SOCIAL_LINKS.email.url}">${SOCIAL_LINKS.email.label}</a></li>
    <li><a href="${SOCIAL_LINKS.whatsapp.url}" target="_blank" rel="noopener">WhatsApp</a></li>
    <li>${ubicacion}</li>
  `;
  containers.forEach((c) => (c.innerHTML = html));
}

/**
 * Rellena la tarjeta "Información directa" de contacto.html
 * (requiere <ul class="info-contacto__lista">).
 * Mantiene el formato con etiquetas en negrita (<strong>).
 */
function renderInfoContacto(selector, opts = {}) {
  const container = document.querySelector(selector);
  if (!container) return;

  const zona = opts.zona || "Loreto, Orellana, Ecuador";
  const horario = opts.horario || "Lunes a viernes, 8:00 – 19:00";

  container.innerHTML = `
    <li><strong>Correo</strong><a href="${SOCIAL_LINKS.email.url}">${SOCIAL_LINKS.email.label}</a></li>
    <li><strong>WhatsApp</strong><a href="${SOCIAL_LINKS.whatsapp.url}" target="_blank" rel="noopener">${SOCIAL_LINKS.whatsapp.label}</a></li>
    <li><strong>Zona de cobertura</strong>${zona}</li>
    <li><strong>Horario de atención</strong>${horario}</li>
  `;
}

// Se ejecuta automáticamente en cuanto carga cada página
document.addEventListener("DOMContentLoaded", () => {
  renderSocialLinks(".topbar__redes", ["youtube", "facebook", "instagram"]);
  renderSocialLinks(".footer__social", ["youtube", "facebook", "instagram", "tiktok", "x"]);
  renderContactList(".footer__contacto-lista");
  renderInfoContacto(".info-contacto__lista");
});