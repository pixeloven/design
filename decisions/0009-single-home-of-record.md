---
id: pxo:ddr/0009
title: pixeloven/design is the single home of record for design knowledge
status: accepted
date: 2026-11-21
sources:
  - "Operator decision, 2026-11-21, on the design-system-as-source-of-truth proposal"
affects:
  - catalog/README.md
  - process.md
---

# DDR-0009: `pixeloven/design` is the single home of record for design knowledge

**Status:** accepted · **Date:** 2026-11-21

## Context

Until now this repository was the source of truth for web foundations only:
colour, type and motion scales, themes, marks and four native controls.
Accessibility guidance, UI/UX patterns, status vocabularies, art direction, 3D
scene rules, mood references, vocabulary and most retired design languages
lived elsewhere, much of it in working folders with no remote.

## Decision

The operator, on 2026-11-21:

> I want to make sure our design system becomes the source of truth for
> everything. Our design system project doesn't just have to encompass active
> designs. It can include, past design languages, expressions, all of these
> details... We need throughout all of our projects a consistent process for
> engaging with design... Everything, I think, needs to be expressed in a way
> that's reusable and referenceable with good documentation.

`pixeloven/design` is the single home of record. It is one repository, not a
split and not an index of links to knowledge kept elsewhere.

## Consequences

- Non-code design knowledge lands in [`catalog/`](../catalog/README.md), one
  entry per stable `pxo:` id, in five tiers: foundation, pattern, direction,
  study and archive. Packages remain the enforced core.
- Retired and superseded design languages are kept, in `catalog/archive/`, with
  why they were retired and what replaced them.
- Every project follows one design process, [`process.md`](../process.md).
- Products keep product-specific decisions in their own logs.

## Sources

- The operator's words above, 2026-11-21.
