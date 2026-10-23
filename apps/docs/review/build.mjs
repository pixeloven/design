import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = join(root, 'dist');
await build({
  configFile: false, root, base: './', logLevel: 'warn',
  esbuild: { jsx: 'automatic' },
  build: { outDir, emptyOutDir: true, assetsInlineLimit: Infinity, cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } } },
});
let html = await readFile(join(outDir, 'index.html'), 'utf8');
for (const match of [...html.matchAll(/<script\b[^>]*src="([^\"]+)"[^>]*><\/script>/g)]) {
  const code = await readFile(join(outDir, match[1]), 'utf8');
  html = html.replace(match[0], () => `<script type="module">${code.replace(/<\/script/gi, '<\\/script')}</script>`);
}
for (const match of [...html.matchAll(/<link\b[^>]*href="([^\"]+\.css)"[^>]*>/g)]) {
  const css = await readFile(join(outDir, match[1]), 'utf8');
  html = html.replace(match[0], () => `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`);
}
const fontLicense = await readFile(new URL('../../../packages/brand/LICENSES/IBM-Plex-OFL.txt', import.meta.url), 'utf8');
html = html.replace('</body>', () => `<script type="application/json" id="font-license">${JSON.stringify({ license: fontLicense }).replace(/<\/script/gi, '<\\/script')}</script></body>`);
await writeFile(join(outDir, 'warden-review.html'), html);
console.log('Portable review: apps/docs/review/dist/warden-review.html');
