---
id: pxo:a11y/behaviours
title: Accessibility behaviours
tier: pattern
status: proposed
since: catalog-2026.11
owners: [design]
consumers: [bridge]
decisions: [pxo:ddr/0016, pxo:ddr/0007]
sources:
  - "Bridge accessibility brief, 2026-11-21, sections 1.3 and 3, with its advisor answers (section 8)"
---

# Accessibility behaviours

What is always on, in every surface: eight behaviours (B1–B8) that are not
settings, and the contrast, type, motion and keyboard rules they rest on. The
settings people choose are [`pxo:a11y/settings`](settings.md); the acceptance
test is [`pxo:a11y/checklist`](checklist.md).

> **Proposed: not adopted.** Which of Bridge's candidate pieces go into
> Bridge's MVP is an open decision. This entry is drafted from Bridge's
> candidates 3 and 5 and waits on that decision before it can be adopted.

> **Reach.** Under [DDR-0016](../../decisions/0016-accessibility-standard-reach.md)
> (`accepted`), every product meets WCAG 2.2 AA and the behaviours below where they apply. The
> [live scene profile](#live-scene-profile) applies only to a product with a
> live scene.

## Rules

### Always on

- **B1. The keyboard reaches everything.**
  - The Tab order follows the regions in reading order: the top bar, open panels
    in the order they were opened, then navigation.
  - Skip links come first, at least one to the main content.
  - As a convenience, `Ctrl+F6` and `Ctrl+Shift+F6` (⌘ on a Mac) move between
    regions, as Slack does in a browser. Firefox and Chromium both let the page
    take that chord if it cancels the key on key-down. Leave plain `F6` to the browser.
  - The chord is never the only path: the Tab order, landmarks, skip links and a
    "Go to region" command meet B1 without it.
- **B2. Focus is managed.**
  - Opening a panel moves focus to its title. Closing returns focus to the
    control that opened it, or to that panel's entry in the navigation if the
    opener is gone.
  - Escape closes the top panel only.
  - A true dialog (first run, a confirm) traps Tab and makes the rest `inert`.
  - A full-screen panel is not a dialog. It makes inert only what it hides;
    whatever stays visible stays live, and nothing visible may be dead. The live
    region and any captions stay outside every inert subtree.
- **B3. Panels are named, and movable without dragging.**
  - Each panel is a `region` labelled by its title.
  - Move, resize and reorder each have a button or menu path as well as drag:
    for example a "Panel options" menu with Move left, centre or right; Size
    small, medium or large; Dock; Full screen; Close.
  - SC 2.5.7 (AA) is not met by a keyboard path alone. Anything that pans (a
    scene, a graph) also gets pan buttons or click-to-centre.
- **B4. Targets.** 24 × 24 CSS px is the AA floor (SC 2.5.8). The design size is
  32 px on desktop and 44 px on touch.
- **B5. Everything shown has a text equivalent.** A picture that carries
  information has a list or table that holds the same things, with the same
  words, counts and actions. See the [live scene profile](#live-scene-profile).
- **B6. Status is never colour alone,** and never light or motion alone. It is
  icon or shape, plus word, plus colour, everywhere it appears. The fixed set is
  [`pxo:pattern/work-status`](../patterns/work-status.md); status colours keep
  their meaning under any accent ([DDR-0007](../../decisions/0007-status-meaning-independent-of-accent.md)).
- **B7. Nothing flashes.** Nothing changes luminance faster than once a second,
  except small marks, and no full-surface change is faster than 400 ms. SC 2.3.1
  (A) fails at more than three flashes a second above a small area. Strobing and
  fast beacons are out.
- **B8. Lists do not jump.** A live update never moves a row or a control from
  under the pointer or the focus, and never takes focus.

### Contrast targets

The floor for every product is WCAG 2.2 AA: 4.5:1 for text and 3:1 for
non-text contrast, which `@pixeloven/tokens` already holds for its text colours.
A product under the full standard aims for this table:

| What | Standard | More contrast (S3) |
| --- | --- | --- |
| Body and muted text | 7:1 | 7:1 |
| Any other text: chips, badges, captions, labels | 4.5:1 | 7:1 |
| Control edges, icons, and marks that carry state | 3:1 against each adjacent colour | 4.5:1 |
| Focus ring | 3:1 against the control and its surroundings | 4.5:1 |
| Panel edge against a live scene, worst 48 px segment | 3:1 | 3:1, with a 2 px keyline |

- **Measure against real pixels** wherever anything is see-through or sits over
  a picture: take the worst pixel behind each text box, and sample the scene
  6 px outside each panel edge, with the scene still.
- **axe-core cannot do this.** Its contrast rule does not report on text over a
  background image or under another element.
- **A second opinion for dark-default products (advisory).** Also report APCA
  for body text: Lc 75 is its minimum for body text, Lc 90 preferred, Lc 60 for
  other content text. It is not a gate, because the WCAG 3 working draft of
  10 September 2026 still lists its text-contrast requirements as developing.

### Type

- **Sizes.** Body 16 px on a 24 px line by default, labels 14 px, nothing under
  12 px, all in `rem`. The reading roles in `@pixeloven/tokens`
  (`pxo:token/reading.body`, `pxo:token/reading.control`) are these sizes; the
  compact `type` scale (body 13, label 11, micro 10 px) is below this floor and
  is not used for running text under the full standard.
- **Setting.** Sentence case, no tracked capitals, mono only for ids and times
  ([DDR-0005](../../decisions/0005-plex-type-roles.md)). Lines of 80 characters
  or fewer. Left-aligned. Tabular figures for counts that change.
- **Low vision.** Atkinson Hyperlegible Next keeps similar letters apart, has
  seven weights and a Mono companion, and is free for commercial use. It is the
  *hyperlegible* face of S6.
- **Dyslexia: promise nothing.**
  - A 2026 meta-analysis of 15 studies (688 children) found no reliable effect of
    dyslexia fonts on speed or accuracy (g = −0.04).
  - A small controlled study (12 pupils) found OpenDyslexic no better than Arial
    or Times New Roman.
  - Wider letter spacing did help in one study of 74 dyslexic children: errors
    roughly halved.
  - So ship spacing and a choice of face (S6), not a "dyslexia mode".

### Motion

1. **Motion is never the only carrier of anything.**
2. **Nothing moves to get attention:** no flash, no brightening, no pan toward
   an event. Attention is a count and an announcement.
3. **Known triggers:** scaling and zooming, spinning, parallax, plane shifting,
   and motion at the edge of vision (WebKit's list). In *calm* none happens on
   its own, and a camera move is a cut.
4. **Interface motion.** Panels open in 180 ms and close in 120 ms, with opacity
   and an 8 px rise. In *calm* and *still* it is opacity only. Nothing loops in
   the interface.
5. **No blurring in and out.** Apple's reduced-motion guidance names "animating
   into and out of blurs". Blur, if used, is static, and S4 removes it.
6. **Replace, do not only remove.** When motion is reduced, a change still needs
   a trace (a cross-fade, then an announcement), or it is missed.

### Keyboard and screen-reader paths

- **Landmarks.** `banner` (the top bar), one named `navigation`, `main`, one named
  `region` per open panel, and one `log` for announcements. No more than these.
- **Headings.** One `h1` (the product), each panel title an `h2`, sections inside
  as `h3`.
- **Names.** Every icon-only button has one. Every count carries its unit ("7 asks").
- **Live region.** Present and empty in the first markup, `role="log"` with
  `aria-live="polite"`. Use `assertive` for one case only: an approval about to
  expire. When a command moves focus, do not also send the same words to the log.
- **Choosing chords.**
  - In browse mode, NVDA and Orca keep plain letters for themselves, so
    single-key shortcuts do not reach the page. Modifier chords and a command
    list are the main path.
  - Orca also uses `Alt+Shift+` a letter for its lists (19 letters).
  - Firefox opens a menu on `Alt` or `Alt+Shift` plus a menu letter (F, E, V, S,
    B, P, T, H) unless the page cancels the key. `Alt+Shift+S` opens Firefox's
    History menu; `Alt+K` is clear in Firefox, Chromium, Orca and NVDA.
  - Give every chord a path with no chord as well.
  - Never use `accesskey`.

### Live scene profile

A product with a live scene adds these.

- **B1.** The scene's controls and the scene come after the navigation in the
  Tab order. A second skip link goes to the scene's list.
- **B3.** Panning the scene has buttons or click-to-centre, not only drag.
- **B5. The scene has a complete text equivalent.**
  - The scene's list holds every place and object the scene shows, with the same
    words and actions. It is always in the DOM and reachable while a panel is open.
  - To assistive technology the canvas is one labelled image.
  - Nothing may be knowable only from the scene. Scene changes are also said in
    words (S10).
- **B6.** Each object that carries state in the scene has a distinct shape that
  matches the key, as well as its colour.
- **B7.** Small flags and an ember-sized glow may change faster than once a
  second; lightning, strobing signs and a fast beacon are out.
- **The scene, by keyboard.** One Tab stop, named. Arrows, plus, minus and 0 work
  only while it has focus. The list is the way through its contents, and
  focusing a row rings the object in the scene. A renderer overlay that makes
  scene objects focusable (PixiJS 8's `pixi.js/accessibility`) is an extra for
  sighted keyboard users (O12), not a replacement for the list.
- **Separation of panels from the scene.**
  1. **Text never sits on the scene.** Every label, count, caption and tooltip
     has its own plate.
  2. **Surfaces are opaque by default, chrome included.** A see-through look is
     opt-in, and its floor is arithmetic: at the lowest opacity a control offers,
     the weakest text on that surface must still pass 4.5:1 against a pure white
     and a pure black scene pixel. If it cannot, raise the floor, or tie the
     opacity to a scene dim that restores it.
  3. **The edge is a two-tone keyline.** A 1 px border alone measured about 1:1
     against a dimmed scene. A 1 px white plus 1 px black keyline outside every
     panel keeps one tone in contrast everywhere (worst pixel 4.59:1 or better).
  4. **The scene yields while you read.** While a panel has focus: ambient
     amplitude and the scene clock at half or less, no one-shot event under a
     panel, and events queue into captions. Behind panels that overlap it, dim
     and desaturate the scene (brightness −35 %, saturation −30 %). A docked
     layout that covers nothing needs only the damping.
  5. **For long work, prefer a layout that leaves the scene uncovered.** Which
     layout is still open; see [`pxo:pattern/panel-over-scene`](../patterns/panel-over-scene.md).
- **Ambient budget.** At most two one-shot events at once, and a calm zone
  around the panels, as ceilings, not targets. Few elements, each readable.

## Reference implementation

Bridge's candidates 3 and 5 meet B1–B8 and the live scene profile: skip links,
region keys, focus return, `inert` behind dialogs and full screen, a Panel
options menu so nothing needs a drag, a complete scene list, the two-tone
keyline and scene damping. Their code lives in local repositories with no remote
yet, so it is described, not linked or copied.

## Sources

- The Bridge accessibility brief of 2026-11-21, sections 1.3 and 3, and the
  advisor answers that amended B1, B2 and B3.
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WCAG 3.0 working draft, 10 September 2026: https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/
- APCA in a Nutshell: https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html
- ARIA Authoring Practices, modal dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- ARIA Authoring Practices, landmark regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- MDN, `inert`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
- WebKit, "Responsive Design for Motion": https://webkit.org/blog/7551/responsive-design-for-motion/
- Braille Institute, Atkinson Hyperlegible: https://www.brailleinstitute.org/freefont/
- Azzarello and others, "Does font improve reading in dyslexic children?", Annals of Dyslexia 76 (2026): https://strathprints.strath.ac.uk/97732/
- Wery and Diliberto, OpenDyslexic study, Annals of Dyslexia 67 (2017): https://pmc.ncbi.nlm.nih.gov/articles/PMC5629233/
- Zorzi and others, "Extra-large letter spacing improves reading in dyslexia", PNAS 109 (2012): https://pmc.ncbi.nlm.nih.gov/articles/PMC3396504/
- PixiJS 8 accessibility: https://pixijs.com/8.x/guides/components/accessibility
