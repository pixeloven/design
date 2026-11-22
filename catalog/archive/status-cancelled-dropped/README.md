---
id: pxo:archive/status-cancelled-dropped
title: Status words Cancelled and Dropped
tier: archive
status: retired
since: catalog-2026.11
owners: [design]
decisions:
  - pxo:ddr/0014
  - "Bridge plan decision log, row 122 (2026-11-21)"
  - "Bridge plan decision log, row 125 (2026-11-21)"
sources:
  - "Bridge plan, Decision log, rows 100 and 122-125"
---

# Status words Cancelled and Dropped

Two words for work that was set aside for good: **Cancelled** for an item and
**Dropped** for a goal. Both said that something stopped, and neither said why,
who decided or when. **Won't do** replaces both.

**Do not use these words.** Set work aside as Won't do, with its reason.

## Dates

| | |
| --- | --- |
| Cancelled adopted | 2026-11-20, Bridge plan row 100: blocked, paused, failed and cancelled were added beside the four spine states |
| Dropped adopted | Not recorded |
| Retired | 2026-11-21: Cancelled by row 122, Dropped by row 125 |
| Archived | 2026-11-21 (`catalog-2026.11`, provisional) |

## What it was

Part of Bridge's status vocabulary. An item that would not be done was
Cancelled; a goal that would not be pursued was Dropped. As the decision log
describes the change, neither required a reason, who decided or when; Won't do
adds all three.

## Why it was retired

Setting work aside is a decision, and a decision is worth keeping. In the
operator's words on row 122, 2026-11-21:

> A won't do gives you a log of things that you've decided on... If you delete
> it, you lose visibility.

Row 125 then put goals under the same rule as items, to give Bridge one status
model for both. Both rows are recorded as
[DDR-0014](../../../decisions/0014-retire-status-words-cancelled-dropped.md).

## What replaced it

**Won't do**, for items and goals alike:

- It requires a one-line reason, who decided and when, and is kept as a
  filterable decision log. It can be reopened (row 122).
- The operator and a goal's coordinator may mark it, each with a reason. A
  coordinator's Won't do appears in "Since you left" so the operator can reopen
  it (row 124).
- When a goal becomes Won't do, its open items follow it, citing the goal's
  reason; reopening the goal offers to reopen them (row 125).

"Not now" is not its replacement: it became a snooze date on a queued item, not
a status (row 123).

The system's shared status pattern, where Won't do will be defined for every
product, is not written yet. That entry is separate work and waits on the open
decision about a shared status meaning.

## Specimen

[`specimen.json`](specimen.json) freezes both words, where each was adopted and
retired, and the rules of the word that replaced them.

## Not verified

- When Dropped entered Bridge's vocabulary. The decision log records its
  retirement, not its adoption.
- Whether either word reached any product other than Bridge.
- That neither word carried a reason before: the log implies it by what Won't
  do adds, and does not say so.

## Sources

- Bridge plan, Decision log, row 100 (2026-11-20) and rows 122 to 125
  (2026-11-21). The plan is a private page.
