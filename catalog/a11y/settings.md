---
id: pxo:a11y/settings
title: Accessibility settings
tier: pattern
status: proposed
since: catalog-2026.11
owners: [design]
consumers: [bridge]
decisions: [pxo:ddr/0016]
sources:
  - "Bridge accessibility brief, 2026-11-21, sections 1 and 2, with its advisor answers (section 8)"
  - "Bridge candidates 3 (readable-first) and 5 (keyboard and command-first), which each built all ten settings"
---

# Accessibility settings

Accessibility is a set of choices people make on top of a safe default. This
entry is the contract for those choices: ten settings (S1–S10), where they live,
how they default and how they are tested. Each setting is a small token layer
keyed off an attribute on `<html>`, so a setting built once can be lifted into
another product. The behaviours that are always on, and the contrast, type,
motion and keyboard rules, are [`pxo:a11y/behaviours`](behaviours.md). The
acceptance test is [`pxo:a11y/checklist`](checklist.md).

> **Proposed: not adopted.** Which of Bridge's candidate pieces go into
> Bridge's MVP is an open decision. This entry is drafted from Bridge's
> candidates 3 and 5 and waits on that decision before it can be adopted.

> **Reach.** Which products must ship these settings is set by
> [DDR-0016](../../decisions/0016-accessibility-standard-reach.md) (`accepted`).

## Who ships what

