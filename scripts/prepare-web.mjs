import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
async function walk(dir) {
  const list = [];
  for (const f of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) list.push(...(await walk(p)));
    else if (!p.endsWith('.map')) list.push(p);
  }
  return list;
}
let html = await readFile('dist/index.html', 'utf8');
html = html
  .replace('<html lang="en">', '<html lang="pt-BR">')
  .replace(
    'You need to enable JavaScript to run this app.',
    'Ative o JavaScript para usar o ERS Finanças.',
  );
html = html.includes('rel="manifest"')
  ? html
  : html.replace(
      '</head>',
      '<link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#151719"><link rel="apple-touch-icon" href="/icon-192.png"></head>',
    );
await writeFile('dist/index.html', html);
const assets = (await walk('dist')).filter((f) => !f.endsWith('coi-serviceworker.js'));
const hash = createHash('sha256');
for (const f of assets) hash.update(await readFile(f));
const source = await readFile('public/coi-serviceworker.js', 'utf8');
await writeFile(
  'dist/coi-serviceworker.js',
  source
    .replace(
      /\/\*BUILD_CACHE\*\/\s*null/,
      JSON.stringify('ers-financas-' + hash.digest('hex').slice(0, 12)),
    )
    .replace(
      /\/\*BUILD_ASSETS\*\/\s*\[\]/,
      JSON.stringify(assets.map((f) => '/' + path.relative('dist', f).split(path.sep).join('/'))),
    ),
);
console.log(`PWA preparada: ${assets.length} arquivos no cache.`);
