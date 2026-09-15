/**
 * Non-colour scale tests — radius, type, ease, duration, shadow, z.
 *
 * The colour tokens are guarded by tokens.test.mjs, and those guards are the
 * reason the palette stopped drifting. These scales arrived with no guards at
 * all, which is the same shape of defect one layer up: a scale nobody asserts
 * is a scale that silently stops being one.
 *
 * What can actually go wrong here, and is therefore what is asserted:
 *
 *   - a radius inserted "between" two steps that is not between them
 *   - a type step whose line-height is a unitless ratio, or is SMALLER than its
 *     own size, which clips descenders at exactly one step and nowhere else
 *   - tracking that stops rising as the ramp falls, so small mono goes cramped
 *   - a duration pair where the exit is slower than the enter — the single most
 *     common way an interface comes to feel sluggish
 *   - two z-layers given the same number, which is invisible until a tooltip
 *     lands under a modal on someone else's machine
 *   - a shadow written with a literal colour, which is a consumer-defined colour
 *     wearing a different hat
 *   - a scale added with a `dark`/`light` pair, which would make it vanish from
 *     the scheme-pinned stylesheets
 *
 * Every one of these was verified to FAIL against the mistake it describes
 * before it was trusted. A check that has never failed is not a check.
 *
 * Run with: node --test
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(here, "..", "src", "tokens.json"), "utf8"));
const SCHEMES = raw.meta.schemes;

/** The groups that carry one value rather than one per scheme. */
const SCALE_GROUPS = ["font", "radius", "type", "ease", "duration", "shadow", "z"];

const keysOf = (group) => Object.keys(raw[group]).filter((k) => k !== "$comment");

/**
 * Walk the token tree the way build.mjs does, so these tests see exactly the
 * tokens that get emitted — not a hand-listed approximation of them. Written
 * out again rather than imported: a bug in a shared walk could hide a token
 * from the build and from the test that is supposed to notice.
 */
function* walk(node, path = []) {
  for (const [key, val] of Object.entries(node)) {
    if (key === "$comment" || key === "meta") continue;
    if (val && typeof val === "object" && ("value" in val || SCHEMES[0] in val)) {
      yield [[...path, key], val];
    } else if (val && typeof val === "object") {
      yield* walk(val, [...path, key]);
    }
  }
}
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const trim = (p) => (p[p.length - 1] === "base" ? p.slice(0, -1) : p);
const cssName = (p) => `--pxo-${trim(p).map(kebab).join("-")}`;

/** Parse "12px" / "180ms" / "-0.02em" / "600" into a number, insisting on the unit. */
const num = (value, unit, what) => {
  const re = unit ? new RegExp(`^(-?\\d+(?:\\.\\d+)?)${unit}$`) : /^(-?\d+)$/;
  const m = re.exec(value);
  assert.ok(m, `${what} is ${JSON.stringify(value)}, which is not a ${unit || "unitless integer"} value`);
  return Number(m[1]);
};

// The ramp, largest to smallest. Order is the invariant, so it is declared here
// rather than read from the file — a reordering of tokens.json must not be able
// to redefine what "descending" means.
const RAMP = ["display", "title", "subtitle", "body", "ui", "label", "micro"];

// --- radius ------------------------------------------------------------------

test("the radius scale ascends, in whole pixels", () => {
  const STEPS = ["xs", "sm", "base", "lg"];
  assert.deepEqual(keysOf("radius").sort(), [...STEPS].sort(), "radius gained or lost a step");
  let prev = -Infinity;
  let prevName = "(nothing)";
  for (const step of STEPS) {
    const v = num(raw.radius[step].value, "px", `radius.${step}`);
    assert.ok(Number.isInteger(v), `radius.${step} is ${v}px — half-pixel radii render inconsistently`);
    assert.ok(
      v > prev,
      `radius.${step} (${v}px) must be larger than radius.${prevName} (${prev}px) — the scale inverted`,
    );
    prev = v;
    prevName = step;
  }
});

// --- type --------------------------------------------------------------------

test("every type step carries all four metrics", () => {
  // A step missing `weight` is not a smaller defect than a wrong weight: the
  // consumer silently inherits whatever the surrounding element had.
  assert.deepEqual(keysOf("type").sort(), [...RAMP].sort(), "the type ramp gained or lost a step");
  for (const step of RAMP) {
    for (const metric of ["size", "lineHeight", "weight", "letterSpacing"]) {
      assert.ok(
        raw.type[step][metric]?.value,
        `type.${step} has no ${metric} — a consumer would inherit one instead`,
      );
    }
  }
});

