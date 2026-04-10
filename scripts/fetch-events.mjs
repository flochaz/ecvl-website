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

async function fetchForms(token, formType) {
  const url = new URL(
    `https://api.helloasso.com/v5/organizations/${orgSlug}/forms`,
  );
  url.searchParams.set('formType', formType);
  url.searchParams.set('states', 'Public');
  url.searchParams.set('pageSize', '50');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Fetch failed for ${formType}: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

async function writeEmptyEvents() {
  const outDir = join(__dirname, '../src/data');
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'events.json'), JSON.stringify([], null, 2));
}

try {
  const token = await getToken();

  // Fetch both Event and Membership form types in parallel
  const [eventForms, membershipForms] = await Promise.all([
    fetchForms(token, 'Event'),
    fetchForms(token, 'Membership'),
  ]);

  const now = new Date();

  // Deduplicate by URL (API may return overlapping results across formType calls)
  const seen = new Set();
  const allForms = [...eventForms, ...membershipForms].filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });

  const events = allForms
    // Keep forms with a future start date OR no start date (ongoing/permanent)
    .filter((e) => !e.startDate || new Date(e.startDate) >= now)
    // Sort: dated events first (ascending), then undated ones at the end
    .sort((a, b) => {
      if (a.startDate && b.startDate) return new Date(a.startDate) - new Date(b.startDate);
      if (a.startDate) return -1;
      if (b.startDate) return 1;
      return 0;
    })
    .slice(0, 9)
    .map((e) => ({
      title: e.title,
      description: e.description ?? '',
      startsAt: e.startDate ?? null,
      endsAt: e.endDate ?? null,
      url: e.url,
      imageUrl: e.banner?.publicUrl ?? null,
      place: e.place?.address ?? null,
      city: e.place?.city ?? null,
      formType: e.formType,
    }));

  const outDir = join(__dirname, '../src/data');
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'events.json'), JSON.stringify(events, null, 2));
  console.log(`[fetch-events] Wrote ${events.length} events to src/data/events.json`);
} catch (err) {
  console.error('[fetch-events] Error:', err.message);
  await writeEmptyEvents();
}
