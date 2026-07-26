/**
 * social-links.js
 * Fuente única de verdad para los enlaces de redes sociales y contacto
 * de Selva Viva Digital / ADN Medio Digital.
 *
 * Si cambias un handle, correo, teléfono o agregas una red nueva,
 * edítalo SOLO aquí (objeto SOCIAL_LINKS) — se actualiza automáticamente
 * en todas las páginas que incluyan este script (index, noticias,
 * reportaje, contacto, 404).
 *
 * No necesitas tocar el HTML de topbar__redes ni footer__social:
 * este script los rellena solo al cargar la página.
 */

const SOCIAL_LINKS = {
  youtube:   { url: "https://www.youtube.com/@ADNMedioDigital", label: "YouTube" },
  facebook:  { url: "https://facebook.com/selvavivadigital",    label: "Facebook" },
  instagram: { url: "https://instagram.com/selvaviva.ec",       label: "Instagram" },
  tiktok:    { url: "https://tiktok.com/@adnmediodigital",      label: "TikTok" },
  x:         { url: "https://x.com/adnmediodigital",            label: "X" },
  whatsapp:  { url: "https://wa.me/593999316910",               label: "WhatsApp" },
  email:     { url: "mailto:info.adnmediodigital@gmail.com",    label: "info.adnmediodigital@gmail.com" }
};

/**
 * Rellena un contenedor existente (por selector CSS) con los enlaces
 * indicados, en el mismo formato de texto que ya usa el sitio.
 *
 * Ejemplo: renderSocialLinks(".footer__social", ["youtube","facebook","instagram","tiktok","x"]);
 */
function renderSocialLinks(selector, platforms) {
  const container = document.querySelector(selector);
  if (!container) return;

  const html = platforms
    .map((key) => {
      const link = SOCIAL_LINKS[key];
      if (!link) return "";
      const isMailto = link.url.startsWith("mailto:");
      const attrs = isMailto ? "" : ' target="_blank" rel="noopener"';
      return `<a href="${link.url}"${attrs}>${link.label}</a>`;
    })
    .join("");

  container.innerHTML = html;
}

/**
 * Rellena la lista de contacto del footer (correo, WhatsApp, ubicación)
 * si el <ul> tiene la clase "footer__contacto-lista".
 * La ubicación se pasa aparte porque no cambia por red social.
 */
function renderContactList(selector, ubicacion = "Loreto, Orellana, Ecuador") {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = `
    <li><a href="${SOCIAL_LINKS.email.url}">${SOCIAL_LINKS.email.label}</a></li>
    <li><a href="${SOCIAL_LINKS.whatsapp.url}" target="_blank" rel="noopener">WhatsApp</a></li>
    <li>${ubicacion}</li>
  `;
}

// Se ejecuta automáticamente en cuanto carga cada página
document.addEventListener("DOMContentLoaded", () => {
  renderSocialLinks(".topbar__redes", ["youtube", "facebook", "instagram"]);
  renderSocialLinks(".footer__social", ["youtube", "facebook", "instagram", "tiktok", "x"]);
  renderContactList(".footer__contacto-lista");
});