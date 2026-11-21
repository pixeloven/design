# The design process

Every PixelOven project engages with design the same way, and the result
always lands in one place: this repository
([DDR-0009](decisions/0009-single-home-of-record.md)). The process reuses the
working parts projects already have — research tasks, review pages, held
decisions, product logs and delivery tasks — and adds only one place of record.

The `design-process` skill carries the parts every worker needs (Ask, Decide
and Codify); the `contributing` skill covers changing this repository.

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
   - A catalogue change is tagged `catalog-YYYY.MM` (provisional, see below).
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

## Principles (seed, provisional)

> **Placeholder.** This section will hold the seed of the process's principles
> layer: the qualified tests moved out of the PixelOven design thesis
> (2026-11-21), which is a working document not yet in this repository. Until
> the seed lands, the thesis is the reference; nothing here is a rule yet.

## Provisional, awaiting decision

These parts are drafted on the recommended option and may change:

- **Principles.** The section above is a placeholder for the principles seed.

- **Citing the system.** Product decisions cite `pxo:` ids and the catalogue
  version; decisions that change the system are DDRs
  ([DDR-0013](decisions/0013-decisions-cite-the-system-by-id.md), `proposed`).
- **Catalogue tags.** `catalog-YYYY.MM` is part of that proposal; no automation
  creates these tags yet.
- **The published reference.** The repository's Markdown is the reference:
  GitHub renders it and agents read it with no deployment. Where Storybook is
  published is not yet decided.
