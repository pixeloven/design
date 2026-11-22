---
id: pxo:ddr/0017
title: One work-status meaning across products, with fixed colour, shape and word
status: accepted
date: 2026-11-22
sources:
  - "Operator decision, 2026-11-22, design-system call 6 (verbatim pick: 'Adopt DDR-0017 (Recommended)')"
affects:
  - pxo:pattern/work-status
  - pxo:ddr/0007
---

# DDR-0017: One work-status meaning across products, with fixed colour, shape and word

**Status:** accepted · **Date:** 2026-11-22

## Context

Three status vocabularies are in use: the token status roles (success, warning,
danger), the operator's status chips (working, needs-decision, blocked, paused,
done, failed), and Bridge's item states (queued, under way, needs you, blocked,
done, failed, won't do, with snooze dates). Status colours already keep their
meaning under any accent ([DDR-0007](0007-status-meaning-independent-of-accent.md)).

## Decision

- One meaning set — queued (with an optional snooze date), under way, needs
  you, blocked, done, failed and won't do — with a fixed colour, shape and word
  per state, shared by operator pages, Bridge and the token status roles.
- Persona themes change only the words.

## Alternatives not taken

- Each product keeps its own status vocabulary and colours.

## Consequences

- `pxo:pattern/work-status` maps the operator chips and the token roles onto
  the set.
- Status meaning is held in one place, which also gives the light-scheme ink
  gap one place to be fixed.
- Each product's data model stays its own; this record decides how a state
  looks and reads.

## Sources

- Operator decision of 2026-11-22 on design-system call 6, verbatim pick:
  'Adopt DDR-0017 (Recommended)'.
- The design-system proposal of 2026-11-21, call 6, recommended option (a).
