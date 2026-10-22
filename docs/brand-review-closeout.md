# Brand review closeout

Updated 2026-10-22. The operator approved completing the remaining brand/design work,
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

The next delivery is issue capture → investigation/refinement → verified work,
with Epic organization and explicit outcome acceptance when relevant.
The editable local study establishes the experience; Warden service, MCP, skill
and UI changes establish the product. A handoff requires shared authoritative
records and the full journey on an owned test vault, including restart, conflict
and refusal recovery. Browser-local state and visual polish cannot satisfy it.

The recovered September prototype already demonstrated the project-first model.
The brief now reconciles those original goals with Lattice's later visual and
interaction decisions. It is the current Warden direction; the historical demos
and audits remain dated references. The revised prototype is the review artifact;
the accepted model now directs production slices alongside the revised study.

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
