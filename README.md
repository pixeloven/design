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

> `pi-web` is an upstream fork kept as inspiration, not a consumer. Only 16 of the
> 35 values in use appear in it at all — the palette is far less inherited than it
> looks.

## Layout

```
packages/
  tokens/     source of truth → CSS vars, TS consts, plain tokens.css
  ui/         React components            (phase 2 — extracted from lattice)
  brand/      logos, marks, favicons      (phase 3)
apps/
  docs/       the documentation site      (phase 4)
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

The token tests are the point of the package, not scaffolding. They enforce that
the elevation ladder is strictly monotonic, that no two steps are imperceptibly
close, that every text colour clears 4.5:1 on `surface`, and that no two tokens
share a value. Each was verified to fail against the actual historical defect it
guards — a check that has never failed is not a check.

## Status

Phase 1. Tokens are reconciled and published; no consumer has migrated yet.
