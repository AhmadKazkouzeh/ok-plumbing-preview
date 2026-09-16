/**
 * Runs every check against the built site.
 *   npm run build && npm run preview   (in one terminal)
 *   npm test                           (in another)
 */
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const files = readdirSync(new URL('.', import.meta.url))
  .filter((f) => /^\d\d.*\.mjs$/.test(f) && f !== 'run-all.mjs')
  .sort();

let failed = 0;
for (const f of files) {
  process.stdout.write(`\n=== ${f} ===\n`);
  const r = spawnSync(process.execPath, [fileURLToPath(new URL(f, import.meta.url))], {
    stdio: 'inherit',
  });
  if (r.status !== 0) failed++;
}
process.exit(failed ? 1 : 0);
