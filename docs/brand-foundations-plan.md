# Approved brand foundations

2026-09-29 · Brand/token foundations published; shared controls and Lattice adoption in progress.

PixelOven is the parent; Lattice is a product. The operator approved Solid as
the primary figure, Inset for icons, Cool/Warm themes, and Acid/electric Violet
accents. Preserve the four selected SVG geometries and use one component family.

## Delivery sequence

1. **Parallel package preparation.** Brand worker prepares additive Solid/Inset
   masters, explicit ink variants, outlined wordmark lockups and icon exports.
   Token worker prepares opt-in Cool/Warm × Acid/Violet × light/dark roles, typed
   access and CSS. Each uses an isolated worktree from current main.
2. **Integration and specimens.** Lead integrates both packages and documents
   shared controls with Lattice exploration and Warden task examples. Show all
   eight combinations, appearance resolution and safe preference handling.
3. **Review and PR.** Check package contents, compatibility, contrast and actual
   browser behavior; independently review the integrated result. Open a PR with
   the implementation, durable docs and meaningful regression tests. Screenshots
   and command output stay outside Git.
4. **After merge.** Existing release automation publishes file-owned package
   versions. Verify publication before consumer PRs adopt explicit pins and the
   chosen variants. Deployment is a later consumer step.

## Acceptance

- Legacy token exports, default values and registered mark paths retain behavior.
- New theme and accent choices are typed and independent of appearance.
- Body/control text and accent text meet 4.5:1 on their used grounds; essential
  boundaries and focus indicators meet 3:1. Action hover/pressed and selection
  states have explicit, verified role pairs in all eight combinations.
- Status and graph origin meanings stay separate from accent choices.
- Exactly one parent registry entry; product variants live under their identity.
  Every shipped asset is registered, self-contained, and uses canonical colors.
- Solid/Inset geometry is preserved. Inspect 16/24/32px and light/dark grounds;
  publish clear-space, minimum-size, crop and icon-format guidance.
- Generated asset builds are reproducible; published manifests resolve to files
  included in the package. Lockups do not depend on a viewer's installed fonts.
- Local validation is targeted. CI owns the wider regression gates.

This tranche delivers shared packages and examples. Product adoption follows
publication, retaining existing saved appearance and stable icon URLs.

## Delivery status

- **Published:** tokens 0.6 with typed opt-in themes and eight validated color
  combinations; brand 0.2 with four masters and 52 generated exports. Original
  token artifacts and marks remain compatible. Both packages validate packed
  consumer imports; brand also checks every registry export.
- **Prepared:** Storybook theme/control examples with Lattice note traversal and
  a Warden task, production-asset specimens, usage guides and strict consumer
  typechecks. CI and the docs container build generate assets before use.
- **Reviewed:** independent package/API compatibility review found no required
  changes. Browser checks covered 24 OS/appearance/theme/accent combinations,
  mobile task retention, System updates, unavailable/corrupt storage and enlarged
  text. A missing React import in the marks reference was corrected during review.
- **Verified after merge:** both packages downloaded from GitHub Packages;
  registry integrity, public exports and generated assets match merged commit
  `85e6fa4`. The docs image also passed its serving smoke check. A duplicate
  release invocation stopped at the existing already-published guard.
- **Current parallel work:** extract native Button/Input/Select/Label into
  `@pixeloven/ui` while Lattice adopts the already published tokens and assets.
  The docs now consume the package instead of owning duplicate control styles.
  Lattice preserves saved appearance, its Dark fallback, current exploration
  and stable icon URLs. Independent review follows both implementations.
- **Next release boundary:** publish UI 0.1 after its PR merges, then migrate
  Lattice's matching controls. The Lattice foundation migration does not depend
  on an unpublished UI package. Warden adoption follows its own roadmap.

The new opt-in danger callout ground was adjusted to pass 4.5:1 with its existing
status foreground. Legacy palette values are unchanged. The surrounding example
workflows remain reference compositions. UI publication and product deployment
remain separate gates; neither is implied by implementation or package tests.

## Shared controls acceptance

- Native semantics, form submission, refs, labels, disabled fields and invalid
  descriptions survive the wrapper. Buttons default to non-submitting actions.
- Strict build/public types and lint cover the package; installed tarball tests
  exercise its exports. React remains a peer rather than bundled runtime code.
- Control styles use canonical roles, readable type, visible focus and at least
  44px touch targets. Consumer layout and state remain outside the package.
- Actual Storybook controls are checked on desktop/mobile across the eight
  combinations, including keyboard focus, form errors and unavailable actions.
- Focused local checks and independent review precede PRs; CI owns broad gates.
