---
id: pxo:ddr/0015
title: The design system's mission and core values
status: accepted
date: 2026-11-21
sources:
  - "Operator decision, 2026-11-21, on the PixelOven design thesis, call 2 (mission option B with the operator's own edit; core values set 1)"
affects:
  - process.md
  - README.md
---

# DDR-0015: The design system's mission and core values

**Status:** accepted · **Date:** 2026-11-21

## Context

The PixelOven design thesis first proposed five "design pillars" as tests for
design decisions. On 2026-11-21 the operator sent them back:

> I'm not really sure where these pillars came from, and some of them kind of
> have too much qualification to them... A mission statement and core values
> might be enough for now, and then later, you can decide whether we feel we
> need something deeper, like kind of like almost like code of conduct.

The agreed shape has four layers: vision, mission, core values, then principles
and standards. The thesis carries the first three. The last layer is granular
and testable, and it belongs in this repository's process, later.

## Decision

The operator chose, on 2026-11-21, mission option B with their own edit (it had
ended "clear to everyone and plainly ours"):

> We give every PixelOven project one design language and the tools to use it,
> so everything we make is accessible to everyone.

And core values set 1, all six:

1. **Make it ours.** Original worlds, original work.
2. **Clear for everyone.** If someone can't take it in, it isn't done.
3. **Build for real use.** Made for something we need, not a someday.
4. **Write it down once.** One source of truth, reused everywhere.
5. **Give back.** Our design language and tools are open.
6. **Agent first.** Built so agents can find it, use it and check it.

## Consequences

- [`process.md`](../process.md) states the mission and the values, and the
  [README](../README.md) states the mission.
- The five removed tests become the seed of the principles layer, in
  `process.md`, marked provisional. Adopting a principle is a later decision.
- This decides nothing about how far the accessibility standard reaches
  ([DDR-0016](0016-accessibility-standard-reach.md)).

## Sources

- The operator's words above, 2026-11-21, on the design thesis.
