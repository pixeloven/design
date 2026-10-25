# Brand review closeout

Updated 2026-10-25. The operator approved completing the remaining brand/design work,
then updating Harmony's Homepage links to the verified current design system.
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
current decision and phased MVP plan. The lead is authorized to drive through a
working MVP before handoff, with Crew implementation and independent reviews.

The issue-workflow MVP is implemented. [Warden #80](https://github.com/pixeloven/warden/pull/80)
and [design #10](https://github.com/pixeloven/design/pull/10) merged October 25.
The complete owned-stack journey passed 15 checks across five browser stages,
including real ingestion, refusal/conflict recovery, restart and index rebuild.
The [versioned implementation handoff](https://github.com/pixeloven/warden/blob/4be0b8675fcf6f0ecb1c12f2957a656dbe02fe2e/docs/mvp-handoff.md)
owns reproduction and customer cutover requirements. The local study remains a
synthetic review surface. Warden identity publication, package adoption and final
documentation/consumer closeout remain; new MVP features are not the next phase.

The recovered September prototype already demonstrated the project-first model.
The brief now reconciles those original goals with Lattice's later visual and
interaction decisions. It is the current Warden direction; the historical demos
and audits remain dated references. The revised prototype is the review artifact;
the accepted model now directs production slices alongside the revised study.

## Remaining closeout

1. **Publish Warden's selected figure.** The operator selected **Waymark — the
   angular W** on October 25. Solid is primary; Inset serves favicons and app
   icons. Brand 0.3.0 registers the unchanged geometry, outlined name lockups
   and appearance-specific icon exports. The
   [identity study](studies/warden-identity/README.md) retains the decision and
   unselected alternatives. Merge and verify package publication before pinning
   that version in Warden; selection does not establish a deployed asset.
2. **Finish shared foundation adoption.** The Warden MVP consumes tokens but
   still owns its controls, primitive scales and legacy mark. Map these to the
   existing package contracts in a bounded consumer change after publication.
   Preserve the accepted workflow; do not extract new generalized components
   without a demonstrated need in both products. Its owned acceptance remains
   valid for the reviewed source, not a claim of complete package adoption.
3. **Repair and publish the documentation.** Correct stale adoption claims and
   verify rendered stories, including Scales. A successful static build or an
   HTTP 200 does not prove its components rendered. Keep the experimental
   historical identity alternatives and synthetic workspace separate from
   published references.
4. **Refresh Harmony last.** Read-only inspection on October 25 found that
   Homepage already links to `https://design.lab.pixeloven.com`, but the running
   documentation image predates the current foundations. Its Marks page throws
   `React is not defined`. Use a verified new documentation digest in Harmony's
   deployment and verify Introduction, Marks, Themes, Scales and representative
   controls in a browser. Homepage's stylesheet still owns literal palette
   values; its token adoption must not be claimed as complete. Recheck the live
   state after the operator's separate cluster-hardening work before preparing
   any deployment change. No cluster changes were made during this review.

## Warden foundation adoption

The bounded consumer pass starts from Warden's merged MVP (`4be0b867`), after
rechecking current main. Lattice `839794d9` provides a working package-integration
reference. Preserve Warden's accepted issues, workflows, navigation and draft
storage. Its controls are local native implementations, not vendored shared
controls; its primitive scales also still have local definitions.

| Slice | Implementation boundary | Acceptance |
| --- | --- | --- |
| Published Waymark and packaging | Pin brand 0.3.0 and UI 0.1.0 alongside tokens 0.6.0 in Warden's frontend manifest/lockfile. Add registry-driven asset copying before dev/build, declared icon/manifest URLs, and the missing Docker runtime `public/` copy. Replace the local TopBar shield with the registered Solid lockup; use Inset for icons. | Verify the published tarball and consumer registry access before final dependency resolution. Generated public files match package bytes, packaged runtime serves them, and GraphQL URL substitution still works. Preserve any deployed icon aliases discovered during preflight. |
| Themes and scales | Add the existing theme resolver, preference/bootstrap and native Display control; map `globals.css`/`workspace.css` aliases to shared radius, typography, motion, shadow and layer tokens. Keep layout dimensions product-owned. | Preserve Warden's System appearance default, with Cool + Acid as visual defaults. All eight resolved theme/accent/appearance combinations work; explicit appearance overrides and System changes are correct; storage failure and reload retain usable behavior without touching drafts. |
| Shared native controls | Keep `components/ui/controls.tsx` as a compatibility layer over published Button/Input/Select/Label. Preserve tone, pending/spinner, refs, native props, submit behavior and Field hints. Keep TextArea native and token-styled. | Focused wrapper tests prove pending/disabled behavior, native form validation, labelled values and refs. Real controls retain 44px targets and visible focus. Preserve links, dialogs, drag handles and the accepted refinement/order/outcome behavior. |
| Converged product gate | Build the real frontend against the exact published packages, then run the existing owned-stack MVP journey once after the preceding slices converge. Add bounded visual checks to its read-only phase. | Confirm UI/MCP workflow, draft/conflict/restart recovery, registered assets, themes, desktop/phone, enlarged text and keyboard return. Preserve zero-mutation assertions for visual checks. CI owns broad suites; raw screenshots/logs remain outside Git. |

Brand and theme preparation may proceed independently; shared-control adoption
depends on the semantic theme roles. Final frozen-lockfile resolution and asset
acceptance require actual brand 0.3.0 publication. Use Warden's existing BuildKit
secret and CI package-access paths; do not add credentials to source. Its
Next-hosted fonts must also be bound to the shared controls' font-family roles.

Do not copy Lattice's Dark default into Warden or mechanically shrink human task
text to the legacy compact type ramp. Use reading roles for prose and controls,
compact roles for actual metadata, and paired action/selection/focus tokens.
No new general Table/dialog abstraction, workflow API, customer migration or
cluster rollout belongs to this adoption pass. Update the Warden handoff and
this plan to the milestone actually verified.

## Delivery sequence

1. **Reconcile and prove Warden's design.** Carry the October live/source
   assessment and recovered September project goals into the current brief.
   Apply the accepted family and relevant Lattice interaction lessons. Build
   the issue-refinement study while mapping contract gaps in parallel, then converge
   for independent product/UX, accessibility and engineering review. The lead
   advances the accepted plan; operator input is reserved for unresolved material
   product choices. Review Warden identity options separately. Studies use synthetic content;
   unsupported capabilities must be explicit.
2. **Implement the accepted Warden direction.** Turn the selected experience
   into bounded product slices with owned fixtures, actual API contracts,
   state/focus/draft/history behavior, and independent reviews. Adopt published
   shared foundations and the selected registered mark. Coordinate any API/data
   migration separately from visual adoption.
3. **Consolidate the shared system.** Extract behavior proven in both products,
   bring Storybook examples and usage guidance up to date, and preserve the
   useful design rationale. Curate historical local demos rather than committing
   raw evidence, generated HTML, dependency trees or command logs.
4. **Update Harmony Homepage last.** Inspect its actual design-system link and
   the destination's deployed version. Publish/deploy the current documentation
   if required; fix the Homepage entry and validate both the landing page and
   representative stories from the consumer network. A successful HTTP response
   alone does not establish that Storybook renders. Keep this work in Harmony's
   own branch/PR and verify the final deployment.

## Completion criteria

- Warden supports contextual creation, editing, task ordering, project navigation,
  decisions, explicit completion and completed-work retrieval on desktop and
  phone. Responsibility and the actual next action are understandable. Failed
  and refused actions preserve useful state. UI and MCP operate on the same
  work model, with any required contract changes delivered.
- Its selected identity is registered, published and adopted across header,
  favicon and app-icon placements using the established family contracts.
- Shared patterns have an explicit owner and actual consumer examples; no
  product maintains a private palette or duplicate primitive scales.
- Design-system documentation describes published behavior and links to current
  product examples. Remaining device/accessibility checks stay named.
- Harmony Homepage reaches the verified current design system and working
  stories after deployment.

## Boundaries

The initial Warden review describes an older release. Source observations and
dated live observations must be identified separately. Open Warden PRs #59/#60
and the card-to-issue migration need reconciliation before rollout; they do not
authorize an unreviewed consumer migration.

Warden's Obsidian plugin, new multi-user permissions, new agent-dispatch service,
and Lattice lifecycle implementation are outside this closeout. Personalization
does not invent status meanings, and synthetic demonstrations do not certify
production write behavior.
