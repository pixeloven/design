# Brand review closeout

2026-10-19. The operator approved completing the remaining brand/design work,
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

The operator supports the first Warden study's visual direction but found its
project/task management wrong. Its queue-centered work model is superseded by
the [revised Warden brief](warden-design-brief.md). The current demo has not yet
been rebuilt around that brief; visual polish and accessibility checks do not
constitute acceptance of the product experience.

Next, demonstrate the complete Project → Task journey: define an outcome,
create and organize work in context, direct progress, finish deliberately and
retrieve completed work. Treat missing API support as named implementation
work. Projects are working destinations; cross-project attention supports them.

## Delivery sequence

1. **Refresh Warden's baseline and prepare the design.** Independently assess the
   current interface and source capabilities. Reconcile the September review
   with implemented work. Revise the prototype around the project/task journey
   and review its usefulness independently of visual craft. Review Warden
   identity options separately. Demonstrations use synthetic content;
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
  phone. Failed and refused actions preserve useful state. UI and MCP operate
  on the same work model, with any required contract changes delivered.
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
