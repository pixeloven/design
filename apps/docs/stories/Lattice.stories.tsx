import React, { useState, type CSSProperties } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import raw from "@pixeloven/tokens/source"
import "./Lattice.css"

const kebab = (key: string) => key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)

export function ReadingRoles() {
  return <div className="pxo-reading-roles">
    {Object.entries(raw.reading).filter(([key]) => key !== "$comment").map(([role, value]) => {
      const entry = value as typeof raw.reading.body
      return <div key={role} className={`pxo-reading-role pxo-reading-${role}`}>
        <strong>{role}</strong>
        <span>{entry.use}</span>
        <code>{entry.size.value} / {entry.lineHeight.value} · {entry.weight.value}</code>
      </div>
    })}
  </div>
}

export function OriginPatterns() {
  return <ul className="pxo-origin-list">
    {Object.entries(raw.graphPattern).map(([origin, entry]) => <li key={origin}>
      <span className="pxo-origin-line" aria-hidden="true" style={{
        borderColor: `var(--pxo-graph-origin-${kebab(origin)})`,
        borderTopStyle: `var(--pxo-graph-pattern-${kebab(origin)})`,
      } as CSSProperties} />
      <span>{origin === "frontmatterRef" ? "Frontmatter reference" : origin}</span>
      <span className="pxo-support">{entry.value}</span>
    </li>)}
  </ul>
}

const source = `---\ntitle: A garden of connected ideas\ntags: [knowledge, exploration]\n---\n\n# A garden of connected ideas\n\nFollow [[notes/keeping-a-reading-journal]] to see how observations become connections.\n\nThis is literal Markdown source. It stays readable and copyable, including long identifiers.\n\n[[notes/research/observations-with-a-deliberately-long-unbroken-canonical-identifier-abcdefghijklmnopqrstuvwxyz]]`

export function LatticeSpecimens() {
  const [query, setQuery] = useState("garden")
  const [selected, setSelected] = useState(true)
  return <main className="pxo-lattice">
    <header>
      <h1>Lattice token specimens</h1>
      <p className="pxo-support">Search, source and health fixtures. Use the Storybook theme menu to inspect dark and light. These controls demonstrate local states; they do not query a vault.</p>
    </header>
    <div className="pxo-specimens">
      <section aria-labelledby="search-heading">
        <h2 id="search-heading">Find a note</h2>
        <label htmlFor="specimen-search">Search notes</label>
        <input id="specimen-search" type="search" value={query} placeholder="Find a note by name" onChange={event => setQuery(event.target.value)} />
        <p className="pxo-support">Names in the loaded fixture</p>
        {"a garden of connected ideas".includes(query.toLowerCase()) ? <button className="pxo-result" aria-pressed={selected} onClick={() => setSelected(!selected)}>
          <span>A garden of connected ideas</span>
          <span className="pxo-reading-code">notes/a-garden-of-connected-ideas</span>
          <span className="pxo-support">{selected ? "Selected note" : "Select note"}</span>
        </button> : <p>No names match this fixture query. Clear the search to see the note.</p>}
        <p>Read a note, follow a connection, then retrace your steps.</p>
        <button className="pxo-focus-example" onClick={() => setQuery("")}>Clear search</button>
        <p className="pxo-support">Focus appearance shown above; keyboard focus uses the same role.</p>
      </section>
      <section aria-labelledby="source-heading">
        <h2 id="source-heading" className="pxo-note-title">A garden of connected ideas</h2>
        <p className="pxo-support">Source fixture · literal Markdown</p>
        <pre className="pxo-reading-code" role="region" tabIndex={0} aria-label="Literal source">{source}</pre>
        <p className="pxo-support">A normal path wraps. Source preserves its line breaks and remains selectable.</p>
        <button disabled>Refreshing source…</button>
      </section>
      <section aria-labelledby="health-heading">
        <h2 id="health-heading">Inspect a finding</h2>
        <p className="pxo-count">1 finding in this fixture</p>
        <div className="pxo-finding">
          <h3>Missing reference</h3>
          <p>The linked note is absent from this indexed fixture. Inspect its source before deciding what to change.</p>
          <code className="pxo-reading-code">notes/keeping-a-reading-journal</code>
        </div>
        <div className="pxo-error" role="status">
          <strong>Recheck unavailable</strong>
          <p>The previous finding remains visible. This example must not report a clean index.</p>
        </div>
        <label htmlFor="source-identity">Source identity for manual handoff</label>
        <input id="source-identity" readOnly value="notes/keeping-a-reading-journal" />
        <p className="pxo-support">Select the identity above and copy it to your editor.</p>
      </section>
    </div>
    <section className="pxo-graph-specimen" aria-labelledby="origins-heading">
      <h2 id="origins-heading">Connections and node states</h2>
      <p>Color and static pattern identify six origins. Origin colors are graphical marks; labels use readable text roles.</p>
      <OriginPatterns />
      <ul className="pxo-node-list">
        {[["node", "Default"], ["node-hub", "High loaded degree"], ["node-isolated", "No loaded links"], ["node-selected", "Selected"], ["node-hover", "Hovered"], ["node-dimmed", "Dimmed context"]].map(([token, label]) => <li key={token}>
          <span className={`pxo-node ${token === "node-selected" ? "pxo-selected-node" : ""}`} style={{ background: `var(--pxo-graph-${token})` }} aria-hidden="true" />{label}
        </li>)}
      </ul>
      <p className="pxo-graph-label">Selected identity · notes/a-garden-of-connected-ideas</p>
      <p className="pxo-support">Opaque CSS samples verify token values. The product must separately verify opacity, lighting, fog and tone mapping in its 3D renderer.</p>
    </section>
  </main>
}

const meta = { title: "Specimens/Lattice", component: LatticeSpecimens, parameters: { layout: "fullscreen" } } satisfies Meta<typeof LatticeSpecimens>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {}
