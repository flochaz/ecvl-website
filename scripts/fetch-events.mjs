/**
 * Fetches upcoming events from HelloAsso at build time.
 * Requires env vars:
 *   HELLOASSO_CLIENT_ID
 *   HELLOASSO_CLIENT_SECRET
 *   HELLOASSO_ORG_SLUG  (e.g. "ecologie-citoyenne-villeneuve-loubet")
 *
 * Output: src/data/events.json
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const clientId = process.env.HELLOASSO_CLIENT_ID;
const clientSecret = process.env.HELLOASSO_CLIENT_SECRET;
const orgSlug = process.env.HELLOASSO_ORG_SLUG;

if (!clientId || !clientSecret || !orgSlug) {
  console.warn(
    '[fetch-events] Missing HELLOASSO_* env vars — writing empty events.json.',
  );
  await writeEmptyEvents();
  process.exit(0);
}

async function getToken() {
  const res = await fetch('https://api.helloasso.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function fetchEvents(token) {
  const url = new URL(
    `https://api.helloasso.com/v5/organizations/${orgSlug}/forms`,
  );
  url.searchParams.set('formType', 'Event');
  url.searchParams.set('states', 'Public');
  url.searchParams.set('pageSize', '20');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`);
  return res.json();
}

async function writeEmptyEvents() {
  const outDir = join(__dirname, '../src/data');
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'events.json'), JSON.stringify([], null, 2));
}

try {
  const token = await getToken();
  const json = await fetchEvents(token);
  const now = new Date();
  const events = (json.data ?? [])
    .filter((e) => e.startDate && new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 6)
    .map((e) => ({
      title: e.title,
      description: e.description ?? '',
      startsAt: e.startDate,
      endsAt: e.endDate,
      url: e.url,
      imageUrl: e.banner ?? null,
      place: e.place?.address ?? null,
      city: e.place?.city ?? null,
    }));

  const outDir = join(__dirname, '../src/data');
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'events.json'), JSON.stringify(events, null, 2));
  console.log(`[fetch-events] Wrote ${events.length} events to src/data/events.json`);
} catch (err) {
  console.error('[fetch-events] Error:', err.message);
  await writeEmptyEvents();
}
