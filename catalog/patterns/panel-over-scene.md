---
id: pxo:pattern/panel-over-scene
title: Panels over a live scene
tier: study
status: study
since: catalog-2026.11
owners: [design]
consumers: [bridge]
sources:
  - "Bridge candidate 3 (readable-first), 2026-11-21"
  - https://claude.ai/artifact/NyTUh2y24K5MZb1GcoKSnJ
outcome: "Open. Bridge's panel layout decision (D6) is being re-framed; candidate 3's reading column is the study on record, and the separation rules it meets are adopted in pxo:a11y/behaviours."
---

# Panels over a live scene

**Study · not adopted.** How work panels sit over a live scene, so that reading
and deciding come first while the scene stays in view. The layout is not
decided: Bridge's panel layout decision (D6) is being re-framed, and this entry
is informative until it is answered. The rules that hold whichever layout wins
are already adopted, in the live scene profile of
[`pxo:a11y/behaviours`](../a11y/behaviours.md#live-scene-profile): text never on
the scene, opaque surfaces by default, a two-tone keyline on every edge that
meets the scene, and a scene that yields while you read.

The id is this pattern's for good. If it is adopted, its tier and status change
and the id stays.

## Rules

Nothing here is a rule yet. This is what Bridge's candidate 3, "readable-first",
tried. In it **the panels lead**, and the scene recedes behind them.

- **A reading column.** On desk and tablet, the open panel is a docked column
  with a measure of about 72 characters (88 when set to Wide). The scene fills
  the rest of the stage and dims while you read. Floating panels remain as a
  setting.
- **A home in words.** With no panel open, home is an Overview: counts with
  units, the top three asks, "since you left", recent changes, and **Say the
  summary**. "Hide overview" gives the full-stage scene. On a phone, home is a
  scene band above the Overview, and a panel is a bottom sheet.
- **An opaque frame.** The top bar, the column and a bottom bar are all solid.
  The navigation, the counts and the scene's controls live in the bottom bar,
  with **Pause scene** first. Labels on the scene sit on opaque plaques, clear
  of one another, and give way to the column; the scene's list names every one.
- **The scene recedes on request.** "Dim the scene while reading" offers Light,
  Medium, Strong and Hide while reading. While a panel has focus, the scene runs
  at half speed and one-shots under a panel snap to their end state.
- **A backdrop switch.** Display → Backdrop puts the live scene, a plain still
  scene (no motion, no plaques) or a flat neutral colour (no scene, the page
  ground) behind the panels, so the interface can be judged with the art out of
  the way. Panel text measured AA or better on each backdrop in both themes.
- **Nothing needs a drag.** An Options menu on every panel holds Full screen,
  Move, Size, Column side, Width and Close. The panel header wraps at large text,
  and titles are never cut. A Pan menu moves the scene, and a graph view gets
  its own pan buttons.
- **The Display menu is its command surface.** This candidate has no command
  bar; the Display menu, one click from every screen, reaches every setting.

## Accessibility

Candidate 3 ships all ten settings of [`pxo:a11y/settings`](../a11y/settings.md)
and meets the behaviours. Against [`pxo:a11y/checklist`](../a11y/checklist.md),
its second review ended at 23 pass, 0 fail and 9 partial. The partial lines
included state carried by hull hue in the scene (the list and panels carry the
word and icon), labels cut at 200 % text, and 24 px link rows that meet the AA
floor but not the 32/44 px design size. No real screen reader, phone or WebKit
was used.

## Reference implementation

Candidate 3's code lives in a local repository with no remote yet, so it is
described here, not linked or copied. The reading column and the Overview, the
scene recession (`setMotion`, `setDamp`, `setCovered`, still-mode
render-on-change and plaque declutter, all outside the scene's renderer
contract) and the Options and Pan menus are its parts worth borrowing.

## Sources

- Bridge candidate 3's write-up, 2026-11-21, and its review page (private):
  https://claude.ai/artifact/NyTUh2y24K5MZb1GcoKSnJ
