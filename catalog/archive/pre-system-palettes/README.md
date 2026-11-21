---
id: pxo:archive/pre-system-palettes
title: Pre-system palettes
tier: archive
status: retired
since: tokens-v0.1.0
owners: [design]
decisions: [pxo:ddr/0006]
sources:
  - README.md
  - packages/tokens/src/tokens.json
  - "commit b27bdc2, feat(tokens): reconcile the palette into one source of truth (2026-09-02)"
  - "Original proposal, \"PixelOven Design System\" (2026-09-02)"
---

# Pre-system palettes

The two hand-maintained copies of the PixelOven palette that existed before
this repository: Harmony's Homepage `custom.css` and Lattice's `globals.css`.
They had converged on the same semantic ladder and drifted apart on its values.
Measuring that drift is why `@pixeloven/tokens` exists.

**Do not use in production.** Every live colour comes from `@pixeloven/tokens`.

## Dates

| | |
| --- | --- |
| In use | Until 2026-09-02. When each copy started is not recorded here. |
| Measured | 2026-09-02, from the live files, before anything was written |
| Retired | 2026-09-02, by tokens 0.1.0 (`tokens-v0.1.0`) |

## What it was

Two stylesheets, each defining its own colours with no package and no import:

| Copy | File | Distinct colours |
| --- | --- | --- |
| Lattice | `frontend/app/globals.css` | 26 |
| Harmony | `…/homepage/configs/custom.css` | 17 |

Across both, 35 distinct values were in use. Exactly eight agreed: the
semantic accents and text colours. Everything structural (grounds, surfaces,
borders, elevation) had drifted into nine near-identical pairs, the closest
`#101527` against `#111526`, 1.4 apart in RGB.

## Why it was retired

Two copies of one palette drift, and the drift was not visible by eye:

- **Harmony's ramp inverted.** Its `border-muted` (relative luminance 0.01879)
  sat below `surface-hover` (0.01961), so a stronger border was darker than the
  surface it bordered.
- **Harmony's `dim` failed WCAG AA.** `#817a99` scored 4.47:1 on surface,
  failing body text by 0.03. Lattice's `#9089ab` scored 5.48:1.

Both ladders ended on the same accent-border luminance (0.0724), so Lattice's
geometrically spaced ramp was taken as the same ladder correctly interpolated.
The reconciliation chose values on measurement, not taste, and every defect
above is now asserted by the token tests.

## What replaced it

[`@pixeloven/tokens`](../../../packages/tokens/README.md), from 0.1.0: one
source, in two schemes, with tests that the ladder moves monotonically away
from its ground and that every text colour clears 4.5:1 on the ground it
declares. Primitive scales come from tokens ([DDR-0006](../../../decisions/0006-primitives-from-tokens.md)).
Consumers import the package or vendor its built CSS at a pinned version.

The legacy palette that tokens 0.6.0 keeps byte-compatible is the reconciled
palette, not these copies. It is deprecated but still live, so it is not archived.

## Specimen

[`specimen.json`](specimen.json) freezes the 2026-09-02 measurement: the counts,
the eight agreed values, the nine near-miss pairs with the token each became,
and the two defects.

## Not verified

- The full value lists of both stylesheets were not kept in this repository.
  The specimen holds only the values the sources record.
- Which side of each near-miss pair belonged to which copy is inferred: the
  second value of every pair is in `tokens.json` today, and Lattice's ramp won.
- The eight agreed values include `#817a99`, which is Harmony's `dim`; Lattice's
  `dim` was `#9089ab`. Where `#817a99` appeared in Lattice is not recorded.

## Sources

- [`README.md`](../../../README.md#why-this-exists), "Why this exists"
- [`packages/tokens/src/tokens.json`](../../../packages/tokens/src/tokens.json), its `$comment`
- Commit `b27bdc2`, "feat(tokens): reconcile the palette into one source of truth", 2026-09-02
- Original proposal, "PixelOven Design System", 2026-09-02, section 01 (a private page)
