---
id: pxo:pattern/confirm-with-effects
title: Confirm with effects
tier: pattern
status: proposed
since: catalog-2026.11
owners: [design]
consumers: [bridge]
decisions:
  - "Bridge plan decision log, rows 126 and 127 (2026-11-21)"
sources:
  - "Bridge candidate 5 (keyboard and command-first), 2026-11-21"
---

# Confirm with effects

Before anything consequential runs, one view says in words exactly what will
happen, and the person confirms it with a button named for the action. Use it
for anything that sends, that changes someone else's work, that queues, or that
cannot be undone — from the [command bar](command-bar.md) or from any button.
Navigation and settings do not need it.

> **Proposed: not adopted.** Which of Bridge's candidate pieces go into
> Bridge's MVP is an open decision. This entry is drafted from Bridge's
> candidate 5 and waits on that decision before it can be adopted.

## Rules

- **List every effect in words.** Who gets it, whether it will queue or run
  now, and what does *not* change. For example: "Approves the expiring
  migration. Its coordinator is told at once. Nothing else in the goal changes."
- **Name the button for the action.** "Approve migration", "Send to the Fleet
  coordinator", "Mark won't do" — never "OK" or "Confirm".
- **Cancel is safe.** Cancel and Escape leave everything as it was and return
  focus to where the person started.
- **A request to a coordinator says it will be restated.** When the action asks
  a coordinator to act on free text, the confirm says the coordinator will
  restate the request before acting.
- **Spoken or model-resolved actions always confirm,** except navigation and
  settings, so a misheard or misread request cannot send.
- **Ask for what the action needs.** If the action needs a reason (Won't do in
  [`pxo:pattern/work-status`](work-status.md)), the confirm holds the required
  field and will not run without it; pressing the button with it empty says
  what is missing.
- **Say the result.** After it runs, the result is spoken in the live region and
  shown on screen.

## Accessibility

- The confirm is a true dialog: it traps Tab, makes the rest `inert`, and moves
  focus to its title on open (B2 in [`pxo:a11y/behaviours`](../a11y/behaviours.md)).
- The effects are text, not icons alone, so a screen reader reads the same list
  a sighted person sees.
- The button's name is its visible label. An unlabelled confirm button passed
  every automated test in Bridge's candidate 5 and was caught only by a
  designer's screenshot review, so check the name by eye as well.

## Reference implementation

Bridge's candidate 5 ends every consequential command on this confirm view, and
routes the coordinator ask through it. Its code lives in a local repository with
no remote yet, so it is described here, not linked or copied.

## Sources

- Bridge candidate 5's write-up, 2026-11-21: "Anything consequential ends on a
  confirm view. It lists every effect in words (who gets it, whether it will
  queue, what does not change), and its button is named for the action."
- The Bridge plan's decision log, rows 126 and 127 (2026-11-21): the coordinator
  ask is "behind the confirm", and the coordinator restates the request before acting.
