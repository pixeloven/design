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
synthetic review surface. Warden identity selection, package adoption and final
documentation/consumer closeout remain; new MVP features are not the next phase.

The recovered September prototype already demonstrated the project-first model.
The brief now reconciles those original goals with Lattice's later visual and
interaction decisions. It is the current Warden direction; the historical demos
and audits remain dated references. The revised prototype is the review artifact;
the accepted model now directs production slices alongside the revised study.

## Remaining closeout

1. **Choose Warden's figure.** The October 25 independent review recommends
   Waymark. Its Solid and Inset geometry survives the family's minimum sizes;
   the [identity study](studies/warden-identity/README.md) records alternatives
   and tradeoffs. Header/tab/icon previews make the decision concrete. The
   operator has not selected a mark; do not publish a candidate as approved.
2. **Finish shared foundation adoption.** The Warden MVP consumes tokens but
   still owns its controls, primitive scales and legacy mark. Map these to the
   existing package contracts in a bounded consumer change after mark selection.
   Preserve the accepted workflow; do not extract new generalized components
   without a demonstrated need in both products. Its owned acceptance remains
   valid for the reviewed source, not a claim of complete package adoption.
3. **Repair and publish the documentation.** Correct stale adoption claims and
   verify rendered stories, including Scales. A successful static build or an
   HTTP 200 does not prove its components rendered. Keep the experimental
   Warden identity and workspace separate from published references.
4. **Refresh Harmony last.** Read-only inspection on October 25 found that
   Homepage already links to `https://design.lab.pixeloven.com`, but the running
   documentation image predates the current foundations. Its Marks page throws
   `React is not defined`. Use a verified new documentation digest in Harmony's
   deployment and verify Introduction, Marks, Themes, Scales and representative
   controls in a browser. Homepage's stylesheet still owns literal palette
   values; its token adoption must not be claimed as complete. Recheck the live
   state after the operator's separate cluster-hardening work before preparing
   any deployment change. No cluster changes were made during this review.

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
