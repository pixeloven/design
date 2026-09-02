/**
 * Token tests.
 *
 * These are not decoration. Two of them encode the exact defects that made this
 * package necessary, found by measuring the two copies this system replaces:
 *
 *   - harmony's surface ramp INVERTED: border-muted (L=0.01879) sat below
 *     surface-hover (L=0.01961), so a "stronger" border was darker than the
 *     surface it bordered. Nothing caught it because nothing looked.
 *   - harmony's `dim` scored 4.47:1 on surface — failing WCAG AA body text by
 *     0.03, which no one would ever catch by eye.
 *
 * A ramp that is only checked by looking at it is not checked. Run with:
 *   node --test
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(here, "..", "src", "tokens.json"), "utf8"));

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const luminance = (c) => {
  const [r, g, b] = hex(c).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const v = (group, key) => raw[group][key].value;

// The elevation ladder, in the order it is meant to ascend. Borders continue
// the surface ramp rather than forming a separate scale.
const LADDER = [
  ["surface", "void"],
  ["surface", "canvas"],
  ["surface", "bg"],
  ["surface", "base"],
  ["surface", "hover"],
  ["surface", "raised"],
  ["border", "muted"],
  ["border", "base"],
  ["border", "strong"],
  ["border", "accent"],
];

test("the elevation ladder is strictly monotonic", () => {
  // The regression guard. harmony's copy failed exactly here.
  let prev = -Infinity;
  let prevName = "(start)";
  for (const [g, k] of LADDER) {
    const l = luminance(v(g, k));
    assert.ok(
      l > prev,
      `${g}.${k} (${v(g, k)}, L=${l.toFixed(5)}) must be lighter than ` +
        `${prevName} (L=${prev.toFixed(5)}) — the ramp inverted`,
    );
    prev = l;
    prevName = `${g}.${k}`;
  }
});

test("the ladder has no imperceptible steps", () => {
  // Two values a person cannot tell apart are one value maintained twice —
  // which is how the drift this package fixes got started.
  for (let i = 1; i < LADDER.length; i++) {
    const [ag, ak] = LADDER[i - 1];
    const [bg, bk] = LADDER[i];
    const a = hex(v(ag, ak));
    const b = hex(v(bg, bk));
    const dist = Math.hypot(...a.map((x, j) => x - b[j]));
    assert.ok(dist >= 3, `${ag}.${ak} and ${bg}.${bk} differ by only ${dist.toFixed(1)} in RGB`);
  }
});

test("every text colour passes WCAG AA body on surface", () => {
  // harmony's dim failed this at 4.47:1.
  for (const key of Object.keys(raw.text)) {
    if (key === "$comment") continue;
    const ratio = contrast(v("text", key), v("surface", "base"));
    assert.ok(ratio >= 4.5, `text.${key} (${v("text", key)}) is ${ratio.toFixed(2)}:1 on surface, needs 4.5`);
  }
});

test("status colours are legible as UI on surface", () => {
  for (const key of Object.keys(raw.status)) {
    if (key === "$comment") continue;
    const ratio = contrast(v("status", key), v("surface", "base"));
    assert.ok(ratio >= 3, `status.${key} is ${ratio.toFixed(2)}:1 on surface, needs 3.0 for UI`);
  }
});

test("status surfaces can carry body text", () => {
  for (const key of Object.keys(raw.statusSurface)) {
    if (key === "$comment") continue;
    const ratio = contrast(v("text", "base"), v("statusSurface", key));
    assert.ok(ratio >= 4.5, `text on statusSurface.${key} is ${ratio.toFixed(2)}:1, needs 4.5`);
  }
});

test("no two colour tokens share a value", () => {
  const seen = new Map();
  for (const [group, entries] of Object.entries(raw)) {
    if (group === "meta" || group === "$comment" || group === "font") continue;
    for (const [key, entry] of Object.entries(entries)) {
      if (key === "$comment") continue;
      const val = entry.value.toLowerCase();
      assert.ok(!seen.has(val), `${group}.${key} duplicates ${seen.get(val)} (${val})`);
      seen.set(val, `${group}.${key}`);
    }
  }
});

test("every token documents what it is for", () => {
  // A token nobody can place gets re-invented locally, which is the whole
  // failure mode. The `use` string is what makes adoption possible.
  for (const [group, entries] of Object.entries(raw)) {
    if (group === "meta" || group === "$comment") continue;
    for (const [key, entry] of Object.entries(entries)) {
      if (key === "$comment") continue;
      assert.ok(entry.use && entry.use.length > 8, `${group}.${key} has no meaningful "use"`);
    }
  }
});
