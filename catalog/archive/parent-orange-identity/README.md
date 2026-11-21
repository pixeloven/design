---
id: pxo:archive/parent-orange-identity
title: Parent orange identity
tier: archive
status: retired
since: brand-v0.1.0
owners: [design]
decisions: [pxo:ddr/0001, pxo:ddr/0006]
sources:
  - skills/brand-assets/SKILL.md
  - packages/brand/test/marks.test.mjs
  - "commit 46d7d84, feat(brand): the mark registry, with the family rule enforced (2026-09-02)"
  - "commit 7368221, feat(brand): keep the established P emblem as the parent mark (2026-09-02)"
---

# Parent orange identity

The colours PixelOven's own site used before the design system: oven orange
`#ff5722` and `#127769`, with the P favicon on an orange tile. Every product
the company shipped used violet `#7c3cff` and teal `#00f0d8`, so the parent and
its products shared no colour at all.

**Do not use in production.** The brand tests fail any mark that renders these
colours.

## Dates

| | |
| --- | --- |
| In use | On the parent site until 2026-09-02. When it began is not recorded here. |
| Retired | 2026-09-02, when the mark registry was written; first released in brand 0.1.0 (`brand-v0.1.0`, 2026-09-04) |

## What it was

- `#ff5722`, an orange meant to say warmth: the oven in PixelOven.
- `#127769`, a teal. Its role is not recorded.
- A favicon that set the letter P as live text in `font-family: system-ui` on
  an orange tile.

## Why it was retired

The company and the things it shipped looked like unrelated businesses, and
nothing was watching the gap. Using orange for warmth was the obvious move,
and it left the parent sharing zero colours with any product. The favicon had
its own defect: because the P was text, its letterform changed with the
viewer's operating system.

That failure is why the family rule exists: **sub-brands vary the figure, never
the palette.**

## What replaced it

- **The established P emblem, kept and redrawn as paths** in
  `@pixeloven/brand`: the parent mark, in-palette and monochrome by intent, so
  the parent "does not compete with its products for colour". The approved
  Solid and Inset forms followed in brand 0.2.0.
- **A test, not a sentence.** `packages/brand/test/marks.test.mjs` checks every
  rendered mark colour against `@pixeloven/tokens`; reintroducing the orange
  was one of the mistakes it was shown to fail on. CI states the same reason.
- The family decisions: PixelOven is the parent ([DDR-0001](../../../decisions/0001-pixeloven-parent-family.md)),
  and products differ by figure, not by palette ([DDR-0006](../../../decisions/0006-primitives-from-tokens.md)).

## Specimen

[`specimen.json`](specimen.json) freezes the two colours, the product colours
of the time and the old favicon's construction. No image is kept: the old
favicon file is not in this repository.

## Not verified

- The role of `#127769` on the parent site.
- When the orange identity was introduced, and whether anything beyond the
  site and its favicon used it.

## Sources

- [`skills/brand-assets/SKILL.md`](../../../skills/brand-assets/SKILL.md), "That rule has teeth"
- [`packages/brand/test/marks.test.mjs`](../../../packages/brand/test/marks.test.mjs), the palette rule
- Commit `46d7d84`, "feat(brand): the mark registry, with the family rule enforced", 2026-09-02
- Commit `7368221`, "feat(brand): keep the established P emblem as the parent mark", 2026-09-02
