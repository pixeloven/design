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

## Installing

Both packages publish to **GitHub Packages**, not npmjs. That needs one line of
registry config and a token — including for public packages, which is a GitHub
Packages quirk and not something you have configured wrong.

**The token never goes in the committed `.npmrc`.** pnpm refuses to expand
`${VAR}` in a registry credential that comes from a *project* `.npmrc` — on
purpose, because that file is committed and a leaked secret could be sent to an
attacker-controlled registry. It says so plainly if you try:

> environment variables are not expanded in registry credentials that come from
> a project .npmrc … Move this credential to a trusted source that pnpm still
> expands

It is not that pnpm cannot expand env vars — it expands them fine from a
**trusted source**. So the split is:

**Committed `.npmrc` — registry mapping only:**

```
@pixeloven:registry=https://npm.pkg.github.com
```

**User-level `~/.npmrc` — the credential, as a variable:**

```
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Then inject the value per-invocation and never write it to disk:

```bash
op run --env-file=op.env -- pnpm install
```

- **In CI**: nothing to do. `actions/setup-node` with `registry-url` writes a
  user-level npmrc, which is a trusted source, so `NODE_AUTH_TOKEN` from the
  workflow's `GITHUB_TOKEN` expands normally. Add `permissions: packages: read`.
- **Locally**: the `~/.npmrc` line above, plus a classic PAT with
  `read:packages` injected by `op run`.
- **In a Dockerfile**: `--mount=type=secret`, written to the *user-level*
  npmrc and removed inside a single `RUN`. Never an `ARG` — an ARG is recorded
  in image history. The project `.npmrc` must also be COPYed with the
  manifests, or pnpm asks npmjs and 404s before it reaches GitHub.

If an install fails with 401/404, check the token before the version: GitHub
Packages returns 404 for "exists but you cannot see it".

## Releasing

The version in `package.json` is the only place a version is written. Bump it,
merge to main, and CI tags and publishes. Do not create tags by hand — a typed
tag can disagree with the artifact it names, and once did here.

## Which path you are on

**Build-capable consumer** (anything with a bundler — Next.js, Vite, Astro):

```ts
import tokens from "@pixeloven/tokens";       // tokens.dark.accent, tokens.light.accent
import "@pixeloven/tokens/tokens.css";        // CSS custom properties, both schemes
```

**No build step** (a mounted stylesheet, a ConfigMap, a static page): vendor the
prebuilt CSS at a pinned version and check it in.

```
configs/vendor/tokens-v0.1.0.css    # copied verbatim from the release
configs/custom.css                  # @import it, then your own layout rules only
```

CI diffs the vendored copy against that release. If it drifts, the build fails —
which is the whole point. Do not hand-edit a vendored file.

## Pick the right stylesheet — this one bites

| Your surface | Vendor / import |
|---|---|
| has a theme toggle, or should follow the OS | `tokens.css` |
| is deliberately ONE scheme | `tokens-dark.css` (or `tokens-light.css`) |

**Getting this wrong is silent.** `tokens.css` follows `prefers-color-scheme`
unless an explicit `data-theme` overrides it. A dark-only surface that vendors
it and sets no `data-theme` renders LIGHT for a light-mode visitor — under
chrome built for dark. Harmony's Homepage and Authentik both shipped that way
and it took a phone screenshot to notice.

The pinned builds carry no media query and no attribute selector, so there is
nothing to remember to set.

## Two schemes

`tokens.css` emits three blocks and you almost never think about them: `:root`
carries **dark** (the default, so a page with no theme wiring is already right),
a `prefers-color-scheme` block follows the OS, and `[data-theme]` lets an
explicit toggle win in both directions.

A dark-only surface (Harmony, Lattice) just uses the variables and ignores the
rest. A surface with a toggle (pixeloven.com) sets `data-theme` on the root.

The light values were **derived, not picked**: each was solved for the same
contrast against its own ground that the dark step has against its ground, at
the same 227° hue. So the ladder ascends in luminance on dark and *descends* on
light — the invariant is distance from the page ground, not raw lightness.

Never reuse a dark value on light. The brand teal is 1.25:1 on a light surface;
the tests reject it.

## The vocabulary

Every token is `--pxo-<group>-<name>` in CSS, `groupName` in TS.

| Group | What it is for |
|---|---|
| `surface` | the elevation ramp: `surface-void` → `surface-canvas` → `surface-bg` → `surface` → `surface-hover` → `surface-raised` |
| `border` | continues that same ramp: `muted` → `border` → `strong` → `accent` |
| `text` | `bright`, `text`, `secondary`, `dim` — all pass AA body on `surface`; `on-accent` is for text sitting **on** an accent fill (white in both schemes) |
| `accent` | `accent` (brand violet — the *same value* in both schemes), `deep` (pressed; a **fill**, never a foreground), `soft` (accent text against the ground) |
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

**Every check runs against every scheme** — a ramp that clears AA on dark can
fail on light, so a light scheme tested on dark's assumptions ships unverified.

- the elevation ladder moves **monotonically away from the ground** (a ramp that
  inverts is the historical bug this guards)
- no two adjacent steps are within 3 in RGB (imperceptible steps are one value
  maintained twice)
- every text colour clears **4.5:1 on the ground it declares** via `on` — so
  `on-accent` is checked against the accent fill, not a surface it never touches
- foreground status and accent colours clear 3:1 on `surface`; accent fills are
  checked by whether `on-accent` text sits legibly on them
- the two schemes stay **perceptually equivalent** — each ladder step must sit
  the same distance from its own ground in both
- every colour token defines every scheme
- no two tokens share a value, unless one declares `sameAs`

These fail loudly on the real historical defects — verified by injecting them.
If a change makes one fail, the change is wrong, not the test.
