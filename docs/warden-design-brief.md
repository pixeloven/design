# Warden: directing work

2026-10-19 · Design proposal, before product implementation. Part of
[design #8](https://github.com/pixeloven/design/issues/8).

## Job and authority

One operator directs work at a desk and makes individual decisions on a phone.
Agents use MCP. Directing is primary; triage and history are also valid reasons
to visit. Success is filing intent, understanding its progress, inspecting the
evidence for a decision, and returning without reconstructing the context.

The visual authority is the approved [PixelOven family](brand-family.md):
Cool/Warm, Acid/electric Violet, Plex Sans/Mono and Solid/Inset. Lattice is the
production reference for craft and continuity. Warden's working composition
follows tasks, dependencies and decisions.

## Current evidence

The fresh live assessment inspected desktop 1440×1000 and phone 390×844 on
October 19. It was read-only; no creation, movement or decisions were submitted.
The deployed source revision was not established by the visual review. The
separate capability review used current main
[`1bdb4b0`](https://github.com/pixeloven/warden/tree/1bdb4b0280d887134a5a0f0be3e028fd8368c085).
Main's issue contract and the live UI's card vocabulary must be reconciled for
release. The September audit is historical evidence, not a current defect count.

| Finding | Observation | Design requirement |
| --- | --- | --- |
| Entry and structure | Live entry opened an empty Needs You queue; active work was elsewhere. Project context was buried in metadata. | Start with useful active work. Keep Needs You immediately reachable and show project/epic context where it helps direct work. |
| Phone working space | Detail and composer began 321px down a 390×844 viewport, leaving 523px for the task before the software keyboard. Metadata preceded Intent. | Give a phone task the usable viewport, with reachable actions, meaningful content first and a dependable return. |
| Draft continuity | A typed unsaved title disappeared after Escape and reopen. | Preserve drafts through supported dismissal and failures; use an explicit discard action and disclose the actual storage lifetime. |
| Focus and controls | Opening detail left focus on its board control. Phone close measured 22×22px and New card 35×27px; navigation and inputs were 34px high. | Focus enters the active task and returns logically. Use the shared 44px controls; protect phone modal focus and background interaction. These dimensions alone are not a complete WCAG target-spacing assessment. |
| Hierarchy and history | Predicates, endpoint details, raw frontmatter and policy prose competed with intent. Decision tables were raw Markdown. | Put intent and relevant evidence first. Present existing authored history readably; retain raw source and diagnostics in disclosure. |
| Board density | At 1440px the populated column was about 189px wide, with five empty columns occupying the remaining board. | Keep cards readable; offer a list and a selected-state phone view. Preserve fixed workflow meaning. |

Retain the readable Plex base, explicit human-gate labels, and blocker identity
with its state. The source review independently confirmed component-local draft
state, constrained phone panels, missing read Retry, and technical detail order.

Review/verify data, actual write outcomes, alternate-theme contrast, physical
phone keyboards and named screen readers were not verified in the live pass.
Owned fixtures must cover those before implementation acceptance. Private live
captures remain outside this repository.

## First working proposal

### Direction contract

- **Mode:** Operate for the workspace; Read/compare for the identity study.
- **Authority:** Extend the approved PixelOven family and task-focused Warden
  direction. No replacement visual world or raster composition is proposed.
- **Form:** A persistent work navigator, readable board/list and adjacent desktop
  task. Phone tasks become a full-viewport working surface; the board shows one
  chosen stage. This composition follows the job and actual workflow states.
- **First viewport:** Visible active issues and New issue establish the next
  action immediately. Review chrome labels the synthetic proposal separately
  from the product's own navigation.
- **Signature interaction:** Open work, inspect its intent/evidence and decision
  consequence, then return to the originating control. A dismissed creation
  draft resumes in the same tab, including after reload when storage works.
- **Material and motion:** Canonical neutral grounds, restrained accent selection,
  Plex text and angular Solid/Inset artwork. Short shared hover transitions
  clarify interaction; no decorative entrance or continuous motion is required.

### Experience

- **Work:** active issues in a comfortable board or list. Keep the five existing
  saved views available; strengthen project/epic context and clear creation.
- **A task:** title, state and related work establish context; Intent leads.
  Plan is prominent for review, Result and Done when for verification. Existing
  Decisions and Log are readable and traceable to their authored content.
- **A decision:** show the action and consequence before committing it. Preserve
  the task and entered reason on refusal/failure. Successful mutation facts take
  precedence over a temporarily older index response.
- **A phone:** one full working task at a time. Selection of a workflow state or
  a readable list replaces several narrow board columns. Close/Back returns to
  the same view, useful scroll position and focus.
- **An interruption:** preserve the creation draft on close. Explicit discard
  clears it; failures retain it. Appearance and view changes preserve the task.

The interactive study uses synthetic data and no network writes. It demonstrates
proposed presentation and continuity, not production API integration or automatic
agent execution. Warden mark choices are review-only until selected.

## Product constraints the implementation must respect

Current states are `todo`, `plan`, `review`, `build`, `verify`, `done`. Humans may
move directly to any known state. Approve and Send back are distinct policy
operations; Send back increments reviews. Unticked completion conditions do not
prevent a human approval under the current policy.

The six browser mutations are create, approve, send back, move, append to Log,
and tick Done when. Create accepts title, configured issue type, intent, project,
parent and dependencies. It creates `todo`; project is a string and parent is
an issue reference. There is no assignee, dispatch, project entity, general
issue-edit or structured history-event API. Do not invent one through UI copy.
Current source does not automatically add Log or Decisions entries for ordinary
transitions.

The server owns saved-view predicates and order. Active excludes done and epics;
Needs You includes review/verify regardless of whether the gate holds; Blocked
excludes done; Recurring currently selects audit; Epics includes completed epics.
Browser code must not quietly redefine these meanings.

## Choices to settle through the proposal

1. Select a Warden figure within the existing Solid/Inset family.
2. Confirm the Work-first composition and phone task model by trying the demo.
3. Define project/epic browsing against actual data and server-owned filtering.
   A richer project overview may need an additive query contract.
4. Keep authored issue history readable in the first delivery. A cross-issue
   searchable timeline needs an explicit event/source model before it is promised.

The designer recommends a stronger project overview and a History destination.
These remain desired outcomes to specify, with the above API boundaries visible.
They must not be imitated with an apparently complete client-generated activity log.

## Proposed implementation slices

| Slice | Outcome and acceptance |
| --- | --- |
| Foundations and continuity | Adopt published tokens/UI and selected assets; readable focus/controls; draft close/reopen/discard/failure behavior with a declared lifetime. Preserve existing appearance preferences. |
| Workspace and task | Work-first entry, board/list and phone state view, readable detail, focus/history/scroll return. Define URL and Browser Back behavior before coding. |
| Project and epic navigation | Agree grouping, totals, completion meaning, unparented work and unresolved references; keep predicates/order server-owned. Add queries only where required by the agreed experience. |
| Decisions and authored history | Review/verify evidence and action consequences, faithful Log/Decisions presentation, explicit refusal/error retry and index-lag reconciliation. No repeated writes during recovery. |
| Acceptance and release | Replay complete journeys with owned fixtures, strict/static checks and independent reviews; CI owns broad suites. Validate package publication and paired product artifacts before consumer rollout. |

For each slice, the product execution spec must name the actual components,
queries/mutations, state transitions, fixtures and recovery expectations.
The study does not authorize a production card-to-issue migration. Reconcile
Warden #59/#60 and deployed API/frontend/vault versions before that cutover.

## Review journeys

1. Understand active work, open an issue and follow its parent/blocker context.
2. Start a draft, close it, change appearance, reopen, and explicitly discard.
3. Read a plan or result, understand the consequence, simulate refusal/failure,
   and recover with the task and reason retained.
4. On phone and keyboard, enter a task, reach its last content/action, close and
   return to the originating work without losing focus or context.
5. Compare Warden marks alongside the approved parent/product pair, at actual
   icon sizes and in both appearances.

## Source anchors

- [Schema and current fields](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/frontend/schema.graphql)
- [Saved views](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/src/warden/views.py)
- [Product context](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/PRODUCT.md) — usage/version and mutation-count statements need reconciliation with later source.
