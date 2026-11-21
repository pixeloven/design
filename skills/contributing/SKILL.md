---
name: contributing
description: "How to change pixeloven/design itself: which tier a change belongs in, how to add or retire a catalogue entry or decision record, regenerating catalog/index.json, the package and plugin version rules, and which checks must fail before they are trusted. Load before editing anything in pixeloven/design. Landmine: catalog/index.json is generated — a hand edit, an id that disagrees with its path, a duplicate id, a gap in decision numbering, or a reference that does not resolve fails CI. Renaming an id or deleting a decision is not caught by any check; never do either."
---

# Contributing to pixeloven/design

This repository is the single home of record for PixelOven's design knowledge
([DDR-0009](../../decisions/0009-single-home-of-record.md)). Packages hold what
is enforced in code; [`catalog/`](../../catalog/README.md) holds everything
else; [`decisions/`](../../decisions/README.md) records why. Before changing any
of it, know which of the three you are touching.

## Which tier

| You are adding | It is | Where |
| --- | --- | --- |
| A colour, scale, mark or shared control | **foundation** | `packages/tokens`, `packages/brand`, `packages/ui` — see `design-system-usage` and `brand-assets` |
| Reusable UI/UX behaviour | **pattern** | `catalog/patterns/<slug>.md` |
| Art bible, mood, vocabulary, voice, 3D scene rules | **direction** | `catalog/art/`, `catalog/voice/`, `catalog/scene/` |
| A dated exploration and its outcome | **study** | `catalog/studies/<slug>/README.md` (with its sources beside it) |
| Something retired | **archive** | `catalog/archive/` |
| A decision that changes the system | **DDR** | `decisions/NNNN-<slug>.md` |

Promote on evidence ([DDR-0011](../../decisions/0011-promote-on-evidence.md)):
an approval or a second consumer, not a draft. A pattern becomes a component in
`packages/ui` only once two products need it ([DDR-0008](../../decisions/0008-shared-controls-on-evidence.md)).

## Adding a catalogue entry

1. Copy the entry template from [`catalog/README.md`](../../catalog/README.md)
   into `catalog/<folder>/<slug>.md`, or `<slug>/README.md` when it carries
   specimen files.
2. Set `id` to match the path (`catalog/patterns/command-bar.md` is
   `pxo:pattern/command-bar`). The check fails if they disagree.
3. Fill `title`, `tier`, `status`, `since` and `owners`. Art entries also need
   `ip` (`reference-only`, `original` or `under-review`); studies should state
   their `outcome`.
4. Run `pnpm catalog:index`, then `pnpm test:catalog`. Commit the regenerated
   `catalog/index.json` with the entry.

## Changing an entry's status

- Move along `proposed → study → adopted → deprecated → retired`, and update
  `since` to the tag or version at which it changed.
- **Never rename or reuse an id.** Others cite it. No check catches a rename
  whose old id nothing in this repository cites, so this is a rule to follow.
- Superseding: set `superseded_by` (it must resolve) and status `deprecated`
  while a consumer still pins it.
- Retiring: move the file to `catalog/archive/<folder>/<slug>.md`, set tier
  `archive` and status `retired`. The id stays the same. Add what it was, why it
  was retired, what replaced it, and a frozen specimen (a small JSON snapshot,
  at most a few small images).
- A status change that the operator decided needs a DDR.

## Adding a decision record

1. Copy [`decisions/TEMPLATE.md`](../../decisions/TEMPLATE.md) to the next free
   number. Numbers have no gaps.
2. Quote the operator's words exactly, with the date.
3. Never delete or rewrite an accepted DDR. Write a new one that `supersedes`
   it, and mark the old one `superseded` with `superseded_by`.
4. A decision drafted on an option that is not yet decided is `proposed`, with a
   visible "provisional" note.
5. Regenerate the index; decisions are listed in it too.

## Versions and releases

- **A package version lives only in its `package.json`.** Bump it, merge, and CI
  tags and publishes. Never create a tag by hand.
- **The skills plugin version lives only in `.claude-plugin/plugin.json`.** Bump
  it when a skill is added, removed or changes what it tells an agent to do: a
  new skill is a minor bump. Consumers receive it when `pixeloven/marketplace`
  moves its pin.
- Each package keeps a `CHANGELOG.md` entry for its release.

## Ownership and review

- The studio is code owner for `catalog/scene/` and the art direction it
  authors under `catalog/art/` ([DDR-0012](../../decisions/0012-studio-code-ownership.md),
  [`CODEOWNERS`](../../CODEOWNERS)). Its changes take its own PR path with an
  independent reviewer.
- **Loosening a check** — weakening a test, a contrast floor or a catalogue
  rule — needs a second reviewer and is shown to the operator, whoever authors it.
- Changes to skills change what agents do. They wait for an explicit merge
  decision.

## What the checks enforce

- Token invariants in both schemes (`packages/tokens`), marks against the
  palette (`packages/brand`), control behaviour and types (`packages/ui`), docs
  coverage (`apps/docs`).
- The catalogue (`tools/catalog`): the index and the files agree both ways;
  every id matches its path and is unique; every `superseded_by` and cited
  `pxo:ddr/` id resolves; tiers and statuses are on the line and consistent
  with the folder; decisions are numbered without gaps; unknown frontmatter
  fields are rejected.
- Not checked: the checks never compare against history, so renaming an id or
  deleting the highest-numbered decision passes. Those are rules, not checks.

**A check that has never failed is not a check.** When adding one, make it fail
against the real mistake it guards before trusting it; the catalogue tests do
this with deliberately broken fixtures.

## Landmines

- **`catalog/index.json` is generated.** Hand edits fail the byte-for-byte check.
- **The frontmatter parser is deliberately small.** Plain or `"double-quoted"`
  values and lists only; a value containing `: ` or starting with a quote, `{`
  or `|` must be double-quoted or rewritten.
- **Public repository.** No third-party images (links only), no secrets, no
  project's proprietary production assets ([DDR-0010](../../decisions/0010-public-loose-licence.md)).
- **No evidence directories.** Screenshots and command output belong in review
  attachments, not source control.
- **Moving a file that something imports.** The Warden study sources are read by
  `apps/docs` and copied into the docs image; a move must update
  `apps/docs/stories/`, `apps/docs/Dockerfile` and the docs-image workflow
  paths, and leave a pointer at the old path.
