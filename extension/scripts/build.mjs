// Builds dist/chrome and dist/firefox from src/ (plus .zip files for the stores).
// The only per-browser difference is the manifest: Chrome runs the background as a
// service worker, Firefox as an event page and needs an add-on id.
//
//   node scripts/build.mjs           # both browsers + zips
//   node scripts/build.mjs --no-zip
//   node scripts/build.mjs --site=http://localhost:5173   # dev build against a local site, no zips

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const dist = join(root, 'dist');
const site = process.argv.find((a) => a.startsWith('--site='))?.split('=')[1];
const zip = !process.argv.includes('--no-zip') && !site;
const PROD_SITE = 'https://www.chineseplus.club';

if (!existsSync(join(src, 'data', 'dict.tsv'))) {
  console.error(
    'src/data/dict.tsv is missing. Export it first:\n' +
      '  cd server && node scripts/export-extension-dict.js',
  );
  process.exit(1);
}

const base = JSON.parse(readFileSync(join(src, 'manifest.json'), 'utf8'));
if (site) base.host_permissions.push(`${new URL(site).origin}/*`);

const targets = {
  chrome: {
    ...base,
    background: { service_worker: 'background.js' },
  },
  firefox: {
    ...base,
    background: { scripts: ['background.js'] },
    browser_specific_settings: {
      gecko: {
        id: 'extension@chineseplus.club',
        strict_min_version: '128.0',
        data_collection_permissions: { required: ['authenticationInfo'] },
      },
    },
  },
};

rmSync(dist, { recursive: true, force: true });
for (const [browser, manifest] of Object.entries(targets)) {
  const out = join(dist, browser);
  mkdirSync(out, { recursive: true });
  cpSync(src, out, {
    recursive: true,
    filter: (path) => !path.endsWith('manifest.json') && !path.endsWith('.DS_Store'),
  });
  writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  if (site) {
    const bg = join(out, 'background.js');
    const code = readFileSync(bg, 'utf8');
    if (!code.includes(`const SITE = '${PROD_SITE}';`)) throw new Error('SITE constant not found');
    writeFileSync(bg, code.replace(`const SITE = '${PROD_SITE}';`, `const SITE = '${new URL(site).origin}';`));
  }

  if (zip) {
    const file = join(dist, `chineseplus-${browser}-${manifest.version}.zip`);
    execFileSync('zip', ['-qr', '-X', file, '.'], { cwd: out });
    console.log(`${browser}: ${file}`);
  } else {
    console.log(`${browser}: ${out}`);
  }
}
