# @pixeloven/brand

PixelOven is the parent identity; Lattice is a product. Solid is the primary
figure for headers and name lockups. Inset is the companion figure for browser
tabs, installed apps and avatars. Both identities use the same canonical ink
and ground tokens. Product identity comes from the figure.

## Use an asset

```js
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const registry = require("@pixeloven/brand/marks.json");
const lattice = registry.marks.find(({ id }) => id === "lattice");
const file = lattice.variants.solid.assets.light.lockup;
const lockupPath = require.resolve(`@pixeloven/brand/${file}`);
```

Copy the resolved file into your app's static assets during its build. In a
bundler that supports asset URLs, the shorter export is also available:

```js
import lockupUrl from "@pixeloven/brand/assets/lattice/solid/light/lockup.svg?url";
```

`marks.json` is the registry. Each identity retains its original `file` and
adds `variants.solid` and `variants.inset`. Every `source` and asset path resolves
as `@pixeloven/brand/<path>`. `./assets/*` is an alias for `./dist/assets/*`.
The registry's `assetContract` records color roles, typography and mask padding.
No consumer needs to reconstruct a mark or typeset a wordmark.

| Variant | Asset keys in each `assets.light` / `assets.dark` | Use |
| --- | --- | --- |
| Solid | `mark`, `lockup` | Headers, navigation, parent and product signatures |
| Inset | `mark` | Transparent square icon on a known ground |
| Inset | `favicon.svg`, `favicon.png16`, `favicon.png32` | Browser tab and favicon fallback |
| Inset | `app.svg`, `app.png180`, `app.png192`, `app.png512` | Square app icons; 180px for an Apple touch icon |
| Inset | `maskable.svg`, `maskable.png192`, `maskable.png512` | Maskable web app icons and cropped avatars |

## Appearance and accessibility

`light` means dark ink for a light ground. `dark` means light ink for a dark
ground. Every generated SVG carries explicit `text.base` ink; favicon, app and
maskable assets also carry an opaque `surface.bg` ground. The neutral roles are
shared by both identities and independent of accent choice. Exported assets do
not inherit a page's CSS or require a font.

Transparent marks and lockups should use the matching appearance on a known
ground. They must not sit over busy imagery or lose their contrast. Icon assets
with opaque grounds remain legible when used outside the application theme.
For a single stable favicon URL, choose an opaque set and keep that URL stable
as you update the file. Consumers choosing appearance-specific icons should
declare both explicitly; an external SVG cannot inherit the surrounding page's
text color.

All SVGs carry a title, `role="img"` and an accessible name. With HTML `<img>`,
provide `alt="Lattice"` or `alt="PixelOven"`; use empty alt when adjacent text
already supplies the same name. The SVG title does not replace HTML alt text.

`sources/<variant>/<identity>.svg` are the four approved 64-unit masters with
`currentColor`. They are for controlled inline use and asset generation. They
are deliberately distinct from the standalone explicit-ink exports. Preserve
the selected paths, cutouts, stroke width and proportions when embedding them.

## Clear space, size and cropping

Reserve at least **8 units on the 64-unit mark grid** outside the visible
artwork, including around a complete lockup. At a 32px mark canvas, that is 4px
of clear space. The transparent space already inside an asset is not a substitute
for this separation from text, controls or other marks. Scale proportionally.

| Asset | Minimum rendered size |
| --- | --- |
| Solid mark | 24 × 24 CSS px |
| Solid lockup | 32 CSS px tall; width follows its viewBox |
| Inset mark / favicon | 16 × 16 CSS px; prefer 24px or larger when space allows |
| Maskable / cropped avatar | 48 × 48 CSS px |

The favicon deliberately preserves the approved Inset geometry at 16px. Fine
interior details soften at this size; do not shrink it further or redraw a
different silhouette. Inspect the actual pixels at the intended size.

Normal app exports use the full approved Inset canvas with an opaque square
ground. Let the platform apply its corners. Use the **maskable** export for a
circle, rounded avatar or a manifest icon with `purpose: "maskable"`; do not
crop the normal app export into a circle. The maskable artwork is centered at
64% scale so its complete foreground remains inside the central safe circle,
whose radius is 40% of image width. The opaque background extends to every edge.
This follows the [web app manifest mask safe area](https://www.w3.org/TR/appmanifest/#icon-masks).

```json
{
  "icons": [
    { "src": "/app-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/app-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## Lettering and reproducible builds

Lockups outline the approved mixed-case IBM Plex Sans Medium (500), with
−0.025em tracking and kerning. They place 40-unit type next to the unchanged
64-unit Solid canvas with a 12-unit gap, centered on the visible letter bounds.
The outlines use the pinned Latin normal 500 WOFF from
`@fontsource/ibm-plex-sans@5.3.0`; the font's OFL is included in `LICENSES/`.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter @pixeloven/brand build
pnpm --filter @pixeloven/brand test
```

The build reads `@pixeloven/tokens/source`, outlines lettering with pinned
[fontkit](https://github.com/foliojs/fontkit), and renders PNGs with pinned
[resvg](https://github.com/thx/resvg-js). It does not load system fonts or use
network resources. `dist/` is ignored in Git, rebuilt by `prepare`, included
in the published package, and rebuilt and tested by `prepublishOnly`.
Tests preserve the selected geometry, enforce directory/registry parity and
explicit canonical colors, render SVGs, check PNG size/content and safe-area
pixels, and resolve every reference from a package tarball installed offline.

## Compatibility

The original `marks/pixeloven.svg`, `marks/lattice.svg`, `./marks/*` exports and
`marks[].file` values remain unchanged in 0.2.0. Existing consumers keep their
current figures until they explicitly adopt a variant. Pin the published package
version and preserve consumer icon URLs when adopting the new artwork.
