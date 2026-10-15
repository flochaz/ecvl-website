/**
 * Builds src/data/events.json for the site from two sources:
 *
 *   1. Repair Café sessions from the hub's public API
 *      ({HUB_URL}/api/public/events) — the hub that replaced the paper flow.
 *   2. Shared-garden events scraped from the Yapla public agenda, until those
 *      move to the hub too. Only Yapla events about the garden are kept, so they
 *      do not duplicate the hub's repair sessions.
 *
 * If one source fails we keep the other; if both fail we leave the existing
 * events.json untouched, so a bad build never empties the calendar.
 *
 * Optional env: HUB_URL (default: the ECVL hub's workers.dev address),
 *               YAPLA_ORG (default: ecologie-citoyenne-pour-villeneuve-loubet-1).
 */

import { writeFile, access, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/data/events.json');

const HUB_URL = (
  process.env.HUB_URL || 'https://repair-cafe-hub.florianchazal-79f.workers.dev'
).replace(/\/+$/, '');

const YAPLA_ORG = process.env.YAPLA_ORG || 'ecologie-citoyenne-pour-villeneuve-loubet-1';
const YAPLA_BASE = `https://${YAPLA_ORG}.s2.yapla.com/fr/evenements`;

const UA = 'Mozilla/5.0 (compatible; ECVL-website/1.0)';

// ── Repair Café: the hub ─────────────────────────────────────────────────────

/**
 * A local datetime string ("2026-11-07T14:00:00", no timezone). The site parses
 * it with `new Date(...)`, which reads it as local time, so 14:00 stays 14:00 in
 * the visitor's browser instead of shifting across timezones.
 */
function localDateTime(date, time) {
  if (!date || !time) return null;
  return `${date}T${String(time).slice(0, 8)}`;
}

async function fetchHubEvents() {
  const res = await fetch(`${HUB_URL}/api/public/events`, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`hub responded ${res.status}`);
  const sessions = await res.json();
  if (!Array.isArray(sessions)) throw new Error('hub returned an unexpected shape');

  return sessions.map((s) => ({
    title: s.name,
    description: s.description || '',
    startsAt: localDateTime(s.date, s.startTime),
    endsAt: localDateTime(s.date, s.endTime),
    // Sessions are walk-in, so the link goes to the hub's public events page.
    url: `${HUB_URL}/events`,
    imageUrl: s.coverUrl ?? undefined,
    place: s.venue?.name ?? undefined,
    city: s.venue?.postcode ?? undefined,
    formType: 'Event',
    id: s.id,
  }));
}

// ── Garden: the Yapla agenda (until it moves to the hub) ─────────────────────

const MONTHS = {
  'janv.': 0, janvier: 0,
  'févr.': 1, février: 1,
  mars: 2,
  'avr.': 3, avril: 3,
  mai: 4,
  juin: 5,
  'juil.': 6, juillet: 6,
  'août': 7, aout: 7,
  'sept.': 8, septembre: 8,
  'oct.': 9, octobre: 9,
  'nov.': 10, novembre: 10,
  'déc.': 11, décembre: 11,
};

/** "Le 29 août 2026" (or without year for the current year) → ISO date or null */
function parseYaplaDate(text) {
  const m = String(text).match(/Le?\s+(\d{1,2})\s+([a-zéûèâà.]+)\s*(?:(\d{4}))?/i);
  if (!m) return null;
  const day = Number(m[1]);
  const rawMonth = m[2].toLowerCase();
  const monthKey = rawMonth.endsWith('.') ? rawMonth.slice(0, -1) : rawMonth;
  const monthIdx = MONTHS[monthKey] ?? MONTHS[rawMonth];
  if (monthIdx === undefined) return null;
  const year = m[3] ? Number(m[3]) : new Date().getFullYear();
  const d = new Date(year, monthIdx, day, 12, 0, 0);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function decodeEntities(str) {
  return String(str)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .trim();
}

function parseListItem(block) {
  const title = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
  const date = block.match(/<h4[^>]*class="[^"]*e-date[^"]*"[^>]*>([\s\S]*?)<\/h4>/);
  const detail = block.match(/href="([^"]*\/detail\/[^"]+)"/);
  if (!title || !detail) return null;
  return {
    title: decodeEntities(title[1]),
    dateText: date ? decodeEntities(date[1]) : '',
    detailUrl: detail[1],
  };
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return res.text();
}

async function fetchYaplaGardenEvents() {
  const html = await fetchText(YAPLA_BASE);
  const items = html.match(/<div class="item">[\s\S]*?<\/div>\s*<\/div>/g) || [];

  const events = [];
  for (const block of items) {
    const item = parseListItem(block);
    if (!item) continue;
    // Only garden events; the hub already covers the repair café.
    const lower = item.title.toLowerCase();
    if (!lower.includes('jardin') && !lower.includes('garden')) continue;

    let description = '';
    let imageUrl;
    try {
      const detailHtml = await fetchText(item.detailUrl);
      const desc = detailHtml.match(/<div class="event-detail__description-wrapper">([\s\S]*?)<\/div>/);
      if (desc) description = decodeEntities(desc[1].replace(/<[^>]+>/g, ' '));
      const img = detailHtml.match(/<div class="event-detail__image-wrapper">[\s\S]*?<img src="([^"]+)"/);
      if (img) imageUrl = img[1];
    } catch {
      /* detail page unavailable — keep list-page data only */
    }

    const idMatch = item.detailUrl.match(/\/(\d+)\/?$/);
    events.push({
      title: item.title,
      description: description || `Rejoignez-nous pour « ${item.title} ».`,
      startsAt: parseYaplaDate(item.dateText),
      endsAt: null,
      url: item.detailUrl.replace(/\/detail\//, '/register/'),
      imageUrl,
      place: null,
      city: null,
      formType: 'Event',
      id: idMatch ? Number(idMatch[1]) : undefined,
    });
  }
  return events;
}

// ── Build ────────────────────────────────────────────────────────────────────

function sortByDate(events) {
  return events.sort((a, b) => {
    if (!a.startsAt) return 1;
    if (!b.startsAt) return -1;
    return new Date(a.startsAt) - new Date(b.startsAt);
  });
}

async function main() {
  const collected = [];
  let anySucceeded = false;

  try {
    const hub = await fetchHubEvents();
    collected.push(...hub);
    anySucceeded = true;
    console.log(`[fetch-events] ${hub.length} repair session(s) from ${HUB_URL}`);
  } catch (err) {
    console.warn(`[fetch-events] Hub unavailable (${err.message}).`);
  }

  try {
    const garden = await fetchYaplaGardenEvents();
    collected.push(...garden);
    anySucceeded = true;
    console.log(`[fetch-events] ${garden.length} garden event(s) from Yapla`);
  } catch (err) {
    console.warn(`[fetch-events] Yapla unavailable (${err.message}).`);
  }

  if (!anySucceeded) {
    try {
      await access(OUT);
      console.warn('[fetch-events] Keeping the existing events.json.');
      return;
    } catch {
      console.warn('[fetch-events] No existing events.json — writing an empty list.');
      await mkdir(join(__dirname, '../src/data'), { recursive: true });
      await writeFile(OUT, '[]\n', 'utf8');
      return;
    }
  }

  await mkdir(join(__dirname, '../src/data'), { recursive: true });
  await writeFile(OUT, JSON.stringify(sortByDate(collected), null, 2) + '\n', 'utf8');
  console.log(`[fetch-events] Wrote ${collected.length} event(s) total.`);
}

await main();
