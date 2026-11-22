---
id: pxo:ddr/0018
title: "Bridge art target: voxel (Astra rendition)"
status: accepted
date: 2026-11-22
sources:
  - "Operator decision, 2026-11-22, on the Bridge art target, from a side-by-side review of the harbour and Low Vesper scenes in voxel (S1) and low-poly (S2)"
affects:
  - pxo:art/bridge-voxel
  - pxo:art/bridge-low-poly
---

# DDR-0018: Bridge art target: voxel (Astra rendition)

**Status:** accepted · **Date:** 2026-11-22

## Context

Bridge shows its work as a live diorama, and it needed an art target. The
Style Study kept two styles, S1 voxel and S2 low-poly, with S4 papercraft and
S6 gouache as maybes. The last review put the two kept styles side by side in
the same two scenes, framed identically: the harbour on a clear day, and Low
Vesper at night in rain. The voxel stills were rendered twice, by GPT-6.2-Astra
and by GPT-6.2-Sol.

Under the promote-on-evidence decision
([DDR-0011](0011-promote-on-evidence.md), plan row 130), an art bible enters
this repository only once the operator approves it. None is approved yet.

## Decision

The operator decided on 2026-11-22:

> "I really like both and want to keep the references to both but I'm going to land on voxel by astra"

- The Bridge diorama art target is **voxel (S1), in the GPT-6.2-Astra
  rendition**: [`pxo:art/bridge-voxel`](../catalog/art/bridge-voxel/README.md).
- **Low-poly (S2) is kept as a reference, not adopted:**
  [`pxo:art/bridge-low-poly`](../catalog/art/bridge-low-poly/README.md). It can
  be cited for comparison; it is not a target.
- **The diorama growth requirement carries into the voxel direction.** Every
  diorama has a procedural component, or some other method, so the scene grows
  and stays readable across:
  - **size:** from a few agents to 30 or more;
  - **variety:** several distinct orchestrators side by side;
  - **hierarchy:** the first mate, second mates and their workers.

## Consequences

- `pxo:art/bridge-voxel` is the adopted target, with the Astra harbour and Low
  Vesper stills as its specimens. Bridge art is reviewed against it.
- `pxo:art/bridge-low-poly` is kept as a study, with its own two stills, and is
  not to be labelled adopted.
- The Sol voxel rendition was the alternative seen; it is not a target.
- This does not decide an art bible, the 3D quality standard, the papercraft
  and gouache maybes, the mood study, or any panel or interface pattern. A
  voxel art bible enters the catalogue once the operator approves one
  ([DDR-0011](0011-promote-on-evidence.md)), and how the growth requirement is
  met is for that art bible to show.
- No token or package changes.

## Sources

- The operator's decision above, 2026-11-22.
- The side-by-side review of the harbour and Low Vesper scenes in both styles,
  and the earlier Style Study, held in the coordinator's task data.
