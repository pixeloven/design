# Token releases

## 0.6.0

- Add opt-in Cool/Warm themes and independent Acid/electric Violet accents with
  explicit Dark/Light/System appearance. Existing exports and generated legacy
  values remain byte-compatible.
- Publish canonical annotated `themes/source`, complete eight-way `themes.json`,
  standalone root-opt-in `themes.css`, and a dependency-free `themes` runtime
  with strict TypeScript unions, immutable full token sets and pure resolution.
- Add verified primary default/hover/pressed ink pairs, essential control
  boundaries, accent text, focus and selection roles. Preserve status and graph
  origin colors; adapt graph grounds and lighten the opt-in light danger callout
  to meet readable text contrast.
- Document saved-setting validation, OS appearance ownership and migration that
  preserves existing consumer defaults and saved choices.

## 0.5.0

- Add `reading.body`, `reading.control`, `reading.input` and `reading.code`,
  including scalable size/line-height metrics and explicit Plex Sans/Mono stacks.
  Existing compact roles and brand colors retain their values.
- Add `graphOrigin`, `graphPattern`, `graph`, `browser.theme` and
  `interaction.focus` through CSS, JS, JSON and TypeScript declarations.
- Preserve Lattice's dark origin colors and static pattern contract; supply
  measured light counterparts with the same color-vision thresholds.
- Document both-theme search, source and health specimens, explicit contrast
  grounds and the remaining consumer renderer validation.

The repository's existing release workflow derives `tokens-v0.5.0` from the
package manifest after merge. A version declaration or local tarball is not
publication evidence; verify the registry artifact and source identity before
consumer adoption.
