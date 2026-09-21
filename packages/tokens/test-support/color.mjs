// Ported without algorithm changes from pixeloven/lattice 8577b414, frontend/lib/graph/color.ts.
// Retains the existing product palette contract; this helper is test-only.
/**
 * Colour science for the edge-origin palette gate (#98).
 *
 * Edge origin is the one dimension Lattice surfaces that nothing else in the
 * stack can (ADR-0002/0013), and it is carried by colour. That makes "these
 * colours are tellable apart" a **correctness property**, not a matter of
 * taste — so it is measured here and asserted in `palette.test.ts` rather than
 * asserted in a comment.
 *
 * The pipeline is the standard one: sRGB → linear RGB → colour-vision-deficiency
 * simulation (Machado et al. 2009) → CIELAB → CIEDE2000 difference. Machado's
 * matrices are defined over **linear** RGB, which is why the de-gamma step is
 * not optional.
 *
 * Reference: Machado, Oliveira & Fernandes (2009), "A Physiologically-based
 * Model for Simulation of Color Vision Deficiency", IEEE TVCG 15(6).
 */




/** The dichromacies we gate against, plus the trivial identity case. */






export const VISION_MODELS                         = [
  "normal",
  "protanopia",
  "deuteranopia",
  "tritanopia",
]

/** Machado et al. (2009) severity-1.0 matrices, row-major, over linear RGB. */
const CVD_MATRIX                                                   = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882,
    -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182,
    0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733,
    0.691367, 0.3039,
  ],
}

/** Parse `#rrggbb` (or `#rgb`) into 0–1 sRGB components. */
export function parseHex(hex        )      {
  const h = hex.trim().replace(/^#/, "")
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h
  if (!/^[0-9a-fA-F]{6}$/.test(full))
    throw new Error(`not a hex colour: ${hex}`)
  return {
    r: Number.parseInt(full.slice(0, 2), 16) / 255,
    g: Number.parseInt(full.slice(2, 4), 16) / 255,
    b: Number.parseInt(full.slice(4, 6), 16) / 255,
  }
}

/** sRGB companding — the transfer function, not a plain 2.2 power. */
function toLinear(c        )         {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function fromLinear(c        )         {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
  return Math.min(1, Math.max(0, v))
}

export function linearize({ r, g, b }     )      {
  return { r: toLinear(r), g: toLinear(g), b: toLinear(b) }
}

/**
 * Simulate how `rgb` (sRGB, 0–1) appears under `model`.
 *
 * Returns sRGB again so results can be compared with the same Lab conversion
 * as the originals. `normal` is the identity — kept so callers can loop over
 * every model uniformly instead of special-casing.
 */
export function simulate(rgb     , model             )      {
  if (model === "normal") return rgb
  const m = CVD_MATRIX[model]
  const { r, g, b } = linearize(rgb)
  return {
    r: fromLinear(m[0] * r + m[1] * g + m[2] * b),
    g: fromLinear(m[3] * r + m[4] * g + m[5] * b),
    b: fromLinear(m[6] * r + m[7] * g + m[8] * b),
  }
}

/** sRGB → CIELAB (D65, 2° observer). */
export function toLab(rgb     )      {
  const { r, g, b } = linearize(rgb)
  // sRGB → XYZ (D65), scaled to the 0–100 range Lab expects.
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) * 100
  const y = (0.2126729 * r + 0.7151522 * g + 0.072175 * b) * 100
  const z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) * 100

  // D65 white point.
  const f = (t        )         =>
    t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29
  const fx = f(x / 95.047)
  const fy = f(y / 100.0)
  const fz = f(z / 108.883)

  return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) }
}

const DEG = Math.PI / 180

/**
 * CIEDE2000 colour difference — the perceptual metric, not plain Euclidean
 * distance in Lab.
 *
 * ΔE76 badly overstates separation in the blue region, which is precisely
 * where this palette's failure mode lives (three origins in the blue family
 * collapsing under deuteranopia), so the cheaper metric would have hidden the
 * bug it exists to catch.
 */
