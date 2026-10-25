# PixelOven brand family

The approved visual language combines restrained, modern workspaces with precise
geometric identity and concentrated electric accents. Usability and accessibility
govern the application; brand expression supports the work.

## Established decisions

- PixelOven is the parent. Lattice and Warden are products within that family.
- Cool and Warm are shared themes. Acid and electric Violet are independent
  accent choices. Dark, Light and System appearance remain independent of both.
- Solid is the primary identity form. Inset is the companion form for favicons,
  installed applications and avatars. Approved PixelOven and Lattice geometry
  lives in `@pixeloven/brand`. Warden's angular W, **Waymark**, was selected
  on October 25 and is published in brand 0.3.0.
- Plex Sans carries human task text. Plex Mono distinguishes identifiers, code
  and measured data. Readable roles take priority over compact metadata styling.
- Colour, typography and other primitive scales come from `@pixeloven/tokens`.
  Product distinction comes through figure, task language and composition.
- Status colours retain their meaning. An accent preference must not change
  what an error, warning or successful outcome means.

The production sources and contracts are the [token guide](../packages/tokens/README.md),
[asset guide](../packages/brand/README.md) and [control guide](../packages/ui/README.md).
Historical direction demos preserve the selection process; their palettes are
not another source of production values.

## Product expression

| Product | Primary human job | Expression |
| --- | --- | --- |
| Lattice | Explore, read and understand connected knowledge. | Spatial relationships, legible evidence and recoverable exploration. |
| Warden | Plan and organize projects/tasks, direct progress, make decisions and inspect outcomes. | Clear project hierarchy, readable intent, visible responsibility and consequences, and dependable return. |

Use the established “A PixelOven project” endorsement on appropriate product
identity surfaces, with the product name leading. Keep ordinary task controls
focused on the person's work. This usage follows the accepted Lattice shell;
it is not a new corporate positioning claim or a requirement to repeat the
parent name on every screen.

Lattice's exploration and reading patterns inform Warden's navigation and
evidence reading; Warden retains its own board/list workflow. The
[Warden brief](warden-design-brief.md#reconciliation-september-intent-and-lattices-design-evolution)
reconciles the original project/task goals with the later family decisions.
Cross-product evidence links should preserve provenance and clear destinations;
shared branding does not imply a shared data model or automatic synchronization.

## Language and interaction

Use plain, specific language. Lead with the task, then the evidence and next
action. Explain a refusal or unavailable action in the place where it matters.
Preserve domain terms when changing them would misrepresent the product.

Show the consequence of a consequential action before it happens. Preserve
drafts and useful context through supported interruptions. Distinguish an empty
result from a failed request, and a completed write from a lagging index.
Restoring an interface must not silently repeat a write.

## Shared implementation boundary

The published native controls are Button, Input, Select and Label. Their native
semantics, focus, disabled, invalid and selected states are shared. Font loading,
theme persistence, validation messages and product state remain with consumers.

Lattice and Warden both consume these controls and the published theme roles.
[Warden #81](https://github.com/pixeloven/warden/pull/81) adopts brand 0.3.0,
tokens 0.6.0 and UI 0.1.0 while keeping its System appearance default and local
form compatibility API. Its merged adoption and owned-fixture acceptance do
not establish customer deployment or migration.

Panels, menus, tooltips, navigation, asynchronous feedback and draft handling
are candidates for further reuse. First compare working Lattice and Warden
requirements; publish a component only when its shared behavior is clear.
Document product differences instead of making a general wrapper conceal them.

## Review standard

Review a real task with realistic content on desktop, phone, keyboard and
enlarged text. Include empty, loading, failed and successful states. Test actual
foreground/background pairings and focus, not only source token values.
Treat named assistive-technology and physical-device checks as unverified until
performed. Use owned fixtures for changes; production data is not a test fixture.

Product implementation, package publication, deployment and user acceptance are
separate milestones. Screenshots and command output belong in review attachments,
not a growing evidence directory in source control.