test("the type ramp descends in size, with line-heights in integer px", () => {
  let prevSize = Infinity;
  let prevLead = Infinity;
  let prevName = "(nothing)";
  for (const step of RAMP) {
    const size = num(raw.type[step].size.value, "px", `type.${step}.size`);
    const lead = num(raw.type[step].lineHeight.value, "px", `type.${step}.lineHeight`);

    assert.ok(Number.isInteger(lead), `type.${step} line-height ${lead}px is not a whole pixel`);
    assert.ok(
      lead >= size,
      `type.${step} line-height (${lead}px) is smaller than its size (${size}px) — lines will clip`,
    );
    assert.ok(
      size < prevSize,
      `type.${step} (${size}px) must be smaller than type.${prevName} (${prevSize}px) — the ramp inverted`,
    );
    assert.ok(
      lead < prevLead,
      `type.${step} line-height (${lead}px) must be smaller than type.${prevName}'s (${prevLead}px)`,
    );
    prevSize = size;
    prevLead = lead;
    prevName = step;
  }
});

test("tracking rises as the ramp falls", () => {
  // The rule that makes small mono read as deliberate rather than cramped. It
  // is easy to undo by adding one step in the middle without thinking about it.
  let prev = -Infinity;
  let prevName = "(nothing)";
  for (const step of RAMP) {
    const t = num(raw.type[step].letterSpacing.value, "em", `type.${step}.letterSpacing`);
    assert.ok(
      t >= prev,
      `type.${step} tracking (${t}em) is tighter than type.${prevName}'s (${prev}em) — ` +
        `tracking must not fall as size falls`,
    );
    prev = t;
    prevName = step;
  }
  const top = num(raw.type[RAMP[0]].letterSpacing.value, "em", "display tracking");
  const bottom = num(raw.type[RAMP.at(-1)].letterSpacing.value, "em", "micro tracking");
  assert.ok(bottom > top, `the ramp must actually open up: ${top}em at the top, ${bottom}em at the bottom`);
});

test("type weights are real font weights", () => {
  for (const step of RAMP) {
    const w = num(raw.type[step].weight.value, "", `type.${step}.weight`);
    assert.ok(
      w >= 100 && w <= 900 && w % 100 === 0,
      `type.${step} weight ${w} is not one of the nine CSS weights`,
    );
  }
});

// --- motion ------------------------------------------------------------------

test("both easing curves are cubic-beziers that start and end at rest", () => {
  for (const key of keysOf("ease")) {
    const v = raw.ease[key].value;
    const m = /^cubic-bezier\(\s*(-?[\d.]+),\s*(-?[\d.]+),\s*(-?[\d.]+),\s*(-?[\d.]+)\s*\)$/.exec(v);
    assert.ok(m, `ease.${key} is ${JSON.stringify(v)}, which is not a cubic-bezier()`);
    const [x1, , x2] = m.slice(1).map(Number);
    // The X axis is time; CSS clamps it to 0..1 and a value outside it is a
    // silently-broken curve rather than an error.
    for (const [name, x] of [["x1", x1], ["x2", x2]]) {
      assert.ok(x >= 0 && x <= 1, `ease.${key} ${name}=${x} is outside 0..1 — time cannot run backwards`);
    }
  }
});

test("durations ascend, and an exit is faster than the enter it reverses", () => {
  const d = Object.fromEntries(
    keysOf("duration").map((k) => [k, num(raw.duration[k].value, "ms", `duration.${k}`)]),
  );

  // The travel-distance scale.
  assert.ok(d.fast < d.base, `duration.fast (${d.fast}ms) must be shorter than duration.base (${d.base}ms)`);
  assert.ok(d.base < d.slow, `duration.base (${d.base}ms) must be shorter than duration.slow (${d.slow}ms)`);

  // A slow exit is the most common way a UI comes to feel sluggish.
  assert.ok(d.exit < d.base, `duration.exit (${d.exit}ms) must be faster than duration.base (${d.base}ms)`);

  // The hover pair inverts that deliberately: entering is instant because the
  // pointer position is already known, leaving is eased because nothing waits
  // on it. Asserted so that "tidying" it into a symmetric pair fails here.
  assert.ok(
    d.in < d.out,
    `duration.in (${d.in}ms) must be faster than duration.out (${d.out}ms) — hover enters instantly`,
  );

  for (const [k, v] of Object.entries(d)) {
    assert.ok(Number.isInteger(v) && v >= 0, `duration.${k} is ${v}ms`);
    assert.ok(v <= 400, `duration.${k} is ${v}ms — anything past ~400ms reads as the interface hanging`);
  }
});

// --- z -----------------------------------------------------------------------

