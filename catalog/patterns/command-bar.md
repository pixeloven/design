---
id: pxo:pattern/command-bar
title: Command bar
tier: pattern
status: adopted
since: catalog-2026.11
owners: [design]
consumers: [bridge]
decisions:
  - "Bridge plan decision log, rows 126 and 127 (2026-11-21)"
sources:
  - "Bridge candidate 5 (keyboard and command-first), 2026-11-21"
  - "Bridge accessibility brief, 2026-11-21, advisor answers to candidate 5"
---

# Command bar

One place to type what you want done. Every action in the product is a
command, so the whole product can be driven from the keyboard, by voice or with
one switch, and the visible chrome can stay small. Use it in any product with
more actions than its chrome can show at once.

## Rules

### Opening it

- `Ctrl+K` (`⌘K` on a Mac) or `Alt+K` opens it, and so does an always-visible
  **Commands** button. The button is the path with no chord.
- A single-key opener such as `/` for search is a character-key shortcut: it
  follows S9 in [`pxo:a11y/settings`](../a11y/settings.md) and switches off with
  the others.
- It is a modal dialog: it traps Tab, Escape closes it, and closing returns
  focus to whatever opened it (B2 in [`pxo:a11y/behaviours`](../a11y/behaviours.md)).

### What it holds

- **Every action.** The catalogue covers every route and every action,
  including each accessibility setting value ("Motion: still") and anything
  that otherwise needs a drag, such as moving or sizing a panel.
- **Verb, then arguments.** You type a verb, then its arguments, and inline
  arguments work: "approve mig" gives one row, and Enter then Enter approves the
  expiring migration. Missing arguments become the next steps.
- **Typos are forgiven.** Command names match fuzzily, and aliases find a
  command by the words people use ("out of scope" finds Mark won't do).

### Running a command

- **Navigation and settings run at once.** Anything consequential ends on a
  [confirm that lists its effects](confirm-with-effects.md) before it runs.
- **Results are always said.** The result of the person's own command is spoken
  in the one live region and shown on screen, at every announcement level. When
  a command moves focus, it does not also send the same words to the log.
- **Every run records its source:** typed, spoken or resolved by a model.
  Anything spoken or model-resolved always goes to the confirm, except
  navigation and settings, so a misheard "approve" cannot send.

### Asking the coordinator

- **The bottom row is always the ask.** For any typed text, the last row reads
  "Ask the Fleet coordinator: “<text>”" (in Bridge's words; a product names its
  own coordinator). It sits below every real match, not only when nothing
  matches.
- **It goes through the confirm,** like any consequential command.
- **The coordinator restates the request before acting,** so a misread request
  is caught before it runs. The confirm says so.
- A language-model resolver, when one exists, sits in front of this row; it
  does not replace it.

## Accessibility

- The bar is an ARIA combobox: a labelled text input that controls a listbox of
  results, with the active row announced as you move through it.
- `Alt+K` is clear in Firefox, Chromium, Orca and NVDA. Avoid `Alt+Shift+S`,
  which opens Firefox's History menu unless the page cancels it.
- Screen readers in browse mode swallow single-letter keys, so the shortcut list
  says so, and the chords and the button are the main paths.
- Every chord has a path with no chord as well.

## Reference implementation

Bridge's candidate 5 has a self-contained `src/command/` module that imports
only React. Its code lives in a local repository with no remote yet, so it is
described here, not linked or copied:

- a registry that the product's commands register into, about 90 of them;
- a pure matcher with inline arguments, `resolve(text, ctx)`, which returns
  ranked `{commandId, args, missing}`, so a speech grammar or a language-model
  resolver can replace it;
- a framework-free engine that a terminal companion could also drive;
- `describe()`, which exports the catalogue as JSON for use as a tool list;
- an ARIA-combobox `Palette` component, and a README that documents the interface.

## Sources

- The Bridge plan's decision log, decided by the operator on 2026-11-21:
  - Row 126: "'Ask the Fleet coordinator: <text>' is always the bottom row for
    any typed text, behind the confirm. Command typos stay with fuzzy matching."
  - Row 127: the coordinator "restates the request before acting", so a misread
    request is caught before it runs.
- Bridge candidate 5's write-up, 2026-11-21.
- The Bridge accessibility brief's advisor answers to candidate 5 (chords and
  spoken results).
- ARIA Authoring Practices, combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
