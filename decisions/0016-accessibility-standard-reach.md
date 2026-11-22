---
id: pxo:ddr/0016
title: The accessibility floor applies to every product, the full settings to motion and live scenes
status: accepted
date: 2026-11-22
sources:
  - "Operator decision, 2026-11-22, design-system call 5 (verbatim pick: 'Adopt DDR-0016 (Recommended)')"
affects:
  - pxo:a11y/settings
  - pxo:a11y/behaviours
  - pxo:a11y/checklist
---

# DDR-0016: The accessibility floor applies to every product, the full settings to motion and live scenes

**Status:** accepted · **Date:** 2026-11-22

## Context

The accessibility standard ([`pxo:a11y/settings`](../catalog/a11y/settings.md),
[`pxo:a11y/behaviours`](../catalog/a11y/behaviours.md),
[`pxo:a11y/checklist`](../catalog/a11y/checklist.md)) was written for Bridge,
whose live scene moves on its own beside other content. Lattice's 3D graph also
moves; a static form page does not. The question is how far the standard reaches.

## Decision

- **Every product** meets WCAG 2.2 AA and the keyboard floor: behaviours B1–B8
  where they apply.
- **A product with motion that runs on its own, or a live scene,** ships all
  ten settings, S1–S10, and a live scene adds the live scene profile.
- **Elsewhere** the settings are recommended, not required.

## Alternatives not taken

- Every product ships all ten settings. This adds cost where it buys little.
- Bridge only, for now. This keeps the standard out of the system.

## Consequences

- Each accessibility entry says who ships what, and marks the scene-only rules.
- The token layers the settings need (contrast more, forced colours, reduced
  transparency, focus width and offset, a colour-blind-safe status set) are a
  later, additive tokens release. This record does not change any package.

## Sources

- Operator decision of 2026-11-22 on design-system call 5, verbatim pick:
  'Adopt DDR-0016 (Recommended)'.
- The design-system proposal of 2026-11-21, call 5, recommended option (a).
