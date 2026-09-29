# PixelOven tokens

`@pixeloven/tokens` owns shared colors, typography and component scales. The
default export and `tokens.css`, `tokens-dark.css`, `tokens-light.css`,
`tokens.json` and `source` retain the existing palette and behavior.

## Opt in to approved themes

```ts
import "@pixeloven/tokens/themes.css";
import {
  normalizeThemeSettings,
  resolveTheme,
  type ThemeSettings,
} from "@pixeloven/tokens/themes";

const settings: ThemeSettings = {
  theme: "cool",       // cool | warm
  accent: "acid",      // acid | violet
  appearance: "system", // dark | light | system
};
const resolved = resolveTheme(settings, "light"); // caller's observed OS scheme
resolved.scheme;                 // light
resolved.tokens.surfaceBg;       // full resolved ThemeTokenSet
resolved.tokens.graphCanvas;     // same appearance as the DOM
resolved.tokens.browserTheme;    // same appearance as browser theme-color
```

`themes.css` is complete on its own. If also importing legacy `tokens.css`, load
`themes.css` last. Opt in on the document root:

```html
<html data-pxo-theme="cool" data-pxo-accent="acid" data-theme="dark">
```

`data-pxo-theme` accepts `cool` or `warm`; without either, the stylesheet does
nothing. `data-pxo-accent` accepts `acid` or `violet`; missing or unrecognized
values use Acid. Set `data-theme="dark"` or `data-theme="light"` for an explicit
appearance. **Remove `data-theme` for System.** CSS follows the operating system,
with Dark as the fallback, and sets `color-scheme` alongside every token. A theme
changes neutral colors; it does not change the shared component geometry or type.
Only document-root opt-in is supported; nested theme scopes are not an API.

The package never accesses the DOM, `matchMedia` or storage. The consumer observes
OS changes, stores choices, handles malformed JSON and storage exceptions, updates
root attributes, browser chrome and renderer, and cleans up listeners. Do not
persist the resolved scheme in place of a System preference.

`normalizeThemeSettings(unknown)` accepts a decoded saved object, preserves each
valid own field and replaces invalid/missing fields with `cool`, `acid`, `system`.
Arrays, primitives, null and inherited settings use those defaults; unknown keys
are ignored. `resolveTheme` also validates at runtime, returns frozen settings,
the resolved `scheme` and a frozen full `tokens` object. Invalid system schemes
fall back to Dark. `resolveAppearance` is the same pure appearance calculation.
Explicit Dark/Light always wins over the observed OS scheme. With no arguments,
resolution is Cool/Acid/System resolved to Dark.

**Existing consumers keep their defaults and saved appearance.** In particular,
Lattice retains Dark unless the operator chooses another appearance. A migration
must supply that existing default before normalization; adopting this opt-in
API must not silently change an established Dark preference to System.

Other exports are frozen `themeNames`, `accentNames`, `appearances`,
`defaultThemeSettings` and `themeTokens[theme][accent][scheme]`. TypeScript exposes
strict `ThemeName`, `AccentName`, `Appearance`, `Scheme`, `ThemeSettings`,
`ThemeTokenSet` and `ResolvedTheme` types. `ThemeTokenSet` extends the incumbent
`TokenSet`. `themes.json` contains the same complete eight token sets using JS
names; `themes/source` exposes the canonical annotated source.

## Roles and contrast

CSS names are `--pxo-` plus the kebab-case JS name. Every color also emits an
`-rgb` companion with space-separated channels for CSS color composition.

| Role | Contract |
| --- | --- |
| `surfaceBg`, `surface`, `surfaceRaised` | Approved page, panel and raised planes. `surfaceVoid`/`surfaceCanvas` alias page; `surfaceHover` aliases raised. |
| `text`, `textBright`, `textSecondary`, `textDim` | At least 4.5:1 on every neutral plane. |
| `border`, `borderMuted` | Decorative separators only. |
| `borderControl`, `borderStrong`, `borderAccent` | At least 3:1 against each adjacent neutral plane. Keep this boundary on primary actions, especially the bright Acid fill on Light. |
| `actionPrimary`, `actionPrimaryHover`, `actionPrimaryPressed` | Explicit default, hover and pressed action fills. Always pair with `actionOnPrimary`. |
| `actionOnPrimary`, `textOnAccent` | At least 4.5:1 on all three primary fills. |
| `accentText`, `accentSoft` | Accent foreground text, at least 4.5:1 on neutral planes. The vivid `accent` fill is not a text color. |
| `interactionFocus` | At least 3:1 against neutral and selection grounds. Use an offset outline so the neutral ground separates it from the action fill. |
| `interactionSelectionSurface`, `interactionSelectionText` | Explicit selection pair, at least 4.5:1. `statusSurfaceAccent` uses the selection ground and needs selection ink. |
| `accent`, `accentDeep` | Legacy aliases of primary default and pressed fills. |

The default action fills are the same in both appearances: approved Acid and
electric Violet. Hover/pressed colors are canonical derived states with the same
ink, not opacity effects composed by each consumer. Interaction meaning also
needs a visible state or shape; color alone is insufficient.

Status success/warning/danger foregrounds and graph-origin colors/patterns keep
their established meanings and values across theme/accent choices. Status ink
clears 4.5:1 on neutral planes and its matching status callout. The opt-in light
danger-callout surface is slightly lighter than the legacy surface to meet that
text contract. Graph canvas and labels follow the neutral theme; essential opaque
nodes and edges clear 3:1 and graph labels 4.5:1. Preserve the Canvas origin's
dashed/curved second channel. Dimmed context, light radiance, renderer opacity,
fog and tone mapping are not readable foreground guarantees; verify the actual
rendered scene before consumer adoption.

Edit `src/themes.json` to change an approved theme role. `use`, declared grounds
and contrast thresholds travel with its source. New themes resolve on top of
`src/tokens.json`, which continues to own unchanged scales and semantic roles.
Build with `npm run build`; run `npm test` in this package. Tests cover all eight
combinations, actual CSS/JS/JSON/type outputs, invalid saved data, appearance
resolution and byte compatibility of every incumbent generated artifact.
