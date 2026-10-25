# Warden identity study

**Waymark selected · October 25, 2026.** The operator selected the angular W
after reviewing these three options. Solid is the primary form; Inset is the
companion for favicons, app icons and avatars. The production masters now live
in `packages/brand/sources`, registered as Warden in brand 0.3.0. Publication and
consumer deployment remain separate milestones.

This directory preserves the original study sources and their dated unapproved
metadata. Threshold and Branch were not selected. Production consumers use the
[brand package](../../../packages/brand/README.md), not these historical files.

Warden directs work and preserves human decision points. Each proposal uses
solid angular geometry and open negative space to express that role. All three
use the exact approved Inset outer container; the product figure changes. The
neutral `currentColor` sources introduce no palette. Cool/Warm themes and
Acid/electric Violet accents remain independent of identity.

## Concepts

| Concept | Figure and rationale | Tradeoff |
| --- | --- | --- |
| **Waymark — selected** | An angular W has two open channels around a central spine. The initials identify Warden; the connected structure suggests several work paths with shared direction. Wide vertical stems and 45° joins relate to PixelOven's P without repeating it. | Its W is the strongest name association; at favicon size the name helps establish the compact emblem. The two lower points can suggest a crest; keep it upright and preserve the open top. |
| **Threshold** | Two opposing gateposts leave a continuous passage through the center. The displaced ends imply entry and release. This puts Warden's human gates in the figure without using a shield, lock, or approval tick. | The most abstract option. It offers a distinctive silhouette but needs a name lockup during introduction; the offset halves may also read as a link. |
| **Branch** | Two lower paths converge into one upward bearing. The large arrowhead makes direction legible immediately; the split tail retains the idea of coordinated work. | The strongest directional reading, with less dependence on a letter. It can resemble a launch or upload symbol, so its product distinctiveness is weaker than Waymark's. |

Use Solid for primary identity and name lockups. Inset cuts the same figure
into the family container for browser tabs, app icons and avatars. Insets use
75% figure scale; Waymark is shifted upward by 1.5 grid units to center its
slightly lower Solid bounds. No stroke, filter, mask or font is required.

## Small sizes

The six sources were rasterized with the repository's pinned resvg alongside
the four approved masters on canonical light and dark grounds. Actual-size
16, 24 and 32px samples were inspected together. Solid at 16px is shown only
as a stress check: the existing family minimum remains 24px for Solid and
16px for Inset.

| Concept | 16px | 24px | 32px |
| --- | --- | --- | --- |
| Waymark | Inset preserves the three-stem silhouette and open channels; the small lower notch softens. The W association is stronger beside the name. | Both figures read clearly; the open channels become reliable shape cues. | The paired lower points and central spine are distinct without added detail. |
| Threshold | Inset preserves the diagonal passage; its two narrow returns soften. The structure reads before its metaphor. | The opposing gateposts separate clearly. | The directional offset is explicit, with generous center space. |
| Branch | Inset preserves the arrow and fork; the two tail tips are secondary. | Arrowhead, trunk and fork separate clearly. | The branched construction is explicit, while direction remains dominant. |

These observations describe the concept review. The October 25 selection
promotes Waymark through the existing brand build, including explicit-ink
exports, outlined name lockups and maskable padding. Inspect generated favicon
pixels and the real name lockup before consumer adoption. Preserve the family's
8-grid-unit external clear space and current minimum sizes.

## October 25 selection review

The independent review retains **Waymark** as the recommendation after comparing
all three candidates with the approved PixelOven and Lattice masters at actual
16px Inset and 24px Solid sizes on canonical light and dark grounds. No geometry
change is required for selection. Threshold's gate emphasizes only one part of
Warden's capture, investigation, refinement and outcome workflow. Branch reads
as upload or launch before coordinated work.

The portable review opens directly with `?review=identity`; add
`&concept=threshold` or `&concept=branch` to start with another figure. It includes
header, browser-tab and app-icon placement previews plus an equal-size family
comparison. These use study sources; they are not production lockup or favicon
exports for the unselected alternatives. Waymark previews use the canonical
production masters and generated assets. Preview controls change the sample
only; they do not undo the operator's selection or publish another figure.

## Source files

| Concept | Solid | Inset |
| --- | --- | --- |
| Waymark | [solid.svg](waymark/solid.svg) | [inset.svg](waymark/inset.svg) |
| Threshold | [solid.svg](threshold/solid.svg) | [inset.svg](threshold/inset.svg) |
| Branch | [solid.svg](branch/solid.svg) | [inset.svg](branch/inset.svg) |

Each source has a 64×64 viewBox, title, accessible name and unapproved status
in its description. For a controlled inline preview, set the surrounding
`color` to the canonical ink token. An external SVG does not inherit page
color; production exports must resolve ink through the existing asset build.
With HTML images, supply `alt="Warden"`, or empty alt when adjacent text
already names the figure.
