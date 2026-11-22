# The design catalogue

`pixeloven/design` is the single home of record for PixelOven's design
knowledge ([DDR-0009](../decisions/0009-single-home-of-record.md)). The packages
hold what is enforced in code. This catalogue holds everything else — patterns,
accessibility guidance, voice, art and 3D direction, studies and retired design
languages — as one Markdown file per stable id.

Entries are promoted here on evidence ([DDR-0011](../decisions/0011-promote-on-evidence.md)):
an approval, or a second project that needs it. The repository is public under
a loose licence ([DDR-0010](../decisions/0010-public-loose-licence.md)); a
project's proprietary assets stay with that project.

How work reaches the catalogue is [`process.md`](../process.md).

## Five tiers

Each entry sits in exactly one tier, and the tier says how binding it is.

| Tier | What it is | Form | How binding |
| --- | --- | --- | --- |
| **foundation** | Values a consumer must not redefine | The packages (`tokens`, `brand`, `ui`), tested | Enforced by tests and by the "no literal values" rule |
| **pattern** | Reusable UI/UX behaviour: panels, command bar, status display, settings layers | Entry with rules, accessibility notes and a reference implementation link; it becomes a component once two products need it | Expected; a deviation is a recorded decision |
| **direction** | Art bibles, mood, vocabulary, voice, 3D scene rules | Entry, plus small specimens | What reviews judge against |
| **study** | Dated explorations and candidates | Entry with its outcome and links to review pages | Informative only |
| **archive** | Retired design languages and superseded entries | Entry with dates, why it was retired, what replaced it, and frozen specimens | Do not use in production |

## Content areas

| Area (in the id) | Folder | Holds |
| --- | --- | --- |
| `token` | `packages/tokens/` | Foundation values; the id is the token's existing JS name, e.g. `pxo:token/status.danger` |
| `a11y` | `catalog/a11y/` | The accessibility standard: settings contract, behaviours, contrast targets, test kit, checklist |
| `pattern` | `catalog/patterns/` | UI/UX patterns, e.g. `pxo:pattern/command-bar` |
| `voice` | `catalog/voice/` | Language and interaction rules, vocabulary, persona-theme index, naming and IP rules |
| `art` | `catalog/art/` | Art bibles per world, style bibles, mood boards (links only), colour scripts, the art glossary |
| `scene` | `catalog/scene/` | 3D direction: lighting states, projection, materials vocabulary, reserved mark colours and their contrast rule |
| `study` | `catalog/studies/` | Dated explorations with outcomes, e.g. `pxo:study/warden-identity` |
| `archive` | `catalog/archive/` | Retired design languages, e.g. `pxo:archive/pi-web-dark` |
| `ddr` | `decisions/` | Design decision records, e.g. `pxo:ddr/0007` |

A folder exists once it has an entry. Today the catalogue holds:

- the accessibility standard, `proposed`: [`pxo:a11y/settings`](a11y/settings.md),
  [`pxo:a11y/behaviours`](a11y/behaviours.md) and
  [`pxo:a11y/checklist`](a11y/checklist.md);
- the patterns [`pxo:pattern/work-status`](patterns/work-status.md),
  [`pxo:pattern/command-bar`](patterns/command-bar.md) and
  [`pxo:pattern/confirm-with-effects`](patterns/confirm-with-effects.md), `proposed`, and
  [`pxo:pattern/panel-over-scene`](patterns/panel-over-scene.md), a `study`;
- the Bridge art target [`pxo:art/bridge-voxel`](art/bridge-voxel/README.md),
  `adopted`, and the low-poly reference kept beside it,
  [`pxo:art/bridge-low-poly`](art/bridge-low-poly/README.md), a `study`
  (neither is an art bible);
- the study [`pxo:study/warden-identity`](studies/warden-identity/README.md);
- seven retired entries in [`archive/`](archive/).

The decision records are in [`decisions/`](../decisions/README.md).
[`index.json`](index.json) is the full list.

`catalog/scene/` and studio-authored entries under `catalog/art/` are owned by
the studio ([DDR-0012](../decisions/0012-studio-code-ownership.md), [`CODEOWNERS`](../CODEOWNERS)).

## Ids

Every entry has a stable id of the form **`pxo:<area>/<slug>`**. The id is
derived from where the file lives, and a test fails if the frontmatter
disagrees:

