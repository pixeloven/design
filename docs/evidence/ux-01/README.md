# UX-01 implementation evidence

2026-09-21. Scoped candidate for [design #4](https://github.com/pixeloven/design/issues/4),
prepared on `feat/lattice-readable-tokens` from design main
`9e856c9f9fd2c3e9954fb8b760af52f382e41ae1`. Package **0.5.0 is prepared locally**;
this record does not claim publication, merged acceptance, or Lattice adoption.

## Delivered contract

128 exported leaves: all 81 existing leaves retain their values and usage
metadata; 47 are additive. The seven compact type roles, original palette and
registered marks are unchanged. `reading.body/control/input/code` include rem
size/line-height, weight, tracking and font stack. Default metrics are 16/24/400,
14/20/500, 16/24/400 and 14/22/400 respectively.

`graphOrigin` carries all six origins; `graphPattern` retains Canvas's static
second channel. `graph` contains canvas/fog ground, neutral node states,
nonessential dimmed context, opaque identity labels and physical light colors.
`browser.theme` and `interaction.focus` complete the browser/focus roles.
CSS, both pinned CSS builds, ESM, JSON and TypeScript declarations expose them.
See [usage guidance](../../../skills/design-system-usage/SKILL.md) and the
Storybook `Foundations/Graph and theme`, `Foundations/Typography` and
`Specimens/Lattice/Overview` pages.

The color-science helper is ported without algorithm changes from Lattice
`8577b414e9c5e86ad5ab2232b5249e952cbb6164`, `frontend/lib/graph/color.ts`.
The original palette thresholds are retained in both schemes: opaque origins
at least 3:1 on canvas, typed pairs at least 15 ΔE00 and neutral-to-typed pairs
at least 12 under all four existing vision simulations. The original dark
origin colors are preserved exactly; light values stay in the same hue families.

## Executed checks

Environment: Node 22.23.2, pnpm 9.12.0, Storybook 10.5.10 / Vite 6.4.3,
Playwright 1.63.0, Chromium 149.0.7827.55 on Linux, axe-core 4.13.0.

| Command / check | Result |
|---|---|
| Initial `node --test test/reading.test.mjs test/graph.test.mjs` in `packages/tokens`, before token implementation | Eight failures for absent roles/exports; meaningful red baseline |
| `pnpm install --frozen-lockfile` after the font dependency/lock update | Passed; lockfile unchanged |
| `node packages/tokens/src/build.mjs` | 128 leaves × two schemes built |
| `node --test --test-reporter=spec` in `packages/tokens` | 38 passed |
| `node --test` in `packages/brand` | 10 passed; no mark changes |
| `node --test --test-reporter=spec` in `apps/docs` | Seven passed |
| `pnpm --filter @pixeloven/docs build` | Production Storybook build passed |
| `impeccable detect --json apps/docs/stories/Lattice.stories.tsx apps/docs/stories/Lattice.css` using the installed 4.2.0 launcher | `[]`, no findings; bounded visual confirmation followed |
| `git diff --check`; `node --check` for browser evidence runner and color helper | Passed |
| Recursive comparison with `git show 9e856c9:packages/tokens/src/tokens.json`, ignoring documentation comments | All 81 old token leaves and metadata preserved |
| `npm pack --pack-destination ../../.scratch --json` in `packages/tokens`, then extract/import packed ESM | Nine expected files, version 0.5.0, 128 roles per scheme; changelog included |
| `check-specimens.mjs`, exact invocation below | Six theme/viewport/text-scale combinations passed, no external requests or page errors |
| Same runner with `AXE_PATH` unset | Deliberately fails before browser launch; an absent audit cannot look like a pass |

Build notices: the pre-existing future `packages/ui` story glob has no files;
Storybook's documentation bundles exceed Vite's advisory chunk-size threshold.
The local user npmrc warns about an unset registry credential during public
dependency installation; no private package publication was attempted.

## Measured evidence

[token-results.json](token-results.json) records the compatibility comparison and
unrounded measurements. Minima across every tested pair/model:

| Measurement | Dark | Light |
|---|---:|---:|
| Origin/canvas contrast | 5.08:1 | 3.57:1 |
| Typed-origin ΔE00 | 18.97 | 21.87 |
| Neutral/typed ΔE00 | 12.41 | 17.76 |
| Focus/declared-ground contrast | 7.24:1 | 4.00:1 |
| Label-text/opaque-label contrast | 16.68:1 | 16.65:1 |

[browser-results.json](browser-results.json) records actual font faces, computed
metrics, every target's dimensions, focus, six static patterns, overflow and
the actual axe version/pass counts/violations/incomplete checks. `AXE_PATH` is
mandatory. Every recorded axe run completed with zero violations and zero
incomplete checks. The source scroller has explicit named-region semantics.

| Case (both themes) | Evidence |
|---|---|
| 1440×1000, default text | [Dark](dark-desktop.png), [Light](light-desktop.png) |
| 390×844, default text | [Dark](dark-phone.png), [Light](light-phone.png) |
| 320×568, 200% root font size | [Dark](dark-text-200.png), [Light](light-text-200.png) |

Body/input compute to 16/24 at default root and 32/48 at doubled root; code
computes to 14/22 and 28/44. Search results use the body role. There is no
application horizontal overflow; all tested buttons/inputs remain at least
44×44 CSS px. Long ordinary paths wrap; literal source is selectable in its
contained scroller. Search filtering, clear, selected state, keyboard Tab and
visible focus were exercised. Focus/selected/disabled/error states appear in
the captures. The bounded visual review kept panel padding fixed while text
enlarges, preserving more reading width.

Plex Sans 400/500/600 and Mono 400 loaded in the specimen from bundled local
assets; Mono 500/600 are also supplied for the existing compact reference pages.
No external request was made. Fontsource dependencies are pinned to 5.3.0; the
full upstream SIL OFL notices are copied into the published docs assets under
`fonts/`. The token package itself contains font stacks, not font binaries.

## Reproduce the browser check

Build docs, serve `apps/docs/storybook-static` on loopback port 6106 with any
static HTTP server, then from the repo root run the following. The executable
path shown is the already installed Chromium used for this evidence; substitute
the local Playwright Chromium path when necessary.

```sh
npm install --prefix .scratch --no-save playwright@1.63.0
PLAYWRIGHT_MODULE="file://$PWD/.scratch/node_modules/playwright/index.mjs" \
CHROMIUM_PATH=/home/operator/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome \
AXE_PATH="$PWD/node_modules/.pnpm/axe-core@4.13.0/node_modules/axe-core/axe.min.js" \
node docs/evidence/ux-01/check-specimens.mjs
```

`SPECIMEN_URL` can override the base URL. `CAPTURE=0` replays assertions and
updates the JSON without taking another visual batch; this was used for the
final source-region semantics correction, which does not alter the captures.
The runner is a local evidence tool, not a new CI/browser dependency. Temporary
tool installation and pack artifacts are dispensable after inspection.

## Limits and next owner

This is upstream token/specimen evidence. Native token contrast is not proof of
3D material contrast: Lattice UX-03A/UX-06 must replay edge alpha (previously
0.35), lighting, fog, tone mapping and static pattern/label rendering in both
themes. Dimmed context is explicitly nonessential. Light radiance is not a
foreground color, and its existing physical values remain the same by design.

The original pixel heading/compact roles stay compatible. Browser page zoom
scales them; user root-font preferences scale the additive reading roles. The
recorded 200% test is root-font enlargement, not physical-phone or screen-reader
acceptance. Dark/Light/System resolution, storage failure, camera/selection
retention, full user journeys and production fonts remain consumer work.

No material plan delta. Package-specific version/tag conventions are preserved;
no release-workflow overhaul, push, PR, merge, tag or publish was performed.
Independent review and final-head CI belong to the lead. Merge of the version
bump triggers the established release workflow; verify the resulting
`@pixeloven/tokens@0.5.0` registry artifact and source/tag identity before UX-03A
pins it. [package-results.json](package-results.json) records the **local**
tarball's file inventory, integrity and SHA-256 for review, not published
provenance.