| A product with… | Must | Recommended |
| --- | --- | --- |
| Anything | WCAG 2.2 AA, and the keyboard floor: behaviours B1–B8 where they apply ([`pxo:a11y/behaviours`](behaviours.md)) | The settings below that fit it |
| Motion that runs on its own | All ten settings, S1–S10 | The optional features |
| A live scene | All ten settings, plus the [live scene profile](#live-scene-profile) here and in [`pxo:a11y/behaviours`](behaviours.md#live-scene-profile) | The optional features |

A **live scene** is a picture that moves on its own for more than five seconds
beside other content: Bridge's harbour diorama, or a 3D graph that drifts.
WCAG 2.2 SC 2.2.2 (A) then requires a way to pause, stop or hide it, and has no
exemption for decoration. No browser pauses a canvas, so the page must.

## Rules

### One convention

- **Place.** One "Accessibility" group, first in Settings, one step from
  wherever display options live, and offered at first run.
- **Behaviour.** Each setting applies at once with no reload, shows its default,
  has Reset, and is kept per viewer. Storage that is blocked or empty never
  breaks the page.
- **System default.** Where the operating system reports a preference, the
  default value is `system`, and an explicit choice wins in both directions. An
  OS preference is the default of a setting, never the only switch:
  `prefers-reduced-transparency` is off by default in Firefox and missing in
  Safari.
- **Hooks.** The resolved value is mirrored on `<html>` as `data-a11y-<name>`,
  and the control carries `data-testid="a11y-<name>"`. Styles key off the
  attribute as a token layer. One test script then fits every product.
- **Every setting value is also a command** where the product has a
  [command bar](../patterns/command-bar.md), for example "Motion: still".

### The ten settings

Values are listed with the default first. "SC" is a WCAG 2.2 success criterion,
with its level in brackets.

**S1. Motion** (`motion`: system · full · calm · still)
- **Does:**
  - *full*: everything moves. `system` resolves to this unless the OS asks for less.
  - *calm*: ambient loops rest on one frame. No camera travel, zoom tween or
    parallax on its own. A state change is a cross-fade of 400 ms or less.
    Panels open with opacity only.
  - *still*: nothing moves on its own; content redraws only when its state changes.
  - A visible **Pause** control for whatever moves on its own, in every mode.
- **Why:** SC 2.2.2 (A) and SC 2.3.3 (AAA). Apple: "Make motion optional."
- **Test:** on a fresh profile, `page.emulateMedia({ reducedMotion: 'reduce' })`
  gives `data-a11y-motion="calm"`. Choosing *full* in the product while the OS
  still says reduce brings motion back. In *still*, one second after the last
  action, `document.getAnimations()` is empty. Pause is reachable by Tab.

**S2. Scene** (`scene`: show · hide)
- **Does:** *hide* removes the scene and its renderer. See the
  [live scene profile](#live-scene-profile).
- **Why:** it is the "hide" of SC 2.2.2, and the way out for weak devices and
  for anyone the scene does not help. The Game Accessibility Guidelines list
  "turn off / hide background movement".
- **Test:** with *hide* there is no `<canvas>`, every route still opens, and the
  counts match the ones shown with the scene.

**S3. Contrast** (`contrast`: system · standard · more)
- **Does:** *more* puts all text at 7:1 or better (chips and muted text
  included), control edges and focus rings at 4.5:1 or better, and makes every
  surface opaque. Separately and always: when the OS forces colours, use system
  colours and keep a real border on every control.
- **Why:** SC 1.4.6 (AAA), SC 1.4.11 (AA). Xbox Accessibility Guideline 102 asks
  for a high-contrast mode at 7:1 for all UI.
- **Test:** `emulateMedia({ contrast: 'more' })` gives `data-a11y-contrast="more"`,
  and the contrast script reports every text pair at 7 or above. With
  `emulateMedia({ forcedColors: 'active' })`, every control still shows an edge
  and a focus ring.

**S4. Transparency** (`transparency`: system · allow · reduce)
- **Does:** *reduce* makes every surface fully opaque and removes backdrop blur:
  panels, top bar, navigation, legends, counts and captions. *allow* permits a
  see-through look, inside the arithmetic bound in
  [`pxo:a11y/behaviours`](behaviours.md#live-scene-profile).
- **Why:** the OS signal does not reach the page in Firefox by default or in
  Safari at all, so the in-app switch is the only reliable route.
- **Test:** with *reduce*, a script finds no element that holds text and has a
  background alpha below 1 or a `backdrop-filter`. In Chromium (118 or later),
  emulating `prefers-reduced-transparency: reduce` in the DevTools Rendering tab
  gives `data-a11y-transparency="reduce"` on a fresh profile.

**S5. Text size** (`text-size`: 100 · 115 · 130 · 150 · 200 percent)
- **Does:** scales interface text, line height and control height together, in
  `rem`, so it also follows the browser's default font size. A panel that no
  longer fits becomes a sheet.
- **One allowed exception:** as a last resort, phone bottom-bar labels may stop
  growing at 130 %, after fewer tabs and two-line labels from a 14 px base have
  been tried, with every destination one step away at full size, and with the
  setting's help saying so. SC 1.4.4 is still met through browser zoom.
- **Why:** SC 1.4.4 (AA) and SC 1.4.10 (AA). Apple and Xbox guidance both name 200 %.
- **Test:** at 200, at both sizes: no text is clipped (`scrollWidth > clientWidth`
  on a box that does not scroll), no sideways page scroll, and targets still
  meet B4. Then browser zoom at 400 % on a 1280 px window (320 CSS px): the phone
  layout appears, and only two-dimensional content scrolls two ways.

**S6. Reading comfort** (`text-spacing`: standard · wide; `font`: default · hyperlegible · system)
- **Does:** *wide* sets line height 1.5, paragraph spacing 2 em, letter spacing
  0.12 em and word spacing 0.16 em on all text. *hyperlegible* switches to
  Atkinson Hyperlegible Next, with its Mono for ids. *system* uses the OS font.
- **Why:** SC 1.4.12 (AA) says nothing may break at exactly these values.
  Special dyslexia fonts have no proven benefit
  ([`pxo:a11y/behaviours`](behaviours.md#type)), so this is a choice of spacing
  and face, not a "dyslexia mode".
- **Test:** with *wide* and text size 130 together, the clipping script from S5 passes.

**S7. Status colours** (`palette`: standard · colour-blind safe)
- **Does:** swaps the status hues (and any category hues, such as graph origins
  or lenses) for a set that stays distinct with red-green and blue-yellow colour
  blindness. The starting point is the Okabe–Ito set: blue for under way (sky
  blue on dark), vermilion for failed, yellow for needs you. These are mark
  colours, not text colours: on a light ground most Okabe–Ito hues fall below
  3:1, so in a light scheme they are fills under dark text, or are darkened to
  4.5:1 before they carry text.
- **Why:** SC 1.4.1 (A). GitHub ships light and dark colour-blind themes.
- **Test:** with protanopia, deuteranopia, tritanopia and achromatopsia emulated
  in turn (Chrome DevTools Rendering tab, or Firefox Accessibility Inspector,
  Simulate), a reviewer names the state of every chip and row from a screenshot.
  Under achromatopsia this must work in both palettes, because status is never
  colour alone (B6).

**S8. Focus indicator** (`focus`: standard · strong)
- **Does:** *standard* is a 2 px solid ring with a 2 px gap, drawn in two tones
  so one always contrasts, on every focusable thing. *strong* is 4 px.
- **Why:** SC 2.4.7 (AA), SC 2.4.11 (AA), SC 2.4.13 (AAA).
- **Test:** Tab through every stop in each layout. A ring shows at each one, at
  3:1 or better against the control and its surroundings, and
  `document.elementFromPoint` at the focused element's centre returns it or its child.

**S9. Single-key shortcuts** (`keys`: on · off), plus a shortcut list opened with `?` and from Settings
- **Does:** *off* disables every shortcut that is one printable key with no
  modifier, for example `N`, `Shift+N`, `/` and `?` itself. Keys that work only
  while one component has focus stay, such as arrows inside a scene or a list.
- **Why:** SC 2.1.4 (A). Speech-input users trigger such keys by talking.
  GitHub has the same switch, "Character keys".
- **Test:** with *off*, pressing each single key outside a text field changes
  neither route nor focus. The list names every shortcut that exists and no others.

**S10. Captions** (`captions`: auto · on · off) **and Announcements** (`announce`: all · needs you only · off)
- **Does:** an announcement is one short sentence for each unprompted change
  that matters (an ask arrived, an item finished, an item failed), sent to one
  polite live region. Bursts combine. Captions show the same words on screen
  for a live scene ([profile](#live-scene-profile)).
- **Scope:** both settings govern unprompted events only. The result of the
  person's own action is always spoken and always shown, at every level.
- **Why:** SC 1.1.1 (A) and SC 4.1.3 (AA). Minecraft captions its sounds this
  way, with marks pointing toward the source.
- **Test:** trigger the fixture's events. The live region's text becomes the
  expected sentence. Three changes within 2 s give one combined announcement.
  Ambient changes (weather, time of day) give none.

### Live scene profile

A product with a live scene adds these to the settings above.

- **S1 Motion.**
  - *calm*: ambient loops rest on one frame: water, flags, smoke, birds,
    weather, blinking signs.
  - *still*: the scene is a picture that redraws only when the state it shows
    changes, and the render loop sleeps.
  - A visible **Pause scene** button in every mode freezes the scene clock until
    it is pressed again.
  - Dimming the scene when a panel opens is a 400 ms fade in every mode, never a
    cut. A brightness fade is not motion in WCAG's terms, and cutting the whole
    stage is the riskier choice for flashing.
  - **Test:** in *still*, at rest, two scene screenshots 2 s apart are identical.
- **S2 Scene.** With *hide*, home becomes the scene's list on a plain surface,
  and controls that would act on the scene (such as "Show in scene") are not drawn.
- **S3 Contrast.** *more* also dims the scene a step further behind panels.
- **S4 Transparency.** *reduce* also covers captions and scene labels.
- **S5 Text size.** The scene is not scaled. Scene labels may stop growing at
  130 %, provided the same words are one step away at full size (in the scene's
  list) and the setting's help says so.
- **S7 Status colours.** The swap applies in the scene as well as in panels, and
  a reviewer names the state of every object in the scene too.
- **S8 Focus indicator.** The ring is drawn on the scene too. *strong* also rings
  the matching object in the scene.
- **S10 Captions.**
  - A caption is one short line for each change that matters. It sits on an
    opaque plate near the scene for at least 5 s, and it is a button that opens
    the thing it describes.
  - *auto* turns captions on whenever Motion is calm or still, because the
    animation that would have shown the change is gone.
  - While a panel covers the scene, captions sit in a reserved strip of constant
    height, never over the panel's text. The strip keeps the latest caption.
  - **Test:** all of it still works while a full-screen panel covers the scene.

## Optional features

None is required. Each is a way to stand out.

| # | Feature | Seen in |
| --- | --- | --- |
| O1 | First-run presets (low vision, motion sensitive, keyboard only, calm) that each set several of S1–S10, all still editable | The Last of Us Part II: three presets over more than 60 settings |
| O2 | Scene clarity mode: mute the scene's colour, and give everything you can open a flat strong colour and an outline | The Last of Us Part II, "High contrast display" |
| O3 | Scene activity level: how much ambient life there is, separate from motion | An operator request for a calmer scene |
| O4 | Dim panels that do not have focus | VS Code, `accessibility.dimUnfocused` |
| O5 | Reading mode on any panel | The reading column in [`pxo:pattern/panel-over-scene`](../patterns/panel-over-scene.md) |
| O6 | A saturation slider for the whole product | Discord |
| O7 | Captions that say where ("Dock 2"), with a mark pointing there, and a caption history | Minecraft's `<` and `>` |
| O8 | Remappable shortcuts in place of on and off | The "remap" route of SC 2.1.4 |
| O9 | A key that reads a summary aloud on demand, and finer announcement levels | Slack, "Message verbosity" |
| O10 | OpenDyslexic as one more face, labelled as a preference and never the default | The evidence under [type](behaviours.md#type) |
| O11 | Sound cues for the caption events, off by default, one switch each | VS Code accessibility signals |
| O12 | Direct keyboard focus on scene objects, in reading order | PixiJS 8's accessibility overlay |

## Accessibility

This entry is the accessibility standard's settings layer. The tokens do not
yet carry its layers: contrast more, forced colours, reduced transparency,
focus width and offset, and a colour-blind-safe status set are planned as
additive layers in a later `@pixeloven/tokens` release. Until then, a product
that ships a setting keeps its values in one token-layer file keyed off the
`data-a11y-*` attribute, and replaces that file when the release lands.

## Reference implementation

Bridge's candidates 3 and 5 each built all ten settings. Their code lives in
local repositories with no remote yet, so it is described here, not linked or
copied. It is linked once Bridge has a repository.

- **Candidate 3's `src/a11y/`** holds S1–S10 as one schema-driven store, each
  value mirrored as `data-a11y-*` on `<html>`, with `a11y.css` as the token
  layer. Beside it: the Accessibility settings group, first-run presets (O1),
  the shortcut list, captions and announcements with burst combining and a
  history (O7), and the keyboard infrastructure (S9 gating, region keys, return
  to the opener). It lifts as a unit, with its unit and end-to-end tests.
- **Candidate 5** builds the same store and adds every setting value as a
  command, remappable single-key shortcuts (O8) and a summary spoken on demand (O9).

## Sources

- The Bridge accessibility brief of 2026-11-21, sections 1 and 2, and the
  advisor answers that amended S1, S5 and S10. It cites every WCAG criterion
  and platform guideline named here.
- WCAG 2.2, W3C Recommendation: https://www.w3.org/TR/WCAG22/
- Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/
- MDN, `prefers-reduced-transparency`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency
- Playwright `emulateMedia`: https://playwright.dev/docs/api/class-page#page-emulate-media
- Okabe and Ito, Color Universal Design: https://jfly.uni-koeln.de/color/
- GitHub accessibility settings: https://docs.github.com/en/account-and-profile/how-tos/account-settings/managing-accessibility-settings
- Game Accessibility Guidelines: https://gameaccessibilityguidelines.com/full-list/
- Xbox Accessibility Guidelines: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102
