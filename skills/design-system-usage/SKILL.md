---
name: design-system-usage
description: "How to consume PixelOven design tokens in any project — the two distribution paths (npm import vs vendored CSS), the token vocabulary (colour, and the non-colour scales: radius, type, easing, duration, shadow, z-index), and the rule that no consumer defines its own. Load before adding, changing, or theming any UI surface in a PixelOven repo. Landmine: a literal hex value — or a literal radius, duration or z-index — in a consumer is how the system decays back into copies, and there is a CI gate for exactly this."
---

# Using the PixelOven design system

`@pixeloven/tokens` is the **source of truth for every surface colour, and for the
scales a surface is built out of** — radius, type, easing, duration, shadow and
stacking order. A consumer never defines one.

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

### Opt-in brand themes

Tokens 0.6 adds `themes.css` and the typed `themes` entry point. Existing exports
keep their values. Import `tokens.css` then `themes.css`, and set
`data-pxo-theme="cool"` or `"warm"` on the root. Choose `data-pxo-accent="acid"`
or `"violet"` independently. The existing `data-theme="dark"|"light"` selects
appearance; omit it to follow the OS. No visual-theme attribute means no opt-in.

Use `resolveTheme`, `normalizeThemeSettings` and `resolveAppearance` for the same
roles in code. Consumers own persistence and OS subscriptions. Preserve existing
saved appearance and the application's fallback during migration. New actions
use the paired `actionPrimary`/`actionOnPrimary` roles, with explicit hover and
pressed fills. Text uses `accentText`, not a bright fill. Essential boundaries
use `borderControl`. See `packages/tokens/README.md` for the complete contract.

The legacy vocabulary and two-scheme behavior below still apply to existing imports.

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

### The non-colour scales

These are **scheme-independent**: one value, no `dark`/`light`. A radius does not
change with the ground. They come out of `:root` in every stylesheet the package
ships, including both pinned builds.

| Group | Tokens | What it is for |
|---|---|---|
| `radius` | `--pxo-radius-xs` 3px · `-sm` 4px · `--pxo-radius` 8px · `-lg` 12px | chips · controls · panels · modals. `sm`/`base`/`lg` are the 4px grid; `xs` is deliberately off it |
| `type` | `--pxo-type-<step>-{size,line-height,weight,letter-spacing}` for `display` `title` `subtitle` `body` `ui` `label` `micro` | seven steps, each carrying all four metrics. Body is **13px/18px** |
| `ease` | `--pxo-ease-out` · `--pxo-ease-in-out` | two curves and no more. No `ease-in` (reads as lag), no overshoot |
| `duration` | `--pxo-duration-in` 0ms · `-out` 140ms · `-fast` 120ms · `--pxo-duration` 180ms · `-exit` 100ms · `-slow` 280ms | duration scales with **distance travelled** |
| `shadow` | `--pxo-shadow-soft` · `--pxo-shadow` · `-strong` · `-lip` · `-lip-strong` | popovers and above. `lip` is the 1px inset top edge that reads as "in front" |
| `z` | `--pxo-z-` `canvas` 0 · `chrome` 10 · `panel` 20 · `popover` 30 · `overlay` 40 · `modal` 50 · `toast` 60 · `tooltip` 70 | steps of 10, so you can slot a layer in without renumbering |

Three rules that are asserted, so you can rely on them rather than re-deriving them:

- **Line-heights are integer px, never unitless ratios.** A ratio makes sub-pixel
  line boxes, which break the 4px rhythm and make grouped lists drift.
- **Tracking rises as size falls** — `-0.02em` at `display`, `+0.12em` at `micro`.
- **An exit is faster than the enter it reverses** (`exit` 100ms vs `base` 180ms).
  Hover is the documented exception and inverts it: `in` is 0ms because easing in
  feedback about your own pointer only adds latency; `out` is 140ms so a fast
  mouse crossing twenty rows does not strobe.

Shadow alphas are tuned on the **dark** ground — the only ground with a production
surface to derive them from. They are not wrong on light, but they are heavier
than a light scheme wants. If you are building a light-first surface, raise it
rather than forking a lighter value locally.

