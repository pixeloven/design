---
id: pxo:a11y/checklist
title: Accessibility acceptance checklist
tier: pattern
status: adopted
since: catalog-2026.11
owners: [design]
consumers: [bridge]
decisions: [pxo:ddr/0016]
sources:
  - "Bridge accessibility brief, 2026-11-21, sections 3.5 and 4, with its advisor answers (section 8)"
  - "Bridge candidates 3 and 5, reviewed against this checklist in two rounds each"
---

# Accessibility acceptance checklist

The acceptance test for [`pxo:a11y/settings`](settings.md) and
[`pxo:a11y/behaviours`](behaviours.md): 32 lines, each pass or fail, and the
test kit that runs them. A review reports every line, including the ones that
were not tested.

> **Provisional: reach.** Which lines a product must pass follows an open
> decision ([DDR-0016](../../decisions/0016-accessibility-standard-reach.md),
> `proposed`). Under its recommended option, every product passes the keyboard,
> semantics and honesty lines and the AA floor; a product with motion or a live
> scene passes them all. Lines marked **(scene)** apply only to a live scene.

## Rules

Run at 1440 × 900 and 390 × 844, light and dark, in Chromium and Firefox.

**Settings**

1. The Accessibility group is first in Settings, one step from wherever display
   options live, and offered at first run.
2. S1–S10 exist with the names and values in [`pxo:a11y/settings`](settings.md).
   Each shows its default, has Reset, applies with no reload and survives one.
3. `<html>` carries the resolved `data-a11y-*` value for each.
4. OS reduced motion gives *calm* and OS more contrast gives *more*. An in-app
   choice overrides each, both ways.
5. Motion *still*, at rest: no animation is running, and **(scene)** two scene
   shots 2 s apart are identical.
6. A visible Pause control exists in every mode and works from the keyboard.
7. **(scene)** Scene *hide*: no canvas, and every route works.
8. Contrast *more*: all text at 7:1 or better. Forced colours: every control has
   an edge and a focus ring.
9. Transparency *reduce*: no text on a see-through or blurred ground.
10. Text size 200 with spacing *wide*: nothing clipped or overlapping, no
    sideways scroll.
11. Browser zoom 400 % at 1280 px: the phone layout, and only two-dimensional
    content (a scene, a graph) scrolls two ways, each inside its own box.
12. Palette: every state can be named from a screenshot under each of the four
    simulated deficiencies.
13. Keys *off*: no single-key shortcut fires.
14. Announcements (and **(scene)** captions) fire for the fixture's events,
    combine bursts, and stay silent for ambient changes.

**Keyboard**

15. Every control and route works with the keyboard alone, with no trap.
16. The skip links work, and so does a move between regions (the chord or a command).
17. Open puts focus on the panel title. Close returns it to the opener. Escape
    closes the top panel only.
18. A focus ring shows at every Tab stop at 3:1 or better, and the focused
    element is never covered.
19. Move, resize and reorder each work by click alone and by keyboard alone.
20. Targets are 24 px or more (32 desktop, 44 touch by design).

**Semantics**

21. axe reports 0 violations with the five WCAG tags, on every route, with a
    panel open.
22. The ARIA snapshot of each route shows the landmarks, one `h1`, each panel
    named by its title, and every icon button named.
23. **(scene)** The scene's list holds everything the scene shows, with the same counts.
24. Behind a dialog everything is inert. Under a full-screen panel, what it hides
    is inert and what stays visible works.

**Visual**

25. The contrast table in [`pxo:a11y/behaviours`](behaviours.md#contrast-targets)
    is met, measured against real pixels wherever anything is see-through.
26. **(scene)** The panel edge is 3:1 or better against the scene at its worst segment.
27. **(scene)** No text sits directly on the scene.
28. No information is carried by colour alone, in panels or **(scene)** in the scene.

**Motion**

29. Nothing flashes more than three times a second, and nothing loops in the interface.
30. **(scene)** While a panel has focus the scene is damped, and no one-shot
    plays under the panel.
31. *Calm*: no camera travel, zoom tween or parallax on its own.

**Honesty**

32. The review states what was not tested: a real screen reader, a real phone, WebKit.

## Test kit

Agents cannot drive a screen reader, so the kit tests the accessibility tree
and the pixels, and line 32 says plainly what that leaves out.

- **Media emulation.** Playwright's `page.emulateMedia` covers `reducedMotion`,
  `forcedColors` and `contrast` (from 1.51). Reduced transparency is emulated in
  Chromium's DevTools Rendering tab.
- **axe.** `@axe-core/playwright` with the tags `wcag2a`, `wcag2aa`, `wcag21a`,
  `wcag21aa` and `wcag22aa`, on every route, with a panel open. Run it on the
  whole page, not on one component.
- **ARIA snapshots.** Playwright `toMatchAriaSnapshot` per route.
- **A scripted Tab walk** through every stop in each layout, checking the ring
  and `document.elementFromPoint` at the focused element's centre.
- **Clipping.** A script that flags any box that does not scroll where
  `scrollWidth > clientWidth`, at text size 200 with spacing *wide*.
- **Real-pixel contrast.** For anything see-through or over a picture: hold the
  scene still, take the worst pixel behind each text box from a screenshot with
  the text made transparent, and sample the scene 6 px outside each panel edge.
  axe's contrast rule does not cover these cases.
- **Colour deficiency.** Chrome DevTools Rendering, or Firefox Accessibility
  Inspector's Simulate, for protanopia, deuteranopia, tritanopia and achromatopsia.
- **Flashing.** Trace Center's PEAT (free, Windows only) for anything that
  changes luminance quickly.
- **Per-setting tests** are written under each setting in
  [`pxo:a11y/settings`](settings.md).

## Accessibility

Each review is a run of this list. Lessons from the first two runs:

- **Test the whole page.** Green component suites missed six failures that the
  reviewer caught: axe had run on one component only, the Tab order had not been
  walked, and nothing had been tested at 200 %. Whole-page axe and a scripted Tab
  walk belong in the first slice of any build.
- **A reviewer finds what no test checks.** Real-pixel and full-list checks
  exposed overlapping labels and objects missing from the scene's list.
- **A designer's screenshot review earns its cost.** It caught an unlabelled
  confirm button that every test had passed.

## Reference implementation

Bridge's candidates 3 and 5 each carry this checklist as end-to-end specs and a
review file. Their code lives in local repositories with no remote yet, so it is
described, not linked or copied. Candidate 5 ended its second review at 24 pass,
0 fail, 7 partial and 1 not tested; candidate 3 at 23 pass, 0 fail, 9 partial.
Neither was run with a real screen reader, a real phone or WebKit.

## Sources

- The Bridge accessibility brief of 2026-11-21, sections 3.5 and 4, and the
  advisor answers that amended lines 5, 11, 16 and 24.
- Bridge candidates 3 and 5: their checklist reviews and learning logs.
- Playwright, accessibility testing: https://playwright.dev/docs/accessibility-testing
- Playwright, ARIA snapshots: https://playwright.dev/docs/aria-snapshots
- axe-core API and tags: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
- axe-core contrast rule: https://dequeuniversity.com/rules/axe/4.10/color-contrast
- Chrome DevTools, rendering effects: https://developer.chrome.com/docs/devtools/rendering/apply-effects
- Firefox Accessibility Inspector, Simulate: https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/simulation/index.html
- Trace Center PEAT: https://trace.umd.edu/peat/
