# Design decision records

A design decision record (DDR) is the one durable record of a decision that
changes PixelOven's design system: a new token or pattern, an art direction,
a retirement, or a rule about how the system itself works. Product decisions
that only *use* the system stay in that product's own log and cite the entry
they follow.

How decisions cite the system — `pxo:` ids plus DDRs here, with product logs
citing `pxo:ddr/NNNN` — is set by
[DDR-0013](0013-decisions-cite-the-system-by-id.md), `accepted`.

## Rules

- **One file per decision:** `decisions/NNNN-short-slug.md`, numbered in order,
  with no gaps. Its id is `pxo:ddr/NNNN`, derived from the file name and checked.
- **Start from [`TEMPLATE.md`](TEMPLATE.md).** Frontmatter carries `id`, `title`,
  `status`, `date` and `sources`, and optionally `supersedes`, `superseded_by`
  and `affects`. The index generator rejects an unknown field.
- **Status:** `proposed` (drafted, awaiting a decision), `accepted`, or
  `superseded` (which must name `superseded_by`).
- **Never delete or rewrite a decision.** Change one by writing a new DDR that
  `supersedes` it, then mark the old one `superseded`. This is a rule, not a
  check: the numbering test fails on a gap, but deleting the highest-numbered
  record leaves none.
- **Quote the decider.** When the operator made the call, the record carries
  their words exactly and the date they said them.
- **Backfilled records add nothing.** DDR-0001 to DDR-0008 restate decisions
  already written in [`docs/brand-family.md`](../docs/brand-family.md) and
  [`docs/brand-foundations-plan.md`](../docs/brand-foundations-plan.md), and
  cite where. Those documents remain the narrative; the DDR gives the decision
  an id.

Decisions appear in [`catalog/index.json`](../catalog/index.json) beside the
catalogue entries, so a cited `pxo:ddr/` id is checked to resolve.

## Index

| Id | Decision | Status |
| --- | --- | --- |
| [DDR-0001](0001-pixeloven-parent-family.md) | PixelOven is the parent; Lattice and Warden are products | accepted |
| [DDR-0002](0002-themes-accents-appearance-independent.md) | Cool/Warm themes, Acid/Violet accents and appearance are independent choices | accepted |
| [DDR-0003](0003-solid-primary-inset-companion.md) | Solid is the primary identity form; Inset is its companion | accepted |
| [DDR-0004](0004-warden-waymark.md) | Warden's identity is Waymark | accepted |
| [DDR-0005](0005-plex-type-roles.md) | Plex Sans for task text, Plex Mono for identifiers and data | accepted |
| [DDR-0006](0006-primitives-from-tokens.md) | Primitive scales come from tokens; products differ by figure, language and composition | accepted |
| [DDR-0007](0007-status-meaning-independent-of-accent.md) | Status colours keep their meaning under any accent | accepted |
| [DDR-0008](0008-shared-controls-on-evidence.md) | Shared controls are published only on shared evidence | accepted |
| [DDR-0009](0009-single-home-of-record.md) | `pixeloven/design` is the single home of record for design knowledge | accepted |
| [DDR-0010](0010-public-loose-licence.md) | The repository stays public under a loose licence | accepted |
| [DDR-0011](0011-promote-on-evidence.md) | Knowledge is promoted into the system on evidence | accepted |
| [DDR-0012](0012-studio-code-ownership.md) | The studio is code owner for the 3D standard and its art direction | accepted |
| [DDR-0013](0013-decisions-cite-the-system-by-id.md) | Decisions cite the system by `pxo:` id and DDR | accepted |
| [DDR-0014](0014-retire-status-words-cancelled-dropped.md) | Won't do replaces the status words Cancelled and Dropped | accepted |
| [DDR-0015](0015-mission-and-core-values.md) | The design system's mission and core values | accepted |
| [DDR-0016](0016-accessibility-standard-reach.md) | The accessibility floor applies to every product, the full settings to motion and live scenes | proposed |
| [DDR-0017](0017-one-work-status-meaning.md) | One work-status meaning across products, with fixed colour, shape and word | proposed |
| [DDR-0018](0018-bridge-art-target-voxel.md) | Bridge art target: voxel (Astra rendition); low-poly kept as a reference | accepted |
