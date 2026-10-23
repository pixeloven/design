# Warden identity study

**UNAPPROVED concepts · October 2026.** These are review sources, outside the
canonical brand registry and published package. PixelOven and Lattice remain
the approved references. Choosing a concept is a separate decision from
publishing production assets.

Warden directs work and preserves human decision points. Each proposal uses
solid angular geometry and open negative space to express that role. All three
use the exact approved Inset outer container; the product figure changes. The
neutral `currentColor` sources introduce no palette. Cool/Warm themes and
Acid/electric Violet accents remain independent of identity.

## Concepts

| Concept | Figure and rationale | Tradeoff |
| --- | --- | --- |
| **Waymark — recommended** | An angular W has two open channels around a central spine. The initials identify Warden; the connected structure suggests several work paths with shared direction. Wide vertical stems and 45° joins relate to PixelOven's P without repeating it. | Its W is the strongest name association and the clearest small mark. The two lower points can suggest a crest; keep it upright and preserve the open top. |
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
| Waymark | Inset preserves a readable W; the inner channels soften but stay open. The center notch is small. | Both figures read clearly; the open channels become reliable shape cues. | The paired lower points and central spine are distinct without added detail. |
| Threshold | Inset preserves the diagonal passage; its two narrow returns soften. The structure reads before its metaphor. | The opposing gateposts separate clearly. | The directional offset is explicit, with generous center space. |
| Branch | Inset preserves the arrow and fork; the two tail tips are secondary. | Arrowhead, trunk and fork separate clearly. | The branched construction is explicit, while direction remains dominant. |

These observations are a concept review, not approval for a production
favicon. Before promotion, inspect browser favicon pixels and a real name
lockup, confirm the figure with the operator, then use the existing brand
build for explicit-ink assets and maskable padding. Preserve the family's
8-grid-unit external clear space and current minimum sizes.

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