- `catalog/<folder>/<slug>.md` → `pxo:<area>/<slug>`
- `catalog/<folder>/<slug>/README.md` → `pxo:<area>/<slug>`, for an entry that
  carries specimen files beside it. Other files in that directory belong to the
  entry.
- `decisions/NNNN-<slug>.md` → `pxo:ddr/NNNN`

Slugs are lower-case words joined by hyphens. **An id is never renamed or
reused.** A retired entry moves to the archive and keeps its id:
`catalog/archive/<folder>/<slug>.md` is still `pxo:<area>/<slug>`. Something
that was only ever archived, such as a pre-system palette, is
`catalog/archive/<slug>.md` → `pxo:archive/<slug>`.

> **Provisional.** Citing the system by these ids, with DDRs for decisions that
> change it, is drafted on the recommended option and awaits a decision
> ([DDR-0013](../decisions/0013-decisions-cite-the-system-by-id.md), `proposed`).
> A product decision that follows an entry names the id and the catalogue
> version, for example "panels follow `pxo:pattern/panel-over-scene` (design
> `catalog-2026.11`)". Catalogue tags `catalog-YYYY.MM` are part of that
> proposal and are not yet created by automation.

For links a decision depends on, use a GitHub permalink at a tag; for reading,
the branch link is fine.

## Status

Every entry moves along one line:

```
proposed → study → adopted → deprecated → retired
```

| Status | Meaning |
| --- | --- |
| `proposed` | Drafted; not yet explored or decided |
| `study` | Being explored, or kept as an informative study with its outcome |
| `adopted` | The current guidance; consumers follow it |
| `deprecated` | Superseded or on its way out; still pinned by a consumer |
| `retired` | No consumer uses it; it lives in `catalog/archive/` |

The checks hold the line together: a `retired` entry must be in the archive
with tier `archive`, and only there; an entry in `catalog/studies/` has tier
`study`; an entry with `superseded_by` is `deprecated` or `retired`, and its
successor must exist.

Decision records have their own status: `proposed`, `accepted` or `superseded`.

## Entry template

Copy this into `catalog/<folder>/<slug>.md`:

```markdown
---
id: pxo:<area>/<slug>
title: A short name
tier: pattern
status: proposed
since: catalog-YYYY.MM
owners: [design]
consumers: [lattice, warden]
supersedes: []
superseded_by: []
decisions: [pxo:ddr/NNNN]
sources:
  - https://… or a repo path
ip: original
---

# A short name

One paragraph: what this is and when to use it.

## Rules

## Accessibility

## Reference implementation

## Sources
```

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | `pxo:<area>/<slug>`, matching the path |
| `title` | yes | A short name |
| `tier` | yes | `foundation`, `pattern`, `direction`, `study` or `archive` |
| `status` | yes | `proposed`, `study`, `adopted`, `deprecated` or `retired` |
| `since` | yes | The repo tag or package version at which the entry took its current status |
| `owners` | yes | Who maintains it: `design`, `studio`, or a product |
| `consumers` | no | Products that follow it |
| `supersedes`, `superseded_by` | no | `pxo:` ids; each must resolve |
| `decisions` | no | DDR ids (checked to resolve) or product log rows |
| `sources` | no | Reports, review pages, repo paths |
| `ip` | for art | `reference-only`, `original` or `under-review` |
| `outcome` | for studies | One line: what the study concluded |

Frontmatter is a small YAML subset — plain or `"double-quoted"` values, `[flow]`
lists and `- item` lists. Anything else, and any unknown field, is an error, so
a typo cannot silently drop out of the index.

## The index

[`index.json`](index.json) is **generated** from entry and decision frontmatter.
Never edit it by hand:

```bash
pnpm catalog:index         # regenerate after changing any entry or decision
pnpm test:catalog          # the parity and resolution checks
```

The tests assert that the index and the files agree in both directions, that
every id matches its path and is unique, that every `superseded_by` and cited
decision resolves, and that decisions are numbered without gaps. Each check is
also run against a deliberately broken catalogue, so it is known to fail on the
mistake it exists for. The checks never compare against history: renaming an id
or deleting the highest-numbered decision passes them, so never doing either is
a rule, not a check.

## What does not belong here

- Third-party images. Mood boards and references are links with a one-line
  "why" and an IP note.
- A project's proprietary production assets, mechanisms and raw files
  ([DDR-0010](../decisions/0010-public-loose-licence.md)).
- Screenshots and command output as evidence. Those belong in review
  attachments, not source control.
- Production code owned by a product. An entry describes and links its
  reference implementation.
