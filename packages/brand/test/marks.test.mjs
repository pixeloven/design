/**
 * Mark tests.
 *
 * The brand rules are worth nothing as prose. "Sub-brands vary the figure, never
 * the palette" is a sentence anybody can agree with and then quietly break with
 * one hex value — which is exactly what happened to pixeloven.com, where the
 * parent brand ended up sharing zero colours with anything it shipped.
 *
 * So the rules are asserted here against @pixeloven/tokens. A mark that invents
 * a colour fails the build.
 *
 * Run with: node --test
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const registry = JSON.parse(readFileSync(join(root, "marks.json"), "utf8"));

const tokens = JSON.parse(readFileSync(join(root, "..", "tokens", "src", "tokens.json"), "utf8"));

/** Every colour the design system defines, in either scheme. */
const PALETTE = new Set(
  Object.entries(tokens)
    .filter(([g]) => !["meta", "$comment", "font"].includes(g))
    .flatMap(([, entries]) =>
      Object.entries(entries)
        .filter(([k]) => k !== "$comment")
        .flatMap(([, e]) => tokens.meta.schemes.map((s) => e[s]).filter(Boolean)),
    )
    .map((c) => c.toLowerCase()),
);

const marks = registry.marks.map((m) => ({ ...m, svg: readFileSync(join(root, m.file), "utf8") }));

test("the registry and the marks directory agree", () => {
  // An orphan SVG ships nothing and a dangling entry breaks a consumer; both are
  // silent unless something looks.
  const onDisk = readdirSync(join(root, "marks")).filter((f) => f.endsWith(".svg")).sort();
  const listed = registry.marks.map((m) => basename(m.file)).sort();
  assert.deepEqual(onDisk, listed, "marks/ and marks.json list different files");
});

test("exactly one parent mark exists", () => {
  const parents = registry.marks.filter((m) => m.tier === "parent");
  assert.equal(parents.length, 1, `expected 1 parent mark, found ${parents.length}`);
});

for (const mark of marks) {
  test(`[${mark.id}] uses only design-system colours`, () => {
    // THE rule, enforced. The oven orange (#ff5722) would fail here, which is
    // the point: it is how the parent brand drifted away from its own products.
    // Comments are stripped first: they legitimately cite retired colours in
    // order to explain why they are retired. Only rendered values are checked.
    const rendered = mark.svg.replace(/<!--[\s\S]*?-->/g, "");
    const used = [...rendered.matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0].toLowerCase());
    assert.ok(used.length > 0, "mark defines no colours at all");
    for (const colour of used) {
      assert.ok(
        PALETTE.has(colour),
        `${colour} is not a design-system token — marks vary the figure, never the palette`,
      );
    }
  });

  test(`[${mark.id}] is a well-formed, accessible, scalable mark`, () => {
    assert.match(mark.svg, /viewBox="0 0 64 64"/, "must use the shared 0 0 64 64 viewBox");
    assert.match(mark.svg, /<title>/, "must carry a <title> for assistive tech");
    assert.match(mark.svg, /role="img"/, 'must carry role="img"');
    assert.match(mark.svg, /aria-label="/, "must carry an aria-label");
    // Raster content cannot scale and defeats the point of shipping SVG.
    assert.doesNotMatch(mark.svg, /<image\b/, "must not embed a raster image");
  });

  test(`[${mark.id}] has no XML-illegal comment content`, () => {
    // A real bug this caught once: writing CSS custom property names (--pxo-...)
    // inside an SVG comment. `--` is illegal in XML comments, and the resulting
    // file renders as a BLANK ICON rather than raising an error anywhere.
    for (const [, body] of mark.svg.matchAll(/<!--([\s\S]*?)-->/g)) {
      assert.ok(!body.includes("--"), `comment contains "--", which is illegal in XML`);
    }
  });

  test(`[${mark.id}] documents its figure in the registry`, () => {
    // A mark whose idea is not written down gets redrawn subtly differently the
    // next time somebody needs it larger.
    assert.ok(mark.figure && mark.figure.length > 12, "registry entry needs a `figure` description");
  });
}
