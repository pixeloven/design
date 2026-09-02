/**
 * Rendering helpers for the Marks page.
 *
 * The registry is the source: marks.json drives both what is shown and what the
 * tests assert, so a mark cannot appear here without being registered, or be
 * registered without appearing here.
 */

import registry from "@pixeloven/brand/marks.json"

type Mark = {
  id: string
  name: string
  tier: string
  file: string
  figure: string
  note?: string
}

const marks = (registry as { marks: Mark[] }).marks

// Vite resolves these at build time, so the rendered mark is the shipped file.
const sources = import.meta.glob("../../../packages/brand/marks/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

const urlFor = (file: string) => {
  const name = file.split("/").pop()
  const key = Object.keys(sources).find((k) => k.endsWith(`/${name}`))
  return key ? sources[key] : ""
}

// Homepage renders marks at roughly 32px, so the small end is the size that
// actually decides whether a mark works.
const SIZES = [96, 48, 32, 24]

export function MarkGrid() {
  return (
    <div className="pxo-marks">
      {marks.map((m) => (
        <div className="pxo-mark" key={m.id}>
          <div className="sizes">
            {SIZES.map((s) => (
              <img key={s} src={urlFor(m.file)} width={s} height={s} alt={`${m.name} at ${s}px`} />
            ))}
          </div>
          <div>
            <div className="mono" style={{ color: "var(--pxo-text)", fontSize: ".85rem" }}>
              {m.name}
            </div>
            <div className="mono" style={{ color: "var(--pxo-text-dim)", fontSize: ".7rem" }}>
              {m.tier}
            </div>
            <div
              style={{
                color: "var(--pxo-text-secondary)",
                fontSize: ".78rem",
                maxWidth: "22rem",
                marginTop: ".3rem",
              }}
            >
              {m.figure}
            </div>
            {m.note ? (
              <div
                style={{
                  color: "var(--pxo-text-dim)",
                  fontSize: ".72rem",
                  maxWidth: "22rem",
                  marginTop: ".3rem",
                }}
              >
                {m.note}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

const TIERS: [string, string, string][] = [
  ["parent", "PixelOven itself. Exactly one, asserted by test.", "the reference all others answer to"],
  ["product", "a thing we ship and name (Lattice, Warden)", "its own figure, shared palette"],
  ["family", "a member of a named set (the *-axi tools)", "shares a motif with its siblings, differs by one element"],
]

export function MarkRules() {
  return (
    <table style={{ width: "100%", fontSize: ".85rem" }}>
      <thead>
        <tr style={{ color: "var(--pxo-text-dim)", textAlign: "left" }}>
          <th>tier</th>
          <th>meaning</th>
          <th>freedom</th>
        </tr>
      </thead>
      <tbody>
        {TIERS.map(([tier, meaning, freedom]) => (
          <tr key={tier} style={{ color: "var(--pxo-text-secondary)" }}>
            <td className="mono" style={{ color: "var(--pxo-text)" }}>
              {tier}
            </td>
            <td>{meaning}</td>
            <td>{freedom}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
