/**
 * Rendering helpers for the Colour page.
 *
 * These read tokens.json directly rather than taking values as props, which is
 * the whole point: a documentation page that transcribes its subject is a
 * second copy, and second copies are what this design system exists to remove.
 */

import raw from "@pixeloven/tokens/source"

type Entry = { dark?: string; light?: string; value?: string; use?: string; on?: string }
type Group = Record<string, Entry | string | string[]>

const SCHEMES = (raw as never as { meta: { schemes: string[] } }).meta.schemes

const entries = (group: string): [string, Entry][] =>
  Object.entries((raw as never as Record<string, Group>)[group])
    .filter(([k]) => k !== "$comment")
    .map(([k, v]) => [k, v as Entry])

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
const cssVar = (group: string, key: string) =>
  `--pxo-${[kebab(group), key === "base" ? null : kebab(key)].filter(Boolean).join("-")}`

// --- colour maths, duplicated from the tests on purpose --------------------
// The tests assert the values are correct; this page shows the reader what the
// numbers ARE. Sharing an implementation would mean a bug in it could make both
// the assertion and the display agree while being wrong.
const channels = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
const luminance = (c: string) => {
  const [r, g, b] = channels(c).map((v) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export function Swatches({ group }: { group: string }) {
  return (
    <div className="pxo-swatches">
      {entries(group).map(([key, entry]) => (
        <div className="pxo-swatch" key={key}>
          <div className="chip" style={{ background: `var(${cssVar(group, key)})` }} />
          <div className="meta">
            <span className="name">{cssVar(group, key)}</span>
            <span className="value">
              {SCHEMES.map((s) => entry[s as "dark" | "light"]).join("  ·  ")}
            </span>
            {entry.use ? <span className="use">{entry.use}</span> : null}
          </div>
        </div>
      ))}
    </div>
  )
}

const LADDER: [string, string][] = [
  ["surface", "void"],
  ["surface", "canvas"],
  ["surface", "bg"],
  ["surface", "base"],
  ["surface", "hover"],
  ["surface", "raised"],
  ["border", "muted"],
  ["border", "base"],
  ["border", "strong"],
  ["border", "accent"],
]

export function Ladder() {
  const groups = raw as never as Record<string, Record<string, Entry>>
  const ground = groups.surface.void
  return (
    <div className="pxo-ladder">
      {LADDER.map(([g, k]) => {
        const entry = groups[g][k]
        return (
          <div
            className="step"
            key={`${g}.${k}`}
            style={{ background: `var(${cssVar(g, k)})` }}
          >
            <span style={{ color: "var(--pxo-text)", minWidth: "12rem" }}>
              {g}.{k}
            </span>
            <span style={{ color: "var(--pxo-text-dim)" }}>
              {SCHEMES.map((s) => entry[s as "dark" | "light"]).join("  ·  ")}
            </span>
            <span style={{ color: "var(--pxo-text-dim)", marginLeft: "auto" }}>
              {SCHEMES.map((s) =>
                contrast(
                  entry[s as "dark" | "light"] as string,
                  ground[s as "dark" | "light"] as string,
                ).toFixed(3),
              ).join("  ·  ")}
              {"  from ground"}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ContrastTable() {
  const groups = raw as never as Record<string, Record<string, Entry>>
  const rows = entries("text").map(([key, entry]) => {
    const [g, k] = (entry.on ?? "surface.base").split(".")
    return {
      token: `text.${key}`,
      on: entry.on ?? "surface.base",
      ratios: SCHEMES.map((s) =>
        contrast(
          entry[s as "dark" | "light"] as string,
          groups[g][k][s as "dark" | "light"] as string,
        ),
      ),
    }
  })
  return (
    <table style={{ width: "100%", fontFamily: "var(--pxo-font-mono)", fontSize: ".8rem" }}>
      <thead>
        <tr style={{ color: "var(--pxo-text-dim)", textAlign: "left" }}>
          <th>token</th>
          <th>on</th>
          {SCHEMES.map((s) => (
            <th key={s}>{s}</th>
          ))}
          <th>AA body</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.token} style={{ color: "var(--pxo-text-secondary)" }}>
            <td style={{ color: "var(--pxo-text)" }}>{r.token}</td>
            <td>{r.on}</td>
            {r.ratios.map((v, i) => (
              <td key={i}>{v.toFixed(2)}:1</td>
            ))}
            <td
              style={{
                color: r.ratios.every((v) => v >= 4.5)
                  ? "var(--pxo-status-success)"
                  : "var(--pxo-status-danger)",
              }}
            >
              {r.ratios.every((v) => v >= 4.5) ? "pass" : "FAIL"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
