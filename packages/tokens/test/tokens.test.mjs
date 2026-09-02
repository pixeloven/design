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
 * EVERY CHECK RUNS AGAINST EVERY SCHEME. A ramp that clears AA on dark can fail
 * on light; a light scheme that is only tested on dark's assumptions ships
 * unverified. That is why these are parameterised rather than written once.
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
const SCHEMES = raw.meta.schemes;

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

/** Colour tokens carry one value per scheme; font tokens carry a single value. */
const v = (group, key, scheme) => {
  const entry = raw[group][key];
  return "value" in entry ? entry.value : entry[scheme];
};

// The elevation ladder, in the order it is meant to move away from the ground.
// Borders continue the surface ramp rather than forming a separate scale.
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

const colourGroups = ["surface", "border", "text", "accent", "status", "statusSurface"];
const keysOf = (group) => Object.keys(raw[group]).filter((k) => k !== "$comment");

for (const scheme of SCHEMES) {
  test(`[${scheme}] the elevation ladder moves monotonically away from the ground`, () => {
    // The regression guard. harmony's copy failed exactly here.
    //
    // Direction is scheme-dependent and that is correct: on dark the ramp gets
    // LIGHTER as it rises, on light it gets DARKER. The invariant is distance
    // from the page ground, not raw luminance, so it is measured as contrast
    // against `surface.void` — which is monotonic in both.
    const ground = v("surface", "void", scheme);
    let prev = -Infinity;
    let prevName = "(ground)";
    for (const [g, k] of LADDER) {
      const value = v(g, k, scheme);
      const d = contrast(value, ground);
      assert.ok(
        d > prev,
        `${g}.${k} (${value}, ${d.toFixed(3)}:1 from ground) must sit further from ` +
          `the ground than ${prevName} (${prev.toFixed(3)}:1) — the ramp inverted`,
      );
      prev = d;
      prevName = `${g}.${k}`;
    }
  });

  test(`[${scheme}] the ladder has no imperceptible steps`, () => {
    // Two values a person cannot tell apart are one value maintained twice —
    // which is how the drift this package fixes got started.
    for (let i = 1; i < LADDER.length; i++) {
      const [ag, ak] = LADDER[i - 1];
      const [bg, bk] = LADDER[i];
      const a = hex(v(ag, ak, scheme));
      const b = hex(v(bg, bk, scheme));
      const dist = Math.hypot(...a.map((x, j) => x - b[j]));
      assert.ok(dist >= 3, `${ag}.${ak} and ${bg}.${bk} differ by only ${dist.toFixed(1)} in RGB`);
    }
  });

  test(`[${scheme}] every text colour passes WCAG AA on the ground it declares`, () => {
    // harmony's dim failed this at 4.47:1.
    //
    // Each text token names its ground in `on`, so onAccent is checked against
    // the accent fill rather than a surface it never sits on. Asserting every
    // text colour against `surface` would be the wrong test twice over: it would
    // fail onAccent spuriously and pass it for the wrong reason.
    for (const key of keysOf("text")) {
      const [g, k] = raw.text[key].on.split(".");
      const ground = v(g, k, scheme);
      const ratio = contrast(v("text", key, scheme), ground);
      assert.ok(
        ratio >= 4.5,
        `text.${key} (${v("text", key, scheme)}) is ${ratio.toFixed(2)}:1 on ` +
          `${raw.text[key].on} (${ground}), needs 4.5`,
      );
    }
  });

  test(`[${scheme}] text on an accent fill works for every accent value`, () => {
    // accent.deep is a fill, not a foreground — so the meaningful check is that
    // text sits legibly ON it, not that it contrasts against a surface behind it.
    for (const key of keysOf("accent")) {
      if (key === "soft") continue; // soft is a foreground, covered below
      const ratio = contrast(v("text", "onAccent", scheme), v("accent", key, scheme));
      assert.ok(
        ratio >= 4.5,
        `text.onAccent on accent.${key} (${v("accent", key, scheme)}) is ${ratio.toFixed(2)}:1, needs 4.5`,
      );
    }
  });

  test(`[${scheme}] foreground status and accent colours are legible on surface`, () => {
    // The light scheme is where this bites: the dark teal #00f0d8 is 1.25:1 on a
    // light ground, so light needs its own darkened value rather than reuse.
    // accent.deep is excluded deliberately — it is a fill, asserted above.
    const surface = v("surface", "base", scheme);
    const foregrounds = [...keysOf("status").map((k) => ["status", k]), ["accent", "base"], ["accent", "soft"]];
    for (const [group, key] of foregrounds) {
      const ratio = contrast(v(group, key, scheme), surface);
      assert.ok(
        ratio >= 3,
        `${group}.${key} (${v(group, key, scheme)}) is ${ratio.toFixed(2)}:1 on surface, needs 3.0 for UI`,
      );
    }
  });

  test(`[${scheme}] status surfaces can carry body text`, () => {
    const text = v("text", "base", scheme);
    for (const key of keysOf("statusSurface")) {
      const ratio = contrast(text, v("statusSurface", key, scheme));
      assert.ok(ratio >= 4.5, `text on statusSurface.${key} is ${ratio.toFixed(2)}:1, needs 4.5`);
    }
  });

  test(`[${scheme}] no two colour tokens share a value`, () => {
    const seen = new Map();
    for (const group of colourGroups) {
      for (const key of keysOf(group)) {
        // A token that declares `sameAs` is a documented alias, not an accident.
        if (raw[group][key].sameAs) continue;
        const val = v(group, key, scheme).toLowerCase();
        assert.ok(!seen.has(val), `${group}.${key} duplicates ${seen.get(val)} (${val})`);
        seen.set(val, `${group}.${key}`);
      }
    }
  });
}

// --- scheme-independent ------------------------------------------------------

test("every colour token defines every scheme", () => {
  // The failure this prevents is a token silently falling back to undefined in
  // one scheme, which renders as an unset CSS variable rather than an error.
  for (const group of colourGroups) {
    for (const key of keysOf(group)) {
      for (const scheme of SCHEMES) {
        const value = raw[group][key][scheme];
        assert.match(
          value ?? "",
          /^#[0-9a-f]{6}$/i,
          `${group}.${key} has no valid ${scheme} value (got ${JSON.stringify(value)})`,
        );
      }
    }
  }
});

test("the two schemes are perceptually equivalent", () => {
  // The light ramp was derived by matching each dark step's contrast against its
  // own ground. This asserts that derivation held, so a later hand-edit to one
  // scheme cannot silently pull the two out of correspondence.
  const grounds = Object.fromEntries(SCHEMES.map((s) => [s, v("surface", "void", s)]));
  for (const [g, k] of LADDER) {
    const [a, b] = SCHEMES.map((s) => contrast(v(g, k, s), grounds[s]));
    assert.ok(
      Math.abs(a - b) < 0.05,
      `${g}.${k} sits ${a.toFixed(3)}:1 from the ${SCHEMES[0]} ground but ` +
        `${b.toFixed(3)}:1 from the ${SCHEMES[1]} ground — the schemes have diverged`,
    );
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
