# Warden: projects people can direct

2026-10-19 · Design proposal, before product implementation. Part of
[design #8](https://github.com/pixeloven/design/issues/8).

## Review status and recommendation

The operator supports the visual direction but found the October study's
project/task management wrong. Its queue-centered work model is superseded by
this brief. The revised Storybook and portable demo now follow the complete
project/task journey below. They are synthetic interaction studies; operator
journey review and the production execution specification remain ahead.

**Build a project workspace where a human can shape an outcome, organize its
tasks, direct progress and inspect the result. Agents use MCP to contribute to
the same work records.** Human work includes planning and organization as well
as approving agent output. The design defines the intended experience; missing
API capabilities become explicit delivery work.

Recommend two levels: **Project → Task**, matching the operator's original
projects/epics and tasks/issues framing. A project is a meaningful outcome;
a task is an actionable piece of work. Standalone tasks remain valid. Do not
add a third Project → Epic → Task hierarchy. Mapping the existing `project`
string and `parent` reference requires a data review before implementation;
the interface must not silently reinterpret or discard either.

One operator works at a desk and makes shorter visits on a phone. Success means
they can answer: What are we trying to achieve? What should happen next? What
needs my input? What actually finished? They should not have to reconstruct the
project by browsing global queues.

The visual authority is the approved [PixelOven family](brand-family.md):
Cool/Warm, Acid/electric Violet, Plex Sans/Mono and Solid/Inset. Lattice is the
production reference for craft and continuity. Warden's composition follows
project context, ordered work and clear decisions. Its mark remains unselected.

## Reconciliation: September intent and Lattice's design evolution

The recovered September 17 product direction already described humans managing
projects/epics and tasks/issues, with agents using MCP. Journey WJ-4 required
understanding a project's work and returning without losing context. Review-pack
decision D-02 recommended a project-first board with Needs you filtering. The
September prototype demonstrated that structure. The October queue-centered
study departed from it; this brief restores the original product intent while
applying the family's later design decisions.

Use this brief as the current Warden product direction and the
[family guide](brand-family.md) as visual authority. Historical studies remain
reference material; neither their illustrative fields nor their palettes become
production contracts. Preserve dated audits as baselines and retest findings
before turning them into current defects. Update this brief in place as decisions
settle, rather than adding competing plans.

| Source to carry forward | Reconciled Warden decision | Disposition |
| --- | --- | --- |
| September's project → task → decision → return journey | Projects have an outcome and an actionable board/list. Capture, refinement, organization and completion belong to the core experience. Attention supports that lifecycle. | Keep the product intent; replace the October navigation. |
| Approved Lattice/PixelOven identity and theme choices | Use canonical Cool/Warm, Acid/electric Violet, independent appearance, Plex roles and Solid/Inset assets. Give Warden its own selected figure and work-oriented composition. | Reuse published foundations; Warden figure selection remains open. |
| Lattice's exploration continuity | Retain project, filters, selected task, useful scroll and focus through detail, search, layout changes and return. Direct links and Browser Back are part of the interaction contract. | Adapt the behavior to project/task navigation. |
| Lattice's focused and expanded reading direction | Let people read substantial intent, plans and results comfortably, with expanded desktop reading and full-screen phone tasks. Keep the originating project recoverable. | Adapt reading patterns; do not copy the graph or require Obsidian-specific syntax. |
| Lattice's mobile corrections | Keep navigation compact and the active task usable. Use a readable list or chosen stage, accessible controls and reachable actions with a phone keyboard. | Carry forward the working-space principle; verify Warden's actual layouts. |
| September's ownership and next-actor goal | Distinguish responsibility for work, the person needed for a decision, and observed execution activity. Preserve the product need for clear responsibility while specifying its data source. | Keep the goal; replace invented owner/activity claims with explicit contracts. |
| Shared truthful-state and accessibility rules | Distinguish no work, partial data, failure and confirmed success. Retain drafts and reasons; recovery never repeats a write. Keyboard, text enlargement, themes and focus are journey requirements. | Required acceptance behavior. |
| Shared component ambitions | Reuse published controls now. Compare navigation, task surfaces, reading, feedback and return behavior before extracting additional shared components. | Share proven behavior; keep board and graph domain logic with their products. |

The Lattice comparison used source
[`cff7de3`](https://github.com/pixeloven/lattice/tree/cff7de3d8fd438462f37cb9237d239e1bd5f221f).
Its roadmap records the approved application shipped in v0.21.1; later reader
refinements provide implemented interaction evidence. This comparison does not
claim a new deployment or physical-device/assistive-technology acceptance pass.

Lattice helps people explore and understand knowledge. Warden helps them turn
intent into organized work and inspect its outcome. A Warden task should be able
to reference relevant knowledge or evidence with a useful label and predictable
return. Begin by specifying ordinary source links and provenance. Automatic note
creation, bidirectional synchronization and a shared storage model are separate
product decisions, not prerequisites for this design. Lattice lifecycle work
continues in its own session.

## Proposed experience

### Three places, each with a distinct job

| Destination | What the person does there |
| --- | --- |
| **Projects** | Find active or completed projects. Open one to see its outcome, completed/total task counts, blockers and decisions alongside its Board/List. Recent projects remain directly reachable in navigation. |
| **All tasks** | Capture standalone work, search across projects and find open or completed tasks. Every result retains its project context when one exists. |
| **Needs attention** | Resolve an actual decision or problem across projects. Each entry explains why it is here and what action is needed; it links back to its project. |

Recommend Projects as the initial destination and restoration of the last
workspace on a return visit. Needs attention remains one action away with a
truthful count. Blocked, recurring and completed are useful filters, not peer
organizational entities competing with projects. Recurring work keeps its
existing meaning until its contract is explicitly changed.

Within a project, its outcome and compact progress summary stay above the work.
Open, Completed and All filters make scope explicit. Board and List show the
same tasks and planning order. Preserve the six task stages initially, with
readable cards rather than shrinking everything to fit. Counts describe tasks,
not an invented percentage of the outcome achieved. Loading or partial data
must not masquerade as a complete project summary.

### One complete journey is the design test

Use a synthetic project, **Improve note reading**, with tasks for the focused
reader, internal-note navigation and phone validation. This is demonstration
content, not a claim about unfinished Lattice delivery.

1. **Start with an outcome.** Create the project and describe what success means.
   Arrive in its workspace with a clear Add task action, not a global empty queue.
2. **Break it into work.** Add tasks without re-entering the project. Quick
   capture needs a title; intent and completion conditions can be refined in
   place. Creation defaults to Todo and shows the inherited project before save.
3. **Organize what happens next.** Edit tasks, put phone validation after the
   reader, and link the real dependency. Planning order and workflow stage are
   separate. Moving a task between projects is explicit and preserves its record.
4. **Direct progress.** Open the reader task, inspect its plan, and make a
   decision with the consequence visible. Return to the same project, filter,
   scroll position and useful focus. A refused or failed action retains input.
5. **Check an interruption on a phone.** Enter from Needs attention, read the
   result in a full-screen task, act, then return to that queue or its project.
   The human can distinguish an awaiting decision from a dependency blocker.
6. **Finish and find it again.** Completing a task reduces active clutter while
   keeping it in Completed and search. Project completion is a separate, explicit
   outcome decision; show unfinished work and require a deliberate disposition
   before confirming. Never cascade completion or reopening to child tasks.

The revised prototype demonstrates this journey end to end, including adding
and editing work, ordering it, changing its project, completion and retrieval.
Its fixtures include Improve note reading, Release preparation, a 50-task Library
maintenance project, a completed Reading foundation project and standalone work.
The review guide names capabilities that still need production contracts.

For this study, completing a project requires its unfinished tasks to be finished
or transferred first. The action never changes child stages. Reopening a child
in a completed project requires explicitly reopening that project. This is a
proposed interaction policy for review, not a claim about current Warden policy.

### Interaction, trust and accessibility

- Contextual creation inherits the project; changing the project is visible.
  Close/reopen and recoverable failures retain drafts, with explicit discard
  and a declared storage lifetime. No success message precedes a confirmed write.
- Desktop supports an adjacent task and expanded reading. Phone uses one
  full-screen task, with the project and dependable Back behavior visible.
  The workspace offers a readable list or one chosen board stage. Browser Back,
  direct links and view changes preserve context, not just appearance.
- Direct board movement and reordering have keyboard and touch alternatives.
  Explain the new stage and order after an action; focus returns logically.
  Intent, Plan, Result and completion conditions lead; metadata and raw source
  stay available without dominating the task.
- Stage, blocker and need for human input are separate facts. Build does not
  mean an agent is running. Display execution activity only from explicit
  evidence; otherwise show the last recorded update. Review/Verify alone must
  not be described as a required human gate when policy says otherwise.
- Responsibility and required next actor must be understandable. Define whether
  an owner represents a human, agent or another accountable role, and how that
  fact is authored and updated. Missing responsibility stays explicit. An owner
  label is not evidence of a running agent or a dispatch operation.
- Present authored Log and Decisions faithfully. A structured action history
  would require its own event/provenance contract; do not manufacture it from
  current state. Read retries never repeat writes, and confirmed mutation facts
  take precedence over a temporarily older index response.

Exercise empty and completed projects, unparented tasks, long titles, many
projects, dense task lists, unavailable dependencies, missing references and
incomplete reads. Prototype fixtures should include two projects for contextual
creation and transfer, standalone work, a completed project, a small three-task
journey and a larger project with at least 50 tasks across stages. Test keyboard,
enlarged text, phone keyboards, themes and recovery as part of the journeys.

## Relevant patterns and our judgment

Linear gives a project its own outcome, overview and issue views, and supports
creation within that context. GitHub also carries filtered context into newly
added items. These support our recommendation for contextual task creation and
a persistent project workspace. They do not determine Warden's data model.
[Linear Projects](https://linear.app/docs/projects),
[GitHub filtering](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/filtering-projects).

GitHub distinguishes manual order from sorting; Linear's focused issue view
includes blockers, active work and completed work. Our inference is to separate
planning order from workflow stage, preserve completed work, and aggregate
attention without replacing the project workspace. We do not need their full
configuration systems or a human-assignee model to deliver those benefits.
[GitHub table layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-table-layout),
[Linear My issues](https://linear.app/docs/my-issues).

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
| Entry and structure | Live entry opened an empty Needs You queue; active work was elsewhere. Project context was buried in metadata. | Make projects working destinations. Keep cross-project attention directly reachable and preserve project context. |
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

## Implementation evidence and required changes

The following describes the pinned source, not a ceiling on the design. A
production delivery must implement and version new contracts before relying on
them. Synthetic demonstrations can explore the target behavior but must label
the capability gaps; they perform no network writes.

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

The server currently owns saved-view predicates and order. Active excludes done and epics;
Needs You includes review/verify regardless of whether the gate holds; Blocked
excludes done; Recurring currently selects audit; Epics includes completed epics.
The revised experience requires an explicit query/policy change rather than
quietly redefining these predicates in browser code.

| Required experience | Current basis | Work to specify and deliver |
| --- | --- | --- |
| Persistent project workspace | Epic issues, parent references and a separate project string | Establish identity/mapping, project-scoped queries, accurate counts and unresolved-reference behavior. Preserve legacy data; do not invent a third tier. |
| Contextual task creation | Create accepts parent/project and starts in Todo | Resolve the mapping, inherit the correct project explicitly and remain in its workspace after save. |
| Refine and organize work | No general browser edit/reparent or rank API; creation leaves Done when empty and ticking only changes existing checkbox states | Add authored-content and criteria editing, relationship/dependency updates and persisted planning order with conflict behavior. UI and MCP must share the same authoritative record. |
| Completed-work retrieval | The `issues` query returns all issues, including done. Active excludes done; completed ordinary tasks have no dedicated saved view | Define scoped open/completed/all retrieval and cross-project search, stable links and honest completeness. Show recorded results/dates only when available. |
| Finish a project intentionally | Epics use the issue workflow. SPEC §3.1 derives completeness from children through Lattice's inverted parent index; there is no explicit browser project-completion/disposition operation | Reconcile derived child completeness with an explicit project outcome decision. Define unfinished-task disposition and reopening without silently changing children. |
| Trustworthy attention | Needs You includes all review/verify records | Define explicit reasons from gate/blocker evidence; distinguish a pending decision from ordinary stage membership. |
| Clear responsibility and next actor | No browser assignee or execution-activity contract | Define responsibility, decision actor and provenance separately. Add authoritative fields/operations where required; never infer live activity from ownership or stage. |
| Dependable navigation and recovery | Existing mutations and authored content | Specify URL/Back/focus/scroll behavior, draft lifetime, conflict/refusal handling and index-lag reconciliation. |

## Decisions and boundaries

The recommendation is Project/Task terminology, Projects-first entry and an
explicit project completion decision. Validate those choices through the full
journey, rather than asking the operator to design individual controls. Review
real records to resolve the legacy project/parent mapping before a migration
specification. Order scope, concurrent edits and query completeness also need
precise contracts in that specification. Responsibility semantics and evidence
links belong in the same contract work; a missing current API is not a reason
to remove an established product need.

Keep Warden's mark selection as a separate review within the approved family.
New team permissions, scheduling, agent dispatch, configurable workflow builders,
a third organizational tier and a fabricated activity feed are not part of this
proposal. Lattice lifecycle work remains in its own session. Harmony Homepage
remains the last closeout step.

## Delivery and acceptance

| Slice | Outcome and acceptance |
| --- | --- |
| Reconciled direction | Lead consolidates the recovered September goals, accepted family decisions and Lattice interaction lessons in this brief. Distinguish retained decisions, new recommendations and unresolved contracts. Historical artifacts remain reference material. |
| One revised interaction prototype | A design/implementation worker rebuilds the project/task journey; an engineering worker can map source/data gaps in parallel. Both return to the lead before review. Show the complete journey in one study with two projects, standalone/completed work and a dense fixture. Use approved visuals, label proposed capabilities and keep mark comparison separate. |
| Journey review | Independent product/UX and accessibility reviews assess whether a person can explain the outcome, organize work, identify responsibility and the next action, make a decision, and retrieve completed work. Review desktop, phone, keyboard and recovery together; operator feedback resolves product choices. |
| Execution specification | After journey review, map accepted interactions to components, data contracts, UI/MCP behavior, migration needs, accessible controls and recovery expectations. Name shared-system versus Warden-owned work and bounded vertical delivery slices. |
| Project workspace and task management | Deliver scoped retrieval, contextual creation, editing, relationships and durable order as coherent journeys. Retain completed work, source context and drafts on desktop and phone. |
| Attention, completion and records | Deliver truthful attention reasons, decision consequences, explicit project completion and faithful authored history with refusal/index-lag recovery. |
| Product acceptance and release | Replay the full journey with owned fixtures and actual write contracts. Run focused local/static checks and independent reviews; CI owns broad suites. Verify package and paired product artifacts before consumer rollout. |

The study does not authorize a production card-to-issue migration. Reconcile
Warden #59/#60 and deployed API/frontend/vault versions before that cutover.

### Prototype review evidence

The October 19 revised build passed strict docs typechecking, the seven existing
documentation checks, and Storybook/portable builds. Browser journeys exercised
contextual capture, same-tab draft recovery, editing, order and transfer,
completion/reopening, decision refusal and read-only recovery, Browser Back,
expanded reading and native phone modal focus. Independent source and designer
reviews found and corrected stale next-actor text, inconsistent drag behavior,
completed-view defaults, ambiguous draft reuse and narrow action-label wrapping.

Automated accessibility scans found no violations in the exercised desktop,
phone, dialog and eight theme combinations, with a final check of the corrected
phone surfaces. At 320 CSS pixels with token text sizes doubled (32px body),
labels remained readable and the page had no horizontal overflow. The portable
file rendered without external requests; blocked browser storage produced an
explicit in-memory fallback. Captures and command logs remain outside Git.

These are synthetic Chromium checks, not physical iPhone, software-keyboard or
screen-reader acceptance. Navigation URLs carry context, not locally authored
records to another browser. Same-session close restores useful scroll/focus;
scroll offsets do not persist across reloads. Operator journey review, Warden
identity selection and the production contracts remain open.

## Source anchors

- September originals: `docs/brand-review/product-direction.md` (Warden),
  `customers-and-journeys.md` (WJ-4), `review-pack.md` (D-02 and walkthrough),
  and `prototype/` in the retained local brand-review archive. These are
  historical references; the current decisions are consolidated above.
- [Lattice reading and return contract](https://github.com/pixeloven/lattice/blob/cff7de3d8fd438462f37cb9237d239e1bd5f221f/docs/markdown-reader.md)
- [Lattice delivered-roadmap status](https://github.com/pixeloven/lattice/blob/cff7de3d8fd438462f37cb9237d239e1bd5f221f/docs/roadmap.md)
- [Schema and current fields](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/frontend/schema.graphql)
- [Saved views](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/src/warden/views.py)
- [Product context](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/PRODUCT.md) — usage/version and mutation-count statements need reconciliation with later source.
