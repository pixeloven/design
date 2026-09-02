# PixelOven Design

One source of truth for the brand: tokens, components, brand assets, docs.

## Why this exists

The palette used to live in two independently maintained copies —
`harmony/.../homepage/configs/custom.css` and `lattice/frontend/app/globals.css`.
Measured before this repo was created:

| | |
|---|---|
| distinct colours in use | **35** |
| values both copies agreed on | **8** |
| near-identical-but-different pairs | **9** (closest: `#101527` vs `#111526`, ΔRGB 1.4) |
| ramps that inverted | **1** — harmony's `border-muted` was *darker* than `surface-hover` |
| text colours below WCAG AA | **1** — harmony's `dim` at 4.47:1, failing by 0.03 |

None of that was noticed by looking. All of it is now asserted by tests.

## Two schemes, one derived from the other

Every colour token carries `dark` and `light`. The light ramp was **derived, not
picked**: each step was solved for the same contrast against its own ground that
the corresponding dark step has against its ground, at the dark scale's own hue
(227°, held to within 3° across all ten steps).

So the ladder ascends in luminance on dark and *descends* on light — the real
invariant is distance from the page ground, which is what the tests assert per
scheme. A test also holds the two schemes in correspondence, so a later hand-edit
to one cannot silently pull them apart.

The brand violet `#7c3cff` is the same value in both schemes.

> `pi-web` is an upstream fork kept as inspiration, not a consumer. Only 16 of the
> 35 values in use appear in it at all — the palette is far less inherited than it
> looks.

## Layout

```
packages/
  tokens/     source of truth → CSS vars, TS consts, plain tokens.css
  brand/      marks, and the rules that keep them one family
  ui/         React components            (next — extracted from lattice)
apps/
  docs/       the documentation site      (later)
```

## Consuming

**With a bundler:**

```ts
import tokens from "@pixeloven/tokens";
import "@pixeloven/tokens/tokens.css";
```

**Without one** (mounted stylesheets, ConfigMaps): vendor `dist/tokens.css` at a
pinned version. CI diffs it against the release, so a drifted copy fails the build.

See the `design-system-usage` skill for the vocabulary and the rules.

## Working here

```bash
pnpm install
pnpm build          # tokens.json -> dist/
pnpm test           # the invariants below
```

The token tests are the point of the package, not scaffolding, and **every one
runs against both schemes**. They enforce that the elevation ladder moves
monotonically away from the ground, that no two steps are imperceptibly close,
that every text colour clears 4.5:1 on the ground it declares, that the two
schemes stay in correspondence, and that no two tokens share a value.

Each guard was verified to fail against a real mistake before being trusted —
the historical ramp inversion and the failing `dim`, plus the light-scheme
traps: reusing the dark teal on light (1.25:1), inverting the light ladder, and
dropping a scheme from a token. A check that has never failed is not a check.

## Status

Phase 1. Tokens are reconciled, dual-scheme and published; no consumer has
migrated yet.
