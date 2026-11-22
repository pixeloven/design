---
id: pxo:pattern/work-status
title: Work status
tier: pattern
status: proposed
since: catalog-2026.11
owners: [design]
consumers: [bridge]
decisions:
  - pxo:ddr/0017
  - pxo:ddr/0007
  - "Bridge plan decision log, rows 122 to 125 (2026-11-21)"
sources:
  - "Bridge candidate 5 (keyboard and command-first), the Won't do lane and snooze, 2026-11-21"
  - "Bridge plan decision log, rows 122 to 125"
  - "Design-system proposal, 2026-11-21, section 6 item 3 and call 6"
---

# Work status

How the state of a piece of work looks and reads: seven states, each with one
fixed colour, shape and word, so a state reads the same on every surface, in
every theme and with any accent. Use it wherever an item, task or goal shows
where it stands: a chip, a row, a board lane, a mark in a scene. The data model
behind the states stays with each product; this entry holds how a state is
shown and said.

> **Provisional: shared meaning.** One meaning set shared by every product
> (operator pages, Bridge and the token status roles), with persona themes
> changing only the words, is an open decision drafted on its recommended
> option ([DDR-0017](../../decisions/0017-one-work-status-meaning.md),
> `proposed`). This entry is proposed too. If the decision goes the other way,
> each product keeps its own set and this entry becomes Bridge's.

> **Decided.** For Bridge (its decision-log rows 122 to 125, 2026-11-21): Won't
> do replaces Cancelled and Dropped, with a required reason, who decided and
> when, and it can be reopened; Not now is a snooze date on a Queued item, not a
> status. A coordinator may mark Won't do, and a goal's open items follow it.
> **Not decided:** the colour, shape and word for each state in the table below,
> drafted from Bridge's candidate 5. That is why this entry is proposed.

## Rules

### The states

| State | Means | Colour | Shape | Word |
| --- | --- | --- | --- | --- |
| **Queued** | Waiting its turn; nobody is on it yet | `pxo:token/text.secondary` | Hollow circle | Queued |
| **Under way** | Someone is working on it | `pxo:token/text.bright` | Solid circle | Under way |
| **Needs you** | It waits on the person's answer | `pxo:token/status.warning` | Hollow double ring | Needs you |
| **Blocked** | It waits on other work | `pxo:token/text.secondary` | Dashed ring | Blocked, or "Waits on 2 items" |
| **Done** | Finished, and it worked | `pxo:token/status.success` | Half-filled circle | Done |
| **Failed** | Finished, and it did not work | `pxo:token/status.danger` | Solid triangle | Failed |
| **Won't do** | Deliberately not done, with a reason | `pxo:token/text.dim` | Hollow circle with a diagonal stroke | Won't do |

- **Shape, word and colour together, always.** Status is never colour alone
  (behaviour B6 in [`pxo:a11y/behaviours`](../a11y/behaviours.md)), so a state
  still reads in greyscale, under forced colours and to a screen reader.
- **Colour meaning never changes with a theme or an accent**
  ([DDR-0007](../../decisions/0007-status-meaning-independent-of-accent.md)).
  Violet is for links, selection and focus, never for a state.
- **Only the word may vary.** A persona theme may rename a state ("Waiting on
  you" for Needs you); it never changes the colour, the shape or what the state
  means (provisional, DDR-0017).
- **Chips** use the status colour as text or mark on its matching
  `statusSurface` ground (`pxo:token/statusSurface.warning`,
  `pxo:token/statusSurface.success`, `pxo:token/statusSurface.danger`), or a
  neutral surface for the neutral states.

### Snooze is not a state

"Not now" is a snooze date on a **Queued** item, not a status of its own.

- A snoozed item is hidden from the default views until its date, then comes
  back by itself.
- A visible toggle ("3 snoozed") shows snoozed items. Each reads
  "Queued · snoozed until 24 Nov".

### Won't do is a decision, not a deletion

- **It carries its reason.** Marking an item Won't do needs a one-line reason,
  and records who decided (the person, or the coordinator of the goal it belongs
  to) and when. All three show wherever the state is shown in full.
- **It is a log.** Won't do items are kept, filterable, as a decision log: a
  lane or list where each entry shows the reason, who decided, when, and a
  Reopen action.
- **It can be reopened.** Reopen sends the item back to Queued and keeps the
  decision in its history.
- **A coordinator's decision is surfaced.** A Won't do that a coordinator
  decided appears in the person's "since you left" summary, so they can reopen it.
- **Goals follow the same rules.** A goal marked Won't do takes its open items
  with it, citing the goal's reason; reopening the goal offers to reopen them.

### Words that are retired

Do not use **Cancelled** (replaced by Won't do), **Dropped** (a goal is Won't
do), **Not now** as a status (a snooze date), or **Move out of scope** (Won't
do with a reason).

### How other vocabularies map onto it

| Source | Its words | Work status |
| --- | --- | --- |
| Token status roles | `status.success`, `status.warning`, `status.danger` | Done (and passing outcomes), Needs you, Failed |
| Operator status chips | `working`, `needs-decision`, `blocked`, `paused`, `done`, `failed` | Under way, Needs you, Blocked, Blocked (it waits on something outside the work), Done, Failed |
| Bridge item states | `queued`, `under_way`, `waiting_on_you`, `blocked`, `done`, `failed`, `wont_do` | One to one, in the order of the table above |

The operator chips have no Queued or Won't do, and `paused` has no exact match:
it waits on a condition expected to clear by itself. It takes Blocked's colour
and shape, and keeps its own word.

## Accessibility

- Every count carries its unit ("3 need you"), and an unprompted change of state
  is announced in words (S10 in [`pxo:a11y/settings`](../a11y/settings.md)).
- Text on a chip meets 4.5:1 on its ground; a shape or mark that carries state
  meets 3:1 against each adjacent colour ([contrast targets](../a11y/behaviours.md#contrast-targets)).
- Under the colour-blind-safe palette (S7), the hues swap: blue for under way,
  vermilion for failed, yellow for needs you. The shapes and words do not change.
- **Known gap.** In the light scheme, operator pages measure the danger ink at
  4.37:1 (and their info ink at 4.31:1) on its soft ground, under 4.5:1. The fix
  is planned with the tokens' accessibility layers, not in this entry.

## Reference implementation

Bridge's candidate 5 builds the full state set. Its code lives in a local
repository with no remote yet, so it is described here, not linked or copied:

- an item state type with the seven values and one map from state to word;
- a legend that gives each state its colour token, fill and shape, used by the
  panels and the scene alike;
- a Won't do lane on the Board as the decision log, "Won't do…" with a required
  reason and Reopen in the item panel, and coordinator decisions listed in
  "Since you left";
- Snooze on queued items, with an "n snoozed" toggle;
- a provider port with `markWontDo(item, reason)`, `reopen(item)` and
  `snooze(item, until)`.

A goal becoming Won't do with its items is decided (row 125) but not yet built.

## Sources

- The Bridge plan's decision log, rows 122 to 125, decided by the operator on
  2026-11-21. Row 122: "A won't do gives you a log of things that you've decided
  on... If you delete it, you lose visibility." Row 123, on snooze: "I agree with
  A... It's how we work now."
- Bridge candidate 5's write-up and build of the Won't do lane and snooze.
- The design-system proposal of 2026-11-21, section 6 item 3 and call 6.
