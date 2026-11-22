# The design process

Every PixelOven project engages with design the same way, and the result
always lands in one place: this repository
([DDR-0009](decisions/0009-single-home-of-record.md)). The process reuses the
working parts projects already have — research tasks, review pages, held
decisions, product logs and delivery tasks — and adds only one place of record.

The `design-process` skill carries the parts every worker needs (Ask, Decide
and Codify); the `contributing` skill covers changing this repository.

## Mission and core values

Decided by the operator on 2026-11-21
([DDR-0015](decisions/0015-mission-and-core-values.md)).

**Mission.** We give every PixelOven project one design language and the tools
to use it, so everything we make is accessible to everyone.

**Core values.**

1. **Make it ours.** Original worlds, original work.
2. **Clear for everyone.** If someone can't take it in, it isn't done.
3. **Build for real use.** Made for something we need, not a someday.
4. **Write it down once.** One source of truth, reused everywhere.
5. **Give back.** Our design language and tools are open.
6. **Agent first.** Built so agents can find it, use it and check it.

## Principles (seed, provisional)

The layer under the values: granular, testable principles. Nothing here is
adopted yet. These five tests were taken out of the design thesis on
2026-11-21 as the seed of this layer; each is a question to ask of a design
decision, with the value it serves and where it already shows.

| Test | The question | Value | Already written in |
| --- | --- | --- | --- |
| **Earned by use** | Which real use needs this now? Share it when a second one does. | Build for real use | [DDR-0008](decisions/0008-shared-controls-on-evidence.md), [DDR-0011](decisions/0011-promote-on-evidence.md) |
| **Reads as intended** | Can the people it is for take in what matters, by eye, by keyboard or by screen reader? | Clear for everyone | The accessibility standard, whose reach is set by [DDR-0016](decisions/0016-accessibility-standard-reach.md) |
| **Written once** | Is this value, rule or decision already written somewhere? Then link to it. | Write it down once | [DDR-0009](decisions/0009-single-home-of-record.md); the [README](README.md#why-this-exists)'s two drifted palettes |
| **Checked, tried or judged** | Is this a rule (it gets a check), a question about the audience (it gets a trial with a person, or is marked untested), or taste (the operator's eye)? | — | The [README](README.md#working-here)'s "a check that has never failed is not a check"; [checklist](catalog/a11y/checklist.md) line 32 |
| **Ours** | Is it original, with its references as links and a reason, never copies? | Make it ours | [DDR-0010](decisions/0010-public-loose-licence.md); the catalogue's [What does not belong here](catalog/README.md#what-does-not-belong-here) |

"Give back" and "Agent first" have no test yet. A principle written from this
seed shows its source and says one thing; adopting one is a DDR.

## Who's who

| Role | Who |
| --- | --- |
| **Operator** | The person who makes PixelOven's design calls |
| **Coordinator** | The agent that plans work, asks the operator, and dispatches tasks (Firstmate in PixelOven's fleet) |
| **Scout** | A research-only task: reads, compares and reports; changes no repository |
| **Ship** | A delivery task: changes one repository through its registered PR path |
| **Studio** | PixelOven's art pipeline: art packs, and the 3D standard it writes ([DDR-0012](decisions/0012-studio-code-ownership.md)) |

## The eight steps

1. **Ask.** A project needs design: a new surface, a style, a pattern, or a
   change to an existing one.
   - The coordinator checks [`catalog/index.json`](catalog/index.json) first.
   - If an `adopted` entry fits, the work is consumption: it goes straight to a
     ship task that cites the id.
   - If an archived or studied entry matches, the coordinator relays what was
     tried and why it stopped, before anything new starts.
2. **Explore and reference.** A scout writes the research or reference report,
   with sources and IP notes, in the coordinator's task data (not in this
   repository). References are links, never copied work.
3. **Prototype.**
   - Candidates and studies are built by ships or scouts in isolated copies.
   - Contact sheets and static boards are reviewed on a review board; live
     canvases in private review pages.
   - A study gets a `catalog/studies/` entry when it is promoted to the
     repository (step 5), not before.
4. **Decide.**
   - Operator calls are held by the coordinator, one held decision per review.
   - The answer is recorded in the product's own log, with the operator's words.
   - If the answer changes the system — a new token, pattern, art direction or
     a retirement — the same answer also becomes a DDR in
     [`decisions/`](decisions/README.md), and the product log row cites
     `pxo:ddr/NNNN`.
5. **Codify.**
   - A ship task in `pixeloven/design`, on its registered delivery path, writes
     or updates the entries, closes the study with its outcome, and moves the
     options not taken to the archive.
   - A design-system gap found while working elsewhere is filed as a change here,
     not left as a note in another repository.
   - Promotion follows evidence ([DDR-0011](decisions/0011-promote-on-evidence.md)):
     an approval, or a second project that needs it.
6. **Release.**
   - A package change bumps the version in its `package.json`; CI tags and
     publishes it. Nothing is tagged by hand.
   - A catalogue change is tagged `catalog-YYYY.MM`; no automation creates
     these tags yet ([DDR-0013](decisions/0013-decisions-cite-the-system-by-id.md)).
7. **Adopt.** Each consumer pins the release in its own PR and cites the ids it
   follows in its `DESIGN.md`. No consumer floats to latest.
8. **Retire.** A superseded entry becomes `deprecated`, and moves to
   `catalog/archive/` with its id unchanged once no consumer pins it.

| Step | Who | Where it lands |
| --- | --- | --- |
| Ask | Coordinator | Backlog item; catalogue lookup |
| Explore | Scout | The coordinator's task data (a report) |
| Prototype | Ship or scout; studio for art packs | Candidate repo or task data; review board or private review page |
| Decide | Operator, through the coordinator | Held decision; the product log; a DDR when the system changes |
| Codify | Ship in `pixeloven/design` | `catalog/`, `decisions/`, `packages/` |
| Release | Design repo CI | GitHub release and packages |
| Adopt | Ship in each consumer | Consumer PR; its `DESIGN.md` |
| Retire | Ship in `pixeloven/design` | `catalog/archive/` |

## Ownership and review

- The studio is code owner for `catalog/scene/` and the art direction it
  authors under `catalog/art/`, on its own PR path with an independent
  reviewer ([`CODEOWNERS`](CODEOWNERS)).
- **A change that loosens a check** — a test, a contrast floor, a catalogue
  rule — needs a second reviewer and is shown to the operator for approval,
  whoever authors it.
- Every other path keeps the repository's normal owners.

## Provisional, awaiting decision

These parts are drafted on the recommended option and may change:

- **Principles.** The seed above is not adopted.
- **The published reference.** The repository's Markdown is the reference:
  GitHub renders it and agents read it with no deployment. Where Storybook is
  published is not yet decided.
