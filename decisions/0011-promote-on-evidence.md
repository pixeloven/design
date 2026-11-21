---
id: pxo:ddr/0011
title: Knowledge is promoted into the system on evidence
status: accepted
date: 2026-11-21
sources:
  - "Operator decision, 2026-11-21, on who owns art bibles (design-system proposal call 3, option a)"
affects:
  - catalog/README.md
  - process.md
---

# DDR-0011: Knowledge is promoted into the system on evidence

**Status:** accepted · **Date:** 2026-11-21

## Context

Art bibles, a 3D quality standard, an art glossary and reserved status
colours were being written in several places: Bridge's working folders, the
studio's planned pipeline repository, and product docs. The question was
whether the design system or the studio's pipeline owns them.

## Decision

The operator chose to promote on evidence, on 2026-11-21:

- The glossary and the reserved status colours go into the design repository now.
- An art bible goes in once the operator approves it.
- The 3D quality standard goes in once a second project needs it. Until then
  the design repository's index points to it.
- The studio writes the 3D standard, and its pipeline enforces it.

## Consequences

- An entry lands in `catalog/` when there is evidence for it — an approval, or a
  second consumer — not because a draft exists.
- Until promoted, work stays a `proposed` or `study` entry, or lives with its
  project.
- This mirrors the existing rule for components ([DDR-0008](0008-shared-controls-on-evidence.md)).

## Sources

- The operator's decision above, 2026-11-21.
