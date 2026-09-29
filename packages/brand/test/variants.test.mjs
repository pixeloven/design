import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const registry = JSON.parse(readFileSync(join(root, "marks.json"), "utf8"));
const tokens = JSON.parse(readFileSync(require.resolve("@pixeloven/tokens/source"), "utf8"));
const read = (file) => readFileSync(join(root, file), "utf8");
const flatten = (value) => typeof value === "string" ? [value] : Object.values(value).flatMap(flatten);
const files = (directory) => readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
  const file = join(directory, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});
const paths = (svg) => [...svg.matchAll(/<path\b[^>]*\/>/g)].map(([path]) => path.trim());
const render = (svg, size = 64) => new Resvg(svg, { fitTo: { mode: "width", value: size }, font: { loadSystemFonts: false } }).render();

// Approved geometry. These independent fixtures protect the selected figures
// while titles, packaging and canonical token values can evolve.
const approved = {
  "pixeloven/solid": [
    '<path fill="currentColor" fill-rule="evenodd" d="M12 7H40L54 21V35L43 46H26V57H12ZM26 20V33H36L41 28L33 20Z"/>',
  ],
  "lattice/solid": [
    '<path fill="currentColor" fill-rule="evenodd" d="M32 5L59 32L32 59L5 32ZM32 14L39 21L32 28L25 21ZM50 32L43 39L36 32L43 25ZM32 50L25 43L32 36L39 43ZM14 32L21 25L28 32L21 39Z"/>',
  ],
  "pixeloven/inset": [
    '<path fill="currentColor" fill-rule="evenodd" d="M16 6H48L58 16V48L48 58H16L6 48V16ZM19 16H35L46 27V34L38 42H28V50H19ZM28 25V33H34L38 29L34 25Z"/>',
  ],
  "lattice/inset": [
    '<path fill="currentColor" fill-rule="evenodd" d="M16 6H48L58 16V48L48 58H16L6 48V16ZM32 13L13 32L32 51L51 32Z"/>',
    '<path fill="none" stroke="currentColor" stroke-width="5" d="M22.5 22.5L41.5 41.5M22.5 41.5L41.5 22.5"/>',
  ],
};

test("variant source and generated directories agree with the registry in both directions", () => {
  const variants = registry.marks.flatMap((mark) => Object.values(mark.variants));
  const sources = variants.map(({ source }) => source);
  const generated = variants.flatMap(({ assets }) => flatten(assets));
  assert.deepEqual(files("sources").sort(), sources.sort());
  assert.deepEqual(files("dist/assets").sort(), generated.sort());
  assert.equal(new Set([...sources, ...generated]).size, sources.length + generated.length, "asset paths must be unique");
  for (const file of [...sources, ...generated]) {
    assert.equal(relative(root, require.resolve(`@pixeloven/brand/${file}`)), file);
  }
});

test("identity variants have a complete, role-specific contract", () => {
  assert.equal(new Set(registry.marks.map(({ id }) => id)).size, registry.marks.length);
  assert.equal(registry.assetContract.version, 1);
  assert.equal(registry.assetContract.inkToken, "text.base");
  assert.equal(registry.assetContract.backgroundToken, "surface.bg");
  assert.deepEqual(registry.assetContract.lockup, { font: "IBM Plex Sans", weight: 500, fontSize: 40, letterSpacingEm: -0.025, gap: 12 });
  for (const mark of registry.marks) {
    assert.deepEqual(Object.keys(mark.variants).sort(), ["inset", "solid"]);
    for (const [variant, definition] of Object.entries(mark.variants)) {
      assert.ok(definition.figure.length > 12);
      assert.ok(definition.usage.length > 12);
      assert.equal(definition.clearSpace.viewBoxUnits, 8);
      assert.deepEqual(Object.keys(definition.assets).sort(), ["dark", "light"]);
      for (const assets of Object.values(definition.assets)) {
        assert.deepEqual(Object.keys(assets).sort(), variant === "solid" ? ["lockup", "mark"] : ["app", "favicon", "mark", "maskable"]);
        if (variant === "inset") {
          assert.deepEqual(Object.keys(assets.favicon).sort(), ["png16", "png32", "svg"]);
          assert.deepEqual(Object.keys(assets.app).sort(), ["png180", "png192", "png512", "svg"]);
          assert.deepEqual(Object.keys(assets.maskable).sort(), ["png192", "png512", "svg"]);
        }
      }
    }
  }
});

