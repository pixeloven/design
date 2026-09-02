---
name: design-system-usage
description: "How to consume PixelOven design tokens in any project — the two distribution paths (npm import vs vendored CSS), the token vocabulary, and the rule that no consumer defines its own colour. Load before adding, changing, or theming any UI surface in a PixelOven repo. Landmine: a literal hex value in a consumer is how the system decays back into copies — there is a CI gate for exactly this."
---

# Using the PixelOven design system

`@pixeloven/tokens` is the **source of truth for every surface colour**. A consumer
never defines one.

That rule is not stylistic. This package exists because the palette was previously
maintained in two places, and they drifted: only 8 of 35 values agreed, nine pairs
were visually identical but numerically different, one ramp had inverted, and one
text colour had silently fallen below WCAG AA. Every one of those was invisible
until measured.

## Which path you are on

**Build-capable consumer** (anything with a bundler — Next.js, Vite, tsup):

```ts
import tokens from "@pixeloven/tokens";       // typed consts
import "@pixeloven/tokens/tokens.css";        // CSS custom properties
```

**No build step** (a mounted stylesheet, a ConfigMap, a static page): vendor the
prebuilt CSS at a pinned version and check it in.

```
configs/vendor/tokens-v0.1.0.css    # copied verbatim from the release
configs/custom.css                  # @import it, then your own layout rules only
```

CI diffs the vendored copy against that release. If it drifts, the build fails —
which is the whole point. Do not hand-edit a vendored file.

## The vocabulary

Every token is `--pxo-<group>-<name>` in CSS, `groupName` in TS.

| Group | What it is for |
|---|---|
| `surface` | the elevation ramp: `surface-void` → `surface-canvas` → `surface-bg` → `surface` → `surface-hover` → `surface-raised` |
| `border` | continues that same ramp: `muted` → `border` → `strong` → `accent` |
| `text` | `bright`, `text`, `secondary`, `dim` — all pass AA body on `surface` |
| `accent` | `accent` (brand violet), `deep` (pressed), `soft` (accent text on dark) |
| `status` | `success`, `warning`, `danger` — semantic, never decorative |
| `status-surface` | tinted grounds for callouts, dark enough to carry body text |
| `font` | `mono` (the brand voice: code, labels, data) and `sans` (prose) |

Borders continue the surface ramp rather than forming their own scale. If you find
yourself wanting a value "between" two steps, that is a signal the ramp needs a
step — open an issue, do not inline one.

## The rules

1. **No literal hex in a consumer.** Not in CSS, not in TS, not in an SVG that
   ships as a brand asset. Marks live in `@pixeloven/brand`.
2. **Semantic over literal.** Reach for `status.danger`, not "the pink one". If no
   token fits the meaning, the vocabulary is incomplete — that is a contribution,
   not a local override.
3. **Never fork a value locally.** A one-off "slightly darker surface" is exactly
   how the drift started. Add a step upstream or use an existing one.
4. **Status colours keep their meaning.** `success` is also the brand teal, which
   is a deliberate overload. Using it decoratively is allowed on marks; using it
   to mean "not healthy" is not.

## Adding or changing a token

Edit `packages/tokens/src/tokens.json` — nothing else. `use` is required and is
checked: a token nobody can place gets re-invented locally.

`node --test` in `packages/tokens` enforces the invariants that matter:

- the elevation ladder is **strictly monotonic** (a ramp that inverts is the
  historical bug this guards)
- no two adjacent steps are within 3 in RGB (imperceptible steps are one value
  maintained twice)
- every text colour clears **4.5:1** on `surface`; status colours clear 3:1
- no two tokens share a value

These fail loudly on the real historical defects — verified by injecting them.
If a change makes one fail, the change is wrong, not the test.