There is deliberately **no spacing scale**. Every consumer so far is on Tailwind
and inherits its 4px grid, so there is no hand-authored copy to drift — which is
not true of the six groups above, all of which were hand-authored in Lattice
before they lived here. A non-Tailwind consumer is the trigger to add one, and it
should be derived from a real surface rather than invented.

## The rules

1. **No literal hex in a consumer.** Not in CSS, not in TS, not in an SVG that
   ships as a brand asset. Marks live in `@pixeloven/brand`. The same goes for a
   literal radius, font size, duration or z-index: `border-radius: 6px` is the
   drift that started the colour problem, wearing different units.
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

And for the non-colour scales, in `test/scales.test.mjs`:

- the radius scale **ascends** in whole pixels
- every type step carries **all four metrics**; sizes and line-heights descend
  together, line-heights are integer px and never smaller than their own size
- **tracking rises as the ramp falls**, and weights are real CSS weights
- durations ascend, and **an exit is faster than the enter it reverses**
- the stacking order is strictly ascending with **no two layers on one number**
- no non-colour token **smuggles in a colour** — a shadow must use a token's
  `-rgb` companion, or neutral black/white at an alpha, never a literal
- every scale is **scheme-independent**, and no two tokens claim the same CSS
  custom property
- a **scheme-pinned build carries every token**, not only the colour ones

These fail loudly on the real historical defects — verified by injecting them.
If a change makes one fail, the change is wrong, not the test.

## Readable surfaces and graph themes (tokens 0.5.0)

The seven compact `type` roles keep their existing pixel metrics. Prefer the
additive `reading` group for human task text. Each role exports `size`,
`lineHeight`, `weight`, `letterSpacing` and `fontFamily`:

| Role | Default size/leading/weight | Family |
|---|---|---|
| `reading.body` | 16/24/400 | Plex Sans |
| `reading.control` | 14/20/500 | Plex Sans |
| `reading.input` | 16/24/400 | Plex Sans |
| `reading.code` | 14/22/400 | Plex Mono |

The new sizes and line heights use rem, so user root-font preferences scale them
without local conversion. Use existing `type.display`/`type.title` with
`font.sans` for headings; browser zoom also scales these existing pixel roles.
The integer-pixel rule above applies to the compact ramp, not `reading`.

CSS example: `var(--pxo-reading-body-size)`; JS example:
`tokens.dark.readingBodySize`. Import `@pixeloven/tokens/tokens.css` for every
CSS role; both pinned builds include them too. Consumers self-host licensed
Plex fonts and select subsets/weights for their content; the tokens contain
font stacks rather than font binaries. The reference docs bundle Latin Sans
and Mono 400/500/600 from Fontsource with swap rendering.

Graph origins use `--pxo-graph-origin-<origin>` / `graphOriginDataview` (the six
origins include `frontmatter-ref` / `FrontmatterRef`). `graphPatternCanvas` is
`dashed`; the other patterns are `solid`. Preserve this second channel in DOM
and WebGL; map dashed to the existing curved 3D link encoding. Never replace a
static distinction with motion alone.

`graphCanvas`, `graphNode`, `graphNodeHub`, `graphNodeIsolated`,
`graphNodeSelected`, `graphNodeHover`, `graphNodeDimmed`, `graphEdgeDimmed`,
`graphLabelSurface`, `graphLabelText` and `graphLight{Ambient,Key,Rim}` cover the
scene. CSS uses the corresponding kebab-case names. Isolated means no links in
the loaded projection; dimmed roles are nonessential context only. Essential
opaque marks have at least 3:1 canvas contrast and label text 4.5:1 on its opaque
label surface. Origin colors are graphical marks, not prose colors.

`browserTheme` supplies browser theme-color. `interactionFocus` supplies a 3:1
focus outline against page, canvas, panel, hover and raised surfaces. Update
DOM, WebGL and browser chrome from the same resolved dark/light scheme. Set
`color-scheme` with `data-theme`; CSS tokens do not own preference storage.

Source values are not rendered-material evidence: verify real edge opacity,
lighting, fog, tone mapping and hover/selection in both themes. Lattice's
previous link opacity of 0.35 is specifically not certified by the opaque
palette tests. Scene updates must preserve positions, selection and camera.
