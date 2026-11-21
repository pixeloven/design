---
id: pxo:archive/warden-threshold
title: Warden Threshold mark
tier: archive
status: retired
since: brand-v0.3.0
owners: [design]
decisions: [pxo:ddr/0004]
sources:
  - catalog/studies/warden-identity/README.md
  - docs/brand-family.md
ip: original
---

# Warden Threshold mark

A candidate identity for Warden that was not selected: two opposing angular
gateposts leave a continuous passage through the centre, so the displaced ends
read as entry and release. It put Warden's human gates in the figure without a
shield, lock or approval tick.

**Do not use in production.** Warden's identity is Waymark, in `@pixeloven/brand`.

## Dates

| | |
| --- | --- |
| Drawn | October 2026, for the [Warden identity study](../studies/warden-identity/README.md); first committed 2026-10-23 |
| Not selected | 2026-10-25, when the operator selected Waymark |
| Retired | Brand 0.3.0 (`brand-v0.3.0`, 2026-10-25), which published Waymark |

## What it was

A Solid figure and an Inset form cut into the family container, both on a
64×64 viewBox in neutral `currentColor`, with no palette of its own. At 16px the
Inset kept its diagonal passage while its two narrow returns softened.

## Why it was retired

- It was the most abstract of the three options: distinctive in silhouette,
  but it would need a name lockup while it was introduced, and its offset
  halves could read as a link.
- The October 25 selection review found that its gate stands for only one part
  of Warden's capture, investigation, refinement and outcome workflow.

## What replaced it

**Waymark**, the angular W: selected on 2026-10-25, published in brand 0.3.0
and adopted by Warden ([DDR-0004](../../decisions/0004-warden-waymark.md)).

## Specimen

The study's source files are the frozen specimen. They stay in the study so the
Storybook review keeps rendering them, and are not copied here:

| Solid | Inset |
| --- | --- |
| [threshold/solid.svg](../studies/warden-identity/threshold/solid.svg) | [threshold/inset.svg](../studies/warden-identity/threshold/inset.svg) |

There is no JSON specimen: the figure carries no colour or scale values.

## Sources

- [Warden identity study](../studies/warden-identity/README.md) (`pxo:study/warden-identity`)
- [Brand family: established decisions](../../docs/brand-family.md#established-decisions)
