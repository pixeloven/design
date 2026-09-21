import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(new URL("../src/tokens.json", import.meta.url)));
const metrics = {
  body: [16, 24, "400", "sans"],
  control: [14, 20, "500", "sans"],
  input: [16, 24, "400", "sans"],
  code: [14, 22, "400", "mono"],
};

test("reading roles preserve approved default metrics and scale with the root font", () => {
  assert.deepEqual(Object.keys(raw.reading ?? {}).filter(k => k !== "$comment").sort(), Object.keys(metrics).sort());
  for (const [role, [size, lead, weight, family]] of Object.entries(metrics)) {
    const entry = raw.reading[role];
    for (const [metric, pixels] of [["size", size], ["lineHeight", lead]]) {
      assert.match(entry[metric].value, /^\d+(?:\.\d+)?rem$/);
      assert.equal(parseFloat(entry[metric].value) * 16, pixels);
      assert.equal(parseFloat(entry[metric].value) * 32, pixels * 2);
    }
    assert.equal(entry.weight.value, weight);
    assert.equal(entry.letterSpacing.value, "0em");
    assert.equal(entry.fontFamily.value, raw.font[family].value);
  }
});

test("reading metrics and font stacks reach all supported consumption paths", async () => {
  const { default: tokens } = await import("../dist/tokens.js");
  const flat = JSON.parse(readFileSync(new URL("../dist/tokens.json", import.meta.url)));
  const types = readFileSync(new URL("../dist/tokens.d.ts", import.meta.url), "utf8");
  for (const scheme of raw.meta.schemes) {
    const css = readFileSync(new URL(`../dist/tokens-${scheme}.css`, import.meta.url), "utf8");
    const responsive = readFileSync(new URL("../dist/tokens.css", import.meta.url), "utf8");
    for (const role of Object.keys(metrics)) {
      for (const metric of ["size", "lineHeight", "weight", "letterSpacing", "fontFamily"]) {
        const jsName = `reading${role[0].toUpperCase()}${role.slice(1)}${metric[0].toUpperCase()}${metric.slice(1)}`;
        const cssName = `reading-${role}-${metric.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
        const value = raw.reading[role][metric].value;
        assert.equal(tokens[scheme][jsName], value);
        assert.equal(flat[scheme][cssName], value);
        assert.ok(types.includes(`${jsName}: string;`));
        for (const sheet of [css, responsive]) assert.ok(sheet.includes(`--pxo-${cssName}: ${value};`));
      }
    }
  }
});
