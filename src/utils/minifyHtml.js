// Minifica HTML en el navegador (sin dependencias externas)
export function minifyHtmlBrowser(html) {
  return html
    .replace(/\n+/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}
