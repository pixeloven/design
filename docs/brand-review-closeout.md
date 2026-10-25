# Brand review closeout

Updated 2026-10-25. The operator approved completing the remaining brand/design work,
then refreshing the design system reached from Harmony's Homepage.
Harmony is the final closeout phase. Lattice's knowledge-lifecycle discovery
has moved to a separate session.

## Accepted foundation

PixelOven/Lattice Solid and Inset identities, Cool/Warm themes, Acid/electric
Violet accents, readable typography and native shared controls have shipped.
Design PRs [#6](https://github.com/pixeloven/design/pull/6) and
[#7](https://github.com/pixeloven/design/pull/7) provide the package baseline.
Lattice's accepted redesign is complete under
[#383](https://github.com/pixeloven/lattice/issues/383). Its device and
assistive-technology follow-ups remain with Lattice
[#407](https://github.com/pixeloven/lattice/issues/407).

The [brand-family guide](brand-family.md) consolidates the decisions that carry
forward. Neither new identity exploration nor a new palette selection is needed
for PixelOven or Lattice.

## Current review status

The operator supports the visual direction and has now accepted the typed Issue
model: Epic is a project outcome with a finish line; Story, Task, Bug and Spike
describe its work, with standalone issues also valid. Ordinary issue creation
and refinement let investigations mature into clearer requirements and plans.
There is no separate idea intake. The [Warden brief](warden-design-brief.md) owns the
accepted decision and delivery record. Crew implementation and independent
reviews converged on the working MVP and its implementation handoff.

The issue-workflow MVP is implemented. [Warden #80](https://github.com/pixeloven/warden/pull/80)
and [design #10](https://github.com/pixeloven/design/pull/10) merged October 25.
The complete owned-stack journey passed 15 checks across five browser stages,
including real ingestion, refusal/conflict recovery, restart and index rebuild.
The [versioned implementation handoff](https://github.com/pixeloven/warden/blob/4be0b8675fcf6f0ecb1c12f2957a656dbe02fe2e/docs/mvp-handoff.md)
records the original MVP reproduction and customer cutover requirements.
[Warden #81](https://github.com/pixeloven/warden/pull/81) then merged on October 25
at 20:07:45 UTC as `fa4e3369081cc90490e31805547658f0b928925b`, completing Waymark
and shared-foundation adoption. Its [updated handoff](https://github.com/pixeloven/warden/blob/fa4e3369081cc90490e31805547658f0b928925b/docs/mvp-handoff.md)
owns current reproduction and cutover guidance. The local study remains a
synthetic review surface. Documentation publication and Harmony's refresh are
the remaining design-session work; new MVP features are not the next phase.

The recovered September prototype already demonstrated the project-first model.
The brief now reconciles those original goals with Lattice's later visual and
interaction decisions. It is the current Warden direction; the historical demos
and audits remain dated references. The revised prototype preserves the design
review; the accepted model is implemented in Warden's merged product slices.

## Remaining closeout

1. **Publish the reconciled documentation.** Record the completed adoption and
   verify rendered stories, including Scales. A successful static build or an
   HTTP 200 does not prove its components rendered. Keep the experimental
   historical identity alternatives and synthetic workspace separate from
   published references.
2. **Refresh Harmony last.** Read-only inspection on October 25 found that
   Homepage already links to `https://design.lab.pixeloven.com`, but the running
   documentation image predates the current foundations. Its Marks page throws
   `React is not defined`. Use a verified new documentation digest in Harmony's
   deployment and verify Introduction, Marks, Themes, Scales and representative
   controls in a browser. Homepage's stylesheet still owns literal palette
   values; its token adoption must not be claimed as complete. Recheck the live
   state after the operator's separate cluster-hardening work before preparing
   any deployment change. No cluster changes were made during this review.

## Warden foundation adoption — completed October 25

The operator selected **Waymark — the angular W**. Brand 0.3.0 publication was
verified from the registry before Warden pinned it. The
[identity study](studies/warden-identity/README.md) preserves the selection and
unselected alternatives. The bounded consumer pass built on Warden's merged MVP
(`4be0b867`), using Lattice `839794d9` as its package-integration reference.
It preserved the accepted issues, workflows, navigation and draft storage.

| Slice | Delivered in Warden #81 | Verified acceptance |
| --- | --- | --- |
| Published Waymark and packaging | Exact brand 0.3.0, tokens 0.6.0 and UI 0.1.0 pins; registry-driven assets before dev/build; Solid header lockup, Inset icons, stable public URLs and manifest; runtime `public/` copy. | Published package access and asset bytes verified. The production container serves the assets and manifest; GraphQL URL substitution works. |
| Themes and scales | Native Display preferences, bootstrap and resolver; shared primitive scales and reading roles; existing self-hosted fonts bound to shared controls. Layout remains product-owned. | System remains the default with Cool + Acid. All eight combinations, explicit appearance, OS changes, reload and unavailable storage pass. Browser theme-color stays unique and aligned through hydration and navigation. |
| Shared native controls | Local compatibility wrappers consume Button/Input/Select/Label while preserving tone, pending/spinner, native props, refs and Field hints. TextArea remains a native token-styled composition. | Native form/ref/disabled checks pass. Rendered controls retain 44px targets, readable type and focus. Accepted refinement, ordering and outcome behavior remains intact. |
| Converged product gate | Real production frontend/API/MCP on the disposable owned fixture, followed by read-only visual checks. | All 15 journey checks and six CI checks passed. Visual checks covered eight desktop theme combinations, two representative phone combinations and 320px enlarged text, with zero mutations. Package and container checks passed separately. |

The acceptance covers merged source and owned fixtures. No customer deployment,
data migration or cluster rollout occurred. Physical phone keyboards and named
assistive-technology checks remain explicit follow-ups. Raw screenshots and logs
stay outside Git; the versioned Warden handoff records reproduction and limits.

## Delivery sequence

1. **Completed: design reconciliation and selection.** The brief carries the
   September goals and Lattice lessons; the synthetic study records the reviewed
   experience and October 25 Waymark selection.
2. **Completed: Warden implementation and adoption.** The accepted issue model,
   owned MVP journey and published brand/theme/control integration are merged.
   Customer release and migration have their own handoff.
3. **Current: documentation publication.** Reconcile adoption status, preserve
   dated evidence, and verify rendered Storybook references. Further component
   extraction needs demonstrated shared behavior; it is not a closeout gate.
4. **Last: Harmony refresh.** Update the documentation image in Harmony's own
   branch/PR and verify its deployment and rendered stories from the consumer
   network. The existing Homepage URL is already correct.

## Completion criteria

- Warden supports contextual creation, editing, task ordering, project navigation,
  decisions, explicit completion and completed-work retrieval on desktop and
  phone. Responsibility and the actual next action are understandable. Failed
  and refused actions preserve useful state. UI and MCP operate on the same
  work model, with any required contract changes delivered.
- Its selected identity is registered, published and adopted across header,
  favicon and app-icon placements using the established family contracts.
- Shared patterns have an explicit owner and actual Lattice/Warden consumer
  examples. Their migrated surfaces consume published roles and primitive
  scales; Homepage's legacy stylesheet is not represented as migrated.
- Design-system documentation describes published behavior and links to current
  product examples. Remaining device/accessibility checks stay named.
- Harmony Homepage reaches the verified current design system and working
  stories after deployment.

## Boundaries

The initial Warden review describes an older release. Source observations and
dated live observations must be identified separately. Warden PRs #59/#60 were
still open in the cutover inventory; their conflicting proposals and the
card-to-issue migration need reconciliation before rollout. They do not
authorize an unreviewed consumer migration.

Warden's Obsidian plugin, new multi-user permissions, new agent-dispatch service,
and Lattice lifecycle implementation are outside this closeout. Personalization
does not invent status meanings, and synthetic demonstrations do not certify
production write behavior.
