#!/usr/bin/env node
/**
 * Downloads all nonprofit logos from nonprofits.json to public/logos/
 * and updates the JSON to use local paths (logos/0.jpg, etc.).
 * Run: node scripts/download-logos.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const jsonPath = path.join(projectRoot, 'src', 'pages', 'nonprofits.json');
const logosDir = path.join(projectRoot, 'public', 'logos');

function getExt(url) {
  try {
    const p = new URL(url).pathname.toLowerCase();
    if (p.endsWith('.png')) return 'png';
    if (p.endsWith('.jpeg') || p.endsWith('.jpg')) return 'jpg';
    if (p.endsWith('.gif')) return 'gif';
    if (p.endsWith('.webp')) return 'webp';
  } catch {}
  return 'jpg';
}

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LogoDownload/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('Expected JSON array');

  fs.mkdirSync(logosDir, { recursive: true });
  const updated = [];
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const url = item.logo?.trim();
    if (!url) {
      updated.push({ ...item, logo: '' });
      fail++;
      continue;
    }
    const ext = getExt(url);
    const filename = `${i}.${ext}`;
    const localPath = path.join(logosDir, filename);
    const publicPath = `logos/${filename}`;

    try {
      const buf = await download(url);
      fs.writeFileSync(localPath, buf);
      updated.push({ ...item, logo: publicPath });
      ok++;
      process.stdout.write(`  ${i + 1}/${data.length} ${filename}\n`);
    } catch (err) {
      console.warn(`  ${i + 1}/${data.length} FAIL ${url}: ${err.message}`);
      updated.push({ ...item }); // keep original URL as fallback
      fail++;
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
  console.log(`\nDone. Saved ${ok} logos to public/logos/. Failed: ${fail}. Updated ${jsonPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
