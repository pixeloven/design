# Warden: projects people can direct

2026-10-19 · Design proposal, before product implementation. Part of
[design #8](https://github.com/pixeloven/design/issues/8).

## Review status and recommendation

The operator supports the visual direction but found the first study's
project/task management wrong. Its queue-centered work model is superseded by
this brief. The current Storybook and portable demo still show that first model;
their visual/accessibility checks do not establish product acceptance.

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

The next prototype must demonstrate this journey end to end, including adding
and editing work, ordering it, changing its project, completion and retrieval.
Improved cards around the old queue navigation would not satisfy the brief.

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
- Present authored Log and Decisions faithfully. A structured action history
  would require its own event/provenance contract; do not manufacture it from
  current state. Read retries never repeat writes, and confirmed mutation facts
  take precedence over a temporarily older index response.

Exercise empty and completed projects, unparented tasks, long titles, many
projects, dense task lists, unavailable dependencies, missing references and
incomplete reads. Prototype fixtures should include a small three-task project
and a larger project with at least 50 tasks across stages. Test keyboard,
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
| Refine and organize work | No general browser edit/reparent or rank API | Add editing, relationship/dependency updates and persisted planning order with conflict behavior. UI and MCP must share the same authoritative record. |
| Completed-work retrieval | Active excludes done; completed ordinary tasks have no dedicated saved view | Provide scoped open/completed/all retrieval and cross-project search, stable links and honest completeness. Show recorded results/dates only when available. |
| Finish a project intentionally | Epics use the issue workflow; no established child-completion policy | Define project completion, unfinished-task disposition and reopening without silently changing children. |
| Trustworthy attention | Needs You includes all review/verify records | Define explicit reasons from gate/blocker evidence; distinguish a pending decision from ordinary stage membership. |
| Dependable navigation and recovery | Existing mutations and authored content | Specify URL/Back/focus/scroll behavior, draft lifetime, conflict/refusal handling and index-lag reconciliation. |

## Decisions and boundaries

The recommendation is Project/Task terminology, Projects-first entry and an
explicit project completion decision. Validate those choices through the full
journey, rather than asking the operator to design individual controls. Review
real records to resolve the legacy project/parent mapping before a migration
specification. Order scope, concurrent edits and query completeness also need
precise contracts in that specification.

Keep Warden's mark selection as a separate review within the approved family.
New team permissions, scheduling, agent dispatch, configurable workflow builders,
a third organizational tier and a fabricated activity feed are not part of this
proposal. Lattice lifecycle work remains in its own session. Harmony Homepage
remains the last closeout step.

## Delivery and acceptance

| Slice | Outcome and acceptance |
| --- | --- |
| Revised interaction prototype | Replace queue-centered navigation with the complete project/task journey above. Use synthetic fixtures; keep approved visuals and clearly identify proposed capabilities. Independent product/UX review must assess managing work, not just appearance. |
| Execution specification | Map each accepted interaction to components, data contracts, UI/MCP behavior, migration needs, accessible controls and recovery expectations. Identify shared patterns with Lattice without forcing shared product structure. |
| Project workspace and task management | Deliver scoped retrieval, contextual creation, editing, relationships and durable order as coherent journeys. Retain completed work, source context and drafts on desktop and phone. |
| Attention, completion and records | Deliver truthful attention reasons, decision consequences, explicit project completion and faithful authored history with refusal/index-lag recovery. |
| Product acceptance and release | Replay the full journey with owned fixtures and actual write contracts. Run focused local/static checks and independent reviews; CI owns broad suites. Verify package and paired product artifacts before consumer rollout. |

The study does not authorize a production card-to-issue migration. Reconcile
Warden #59/#60 and deployed API/frontend/vault versions before that cutover.

## Source anchors

- [Schema and current fields](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/frontend/schema.graphql)
- [Saved views](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/src/warden/views.py)
- [Product context](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/PRODUCT.md) — usage/version and mutation-count statements need reconciliation with later source.
