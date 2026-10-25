# Changelog

## 0.3.0

- Add Warden as a product identity using the approved Waymark angular W, with
  unchanged Solid and Inset geometry from the selected study.
- Provide the full canonical light/dark asset set: outlined name lockups,
  SVG/PNG favicons, app icons and maskable exports. The legacy `file` export
  uses the same Solid figure in canonical light ink on an opaque dark ground.
- Extend approved-geometry fixtures and existing rendering, palette, safe-area
  and offline package-consumer checks to Warden. PixelOven and Lattice artwork
  and asset contracts remain unchanged.
- Run test files serially so package preparation cannot rebuild assets while
  the rendering checks read them.

## 0.2.0

- Add the approved Solid and Inset figures under each existing identity, with
  explicit canonical light/dark SVG exports and a nested variant registry.
- Add outlined IBM Plex Sans Medium name lockups, SVG/PNG favicons, opaque app
  icons and mask-safe app/avatar exports, built reproducibly from source SVGs.
- Document clear space, minimum size, appearance, cropping and public asset paths.
- Validate package contents and exports, selected geometry, palette, raster
  outputs and mask-safe foreground bounds. Preserve legacy files and registry
  `file` properties without changing the single-parent relationship.

## 0.1.0

- Establish the PixelOven parent and Lattice product mark registry, shared
  canonical palette, and accessible SVG checks.
