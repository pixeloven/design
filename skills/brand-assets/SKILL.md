---
name: brand-assets
description: "Where PixelOven marks live, how to add one for a new product or sub-brand, and the rules that keep them one family. Load before drawing, editing, or embedding any logo or icon in a PixelOven repo. Landmine: a mark that invents a colour fails CI — sub-brands vary the figure, never the palette."
---

# Brand assets

Every PixelOven mark lives in `@pixeloven/brand`. Nothing else defines one, and
no repo keeps its own copy.

That rule has teeth. The parent site once used `#ff5722` and `#127769` while
every product used `#7c3cff` and `#00f0d8` — the company and the things it
shipped looked like unrelated businesses. `packages/brand/test/marks.test.mjs`
asserts against `@pixeloven/tokens`, so a mark that invents a colour fails the
build rather than quietly shipping.

## The one rule

**Sub-brands vary the FIGURE, never the palette.**

Distinctiveness comes from geometry — a diamond of woven bands, a lit pixel in a
chamber — not from a new hue. Every mark is drawn in design-system tokens, so the
family reads as one brand at a glance and the marks still differ at 24px.

## Tiers

`marks.json` records what each mark *is*, which decides how far it may vary:

| Tier | Meaning | Freedom |
|---|---|---|
| `parent` | PixelOven itself. Exactly one, asserted. | the reference all others answer to |
| `product` | a thing we ship and name (Lattice, Warden) | its own figure, shared palette |
| `family` | a member of a named set (the `*-axi` tools) | shares a motif with its siblings, differs by one element |

The `*-axi` family is the case to think about before inventing a scheme: eight
repos that should read as siblings. One motif, one element varying — not eight
unrelated drawings.

## Adding a mark

1. Draw it at `viewBox="0 0 64 64"`, in tokens only.
2. Save as `packages/brand/marks/<id>.svg`.
3. Register it in `marks.json` with `id`, `name`, `tier`, `file`, and a `figure`
   sentence saying what the shape *is*. The description is required: a mark whose
   idea is not written down gets redrawn subtly differently the next time
   somebody needs it bigger.
4. `node --test` in `packages/brand`.

## What the tests enforce

- **only design-system colours** in rendered output (comments may cite retired
  ones to explain why they are retired)
- the registry and `marks/` agree **in both directions** — no orphan file, no
  dangling entry
- exactly one `parent` mark
- shared `0 0 64 64` viewBox, a `<title>`, `role="img"`, an `aria-label`
- no embedded raster — it cannot scale, which defeats shipping SVG
- no `--` inside an XML comment

Each was verified to fail on a real mistake before being trusted.

## Landmines

- **`--` is illegal inside an XML comment.** Writing CSS custom property names
  (`--pxo-accent`) in a mark's comment produces a malformed file that renders as
  a **blank icon** — no error anywhere. This has happened once already.
- **Design for the small size.** Homepage renders marks around 32px. Interior
  detail finer than the stroke turns to mush; gaps between elements are
  load-bearing. Check 24px before deciding.
- **Do not repeat token values in prose.** A comment naming a hex goes stale the
  moment the palette is reconciled — which has also already happened. Name the
  token, not the value.
