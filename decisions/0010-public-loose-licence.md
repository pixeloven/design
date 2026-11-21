---
id: pxo:ddr/0010
title: The repository stays public under a loose licence
status: accepted
date: 2026-11-21
sources:
  - "Operator decision, 2026-11-21, on the design-system-as-source-of-truth proposal"
  - LICENSE
affects:
  - catalog/README.md
---

# DDR-0010: The repository stays public under a loose licence

**Status:** accepted · **Date:** 2026-11-21

## Context

Making this repository the home of record ([DDR-0009](0009-single-home-of-record.md))
means art direction, patterns and studies for unreleased work would become
public. The repository was made public, under the MIT licence, in #13.

## Decision

The operator, on 2026-11-21:

> the design repo should remain public. It should be under a very loose
> license. The focus is on the expression of Pixel Oven's entire design
> language thoroughly from end to end. That is our kind of give back to the
> community as we evolve it over time... if we ever do produce a harness for
> visual production, like these things are the contributions back, while the
> kind of proprietary assets that we generate are very much going to be
> determined where they go on a project need basis... It's really about what is
> being produced... if we build a harness and a process and all that to produce
> a very high quality, 3D assets and pipeline for comics, I have no problem
> sharing that with the community. The part I would avoid sharing is the exact
> mechanism or style or raw assets that we use to create our exact comic book.
> And so that's something I can determine on a need basis... I don't want to
> overthink this.

## Consequences

- One public repository. There is no private companion design repository and no
  separate art licence; the existing MIT licence covers the repository.
- Tooling, harnesses and process are open contributions.
- Proprietary product assets (the exact style, mechanism and raw assets for a
  specific comic or game) live with the project that needs them, decided case
  by case by the operator. They are not added here by default.
- Bridge art may be public.
- References to third-party work are links, never copied images.

## Sources

- The operator's words above, 2026-11-21.
- [`LICENSE`](../LICENSE)
