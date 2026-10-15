// The Repair Café hub's public address. Sessions shown on the site come from
// its /api/public/events (see scripts/fetch-events.mjs), and links point back to
// its public pages. Override with PUBLIC_HUB_URL to move to a custom domain.
export const HUB_URL = (
  import.meta.env.PUBLIC_HUB_URL || 'https://repair-cafe-hub.florianchazal-79f.workers.dev'
).replace(/\/+$/, '');

export const HUB_EVENTS_URL = `${HUB_URL}/events`;
