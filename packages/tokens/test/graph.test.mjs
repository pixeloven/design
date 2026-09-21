import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { contrastRatio, parseHex, perceptualDistance, toLab, VISION_MODELS } from "../test-support/color.mjs";

const raw = JSON.parse(readFileSync(new URL("../src/tokens.json", import.meta.url)));
const origins = ["wikilink", "embed", "tag", "dataview", "frontmatterRef", "canvas"];
const typed = origins.slice(1, 5);
const pairs = items => items.flatMap((a, i) => items.slice(i + 1).map(b => [a, b]));

for (const scheme of raw.meta.schemes) {
  test(`[${scheme}] graph retains Lattice's hue, neutral and pattern contract`, () => {
    const color = origin => raw.graphOrigin?.[origin]?.[scheme];
    for (const origin of origins) {
      assert.match(color(origin) ?? "", /^#[0-9a-f]{6}$/i);
      assert.ok(contrastRatio(color(origin), raw.graph.canvas[scheme]) >= 3, `${origin}: canvas contrast`);
    }
    for (const model of VISION_MODELS) {
      for (const [a, b] of pairs(typed)) {
        assert.ok(perceptualDistance(color(a), color(b), model) >= 15, `${a}/${b} under ${model}`);
      }
      for (const origin of typed) {
        assert.ok(perceptualDistance(color("wikilink"), color(origin), model) >= 12, `neutral/${origin} under ${model}`);
      }
    }
    for (const [a, b] of pairs(origins)) {
      if (color(a) === color(b)) assert.notEqual(raw.graphPattern[a].value, raw.graphPattern[b].value);
    }
    const chroma = hex => { const { a, b } = toLab(parseHex(hex)); return Math.hypot(a, b); };
    assert.ok(chroma(color("wikilink")) < Math.min(...typed.map(o => chroma(color(o)))) / 2);
    assert.equal(raw.graphPattern.wikilink.value, "solid");
    assert.equal(raw.graphPattern.canvas.value, "dashed");
  });

  test(`[${scheme}] graph and browser aliases, essential states and focus have declared grounds`, () => {
    assert.equal(raw.graph?.canvas[scheme], raw.surface.canvas[scheme]);
    assert.equal(raw.browser.theme[scheme], raw.surface.void[scheme]);
    for (const group of ["graph", "graphOrigin", "browser", "interaction"]) {
      for (const [name, entry] of Object.entries(raw[group])) {
        if (name === "$comment") continue;
        assert.ok(entry.use.length > 8);
        assert.ok(entry.on || entry.role === "ground" || entry.role === "light", `${group}.${name}: declare ground or radiance`);
        if (!entry.minContrast) continue;
        for (const path of entry.on) {
          const [g, k] = path.split(".");
          assert.ok(contrastRatio(entry[scheme], raw[g][k][scheme]) >= entry.minContrast, `${group}.${name} on ${path}`);
        }
      }
    }
  });

  test(`[${scheme}] graph roles and patterns reach CSS, JS, JSON and types`, async () => {
    const { default: tokens } = await import("../dist/tokens.js");
    const flat = JSON.parse(readFileSync(new URL("../dist/tokens.json", import.meta.url)));
    const types = readFileSync(new URL("../dist/tokens.d.ts", import.meta.url), "utf8");
    const sheets = ["tokens.css", `tokens-${scheme}.css`].map(file => readFileSync(new URL(`../dist/${file}`, import.meta.url), "utf8"));
    for (const group of ["graph", "graphOrigin", "graphPattern", "browser", "interaction"]) {
      assert.ok(raw[group], `missing ${group}`);
      for (const [key, entry] of Object.entries(raw[group])) {
        if (key === "$comment") continue;
        const jsName = `${group}${key[0].toUpperCase()}${key.slice(1)}`;
        const cssName = `${group}-${key}`.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
        const value = entry.value ?? entry[scheme];
        assert.equal(tokens[scheme][jsName], value);
        assert.equal(flat[scheme][cssName], value);
        assert.ok(types.includes(`${jsName}: string;`));
        for (const css of sheets) assert.ok(css.includes(`--pxo-${cssName}: ${value};`));
      }
    }
  });
}
