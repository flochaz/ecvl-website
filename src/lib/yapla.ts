// The organisation's public Yapla agenda. The site shows it live in an iframe
// (see components/YaplaAgenda.astro): Yapla sends no Access-Control-Allow-Origin
// header, so the browser cannot read its HTML itself, and the site is static —
// framing is the only way to show the current events without a build step.
// Yapla does not block framing (no X-Frame-Options, no CSP frame-ancestors).
export const YAPLA_AGENDA_URL =
  'https://ecologie-citoyenne-pour-villeneuve-loubet-1.s2.yapla.com/fr/evenements';