test("the stacking order is strictly ascending, with no two layers on the same number", () => {
  // Two layers sharing a number is decided by DOM order, which is invisible
  // until a tooltip opens underneath a modal on someone else's machine.
  const ORDER = ["canvas", "chrome", "panel", "popover", "overlay", "modal", "toast", "tooltip"];
  assert.deepEqual(keysOf("z").sort(), [...ORDER].sort(), "the stack gained or lost a layer");
  const seen = new Map();
  let prev = -Infinity;
  let prevName = "(nothing)";
  for (const layer of ORDER) {
    const v = num(raw.z[layer].value, "", `z.${layer}`);
    assert.ok(!seen.has(v), `z.${layer} and z.${seen.get(v)} are both ${v}`);
    assert.ok(v > prev, `z.${layer} (${v}) must sit above z.${prevName} (${prev}) — the stack inverted`);
    seen.set(v, layer);
    prev = v;
    prevName = layer;
  }
});

// --- cross-cutting -----------------------------------------------------------

test("no non-colour token smuggles in a colour", () => {
  // A shadow written `0 8px 24px #000000cc` is a consumer-defined colour with a
  // different name on it — the exact thing this package exists to prevent. The
  // permitted forms are neutral black/white at an alpha, or a derivation from a
  // token's own `-rgb` companion.
  for (const group of SCALE_GROUPS) {
    for (const [path, entry] of walk(raw[group], [group])) {
      const value = entry.value;
      assert.doesNotMatch(
        value,
        /#[0-9a-f]{3,8}\b/i,
        `${path.join(".")} contains a literal colour: ${value}`,
      );
      // One level of nesting, so `rgb(var(--x) / 0.06)` is captured whole
      // rather than truncated at the inner `)`.
      for (const fn of value.matchAll(/\brgba?\(((?:[^()]|\([^()]*\))*)\)/g)) {
        const body = fn[1];
        const ok =
          /^\s*var\(--pxo-[a-z-]+-rgb\)\s*\/\s*[\d.]+\s*$/.test(body) ||
          /^\s*(0\s+0\s+0|255\s+255\s+255)\s*(\/\s*[\d.]+\s*)?$/.test(body);
        assert.ok(
          ok,
          `${path.join(".")} builds a colour from ${JSON.stringify(body)} — use a token's ` +
            `-rgb companion, or neutral black/white at an alpha`,
        );
      }
    }
  }
});

test("every non-colour token is scheme-independent", () => {
  // A scale given `dark`/`light` values would be emitted per-scheme, which is
  // not wrong in tokens.css — and would quietly drop it from the pinned
  // stylesheets for the non-default scheme, where it has no :root to inherit.
  for (const group of SCALE_GROUPS) {
    for (const [path, entry] of walk(raw[group], [group])) {
      assert.ok("value" in entry, `${path.join(".")} has no single value`);
      for (const scheme of SCHEMES) {
        assert.ok(
          !(scheme in entry),
          `${path.join(".")} declares a ${scheme} value — scales do not vary by scheme`,
        );
      }
    }
  }
});

test("no two tokens claim the same CSS custom property", () => {
  // `base` trims off the name (radius.base -> --pxo-radius), so a group can
  // collide with itself, and two groups can collide with each other. Neither
  // fails the build — the second declaration simply wins.
  const seen = new Map();
  for (const [path] of walk(raw)) {
    const name = cssName(path);
    assert.ok(!seen.has(name), `${path.join(".")} and ${seen.get(name)} both emit ${name}`);
    seen.set(name, path.join("."));
  }
});

test("a scheme-pinned build carries every token, not only the colour ones", () => {
  // This shipped: tokens-light.css carried no --pxo-font-mono at all, because
  // scheme-independent tokens were skipped for every non-default scheme — which
  // is right for tokens.css, where :root already declared them, and wrong for a
  // pinned file that is the only block there is.
  //
  // It went unnoticed because every pinned consumer so far is dark, and dark is
  // the default scheme. With the non-colour scales here, the same path would
  // have dropped 53 tokens instead of 2.
  const dist = join(here, "..", "dist");
  const names = [...walk(raw)].map(([p]) => cssName(p));
  for (const scheme of SCHEMES) {
    const file = join(dist, `tokens-${scheme}.css`);
    let css;
    try {
      css = readFileSync(file, "utf8");
    } catch {
      assert.fail(`${file} is missing — run the build before the tests`);
    }
    const body = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const missing = names.filter((n) => !body.includes(`${n}:`));
    assert.deepEqual(missing, [], `tokens-${scheme}.css is missing ${missing.length} token(s)`);
  }
});
