/**
 * Rendering helpers for the Scales page — the non-colour primitives.
 *
 * Same rule as the Colour page: these read tokens.json and nothing is
 * transcribed. A radius drawn at a hardcoded 8px would keep looking right long
 * after the token stopped being 8px, which is the failure this system exists to
 * remove — so every shape on the page is drawn with `var(--pxo-…)` and every
 * NUMBER shown beside it is parsed out of the source.
 *
 * One component with a `group` prop rather than five named ones, because the
 * docs coverage test matches `group="…"` to prove a token group is actually
 * rendered. A component the test cannot see is a group that can go undocumented.
 */

import type { JSX, ReactNode } from "react"

import raw from "@pixeloven/tokens/source"

type Leaf = { value?: string; use?: string }
type Node = Record<string, Leaf | Record<string, Leaf> | string | string[]>

const source = raw as never as Record<string, Node>

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

/** `base` names its group: radius.base -> --pxo-radius. Mirrors the build. */
const cssVar = (...path: string[]) =>
  `--pxo-${(path.at(-1) === "base" ? path.slice(0, -1) : path).map(kebab).join("-")}`

const entries = (group: string): [string, Leaf][] =>
  Object.entries(source[group]).filter(([k]) => k !== "$comment") as [string, Leaf][]

/** The leading number of a token value: "180ms" -> 180, "-0.02em" -> -0.02. */
const magnitude = (value: string) => Number(/^-?[\d.]+/.exec(value)?.[0] ?? 0)

const Row = ({ name, value, use, children }: {
  name: string
  value: string
  use?: string
  children?: ReactNode
}) => (
  <div className="pxo-scale-row">
    <div className="pxo-scale-demo">{children}</div>
    <div className="pxo-scale-meta">
      <span className="name">{name}</span>
      <span className="value">{value}</span>
      {use ? <span className="use">{use}</span> : null}
    </div>
  </div>
)

// --- per-group renderings ----------------------------------------------------

const Radius = () => (
  <div className="pxo-scale">
    {entries("radius").map(([key, entry]) => (
      <Row key={key} name={cssVar("radius", key)} value={entry.value!} use={entry.use}>
        <div
          className="pxo-radius-chip"
          style={{ borderRadius: `var(${cssVar("radius", key)})` }}
        />
      </Row>
    ))}
  </div>
)

const METRICS = ["size", "lineHeight", "weight", "letterSpacing"] as const

const TypeRamp = () => {
  const steps = Object.entries(source.type).filter(([k]) => k !== "$comment") as [
    string,
    Record<string, Leaf> & { use?: string },
  ][]
  return (
    <div className="pxo-scale">
      {steps.map(([step, entry]) => (
        <div className="pxo-scale-row" key={step}>
          <div className="pxo-scale-demo">
            <span
              style={{
                fontFamily: "var(--pxo-font-mono)",
                fontSize: `var(${cssVar("type", step, "size")})`,
                lineHeight: `var(${cssVar("type", step, "lineHeight")})`,
                fontWeight: `var(${cssVar("type", step, "weight")})` as never,
                letterSpacing: `var(${cssVar("type", step, "letterSpacing")})`,
                color: "var(--pxo-text)",
              }}
            >
              {step}
            </span>
          </div>
          <div className="pxo-scale-meta">
            <span className="name">{cssVar("type", step)}-*</span>
            <span className="value">
              {METRICS.map((m) => (entry[m] as Leaf).value).join("  ·  ")}
            </span>
            <span className="use">{entry.use}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Draw the curve from its own control points, so the picture cannot lie. */
const Curve = ({ value }: { value: string }) => {
  const [x1, y1, x2, y2] = (value.match(/-?[\d.]+/g) ?? []).map(Number)
  const S = 56
  const at = (x: number, y: number) => `${x * S},${S - y * S}`
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} aria-hidden>
      <path
        d={`M ${at(0, 0)} C ${at(x1, y1)} ${at(x2, y2)} ${at(1, 1)}`}
        fill="none"
        stroke="var(--pxo-accent)"
        strokeWidth="2"
      />
    </svg>
  )
}

const Ease = () => (
  <div className="pxo-scale">
    {entries("ease").map(([key, entry]) => (
      <Row key={key} name={cssVar("ease", key)} value={entry.value!} use={entry.use}>
        <Curve value={entry.value!} />
      </Row>
    ))}
  </div>
)

const Duration = () => {
  const all = entries("duration")
  const longest = Math.max(...all.map(([, e]) => magnitude(e.value!)))
  return (
    <div className="pxo-scale">
      {all.map(([key, entry]) => (
        <Row key={key} name={cssVar("duration", key)} value={entry.value!} use={entry.use}>
          {/* Width is the duration, to scale — so a value that drifts out of
              proportion with the rest is visible rather than merely listed. */}
          <div
            className="pxo-duration-bar"
            style={{ width: `${(magnitude(entry.value!) / longest) * 100}%` }}
          />
        </Row>
      ))}
    </div>
  )
}

const Shadow = () => (
  <div className="pxo-scale">
    {entries("shadow").map(([key, entry]) => (
      <Row key={key} name={cssVar("shadow", key)} value={entry.value!} use={entry.use}>
        <div
          className="pxo-shadow-card"
          style={{ boxShadow: `var(${cssVar("shadow", key)})` }}
        />
      </Row>
    ))}
  </div>
)

const ZStack = () => {
  const layers = entries("z")
  const top = Math.max(...layers.map(([, e]) => magnitude(e.value!)))
  return (
    <div className="pxo-scale">
      {[...layers].reverse().map(([key, entry]) => (
        <Row key={key} name={cssVar("z", key)} value={entry.value!} use={entry.use}>
          {/* Indent by height in the stack: the order is the whole point. */}
          <div
            className="pxo-z-layer"
            style={{ marginLeft: `${(magnitude(entry.value!) / top) * 60}%` }}
          />
        </Row>
      ))}
    </div>
  )
}

const RENDERERS: Record<string, () => JSX.Element> = {
  radius: Radius,
  type: TypeRamp,
  ease: Ease,
  duration: Duration,
  shadow: Shadow,
  z: ZStack,
}

export function Scale({ group }: { group: string }) {
  const Renderer = RENDERERS[group]
  if (!Renderer) throw new Error(`no renderer for token group "${group}"`)
  return <Renderer />
}
