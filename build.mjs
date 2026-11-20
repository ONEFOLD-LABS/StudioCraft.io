// Builds the static StudioCraft website into dist/ (ready for GitHub Pages).
import { mkdir, rm, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './src/layout.mjs';
import { artFiles } from './src/art.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
const pages = ['home', 'features', 'engine', 'mcp', 'download'];

await rm(out, { recursive: true, force: true });
for (const d of ['fonts', 'brand', 'screens']) await mkdir(join(out, 'assets', d), { recursive: true });

for (const name of pages) {
  const mod = await import(`./src/pages/${name}.mjs`);
  const { meta } = mod;
  const base = meta.path ? '../' : './';
  const html = page({ base, active: meta.active, title: meta.title, description: meta.description, body: mod.body(base), cta: meta.cta !== false });
  const dir = join(out, meta.path);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
  console.log('page', '/' + meta.path);
}

for (const [file, item] of artFiles) {
  if (item.copy) await copyFile(item.copy, join(out, 'assets', 'screens', file));
  else await writeFile(join(out, 'assets', 'screens', file), item.svg);
}
await copyFile(join(root, 'src', 'styles.css'), join(out, 'assets', 'styles.css'));
await copyFile(join(root, 'src', 'site.js'), join(out, 'assets', 'site.js'));
for (const f of ['icon.svg', 'icon-small.svg', 'icon-256.png']) await copyFile(join(root, 'src', 'brand', f), join(out, 'assets', 'brand', f));
await writeFile(join(out, '.nojekyll'), '');

const fonts = [
  ['@fontsource/ubuntu/files/ubuntu-latin-300-normal.woff2', 'ubuntu-latin-300-normal.woff2'],
  ['@fontsource/ubuntu/files/ubuntu-latin-400-normal.woff2', 'ubuntu-latin-400-normal.woff2'],
  ['@fontsource/ubuntu/files/ubuntu-latin-500-normal.woff2', 'ubuntu-latin-500-normal.woff2'],
  ['@fontsource/ubuntu/files/ubuntu-latin-700-normal.woff2', 'ubuntu-latin-700-normal.woff2'],
  ['@fontsource/ubuntu-mono/files/ubuntu-mono-latin-400-normal.woff2', 'ubuntu-mono-latin-400-normal.woff2'],
];
for (const [src, name] of fonts) await copyFile(join(root, 'node_modules', src), join(out, 'assets', 'fonts', name));
console.log('done →', out);
