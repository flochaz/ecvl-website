/**
 * Writes src/data/stats.json for the site from the repair hub's public figures
 * ({HUB_URL}/api/public/stats). The Repair Café page shows these as "our
 * impact", the same numbers the hub reports internally.
 *
 * If the hub is unreachable we keep the existing stats.json, so a bad build
 * never empties the numbers on the page.
 *
 * Optional env: HUB_URL (default: the ECVL hub's workers.dev address).
 */

import { writeFile, access, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/data/stats.json');

const HUB_URL = (
  process.env.HUB_URL || 'https://repair-cafe-hub.florianchazal-79f.workers.dev'
).replace(/\/+$/, '');

const UA = 'Mozilla/5.0 (compatible; ECVL-website/1.0)';

async function main() {
  let stats;
  try {
    const res = await fetch(`${HUB_URL}/api/public/stats`, {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`hub responded ${res.status}`);
    const body = await res.json();
    stats = {
      repairCount: Number(body.repairCount ?? 0),
      completedCount: Number(body.completedCount ?? 0),
      objectsSavedKg: Number(body.objectsSavedKg ?? 0),
      eventCount: Number(body.eventCount ?? 0),
      volunteerCount: Number(body.volunteerCount ?? 0),
      successRate: Number(body.successRate ?? 0),
      updatedAt: new Date().toISOString(),
    };
    console.log(
      `[fetch-stats] ${stats.repairCount} repair(s), ${stats.objectsSavedKg} kg saved, from ${HUB_URL}`,
    );
  } catch (err) {
    console.warn(`[fetch-stats] Hub unavailable (${err.message}).`);
    try {
      await access(OUT);
      console.warn('[fetch-stats] Keeping the existing stats.json.');
      return;
    } catch {
      console.warn('[fetch-stats] No existing stats.json — writing zeros.');
      stats = {
        repairCount: 0,
        completedCount: 0,
        objectsSavedKg: 0,
        eventCount: 0,
        volunteerCount: 0,
        successRate: 0,
        updatedAt: null,
      };
    }
  }

  await mkdir(join(__dirname, '../src/data'), { recursive: true });
  await writeFile(OUT, JSON.stringify(stats, null, 2) + '\n', 'utf8');
  console.log('[fetch-stats] Wrote src/data/stats.json.');
}

await main();
