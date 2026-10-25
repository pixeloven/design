import React, { useEffect, useRef, useState, type CSSProperties } from "react"
import { Button, Label, Select } from "@pixeloven/ui"
import { normalizeThemeSettings, resolveTheme, type Scheme, type ThemeSettings } from "@pixeloven/tokens/themes"
import pixeloven from "../../../packages/brand/sources/solid/pixeloven.svg?raw"
import lattice from "../../../packages/brand/sources/solid/lattice.svg?raw"
import pixelovenInset from "../../../packages/brand/sources/inset/pixeloven.svg?raw"
import latticeInset from "../../../packages/brand/sources/inset/lattice.svg?raw"
import waymark from "../../../docs/studies/warden-identity/waymark/solid.svg?raw"
import waymarkInset from "../../../docs/studies/warden-identity/waymark/inset.svg?raw"
import threshold from "../../../docs/studies/warden-identity/threshold/solid.svg?raw"
import thresholdInset from "../../../docs/studies/warden-identity/threshold/inset.svg?raw"
import branch from "../../../docs/studies/warden-identity/branch/solid.svg?raw"
import branchInset from "../../../docs/studies/warden-identity/branch/inset.svg?raw"
import { WardenWorkspace } from "./WardenWorkspace"
import "@pixeloven/tokens/themes.css"
import "@pixeloven/ui/styles.css"
import "./WardenReview.css"

const CONCEPTS = [
  { id: "waymark", name: "Waymark", solid: waymark, inset: waymarkInset,
    idea: "Two channels meet in a decisive W. Work has a direction, with room for human judgment along the way.",
    tradeoff: "Our recommendation: the clearest connection to Warden’s name. At favicon size it reads first as a compact emblem; the name helps establish the W. Keep the top open so the lower points do not become a shield." },
  { id: "threshold", name: "Threshold", solid: threshold, inset: thresholdInset,
    idea: "A passage framed by two solid posts. The human gate becomes a place to move work through.",
    tradeoff: "A distinctive abstract option, though it can read as brackets or a link. The gate metaphor describes only part of Warden’s work: capture, investigation and refinement matter too." },
  { id: "branch", name: "Branch", solid: branch, inset: branchInset,
    idea: "Separate paths converge into a shared direction. A compact figure for coordinating work.",
    tradeoff: "The most immediate sense of direction, but the arrow reads as upload or launch before coordinated work. It is the least distinctive product identity of the three." },
] as const

export type Concept = typeof CONCEPTS[number]["id"]
type Page = "workspace" | "identity"

function initialSettings(): ThemeSettings {
  try { return normalizeThemeSettings(JSON.parse(localStorage.getItem("pixeloven.warden-review.appearance") ?? '{"appearance":"dark"}')) }
  catch { return normalizeThemeSettings({ appearance: "dark" }) }
}

function variables(tokens: ReturnType<typeof resolveTheme>["tokens"]): CSSProperties {
  return Object.fromEntries(Object.entries(tokens).flatMap(([name, value]) => {
    const key = `--pxo-${name.replace(/[A-Z]/g, part => `-${part.toLowerCase()}`)}`
    return /^#[0-9a-f]{6}$/i.test(value)
      ? [[key, value], [`${key}-rgb`, [1, 3, 5].map(index => Number.parseInt(value.slice(index, index + 2), 16)).join(" ")]]
      : [[key, value]]
  })) as CSSProperties
}

// SVG strings are checked-in artwork, never note content or user input.
export function ReviewMark({ svg, size = 32 }: { svg: string; size?: number }) {
  return <span className="wr-mark" aria-hidden="true" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />
}