export function deltaE00(c1     , c2     )         {
  const kL = 1
  const kC = 1
  const kH = 1

  const c1ab = Math.hypot(c1.a, c1.b)
  const c2ab = Math.hypot(c2.a, c2.b)
  const cBar = (c1ab + c2ab) / 2
  const g = 0.5 * (1 - Math.sqrt(cBar ** 7 / (cBar ** 7 + 25 ** 7)))

  const a1p = (1 + g) * c1.a
  const a2p = (1 + g) * c2.a
  const c1p = Math.hypot(a1p, c1.b)
  const c2p = Math.hypot(a2p, c2.b)

  const hp = (b        , ap        )         => {
    if (b === 0 && ap === 0) return 0
    const h = Math.atan2(b, ap) / DEG
    return h >= 0 ? h : h + 360
  }
  const h1p = hp(c1.b, a1p)
  const h2p = hp(c2.b, a2p)

  const dLp = c2.l - c1.l
  const dCp = c2p - c1p

  let dhp
  if (c1p * c2p === 0) dhp = 0
  else if (Math.abs(h2p - h1p) <= 180) dhp = h2p - h1p
  else if (h2p - h1p > 180) dhp = h2p - h1p - 360
  else dhp = h2p - h1p + 360
  const dHp = 2 * Math.sqrt(c1p * c2p) * Math.sin((dhp / 2) * DEG)

  const lBarP = (c1.l + c2.l) / 2
  const cBarP = (c1p + c2p) / 2

  let hBarP
  if (c1p * c2p === 0) hBarP = h1p + h2p
  else if (Math.abs(h1p - h2p) <= 180) hBarP = (h1p + h2p) / 2
  else if (h1p + h2p < 360) hBarP = (h1p + h2p + 360) / 2
  else hBarP = (h1p + h2p - 360) / 2

  const t =
    1 -
    0.17 * Math.cos((hBarP - 30) * DEG) +
    0.24 * Math.cos(2 * hBarP * DEG) +
    0.32 * Math.cos((3 * hBarP + 6) * DEG) -
    0.2 * Math.cos((4 * hBarP - 63) * DEG)

  const dTheta = 30 * Math.exp(-(((hBarP - 275) / 25) ** 2))
  const rC = 2 * Math.sqrt(cBarP ** 7 / (cBarP ** 7 + 25 ** 7))
  const rT = -rC * Math.sin(2 * dTheta * DEG)

  const sL = 1 + (0.015 * (lBarP - 50) ** 2) / Math.sqrt(20 + (lBarP - 50) ** 2)
  const sC = 1 + 0.045 * cBarP
  const sH = 1 + 0.015 * cBarP * t

  return Math.sqrt(
    (dLp / (kL * sL)) ** 2 +
      (dCp / (kC * sC)) ** 2 +
      (dHp / (kH * sH)) ** 2 +
      rT * (dCp / (kC * sC)) * (dHp / (kH * sH)),
  )
}

/** Perceptual distance between two hex colours as seen under `model`. */
export function perceptualDistance(
  hexA        ,
  hexB        ,
  model             ,
)         {
  return deltaE00(
    toLab(simulate(parseHex(hexA), model)),
    toLab(simulate(parseHex(hexB), model)),
  )
}

/** WCAG relative luminance. */
export function relativeLuminance(hex        )         {
  const { r, g, b } = linearize(parseHex(hex))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * WCAG contrast ratio between two hex colours.
 *
 * Used against the canvas: WCAG 1.4.11 requires 3:1 for graphical objects
 * essential to understanding content, and an edge in a graph whose whole
 * premise is edge typing is exactly that.
 */
export function contrastRatio(hexA        , hexB        )         {
  const a = relativeLuminance(hexA)
  const b = relativeLuminance(hexB)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}
