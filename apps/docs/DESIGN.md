---
name: PixelOven design documentation
description: Shared visual authority and the built Warden review study.
colors:
  primary: "var(--pxo-action-primary)"
  on-primary: "var(--pxo-action-on-primary)"
  background: "var(--pxo-surface-bg)"
  surface: "var(--pxo-surface)"
  text: "var(--pxo-text)"
  text-secondary: "var(--pxo-text-secondary)"
  selection-surface: "var(--pxo-interaction-selection-surface)"
  selection-text: "var(--pxo-interaction-selection-text)"
typography:
  body:
    fontFamily: "var(--pxo-reading-body-font-family)"
    fontSize: "var(--pxo-reading-body-size)"
    lineHeight: "var(--pxo-reading-body-line-height)"
  control:
    fontFamily: "var(--pxo-reading-control-font-family)"
    fontSize: "var(--pxo-reading-control-size)"
    lineHeight: "var(--pxo-reading-control-line-height)"
  code:
    fontFamily: "var(--pxo-reading-code-font-family)"
    fontSize: "var(--pxo-reading-code-size)"
    lineHeight: "var(--pxo-reading-code-line-height)"
rounded:
  sm: "var(--pxo-radius-sm)"
  base: "var(--pxo-radius)"
---

# Design System: PixelOven documentation

## Overview

**Creative North Star: "PixelOven family"**

The approved modern, minimalist cyberpunk direction combines neutral work
surfaces, concentrated electric accents, readable Plex typography and precise
Solid/Inset identity. Density serves the task; hierarchy and accessible controls
carry the expression.

This records shared visual guidance for the documentation application and the
built Warden review study. Warden's composition is study-specific, not a template
for every product. Its synthetic local state does not establish production
capabilities or approve a Warden mark.

The operator supports this visual direction but found the October study's
queue-centered work model inadequate. The accepted model makes an Epic the
project-level Issue, with direct Story/Task/Bug/Spike children. New issue captures
work with what is known; findings refine requirements and produce related work.
All five types share a creation composer with relevant optional fields. New Epic
preselects Epic; switching types preserves authored draft text.
An Epic is optional, and no intake wizard is required. Epics, All issues and Needs attention
provide working destinations. List is the default, Board optional. The local
study and production UI/MCP acceptance remain distinct delivery gates.

**Key Characteristics:**

- Cool/Warm neutrals and independent Acid/electric Violet accents.
- Plex Sans task text and Plex Mono identifiers.
- Tonal separation, modest corners and visible interaction states.
- Solid primary identity and Inset companion identity.

The [family decisions](../../docs/brand-family.md),
[token package](../../packages/tokens/README.md) and
[native controls](../../packages/ui/src/styles.css) remain authoritative.
Frontmatter binds to canonical variables; it does not copy their values.

## Colors

Cool/Warm, Acid/electric Violet and Dark/Light/System are independent choices.
Background is the working ground, Surface holds cards/controls and Raised
separates higher planes. Text and Secondary text distinguish intent from context.
Pair primary fills with on-primary ink, selected surfaces with selection ink,
and links with accent-text. Retain control boundaries and offset focus outlines.
Status colors keep their meaning across preferences; decorative borders are not
control boundaries. Warden's accented Review/Verify markers retain written labels.

## Typography

Use complete canonical roles, including weight and tracking. Plex Sans carries
reading-body prose, reading-control actions and reading-input fields. Plex Mono
carries reading-code identifiers and counts. The study uses Sans with compact
Display/Title metrics for headings, and limits detail prose to (65ch). Consumers
load the fonts. Preserve readable task text instead of substituting compact
metadata roles.

## Layout

Warden's wide layout has a (12.5rem) navigator, a flexible project board/list and
an adjacent task. Projects use outcome-led rows with compact task counts.
Board columns retain a (15rem) minimum and scroll horizontally. At
(761–1200px), navigation moves above the workspace. At (760px) and below, native
Workspace/Stage selects and wrapping Board/List controls lead readable work;
the board shows one stage. A phone project keeps its title, actionable counts
and a short outcome visible; the full outcome and project settings have separate
disclosures. A compact next-work row follows authored planning order. Detail and creation fill the phone viewport with
scrolling content and safe-area padding. Desktop reading can expand into a
protected, viewport-centered surface with a (48rem) content limit. Enlarged text
stacks controls while preserving complete labels. Review chrome and simulation
controls remain distinct from product navigation.

The identity study is bounded to (76rem); drawing/copy and appearance settings
stack at (700px). These are observed study breakpoints, not shared scale tokens.
See the [revised Warden brief](../../docs/warden-design-brief.md) for the intended
journey, proposed policies and production capability gaps.

## Elevation & Depth

Neutral planes and borders convey depth; resting cards have no shadow. The
desktop composer uses shadow-strong and a surface-void-derived backdrop.
Task-card color transitions use duration-out/ease-out and disappear under
reduced motion. Shared native controls introduce no motion themselves.

## Shapes

Canonical small corners serve controls, base corners serve cards and large
corners serve the desktop composer. Compact markers/list rows/phone panels use
extra-small corners. Solid/Inset geometry remains angular. PixelOven and Lattice
figures come from `@pixeloven/brand`; Warden candidates remain unapproved studies
outside its asset registry.

## Components

- **Buttons:** shared primary/secondary variants, minimum target dimensions
  `max(44px, 2.75rem)`, and native hover/pressed/selected/disabled/focus states.
  Disabled controls retain readable ink and a dashed boundary.
- **Entry:** shared Input, Select and Label; native semantics and reading roles.
  Invalid entry uses a dashed danger boundary with consumer-owned explanations.
  Warden's textarea is local, not a fifth published control.
- **Navigation and tasks:** project outcomes lead; cards support titles with
  IDs, responsibility and actual attention reasons. Open/Completed/All filters
  and search keep finished work findable. Board and List share project planning
  order. All work, Decisions and Blocked focus remain project-scoped. Drag
  handles support pointer/touch movement and keyboard placement, with a stable
  source footprint, traveling preview, active destination and exact insertion
  feedback. Explicit transfer stays separate from ordering.
- **Task:** a specific request leads, with decisions, editing, completion and
  Manage task together. Review leads with Plan; Verify leads with Result and
  Done when. Activity defaults to Comments, including authored decision reasons;
  a Decisions filter narrows the same feed. The composer stays visible across
  filters, with feedback beside it. Legacy Decision and Log text retains its
  source label without invented author/time metadata. Approve,
  Request changes and Move explain their different consequences. Focus enters the task and returns on
  close; browser-session state retains drafts and decision reasons. Desktop
  expansion and phone modal reading protect concentration and return context.
- **Identity:** compare Solid/Inset and small-size specimens alongside the
  approved family. Preview selection does not approve or publish a mark.

## Do's and Don'ts

- **Do** bind shared visual values to canonical token roles.
- **Do** preserve readable text, visible focus and complete labels as text grows.
- **Do** attribute Warden composition and local behavior to this synthetic study.
- **Don't** create another palette or change status meaning with accent preferences.
- **Don't** present Warden candidates as approved family assets.
- **Don't** infer production integration or unperformed accessibility coverage from visual review.
