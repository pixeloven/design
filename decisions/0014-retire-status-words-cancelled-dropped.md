---
id: pxo:ddr/0014
title: Won't do replaces the status words Cancelled and Dropped
status: accepted
date: 2026-11-21
sources:
  - Bridge plan, Decision log, row 122 (2026-11-21)
  - Bridge plan, Decision log, row 125 (2026-11-21)
affects:
  - pxo:archive/status-cancelled-dropped
---

# DDR-0014: Won't do replaces the status words Cancelled and Dropped

**Status:** accepted · **Date:** 2026-11-21

## Context

Bridge set work aside with two words: **Cancelled** for an item and
**Dropped** for a goal. Neither said why, who decided or when. Setting work
aside is a decision, and the operator wanted it kept. The retired words are
archived as
[`pxo:archive/status-cancelled-dropped`](../catalog/archive/status-cancelled-dropped/README.md).

## Decision

In the operator's words on Bridge decision-log row 122, 2026-11-21:

> A won't do gives you a log of things that you've decided on... If you delete
> it, you lose visibility.

Row 122 decided: "'Won't do' replaces 'Cancelled': a deliberate decision with
a required one-line reason, who decided and when; kept as a filterable
decision log; reopenable".

Row 125 decided: "'Dropped' becomes Won't do with the same rules; the goal's
open items follow it to Won't do citing the goal's reason, and reopening the
goal offers to reopen them". Its reason: "One status model for items and
goals".

## Consequences

- Cancelled and Dropped are retired and archived as
  `pxo:archive/status-cancelled-dropped`. Do not use either word.
- Won't do carries a reason, who decided and when, for items and goals alike.
- It does not define Won't do for every product. The shared status pattern
  waits on the open decision about a shared status meaning.

## Sources

- Bridge plan, Decision log, rows 122 and 125 (2026-11-21). The plan is a
  private page.
- [Archive entry: status words Cancelled and Dropped](../catalog/archive/status-cancelled-dropped/README.md)
