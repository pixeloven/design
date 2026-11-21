---
id: pxo:ddr/0012
title: The studio is code owner for the 3D standard and its art direction
status: accepted
date: 2026-11-21
sources:
  - "Operator decision, 2026-11-21, on who writes the studio's sections (studio boundary call 2)"
  - CODEOWNERS
affects:
  - CODEOWNERS
---

# DDR-0012: The studio is code owner for the 3D standard and its art direction

**Status:** accepted · **Date:** 2026-11-21

## Context

[DDR-0011](0011-promote-on-evidence.md) has the studio — PixelOven's art
pipeline — write the 3D quality standard. That raises who may change the
studio's sections of this repository, and how.

## Decision

The operator decided on 2026-11-21:

- The studio writes its design-repository sections directly: the 3D standard
  (`catalog/scene/`) and the art direction it authors under `catalog/art/`.
- It does so as code owner, on its own PR path, with an independent reviewer.
- A change that loosens a check needs a second reviewer and is shown to the
  operator for approval.
- Other paths keep the design repository's normal owners.

## Consequences

- [`CODEOWNERS`](../CODEOWNERS) names the studio for `catalog/scene/` and for
  each studio-authored entry under `catalog/art/`.
- Studio-authored entries list `studio` in their `owners` frontmatter.
- The second-reviewer rule for loosening a check is a review rule; CODEOWNERS
  cannot express it, so [`process.md`](../process.md) states it.

## Sources

- The operator's decision above, 2026-11-21.
