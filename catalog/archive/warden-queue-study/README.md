---
id: pxo:archive/warden-queue-study
title: Warden queue-centred study
tier: archive
status: retired
since: catalog-2026.11
owners: [design]
sources:
  - docs/warden-design-brief.md
  - apps/docs/PRODUCT.md
  - apps/docs/DESIGN.md
---

# Warden queue-centred study

Warden's October 2026 work model, built around global queues. People entered
on a Needs You queue and found work through saved views across all projects,
while the project itself was a string in each card's metadata. The operator
supported the study's visual direction and rejected this model of work.

**Do not build on it.** The current Warden direction is the
[Warden design brief](../../../docs/warden-design-brief.md). Only the work model
is archived here: the visual direction it carried was kept.

## Dates

| | |
| --- | --- |
| In use | October 2026, in the live Warden UI and its study; assessed on 2026-10-19 against source `1bdb4b0` (private) |
| Rejected | October 2026, by the operator; the exact date is not recorded |
| Recorded in this repository | 2026-10-23, when the brief restored the September project-first intent ([#9](https://github.com/pixeloven/design/pull/9)) |
| Archived | 2026-11-21 (`catalog-2026.11`, provisional) |

## What it was

- Entry opened an empty Needs You queue; active work was elsewhere.
- Server-owned saved views decided what each queue held: Active excluded done
  and epics, Needs You held every review and verify item whether or not a gate
  held, Blocked excluded done, Recurring selected audit, Epics included
  completed epics.
- Six workflow states (Todo, Plan, Review, Build, Verify, Done), shown as a
  board with one column per state.
- Project context lived in metadata. Epic issues, parent references and a
  separate project string coexisted with no project identity.

## Why it was retired

It departed from the September product intent, in which people manage
projects and their tasks and return without losing context (journey WJ-4,
review-pack decision D-02: a project-first board with Needs you as a filter).
The October 19 baseline showed the cost:

- People had to reconstruct a project by browsing global queues, and attention
  was not tied to a reason: Needs You counted stage membership, not a pending
  decision.
- On a phone, task detail began 321px down a 390×844 viewport, leaving 523px
  for the task before the software keyboard, with metadata before intent.
- Controls were small (close 22×22px, New card 35×27px, inputs 34px high), and
  at 1440px the one populated column was about 189px wide beside five empty ones.

## What replaced it

The issue model in the [Warden design brief](../../../docs/warden-design-brief.md#product-decision-and-ownership),
merged in Warden #80 and #81 (private): everything is an Issue; an Epic is the
project-level issue with Story, Task, Bug and Spike children; standalone work
is valid. Epics, All issues and Needs attention are working destinations,
List is the default and Board optional, and attention carries an explicit
reason. The six workflow states were kept.

A separate, later idea and proposal intake flow (October 22) was also
superseded; it is recorded in the brief and is not part of this entry.

## Specimen

[`specimen.json`](specimen.json) freezes the model as the baseline recorded
it: the entry point, the six states, the saved-view predicates, the six browser
mutations and the October 19 measurements. The October study's own palettes
are review evidence and were never production values; none is kept here.

## Not verified

- The date and the operator's exact words when the queue-centred model was
  rejected. The repository records the outcome, not the call.
- Which deployed revision the October 19 live assessment saw; the visual
  review did not establish it.

## Sources

- [Warden design brief](../../../docs/warden-design-brief.md): "Reconciliation", "Historical live/source baseline — October 19–22" and "Historical implementation baseline and recorded gaps"
- [`apps/docs/PRODUCT.md`](../../../apps/docs/PRODUCT.md) and [`apps/docs/DESIGN.md`](../../../apps/docs/DESIGN.md), the operator's verdict on the October study
