---
name: design-process
description: "How any PixelOven project engages with design: look the need up in the design catalogue first, hold the operator's call, and land anything that changes the system in pixeloven/design as a catalogue entry or decision record. Load before starting design work in any PixelOven repo — a new surface, style, pattern, art direction or retirement. Landmine: a design decision recorded only in a product log or another repo is invisible to every other project; if it changes the system, it is a DDR in pixeloven/design."
---

# The PixelOven design process

`pixeloven/design` is the single home of record for PixelOven's design
knowledge — tokens, marks and controls, and also patterns, accessibility,
voice, art and 3D direction, studies and retired languages. The full process
is [`process.md`](../../process.md); this skill carries the three steps every
worker needs, in any repo.

The rule exists because design knowledge was scattered: an accessibility
standard, UI patterns, three status vocabularies and five style bibles lived in
working folders with no remote, and a known contrast gap sat in another repo's
notes while the design repo had no issue for it. Nobody could cite any of it.

## 1. Ask: look it up before you design it

Before drawing, proposing or building anything, read
[`catalog/index.json`](../../catalog/index.json) in `pixeloven/design` (and the
token and brand packages for foundations).

| What you find | What to do |
| --- | --- |
| An `adopted` entry that fits | Consume it. Cite its id in the work, e.g. "follows `pxo:pattern/command-bar`". No new design. |
| A `study` or `proposed` entry | Read its outcome and sources. Build on it, or say why it does not fit. |
| An `archive` entry, or a `deprecated` one | Report what was tried and why it stopped **before** starting anything new. Do not revive it silently. |
| Nothing | The need is new: explore (a research report with sources and IP notes), then prototype in an isolated copy. |

Ids look like `pxo:<area>/<slug>` (`pxo:study/warden-identity`) or
`pxo:ddr/NNNN` for decisions; a token's id is its JS name
(`pxo:token/status.danger`). See [`catalog/README.md`](../../catalog/README.md).

## 2. Decide: the operator decides, and the words are kept

- A design call — a direction, a style, a pattern choice, a retirement — is
  the operator's. Hold it for them through the coordinator; do not pick one and
  build it as if it were decided.
- Record the answer in the product's own log, with the operator's words.
- **If the answer changes the system** (a new token, pattern, art direction or
  a retirement), it also becomes a DDR in `pixeloven/design/decisions/`, and the
  product log row cites `pxo:ddr/NNNN`. One record, one owner.

The citation scheme above (`pxo:` ids plus DDRs) is
[DDR-0013](../../decisions/0013-decisions-cite-the-system-by-id.md), `accepted`.

## 3. Codify: land it in pixeloven/design

- Changes reach the system as a PR in `pixeloven/design` on its own delivery
  path — not as a note, a copied file, or a local override in the consuming repo.
- Promote on evidence ([DDR-0011](../../decisions/0011-promote-on-evidence.md)):
  an approved direction, or a second project that needs the same thing. Until
  then it stays a study, or stays with its project.
- Close the study with its outcome, and move the options not taken to the archive.
- A gap you find in the system while working elsewhere (a token that fails
  contrast, a missing role) is a change to `pixeloven/design`, filed there.

For how to write the entry, DDR or package change itself, load the
`contributing` skill.

## Consuming what is released

Pin an exact release in your own PR; never float to latest. Cite the catalogue
ids your product follows in its `DESIGN.md`. A consumer never defines its own
colour, scale or mark — see `design-system-usage` and `brand-assets`.

## Landmines

- **A decision in a product log only is lost to every other project.** If it
  changes the system, it needs a DDR, even when the product log already has it.
- **Copying is forking.** Copying an entry, a palette or a component into a
  product repo creates the two-copies problem this repository was built to end
  (35 colours in use, 8 agreed). Cite and pin instead.
- **References are links.** Never copy a third-party image into any repo; a mood
  board is links with a one-line "why" and an IP note.
- **Proprietary assets stay with their project.** The repository is public
  ([DDR-0010](../../decisions/0010-public-loose-licence.md)). The exact style,
  mechanism and raw assets for a specific comic or game are not added by
  default; the operator decides case by case.
- **Do not re-ask a settled call.** Check `decisions/` first; an accepted DDR is
  the answer until a new DDR supersedes it.