export function WardenReview({ initialPage = "workspace", initialConcept = "waymark" }: { initialPage?: Page; initialConcept?: Concept }) {
  const [page, setPage] = useState<Page>(initialPage)
  const [concept, setConcept] = useState<Concept>(initialConcept)
  const [settings, setSettings] = useState(initialSettings)
  const [saved, setSaved] = useState(true)
  const workspace = useRef<HTMLDivElement>(null)
  const comparison = useRef<HTMLElement>(null)
  const [system, setSystem] = useState<Scheme>(() => matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: light)")
    const change = () => setSystem(media.matches ? "light" : "dark")
    media.addEventListener("change", change)
    return () => media.removeEventListener("change", change)
  }, [])
  const resolved = resolveTheme(settings, system)
  const selected = CONCEPTS.find(item => item.id === concept) ?? CONCEPTS[0]
  function preference(key: keyof ThemeSettings, value: string) {
    const next = normalizeThemeSettings({ ...settings, [key]: value })
    setSettings(next)
    try { localStorage.setItem("pixeloven.warden-review.appearance", JSON.stringify(next)); setSaved(true) }
    catch { setSaved(false) }
  }
  return <div className="warden-review" style={{ ...variables(resolved.tokens), colorScheme: resolved.scheme }}>
    <header className="wr-reviewbar">
      <div><h1>Warden design review</h1><p>Interactive proposal · sample work only</p></div>
      <nav aria-label="Design review"><Button aria-pressed={page === "workspace"} onClick={() => setPage("workspace")}>Workspace</Button><Button aria-pressed={page === "identity"} onClick={() => setPage("identity")}>Identity study</Button></nav>
      <details className="wr-appearance"><summary>Appearance</summary><div>
        <Label>Theme<Select value={settings.theme} onChange={event => preference("theme", event.target.value)}><option value="cool">Cool</option><option value="warm">Warm</option></Select></Label>
        <Label>Accent<Select value={settings.accent} onChange={event => preference("accent", event.target.value)}><option value="acid">Acid</option><option value="violet">Electric Violet</option></Select></Label>
        <Label>Appearance<Select value={settings.appearance} onChange={event => preference("appearance", event.target.value)}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></Select></Label>
        <p role="status">{saved ? "Appearance stays in this browser." : "Appearance applies for this visit; browser storage is unavailable."}</p>
      </div></details>
    </header>
    <div hidden={page !== "workspace"} ref={workspace} tabIndex={-1} aria-label="Warden workspace proposal">
      <WardenWorkspace mark={<ReviewMark svg={selected.solid} />} />
      <details className="wr-walkthrough">
        <summary>Review scope and walkthrough</summary>
        <div>
          <h2>Develop clearer work through issues</h2>
          <ol>
            <li>Choose <strong>New issue</strong> and select Epic, Story, Task, Bug or Spike. The optional fields adapt to the type; a title is enough. <strong>New Epic</strong> opens the same composer with Epic selected.</li>
            <li>Use a Spike to explore a design or implementation question. Record its findings in Result and comments, then refine existing requirements or create a linked follow-up. Keep the investigation available.</li>
            <li>Create an Epic when a shared outcome is useful. Refine its outcome and finish line as you learn. Organize related work, change planning order or transfer issues between Epics.</li>
            <li>Open <strong>Needs attention</strong>. Identify what is being asked, read the plan or result, and approve it or request changes. Add a comment, then return to the originating workspace.</li>
            <li>Find completed work and reopen it. Finish or transfer remaining children, then explicitly accept the Epic outcome against its finish line.</li>
            <li>Use the demo scenarios to check a refused action or incomplete read. Confirm that drafts and decision reasons survive recovery.</li>
          </ol>
          <h3>What this proposal demonstrates</h3>
          <p>This is a local interaction study with synthetic issues. Epics, Stories, Tasks, Bugs and Spikes are types of the same work record. The study does not connect to Warden, generate plans with AI, dispatch agents or change a vault. Responsibility identifies accountability, not current execution.</p>
          <p>The production MVP now implements shared UI/MCP authoring, refinement, durable relationships and order, and explicit Epic acceptance. Its owned-vault journey passed ingestion and restart validation in <a href="https://github.com/pixeloven/warden/pull/80">Warden #80</a>. This local study still uses sample work; it does not certify a customer deployment.</p>
          <p>Approval, Request changes (the existing Send back operation) and direct Move have distinct consequences. Creating work in Todo does not approve a plan or start execution. Warden’s mark remains a separate identity decision.</p>
        </div>
      </details>
    </div>
    {page === "identity" && <main className="wr-identity">
      <div className="wr-identity-intro"><h2>Choose Warden’s mark.</h2><p>We recommend Waymark: a recognizable W with the angular geometry of the PixelOven family. Compare all three proposals below, then try a figure in the workspace. Previewing a mark does not approve it.</p></div>
      <div className="wr-family" aria-label="Approved family alongside the selected Warden concept">
        <div><ReviewMark svg={pixeloven} size={56} /><span>PixelOven</span><small>Approved parent</small></div>
        <div><ReviewMark svg={lattice} size={56} /><span>Lattice</span><small>Approved product</small></div>
        <div><ReviewMark svg={selected.solid} size={56} /><span>Warden</span><small>{selected.name} · proposed</small></div>
      </div>
      <section className="wr-placement" ref={comparison} tabIndex={-1} aria-labelledby="placement-title">
        <h3 id="placement-title">{selected.name} in use</h3>
        <div className="wr-placement-grid">
          <div><p className="wr-secondary">Header · Solid at 32px</p><div className="wr-header-specimen"><ReviewMark svg={selected.solid} /><div><strong>Warden</strong><small>A PixelOven project</small></div></div></div>
          <div><p className="wr-secondary">Browser tab · Inset at 16px</p><div className="wr-tab-specimen"><ReviewMark svg={selected.inset} size={16} /><span>Warden · All issues</span></div></div>
          <div><p className="wr-secondary">App icon · Inset at 64px</p><div className="wr-app-specimen"><ReviewMark svg={selected.inset} size={64} /><span>Warden</span></div></div>
        </div>
        <details className="wr-family-sizes"><summary>Compare the family at minimum sizes</summary><div className="wr-family-size-grid">
          {[{ name: "PixelOven", solid: pixeloven, inset: pixelovenInset }, { name: "Lattice", solid: lattice, inset: latticeInset }, { name: `Warden · ${selected.name}`, solid: selected.solid, inset: selected.inset }].map(item => <div key={item.name}><strong>{item.name}</strong><span><ReviewMark svg={item.solid} size={24} />Solid · 24px</span><span><ReviewMark svg={item.inset} size={16} />Inset · 16px</span></div>)}
        </div></details>
        <p className="wr-secondary">Placement previews use the original study geometry. Production lockups, favicon files and platform icon padding follow selection.</p>
      </section>
      {CONCEPTS.map(item => <section className="wr-concept" key={item.id} aria-labelledby={`concept-${item.id}`}>
        <div className="wr-concept-drawing"><div><ReviewMark svg={item.solid} size={96} /><span>Solid</span></div><div><ReviewMark svg={item.inset} size={96} /><span>Inset</span></div></div>
        <div className="wr-concept-copy"><h3 id={`concept-${item.id}`}>{item.name}</h3><p>{item.idea}</p><p className="wr-secondary">{item.tradeoff}</p>
          <div className="wr-size-specimens" aria-label={`${item.name} at 16, 24 and 32 pixels`}>{[16, 24, 32].map(size => <div key={size}><ReviewMark svg={item.solid} size={size} /><ReviewMark svg={item.inset} size={size} /><span>{size}px</span></div>)}</div>
          <p className="wr-secondary">Solid at 16px is a stress check. Family minimums: Solid 24px, Inset 16px.</p>
          <div className="wr-concept-actions"><Button aria-pressed={concept === item.id} onClick={() => { setConcept(item.id); requestAnimationFrame(() => { comparison.current?.focus({ preventScroll: true }); comparison.current?.scrollIntoView({ block: "start" }); }) }}>{concept === item.id ? `${item.name} in preview` : `Preview ${item.name}`}</Button><Button onClick={() => { setConcept(item.id); setPage("workspace"); requestAnimationFrame(() => { workspace.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }) }}>Try in workspace</Button></div>
        </div>
      </section>)}
      <p className="wr-study-note">Waymark is the recommended starting point. Preview selection does not approve or publish a mark. The approved PixelOven and Lattice artwork is unchanged.</p>
    </main>}
  </div>
}
