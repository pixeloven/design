---
id: pxo:archive/pi-web-dark
title: piWebDark
tier: archive
status: retired
since: tokens-v0.1.0
owners: [design]
decisions: [pxo:ddr/0006]
sources:
  - README.md
  - packages/brand/marks/lattice.svg
  - "commit 46d7d84, feat(brand): the mark registry, with the family rule enforced (2026-09-02)"
  - "Original proposal, \"PixelOven Design System\" (2026-09-02)"
---

# piWebDark

The dark-only inspiration palette PixelOven's surfaces were drawn in before the
design system: violet accent, teal success, amber warning and rose danger over
deep blue-black grounds, set in IBM Plex. The Original proposal for this
repository was drawn in it. It takes its name from `pi-web`, an upstream fork
kept as inspiration.

**Do not use in production.** Every live colour comes from `@pixeloven/tokens`.

## Dates

| | |
| --- | --- |
| In use | Until 2026-09-02. When it was first used is not recorded here. |
| Frozen | 2026-09-02, the palette the Original proposal declared |
| Retired | 2026-09-02, by tokens 0.1.0 (`tokens-v0.1.0`) |

## What it was

Fourteen colours, one scheme. Its structural values are the Harmony side of
the [pre-system drift pairs](../pre-system-palettes/README.md) (`#141d33`,
`#080d18`, `#1c2440`, `#1b2543`, `#2c3760`), and its `dim` is Harmony's
`#817a99`. The Lattice trellis records its own colours as "the piWebDark design
system", with its `pi-accent` and `pi-success` tokens "from `configs/custom.css`",
so piWebDark is best read as the palette
Harmony's Homepage carried, named for the fork it came from.

It was less inherited than it looked: only 16 of the 35 values in use across
Lattice and Harmony appeared in `pi-web` at all.

## Why it was retired

It was one of the copies whose drift the design system was created to end. Its
ground `#070912` and its `dim` both lost on measurement: the ground did not
match the reconciled elevation ladder, and `#817a99` failed WCAG AA body text
at 4.47:1. The Lattice mark's comment still cited `#070912` as its ground; the
brand tests caught it on their first run, hours after reconciliation had
replaced that ground with `surface.void`.

## What replaced it

[`@pixeloven/tokens`](../../../packages/tokens/README.md), from 0.1.0. Seven of
the fourteen values survive unchanged as tokens; the specimen names each one.
The accents, status hues and text colours carried over, and every structural
value was replaced by Lattice's ramp.

The name survives too: `tokens.json` still declares `meta.name: "piWebDark"`
for the legacy palette that tokens 0.6.0 keeps byte-compatible. That palette is
the reconciled one, deprecated but still live, and is not this entry.

## Specimen

[`specimen.json`](specimen.json) freezes the fourteen colours under their
original names, with the token that carries each surviving value today.

## Not verified

- `pi-web` itself was not read. The values are the Original proposal's, which
  states it is drawn in piWebDark. The Original proposal counts 61 colours in
  `pi-web`; those are not recorded here.
- The reading of piWebDark as Harmony's palette rests on the value overlap and
  the Lattice mark's comment, not on Harmony's file.

## Sources

- [`README.md`](../../../README.md#two-schemes-one-derived-from-the-other), the `pi-web` note
- [`packages/brand/marks/lattice.svg`](../../../packages/brand/marks/lattice.svg), its palette comment
- Commit `46d7d84`, "feat(brand): the mark registry, with the family rule enforced", 2026-09-02
- Original proposal, "PixelOven Design System", 2026-09-02, its stylesheet and section 01 (a private page)
