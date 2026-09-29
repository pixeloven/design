import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { Resvg } from "@resvg/resvg-js";
import { openSync } from "fontkit";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const registry = JSON.parse(readFileSync(join(root, "marks.json"), "utf8"));
const tokens = JSON.parse(readFileSync(require.resolve("@pixeloven/tokens/source"), "utf8"));
const font = openSync(require.resolve("@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff"));

const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const number = (value) => Number(value.toFixed(6));
const token = (path, scheme) => path.split(".").reduce((value, key) => value[key], tokens)[scheme];

function svg(title, body, width = 64) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 64" width="${width}" height="64" role="img" aria-label="${escape(title)}">\n  <title>${escape(title)}</title>\n${body}\n</svg>\n`;
}

function emit(file, content) {
  if (!file.startsWith("dist/assets/") || file.includes("..")) throw new Error(`Invalid asset path: ${file}`);
  const destination = join(root, file);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content);
}

function icon(title, body, background, scale = 1) {
  const inset = number((64 - 64 * scale) / 2);
  const artwork = scale === 1 ? body : `  <g transform="translate(${inset} ${inset}) scale(${scale})">\n${body}\n  </g>`;
  return svg(title, `  <rect width="64" height="64" fill="${background}"/>\n${artwork}`);
}

function lockup(name, body, ink) {
  const { fontSize, letterSpacingEm, gap } = registry.assetContract.lockup;
  const scale = fontSize / font.unitsPerEm;
  // Retain kerning. Disable optional ligatures so the specified tracking is
  // applied between each letter of these two approved names.
  const run = font.layout(name, { liga: false });
  let x = 0;
  const glyphs = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [index, glyph] of run.glyphs.entries()) {
    const position = run.positions[index];
    const gx = x + position.xOffset;
    const gy = position.yOffset;
    const { bbox } = glyph;
    minX = Math.min(minX, gx + bbox.minX);
    maxX = Math.max(maxX, gx + bbox.maxX);
    minY = Math.min(minY, gy + bbox.minY);
    maxY = Math.max(maxY, gy + bbox.maxY);
    glyphs.push(`      <path transform="translate(${number(gx)} ${number(gy)})" d="${glyph.path.toSVG()}"/>`);
    x += position.xAdvance + letterSpacingEm * font.unitsPerEm;
  }
  // Centre the visible lettering on the unchanged 64-unit mark canvas. Give
  // the wordmark a fixed gap after that canvas and 8 units of trailing space.
  const start = 64 + gap - minX * scale;
  const baseline = 32 + ((maxY + minY) * scale) / 2;
  const width = Math.ceil(start + maxX * scale + 8);
  const outline = `  <g fill="${ink}" transform="translate(${number(start)} ${number(baseline)}) scale(${number(scale)} ${number(-scale)})">\n${glyphs.join("\n")}\n  </g>`;
  return svg(name, `${body}\n${outline}`, width);
}

function emitIconSet(files, content) {
  emit(files.svg, content);
  for (const [kind, file] of Object.entries(files)) {
    if (kind === "svg") continue;
    const size = Number(kind.replace("png", ""));
    if (!Number.isInteger(size) || size <= 0) throw new Error(`Invalid PNG size: ${kind}`);
    const png = new Resvg(content, { fitTo: { mode: "width", value: size }, font: { loadSystemFonts: false } }).render().asPng();
    emit(file, png);
  }
}

rmSync(join(root, "dist", "assets"), { recursive: true, force: true });
for (const mark of registry.marks) {
  for (const [variant, definition] of Object.entries(mark.variants)) {
    const source = readFileSync(join(root, definition.source), "utf8");
    const body = source.replace(/^[\s\S]*?<title>[^<]*<\/title>\s*/, "").replace(/\s*<\/svg>\s*$/, "");
    for (const [scheme, assets] of Object.entries(definition.assets)) {
      const ink = token(registry.assetContract.inkToken, scheme);
      const background = token(registry.assetContract.backgroundToken, scheme);
      if (!/^#[\da-f]{6}$/i.test(ink) || !/^#[\da-f]{6}$/i.test(background)) throw new Error(`Invalid ${scheme} brand tokens`);
      const rendered = body.replaceAll("currentColor", ink);
      emit(assets.mark, svg(`${mark.name} — ${variant}`, rendered));
      if (assets.lockup) emit(assets.lockup, lockup(mark.name, rendered, ink));
      if (assets.favicon) emitIconSet(assets.favicon, icon(`${mark.name} favicon`, rendered, background));
      if (assets.app) emitIconSet(assets.app, icon(`${mark.name} app icon`, rendered, background));
      if (assets.maskable) emitIconSet(assets.maskable, icon(`${mark.name} maskable icon`, rendered, background, registry.assetContract.maskable.scale));
    }
  }
}
