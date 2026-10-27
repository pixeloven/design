# Warden: develop clear work through issues

2026-10-25 · Accepted product model, delivered MVP and foundation adoption. Part of
[design #8](https://github.com/pixeloven/design/issues/8).

## Product decision and ownership

The operator accepted the issue model below. The working MVP and implementation
handoff merged in [Warden #80](https://github.com/pixeloven/warden/pull/80) (private);
published brand, theme and control adoption followed in
[#81](https://github.com/pixeloven/warden/pull/81) (private). Crew implementation, research
and independent review converged under the lead's acceptance. Customer release
and migration remain separate from these delivered source milestones.

**Capture what is known, investigate what is uncertain, and refine the work as
you learn. Follow it through to an explicitly accepted result.** The human UI
and agent MCP operate on the same Warden issues. Research, design exploration
and implementation spikes are work in that system, not prerequisites for
entering it. Agent skills help refine those records in the existing agent host.

Everything is an **Issue**. Type gives it purpose; status describes progress.

| Type | Purpose |
| --- | --- |
| Epic | A bounded project with a meaningful outcome and observable finish line. |
| Story | A capability or benefit for a user. |
| Task | A concrete piece of work. |
| Bug | A correction of expected versus actual behavior. |
| Spike | A bounded investigation that produces findings, a decision or clearer requirements. It can explore design, implementation or another uncertainty. |

The initial hierarchy is **Epic → Story / Task / Bug / Spike**. Standalone issues are
valid. An Epic is the project-level issue, not a separate Project entity above
it. There is no required Story → Task tier. The existing `project` string is
legacy context: retain it until a reviewed mapping exists, rather than turning
each distinct string into a new Epic or silently dropping it.

Keep the six workflow states: Todo, Plan, Review, Build, Verify and Done.
An uncertain issue is still an issue; it does not need a separate Idea entity or
discovery status. Creating work in Todo does not approve its plan, dispatch an
agent or begin execution. Finishing all
children does not accept the Epic's outcome; accepting an Epic never silently
changes its children.

The design repository's interactive study uses synthetic browser-local records.
It proves an experience, not production persistence or MCP integration. The real
Warden journey passed against an owned test vault; the versioned handoff below
records its evidence and limits. Documentation publication and Harmony's
Storybook refresh follow separately.

One operator works at a desk and makes shorter visits on a phone. Success means
they can answer: What are we trying to achieve? What should happen next? What
needs my input? What actually finished? They should not have to reconstruct the
project by browsing global queues.

The visual authority is the approved [PixelOven family](brand-family.md):
Cool/Warm, Acid/electric Violet, Plex Sans/Mono and Solid/Inset. Lattice is the
production reference for craft and continuity. Warden's composition follows
project context, ordered work and clear decisions. The operator selected Waymark,
the angular W, on October 25: Solid for primary identity and Inset for icons.
Brand 0.3.0 is published and Warden #81 consumes it with tokens 0.6.0 and UI 0.1.0.
Warden preserves System appearance by default, with Cool + Acid.

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
| Approved Lattice/PixelOven identity and theme choices | Use canonical Cool/Warm, Acid/electric Violet, independent appearance, Plex roles and Solid/Inset assets. Give Warden its selected Waymark figure and work-oriented composition. | Published in brand 0.3.0 and adopted with shared themes and controls in Warden #81. |
| Lattice's exploration continuity | Retain project, filters, selected task, useful scroll and focus through detail, search, layout changes and return. Direct links and Browser Back are part of the interaction contract. | Adapt the behavior to project/task navigation. |
| Lattice's focused and expanded reading direction | Let people read substantial intent, plans and results comfortably, with expanded desktop reading and full-screen phone tasks. Keep the originating project recoverable. | Adapt reading patterns; do not copy the graph or require Obsidian-specific syntax. |
| Lattice's mobile corrections | Keep navigation compact and the active task usable. Use a readable list or chosen stage, accessible controls and reachable actions with a phone keyboard. | Carry forward the working-space principle; verify Warden's actual layouts. |
| September's ownership and next-actor goal | Distinguish responsibility for work, the person needed for a decision, and observed execution activity. Preserve the product need for clear responsibility while specifying its data source. | Keep the goal; replace invented owner/activity claims with explicit contracts. |
| Shared truthful-state and accessibility rules | Distinguish no work, partial data, failure and confirmed success. Retain drafts and reasons; recovery never repeats a write. Keyboard, text enlargement, themes and focus are journey requirements. | Required acceptance behavior. |
| Shared component ambitions | Reuse published controls now. Compare navigation, task surfaces, reading, feedback and return behavior before extracting additional shared components. | Share proven behavior; keep board and graph domain logic with their products. |

The Lattice comparison used source
[`cff7de3`](https://github.com/pixeloven/lattice/tree/cff7de3d8fd438462f37cb9237d239e1bd5f221f) (private).
Its roadmap records the approved application shipped in v0.21.1; later reader
refinements provide implemented interaction evidence. This comparison does not
claim a new deployment or physical-device/assistive-technology acceptance pass.

Lattice helps people explore and understand knowledge. Warden helps them turn
intent into organized work and inspect its outcome. A Warden task should be able
to reference relevant knowledge or evidence with a useful label and predictable
return. Begin by specifying ordinary source links and provenance. Automatic note
creation and bidirectional knowledge synchronization are separate product
decisions. Warden already uses Lattice as its storage substrate; that does not
move Warden's workflow rules into an agent skill. Lattice lifecycle work
continues in its own session.

## Accepted experience

### Create an issue; refine it through work

The primary entry is **New issue**, with Epic, Story, Task, Bug and Spike in one
type selector. A title is enough to capture any type. The same composer shows
the relevant optional fields: outcome, finish line and scope for an Epic;
requirements and optional Epic membership for other work. Context remains
shared, while requirements, scope and Plan can develop as more becomes known.
A known Bug or Task can go straight to
refinement. An uncertain question can be captured as a Spike. Neither route
requires an intake interview, an Epic, a complete plan or a batch of children.

A Spike uses the same issue detail, comments, Plan, Result and workflow as other
work. Its intent describes the question; its Plan describes the investigation;
its completion conditions describe what would resolve enough uncertainty to
decide what comes next. Findings, source evidence, alternatives and remaining
unknowns belong in its Result and comments. This can conclude that no delivery
work is warranted. Do not imply that every completed investigation ships code.
Capture may be rough; a useful investigation should have a bounded question
before someone undertakes it. That is refinement guidance, not another form gate.
In the existing workflow, Build means carrying out that investigation and Verify
means assessing its findings. The issue type does not require new stage names.

Learning can improve an existing issue's requirements, yield a follow-up Story,
Task, Bug or Spike, or make a larger outcome clear enough to organize in an Epic.
Keep the investigation and its findings available after follow-up work is
created. A source link records where work came from; it is not a dependency and
does not imply that the source approved the follow-up. Do not require converting
the Spike into delivery work and losing its original purpose. Follow-ups may
remain standalone or join the same Epic. Ordering, source links, dependencies
and Epic membership have distinct meanings.

Use ordinary body links for the source investigation and related work, consistent
with Warden's existing specification. `parent` owns Epic membership and
`depends_on` owns blocking. A dedicated provenance relationship API is not
required to demonstrate this journey.

An Epic can be created directly whenever a bounded outcome is useful, including
before investigation starts. Its title is enough at capture; outcome, scope,
finish line and child work mature alongside the issues. An observable finish
line is required for explicit outcome acceptance, not for saving an early Epic.
There is no compulsory issue → Spike → Epic sequence.

**New Epic** is a contextual shortcut into that same composer with Epic selected.
Changing the type of an unsaved issue keeps its title, context and type-specific
draft text through switching back, closing and reloading. Epic creation never
inherits another Epic as its parent. Existing drafts require explicit resume
or discard rather than being overwritten by a shortcut. Editing a saved Epic
can use an outcome-specific editor; changing the type of an existing record
across the Epic boundary is a separate operation outside this creation change.
If a type change leaves authored fields outside the selected type's form,
creation discloses that their text will be retained in Activity. Such retained
text does not establish a parent or dependency relationship.

For example: capture **Explore focused note reading** as a Spike; compare reader
layouts and record why one works better; refine **Give the focused reader room
to breathe** with the findings; create a linked Bug for the lost reading position.
Group the work under **Improve note reading** when that outcome is clear. Finish
the investigation on its own terms, then direct and verify the delivery issues.
The reverse starting point is equally valid: capture a Task to preserve reading
position, discover uncertainty while refining it, and create a separate Spike
only if comparing implementation approaches deserves its own tracked work.

Agent assistance uses the existing conversation and Warden's refinement skills,
reusing supplied context and asking only questions that affect the work. Crew
can coordinate research and Lattice can supply relevant knowledge. The skill
reads the complete issue, writes findings and revised requirements through
Warden, and creates related work only when useful and authorized. Existing
authorization persists. No embedded chat, separate idea store or new dispatch
service is needed. Each write reports the actual saved record; retries reconcile
uncertain outcomes rather than creating duplicates.

The local study demonstrates these interactions with authored synthetic records
and same-tab draft recovery. It makes no AI-generation or agent-dispatch claim.

### Clear surface ownership

| Surface | Responsibility |
| --- | --- |
| Warden refinement skills | Help investigate, record findings and refine issues through the installed Warden tools; preserve evidence and report missing capabilities. Evolve the existing task-refine pattern before adding a separate skill. |
| Warden service, MCP and browser API | Own issue identity, validated authoring, relationships, workflow decisions and refusal/conflict outcomes. UI and MCP share the service rules. |
| Warden UI | Inspect and revise the same work; make the outcome, evidence and next action legible; preserve context and drafts. |
| Lattice | Supply linked knowledge and Warden's existing persistence substrate. New workflow authoring goes through Warden's contract. |
| Crew | Coordinate research, refinement, implementation and review. Stage and owner labels are not execution telemetry. |

### Three places, each with a distinct job

| Destination | What the person does there |
| --- | --- |
| **Epics** | Find active or completed outcomes. Open an Epic to see its brief, finish line, ordered child issues and next action. |
| **All issues** | Capture standalone work, search by identity/type and find open or completed issues, including Epics. Every child retains its Epic context. |
| **Needs attention** | Resolve an actual decision or problem across projects. Each entry explains why it is here and what action is needed; it links back to its project. |

Use Epics as the initial destination and restore the last
workspace on a return visit. Needs attention remains one action away with a
truthful count. Blocked, recurring and completed are useful filters, not peer
organizational entities competing with projects. Recurring work keeps its
existing meaning until its contract is explicitly changed.

Within a project, its outcome and compact progress summary stay above the work.
Open, Completed and All filters make scope explicit. Board and List show the
same child issues and planning order. List is the default; Board remains an
optional way to direct stages. Preserve the six issue stages initially, with
readable cards rather than shrinking everything to fit. Counts describe tasks,
not an invented percentage of the outcome achieved. Loading or partial data
must not masquerade as a complete project summary.

A project also needs to help direct its work. Its completion, decision and
blocker counts open the corresponding scoped tasks. All work, Decisions and
Blocked filters remain within the project; Decisions requires an actual gate.
One compact **Next in your plan** row exposes the first unfinished task in
authored planning order, its recorded next action and any blockers. It does not
infer live agent activity or invent a priority score. List exposes that planning
order and a direct way to organize tasks. Contextual New issue belongs beside the
Epic title; outcome editing and completion stay with the Epic brief. Phone keeps
the outcome and finish line accessible without opening administrative controls.

### One complete journey is the design test

Use a synthetic Epic, **Improve note reading**, with issues for the focused
reader, internal-note navigation and phone validation. This is demonstration
content, not a claim about unfinished Lattice delivery.

1. **Capture work.** Create a standalone Spike to explore focused reading, with
   only a title if that is all that is known. Close/reopen an unfinished draft.
   Add the question, investigation Plan and completion conditions as they become
   useful. Creation puts the record in Todo; execution has not started.
2. **Learn and refine.** Record findings in the Spike's Result and comments.
   Refine an existing delivery issue or create a linked follow-up. Keep the
   source investigation accessible. Create an Epic when a shared outcome is
   useful and associate the work; outcome and finish line can be refined later.
3. **Organize what happens next.** Edit tasks, put phone validation after the
   reader, and link the real dependency. Provenance, planning order and workflow stage are
   separate. Moving a task between projects is explicit and preserves its record.
4. **Direct progress.** Open the reader task, inspect its plan, and make a
   decision with the consequence visible. Return to the same project, filter,
   scroll position and useful focus. A refused or failed action retains input.
5. **Check an interruption on a phone.** Enter from Needs attention, read the
   result in a full-screen task, act, then return to that queue or its project.
   The human can distinguish an awaiting decision from a dependency blocker.
6. **Finish and find it again.** Record the result and evidence. Completing an issue reduces active clutter while
   keeping it in Completed and search. Project completion is a separate, explicit
   outcome decision; show unfinished work and require a deliberate disposition
   before confirming. Never cascade completion or reopening to child tasks.

The study's fixture families include Improve note reading, Release preparation,
a 50-issue Library maintenance Epic, a completed Reading foundation Epic and
standalone work. They exercise the interaction; the real UI/MCP journey passed
the owned-fixture acceptance recorded below in Warden #80 and again in #81.

For this study, completing a project requires its unfinished tasks to be finished
or transferred first. The action never changes child stages. Reopening a child
in a completed project requires explicitly reopening that project. This central
service policy is implemented in [Warden #79](https://github.com/pixeloven/warden/pull/79) (private);
customer deployment remains separate.
Acceptance requires a recorded outcome note against the finish line. The
service applies that rule to every path that can close an Epic, including direct
moves and approvals, and preserves acceptance history on reopen.

### Interaction, trust and accessibility

- Contextual child creation inherits the Epic; changing that membership is
  visible. Selecting Epic creates a top-level outcome, not a nested Epic.
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
- During a drag, keep the source identifiable and highlight only the active
  destination. Show the insertion position and describe the proposed stage/order
  change before drop. Cover empty columns, the end of a sequence and off-screen
  stages. Cancel and rejected drops leave records unchanged. If a successful
  move leaves the current filter, explain that and provide Show task. Validation
  must exercise the actual pointer path and inspect feedback before release;
  checking only a final state change is insufficient.
- Stage, blocker and need for human input are separate facts. Build does not
  mean an agent is running. Display execution activity only from explicit
  evidence; otherwise show the last recorded update. Review/Verify alone must
  not be described as a required human gate when policy says otherwise.
- Needs attention must name the requested action before opening a task: review
  a plan, verify a result, inspect a dependency or locate an unavailable record.
  The task repeats that ask near its title, explains the consequences and keeps
  its relevant actions together. Review leads with Plan; Verify leads with Result
  and Done when. General editing, completion, stage changes, order and transfer
  belong to one task action area, rather than disconnected sections below the
  reading. In the proposed UI, Request changes expresses the existing Send back
  operation; direct Move remains distinct from approval.
- Responsibility and required next actor must be understandable. Define whether
  an owner represents a human, agent or another accountable role, and how that
  fact is authored and updated. Missing responsibility stays explicit. An owner
  label is not evidence of a running agent or a dispatch operation.
- Present authored Log and Decisions faithfully in one visible **Activity**
  area, with **Comments** selected by default, Add a comment and Post comment.
  Comments includes decision explanations; **Decisions** narrows the same feed
  to decision notes. Keep the composer available in either filter; successful
  posting returns to Comments and feedback stays beside the composer. Switching
  filters preserves drafts. Preserve the distinction of a decision note without
  making the person navigate separate disclosures. Show
  authors, dates and ordering only where recorded; legacy text remains intact.
  A decision comment stays beside its action and retains its draft on refusal.
  A structured comment/event history would require its own provenance contract;
  add History, Transitions and an All activity view when such events are
  recorded, with event identity, actor, timestamp, action and consequence.
  Do not manufacture them from current state or duplicate Comments with an
  empty All view. Read retries never repeat writes,
  and confirmed mutation facts take precedence over a temporarily older index
  response.

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

## Historical live/source baseline — October 19–22

The fresh live assessment inspected desktop 1440×1000 and phone 390×844 on
October 19. It was read-only; no creation, movement or decisions were submitted.
The deployed source revision was not established by the visual review. The
separate capability review used current main
[`1bdb4b0`](https://github.com/pixeloven/warden/tree/1bdb4b0280d887134a5a0f0be3e028fd8368c085) (private).
That main revision's issue contract and the live UI's card vocabulary required
release reconciliation. These findings describe the dated baseline; the delivery
record below describes the later merged implementation. Neither audit is a
current defect count or evidence of customer cutover.

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

Review/verify data, actual write outcomes and alternate-theme contrast were not
verified in the live pass; the later owned acceptance covered these behaviors
and themes. Physical phone keyboards and named screen readers remain unverified
follow-ups in the handoff. Private live captures remain outside this repository.

## Historical implementation baseline and recorded gaps

The following describes pinned source `1bdb4b0` and the gaps recorded before the
MVP implementation. The delivery table below records their merged resolution;
these are not claims about current main. Synthetic demonstrations remain
separate from the product contracts and perform no network writes.

Current states are `todo`, `plan`, `review`, `build`, `verify`, `done`. Humans may
move directly to any known state. Approve and Send back are distinct policy
operations; Send back increments reviews. Unticked completion conditions do not
prevent a human approval under the current policy.

The six browser mutations are create, approve, send back, move, append to Log,
and tick Done when. Create accepts title, configured issue type, intent, project,
parent and dependencies. It creates `todo`; project is a string and parent is
an issue reference. There is no assignee, dispatch, project entity, general
issue-edit or structured history-event API. Story is not in the default type
vocabulary; Spike is already configured. At the pinned main revision, the MCP's
`task_show` omits title, body and parent context and `task_create` drops node
identity. [Warden #66](https://github.com/pixeloven/warden/pull/66) (private) implements
those additive reads; they are not yet established as deployed capabilities.
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

The October 22 source review also established three consequential limits:

- Existing body CAS protects the service's read/write interval, not a draft
  opened earlier by a person or agent. Refinement needs a revision-bearing read
  and caller-supplied expected revision. Result currently involves separate body
  and frontmatter writes; a combined editor must define atomicity or report
  partial outcomes precisely.
- `parent` currently accepts an unvalidated reference. New writes must validate
  a real Epic parent and the two-level hierarchy. Existing anomalies stay visible
  and repairable; they are not dropped from queries.
- Human direct moves bypass policy checks, including Epic closure. An outcome
  acceptance button alone is insufficient. Every close/reopen path must obey
  the central rule, with defined behavior if children change concurrently.

Gates retain their existing advisory human/agent handshake (ADR-0024). The MVP
supplies and uses a complete Warden workflow path; it does not narrow agents'
general Lattice permissions or claim that a gate is a security boundary.

## Decisions and boundaries

The accepted model is typed Issues with Epic as the outcome. The primary entry
is ordinary issue creation and progressive refinement, including design and
implementation spikes. No idea intake or proposal publication step is required.
Validate it through a complete journey without asking the operator to design
individual controls. Preserve legacy types and project labels. Add Story to the
API, MCP and fixture vocabulary consistently, initially with Task's review and
verify gates; deployment-specific type files must be reconciled explicitly.
Spike already exists in Warden's default policy. Preserve its current policy
while presenting an investigation's findings and decision as its result.

Define responsibility as authored accountability, not execution activity. Its
minimal persisted contract, ordering scope, concurrent edits, query completeness
and evidence links belong in the Warden implementation specification. A missing
current API is delivery work, not permission to display an invented fact.

Warden's separate identity review selected Waymark on October 25. Its unchanged
Solid/Inset geometry is published in brand 0.3.0 and adopted in Warden #81.
New team permissions, scheduling, agent dispatch, configurable workflow builders,
a third organizational tier and a fabricated activity feed are not part of this
proposal. Lattice lifecycle work remains in its own session. Harmony Homepage
remains the last closeout step.

## Delivery and acceptance

These bounded slices are delivered. Design records stay in this repository;
production service, skill, UI and fixture changes belong in Warden. The versioned
handoff owns reproduction, recovery and the separate customer cutover.

| Slice | Acceptance and dependency | State |
| --- | --- | --- |
| 1. Issue creation and refinement experience | Ordinary title-only capture, Spike investigations, useful Plan/Result authoring and linked follow-ups. Epic organization and explicit outcome acceptance when relevant; recovery preserves older drafts. Default List; preserve optional Board and working drag behavior. Independent product/source reviews converge with a desktop/phone interaction pass. | Study merged in [design #9](https://github.com/pixeloven/design/pull/9); production experience implemented across the Warden slices below. |
| 2. Complete Warden reads | Additive MCP responses expose the full issue and stable identity already available to the service. Missing, malformed and unavailable records remain distinct. Focused cross-surface tests; no unrelated policy or migration change. Can run in parallel with slice 1. | Merged [Warden #66](https://github.com/pixeloven/warden/pull/66) (private). |
| 3. Authoritative issue refinement | Shared revision-aware content authoring, Story policy, existing Spike support, validated Epic parents and persisted Epic content. Retain source evidence as ordinary body links. Evolve refinement skills to investigate, record findings, revise requirements and create useful follow-ups through actual Warden tools. Browser edits the same issue; MCP reads it back. Begins after read contract and reviewed interaction converge. | Merged [#68](https://github.com/pixeloven/warden/pull/68) (private), [#69](https://github.com/pixeloven/warden/pull/69) (private) and [#70](https://github.com/pixeloven/warden/pull/70) (private). |
| 4. Durable workspace and direction | Epic/child/standalone queries, open/completed/all scope, truthful counts, ordered work, explicit transfer and responsibility. Real comments, decisions, result editing and recovery; no fabricated activity. Port the accepted UI against these contracts. | Merged [#71](https://github.com/pixeloven/warden/pull/71) (private), [#72](https://github.com/pixeloven/warden/pull/72) (private), [#73](https://github.com/pixeloven/warden/pull/73) (private), [#75](https://github.com/pixeloven/warden/pull/75) (private), [#76](https://github.com/pixeloven/warden/pull/76) (private), [#77](https://github.com/pixeloven/warden/pull/77) (private) and [#78](https://github.com/pixeloven/warden/pull/78) (private). |
| 5. Accepted outcome | Central explicit Epic acceptance/reopen rules cover all transition paths and concurrent child changes. Children remain unchanged; remaining work has an explicit disposition. Completed outcomes stay searchable. | Merged [#79](https://github.com/pixeloven/warden/pull/79) (private), with compatible source guards in [Lattice #444](https://github.com/pixeloven/lattice/pull/444) (private). |
| 6. Working MVP and handoff | Real production frontend, API and MCP exercise the journey on an owned Lattice fixture. Fresh browser and process restart retain work; conflicts/refusals/index delay recover without false success or duplicate writes. Independent engineering/design reviews pass, artifacts are versioned, and remaining limitations are named. | Owned acceptance passed; runnable harness, one navigation correction and handoff in [Warden #80](https://github.com/pixeloven/warden/pull/80) (private), merged October 25. Ready for implementation handoff; customer cutover remains separate. |
| 7. Published design foundations | Consume the selected registered mark, shared themes, scales and native controls while preserving the accepted workflows and System default. Verify real package/container assets and rerun the owned workflow with read-only visual acceptance. | Merged [Warden #81](https://github.com/pixeloven/warden/pull/81) (private) on October 25 as `fa4e336`. Exact brand 0.3.0, tokens 0.6.0 and UI 0.1.0 pins; all 15 owned checks and six CI checks passed. |

### October 25: shared-foundation adoption

[Warden #81](https://github.com/pixeloven/warden/pull/81) (private) merged at 20:07:45 UTC
as `fa4e3369081cc90490e31805547658f0b928925b`. Published-package and container
checks verified Waymark Solid header lockups, Inset favicon/app/maskable assets,
stable URLs and GraphQL URL substitution. Native controls preserve Warden's
public wrapper props, form behavior, refs, pending and disabled states. Shared
primitive scales and reading roles replace the migrated local definitions.

The real owned journey passed all 15 checks with the existing workflow intact.
Its visual gate covered all eight theme combinations on desktop, two
representative combinations at phone viewports, and 320px enlarged text.
Focus/return, saved preferences and System changes passed with zero mutations.
System remains the default appearance with Cool + Acid. All six
CI checks passed. No customer deployment or migration occurred; physical phone
keyboards and named assistive technology remain follow-ups.

The [updated implementation handoff](https://github.com/pixeloven/warden/blob/fa4e3369081cc90490e31805547658f0b928925b/docs/mvp-handoff.md) (private)
records reproduction and customer cutover limits. The remaining design-session
work is documentation publication, then Harmony's Homepage/Storybook refresh.
Homepage already links to `https://design.lab.pixeloven.com`. Lattice lifecycle
work remains in its separate session.

### October 24: owned MVP acceptance and implementation handoff

The full production frontend/API/MCP journey passed against Warden's disposable
owned vault with real Lattice ingestion and SurrealDB. Fifteen checks across
five browser stages covered title-only standalone Spike capture, retained drafts,
UI findings read back through MCP, existing requirement refinement, linked
follow-up work, explicit Epic membership/order/responsibility, an investigation
that ends without follow-up, human gates and outcome acceptance/reopening.
Actual stale indexing, stale-revision refusal and a lost successful response
were exercised without fabricated success or duplicate writes. All application
processes restarted, the index was reconstructed from the same source, and fresh
desktop/phone browsers and MCP retained the work.

The run found a real late-read navigation defect: arriving issue detail remounted
the reading surface and closed its refinement editor. Warden #80 gives that
editor a stable owner and adds retained/active-draft regressions. The complete
rerun passed with zero page/hydration or GraphQL errors. Independent engineering
reviews and a bounded Impeccable visual confirmation passed. Raw evidence remains
outside Git; the runnable harness and
[handoff](https://github.com/pixeloven/warden/blob/dc117aecf8fd8b158085c2fa032062d69d822556/docs/mvp-handoff.md) (private)
belong to Warden. The tested host is Lattice `4003e4c`; Warden's source baseline
is merged #79 (`515cfba`) plus #80's navigation fix and harness. Source versions
are separate from release tags.

Warden #80 and design #10 merged October 25. Implementation ownership can now
transfer using the versioned handoff. This is not customer
cutover acceptance: read-only inspection still found the deployed card contract,
an older Lattice without source guards, and an authoring policy that lacks the
issue kind. Old Warden #59/#60 remain conflicting proposals requiring deliberate
reconciliation; the handoff records the bounded index inventory and individual
owned-fixture migration previews. Do not synthesize Epics from legacy labels or
apply aggregate phase-2 migration as UI adoption. Physical phone keyboards,
named assistive technology and production identity/deployment checks remain
explicit follow-ups.

The October 25 foundation adoption above completes the later design integration.
Warden release, source inventory and customer migration still proceed through
the separate implementation/cutover plan.

The MVP handoff includes runnable setup, exact revisions, paired API/MCP type
configuration, migration inventory/preview, the accepted journey, focused test
commands, recovery instructions and remaining work. It does not require a live
customer vault. Use a disposable copy of Warden's owned fixture with a tested
Lattice version; do not inherit the compose file's old version without checking
compatibility. Prove an MCP-created standalone Spike edited in the real UI,
findings read back through MCP, a linked follow-up and refinement of existing
requirements, then Epic organization and explicit outcome acceptance. Include
title-only capture, a Spike that concludes without follow-up work and persistence
after restart. Network/tool
traces must show product workflow writes using Warden. Keep raw evidence outside
Git and report results in the review.

Focused local tests protect the changed contract and critical journey. CI owns
the broad suite and coverage gate. Browser acceptance includes keyboard, phone
layout, enlarged text, themes, drafts, conflicts and real pointer feedback where
dragging is included. Physical-device and assistive-technology checks remain
explicitly named when not performed.

This work does not authorize a production card-to-issue migration. As checked
October 22, Warden #59 is open/draft/conflicted and #60 is open. Reconcile both
and deployed API/frontend/vault versions before cutover. Inventory existing
parent/project relationships read-only; do not synthesize Epics from strings,
merge by title or run the aggregate phase-2 migration as part of UI adoption.

### October 23 validation: one issue composer

New issue now offers Epic alongside Story, Task, Bug and Spike. New Epic
preselects Epic in that same component; existing Epic editing stays separate.
All twenty-five docs/model tests and strict typechecking pass, and the portable
preview builds. Independent source review passed after confirming that child
navigation clears a prior creation return target.

Chromium at 1440px and 390px verifies all five choices, work/Epic type switching,
shared context, retained type-specific fields, parent restoration when switching
back to work, close/reload and top-level Epic creation. Additional browser checks
cover the shortcut, title-only Epic capture, Epic follow-up provenance, both old
draft channels together, explicit resume instead of overwrite, and 320px doubled
text without page overflow. Global creation remains usable in a completed Epic
and defaults to standalone work. Back returns to the actual source or Epic,
including when reopening a child after creation and reload. Automated
accessibility scans found no violations in the exercised Epic composer states.
The Impeccable source scan reported no findings; no suppressions were added.
These remain synthetic browser checks, not production or physical-device proof.

### October 22 validation: issue refinement

The current study replaces the intake wizard with title-only Issue/Epic capture,
adds Spike investigations and source-linked follow-ups, and keeps earlier drafts
recoverable. Thirteen model regressions cover creation, separate draft channels,
v2/v3 migration and old bookmarks, refinement, ordering and explicit Epic
acceptance. All twenty docs/model tests and strict typechecking pass; the
portable preview builds successfully.

Chromium journeys at 1440px and 390px verify Spike capture, draft close/reload,
Plan/Result editing, comments, linked Bug creation, and return to the source.
Completing the Spike leaves the delivery Bug open and preserves the findings.
The source link adds no dependency. A separate desktop check verifies ordinary
capture from an open issue returns to that issue, including after reload.
Legacy idea text and an unrelated issue draft survive together; direct Epic
creation needs no finish line at capture. The 320px doubled-text check has no
page overflow. Automated accessibility scans report no violations in the
exercised desktop/phone follow-up states. Three actual pointer/keyboard checks
pass for before-placement, empty-stage movement and keyboard placement.

Independent product and source reviews passed after correcting the Back label
for creation from an open issue. The Impeccable scan reported no findings and
no suppressions were added. These are synthetic study checks; they do not
establish real API/MCP integration, physical-device or screen-reader acceptance.

### Earlier October 22 validation: superseded intake flow

The following results describe the earlier idea/proposal build. The operator
subsequently clarified that ordinary issues and spikes should drive refinement.
The intake flow is superseded; these results do not validate its replacement.

The revised study uses one typed Issue collection and preserves existing v2
records, drafts, comments, decisions and navigation during migration. Nine domain
regressions cover migration, proposal validation/creation, type-aware editing,
scoping/order and explicit outcome acceptance/reopening. All sixteen docs and
domain tests pass, alongside strict typechecking and Storybook/portable builds.

Chromium checks at 1440px and 390px exercise editable proposal rows, draft
close/reload, typed Epic/child creation, Plan/Result editing and completed child
retrieval without automatically completing the Epic. A further phone journey
checks open-child refusal, recorded outcome acceptance, reload and explicit
reopening without changing child states, plus the standalone-idea shortcut.
At 320 CSS pixels with text tokens doubled, the page has no horizontal overflow.
Automated accessibility
checks found no violations in the exercised proposal and workspace states.
Five actual pointer/keyboard/touch scenarios confirm placement feedback,
empty-stage movement, persistence, touch cancellation and ordinary card scrolling.
Independent product/engineering reviews passed for this slice. The Impeccable
source detector reported no findings; no suppressions were added. These are
local study results, not real API/MCP integration or physical-device acceptance.

### Historical prototype review evidence (October 19–21)

The October 19 revised build passed strict docs typechecking, the seven existing
documentation checks, and Storybook/portable builds. Browser journeys exercised
contextual capture, same-tab draft recovery, editing, order and transfer,
completion/reopening, decision refusal and read-only recovery, Browser Back,
expanded reading and native phone modal focus. Independent source and designer
reviews found and corrected stale next-actor text, move/order state handling,
completed-view defaults, ambiguous draft reuse and narrow action-label wrapping.

Subsequent operator review exposed a gap in that first validation: checking a
move's final state did not prove usable drag interaction. Actual pointer input
reproduced a source-card layout shift that canceled native dragging. The revised
handle-based interaction keeps the source stable and shows the destination and
before/after/end placement before release. Independent Chromium mouse/touch
checks cover placement, empty stages, both scroll axes, cancellation, invalid
project targets, keyboard placement and recovery when a move leaves a filter.
The review also replaced scattered task controls with a specific ask/action
area and visible Comments, and condensed the project header after inspecting
the phone layout. Fresh phone navigation starts with List; an explicitly chosen
Board layout survives navigation and reload.

Automated accessibility scans found no violations in the exercised desktop,
phone, dialog and eight theme combinations, with a final check of the corrected
phone surfaces. Comment and decision drafts remain separate through closing,
reloads, posting and refusal/re-read. Required gates, optional inspection and
missing dependencies have distinct requests. At 320 CSS pixels with token text sizes doubled (32px body),
labels remained readable and the page had no horizontal overflow. The portable
file rendered without external requests; blocked browser storage produced an
explicit in-memory fallback. Captures and command logs remain outside Git.
The final Impeccable source scan reported no findings and required no ignores.

These are synthetic Chromium checks, not physical iPhone, software-keyboard or
screen-reader acceptance. Navigation URLs carry context, not locally authored
records to another browser. Same-session close restores useful scroll/focus;
scroll offsets do not persist across reloads. At that review, operator journey
acceptance, Warden identity selection and the production contracts remained
open. The October 22 product decisions authorized implementation with independent
reviews; the later delivery entries above record identity selection, publication,
consumer adoption and owned production-stack acceptance. Customer deployment
remains separate from those milestones.

## Source anchors

- September originals: `docs/brand-review/product-direction.md` (Warden),
  `customers-and-journeys.md` (WJ-4), `review-pack.md` (D-02 and walkthrough),
  and `prototype/` in the retained local brand-review archive. These are
  historical references; the current decisions are consolidated above.
- [Lattice reading and return contract](https://github.com/pixeloven/lattice/blob/cff7de3d8fd438462f37cb9237d239e1bd5f221f/docs/markdown-reader.md) (private)
- [Lattice delivered-roadmap status](https://github.com/pixeloven/lattice/blob/cff7de3d8fd438462f37cb9237d239e1bd5f221f/docs/roadmap.md) (private)
- [Merged foundation and cutover handoff](https://github.com/pixeloven/warden/blob/fa4e3369081cc90490e31805547658f0b928925b/docs/mvp-handoff.md) (private)
- [October baseline schema and fields](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/frontend/schema.graphql) (private)
- [Existing Spike policy](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/src/warden/policy.py) (private)
- [Issue content and relationship semantics](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/SPEC.md) (private)
- [Existing refinement skill](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/skills/task-refine/SKILL.md) (private)
- [Saved views](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/src/warden/views.py) (private)
- [Product context](https://github.com/pixeloven/warden/blob/1bdb4b0280d887134a5a0f0be3e028fd8368c085/PRODUCT.md) (private) — usage/version and mutation-count statements need reconciliation with later source.