for (const mark of registry.marks) {
  for (const [variant, definition] of Object.entries(mark.variants)) {
    test(`${mark.id}/${variant} preserves the approved source geometry`, () => {
      const source = read(definition.source);
      assert.deepEqual(paths(source), approved[`${mark.id}/${variant}`]);
      assert.match(source, /viewBox="0 0 64 64"/);
      assert.match(source, /<title>[^<]+<\/title>/);
      assert.match(source, /role="img"/);
      assert.match(source, /aria-label="[^"]+"/);
      assert.doesNotMatch(source, /#[\da-f]{3,8}\b|<image\b|<text\b|<style\b/i);
      // Source masters intentionally inherit ink only when inlined.
      for (const [, paint] of source.matchAll(/(?:fill|stroke)="([^"]+)"/g)) assert.ok(["none", "currentColor"].includes(paint));
      assert.doesNotThrow(() => render(source));
    });

    for (const [scheme, assets] of Object.entries(definition.assets)) {
      const ink = tokens.text.base[scheme];
      const ground = tokens.surface.bg[scheme];
      const svgs = flatten(assets).filter((file) => file.endsWith(".svg"));
      test(`${mark.id}/${variant}/${scheme} assets are standalone, accessible SVGs with explicit canonical inks`, () => {
        for (const file of svgs) {
          const svg = read(file);
          assert.match(svg, /<title>[^<]+<\/title>/);
          assert.match(svg, /role="img"/);
          assert.match(svg, /aria-label="[^"]+"/);
          assert.doesNotMatch(svg, /currentColor|var\(|<text\b|<image\b|<style\b|\bstyle=|\bhref=|<script\b|\bon\w+=/i);
          assert.match(svg, /fill="#[\da-f]{6}"/i);
          const palette = new Set([ink, ground, "none"]);
          for (const [, paint] of svg.matchAll(/(?:fill|stroke|stop-color|color)="([^"]+)"/g)) assert.ok(palette.has(paint), `${file}: noncanonical paint ${paint}`);
          for (const [, comment] of svg.matchAll(/<!--([\s\S]*?)-->/g)) assert.ok(!comment.includes("--"));
          const raster = render(svg);
          assert.ok(raster.pixels.some((channel, index) => index % 4 === 3 && channel > 0), `${file} rendered blank`);
        }
        assert.deepEqual(paths(read(assets.mark)), approved[`${mark.id}/${variant}`].map((path) => path.replaceAll("currentColor", ink)));
        assert.match(read(assets.mark), /viewBox="0 0 64 64"/);
      });

      if (variant === "solid") {
        test(`${mark.id}/${scheme} lockup is outlined Plex lettering beside the unmodified Solid mark`, () => {
          const lockup = read(assets.lockup);
          const markPaths = approved[`${mark.id}/solid`].map((path) => path.replaceAll("currentColor", ink));
          assert.deepEqual(paths(lockup).slice(0, markPaths.length), markPaths);
          assert.equal(paths(lockup).length, markPaths.length + mark.name.length);
          assert.doesNotMatch(lockup, /font-family|<text\b|@font-face/);
          const rendered = render(lockup, 600);
          const inkPixels = [...rendered.pixels].filter((_, index) => index % 4 === 3);
          assert.ok(inkPixels.some((alpha) => alpha === 255));
        });
      } else {
        test(`${mark.id}/${scheme} PNGs match their registered SVGs at the declared sizes`, () => {
          for (const kind of ["favicon", "app", "maskable"]) {
            const set = assets[kind];
            for (const [format, file] of Object.entries(set)) {
              if (format === "svg") continue;
              const size = Number(format.slice(3));
              const buffer = readFileSync(join(root, file));
              assert.deepEqual(buffer.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
              assert.equal(buffer.readUInt32BE(16), size);
              assert.equal(buffer.readUInt32BE(20), size);
              const expected = render(read(set.svg), size);
              assert.deepEqual(buffer, expected.asPng(), `${file} is not the registered ${kind} artwork`);
              assert.ok(expected.pixels.every((channel, index) => index % 4 !== 3 || channel === 255), `${kind} needs an opaque ground`);
            }
          }
        });

        test(`${mark.id}/${scheme} maskable icon keeps all foreground inside the platform safe circle`, () => {
          const size = 512;
          const raster = render(read(assets.maskable.svg), size);
          const pixels = raster.pixels;
          const background = [1, 3, 5].map((start) => parseInt(ground.slice(start, start + 2), 16));
          const safeRadius = size * 0.4;
          for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
            const start = (y * size + x) * 4;
            if (background.some((channel, index) => pixels[start + index] !== channel)) {
              assert.ok(Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) <= safeRadius, "foreground escaped the safe circle");
            }
          }
        });
      }
    }
  }
}
