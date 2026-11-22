---
id: pxo:ddr/0013
title: Decisions cite the system by pxo id and DDR
status: accepted
date: 2026-11-22
sources:
  - "Operator decision, 2026-11-22, design-system call 4 (verbatim pick: 'Adopt DDR-0013 (Recommended)')"
affects:
  - catalog/README.md
  - decisions/README.md
  - process.md
  - skills/design-process/SKILL.md
---

# DDR-0013: Decisions cite the system by `pxo:` id and DDR

**Status:** accepted · **Date:** 2026-11-22

## Context

Products record their design decisions in their own logs (for Bridge, its plan
document). Nothing in those logs can point at a design-system entry by a stable
name, and nothing here records a decision that a product made which changed
the system.

## Decision

- Every catalogue entry has a stable id, `pxo:<area>/<slug>`, and every design
  decision record has `pxo:ddr/NNNN`.
- A product decision that *uses* the system names the id and the catalogue
  version it follows, for example "panels follow `pxo:pattern/panel-over-scene`
  (design `catalog-2026.11`)".
- A product decision that *changes* the system lands as a DDR in `decisions/`,
  carrying the operator's words, and the product log row links that DDR. One
  record, one owner; the product log stays the narrative.

## Alternatives not taken

- Product decision logs only, with the system linking back to log rows.
- GitHub issues in this repository as the records.

## Consequences

- `catalog/index.json` lists decisions beside entries, and the parity test checks
  that every cited `pxo:ddr/` id resolves.
- Catalogue tags `catalog-YYYY.MM` name a catalogue version. They are part of this
  decision and are not yet created by automation.

## Sources

- Operator decision of 2026-11-22 on design-system call 4, verbatim pick:
  'Adopt DDR-0013 (Recommended)'.
- The design-system proposal of 2026-11-21, call 4, recommended option (a).
