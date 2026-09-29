import React, { useEffect, useId, useState, type CSSProperties } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  accentNames, appearances, normalizeThemeSettings, resolveTheme, themeNames,
  type Scheme, type ThemeSettings,
} from "@pixeloven/tokens/themes"
import "./Themes.css"

const STORAGE_KEY = "pixeloven.design.theme-specimen.v1"
const NOTES = [
  { id: "foundations", title: "Design foundations", summary: "Principles for a coherent family of tools.", links: ["accessibility", "components"] },
  { id: "accessibility", title: "Accessible interfaces", summary: "Readable text, reachable controls and clear paths through a task.", links: ["foundations", "components"] },
  { id: "components", title: "Component library", summary: "Shared controls carry consistent behavior across products.", links: ["foundations", "accessibility"] },
] as const

function readPreferences(): ThemeSettings {
  try { return normalizeThemeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")) }
  catch { return normalizeThemeSettings(null) }
}

function useSystemScheme(): Scheme {
  const [scheme, setScheme] = useState<Scheme>(() => matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: light)")
    const update = () => setScheme(media.matches ? "light" : "dark")
    media.addEventListener("change", update)
    update()
    return () => media.removeEventListener("change", update)
  }, [])
  return scheme
}

const cssVariables = (tokens: ReturnType<typeof resolveTheme>["tokens"]): CSSProperties =>
  Object.fromEntries(Object.entries(tokens).flatMap(([name, value]) => {
    const key = `--pxo-${name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`
    return /^#[0-9a-f]{6}$/i.test(value)
      ? [[key, value], [`${key}-rgb`, [1, 3, 5].map(index => parseInt(value.slice(index, index + 2), 16)).join(" ")]]
      : [[key, value]]
  })) as CSSProperties

export function ThemeSpecimens() {
  const id = useId()
  const [settings, setSettings] = useState(readPreferences)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState("foundations")
  const [history, setHistory] = useState<string[]>([])
  const [healthOpen, setHealthOpen] = useState(false)
  const [taskStatus, setTaskStatus] = useState("ready")
  const resolved = resolveTheme(settings, useSystemScheme())
  const note = NOTES.find(item => item.id === selected) ?? NOTES[0]
  const matches = NOTES.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))

  function changePreference(key: keyof ThemeSettings, value: string) {
    const next = normalizeThemeSettings({ ...settings, [key]: value })
    setSettings(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageAvailable(true) }
    catch { setStorageAvailable(false) }
  }
  function openNote(next: string) {
    setHistory(previous => [...previous, selected])
    setSelected(next)
  }

  return <main className="theme-studio" style={{ ...cssVariables(resolved.tokens), colorScheme: resolved.scheme }} data-scheme={resolved.scheme}>
    <header className="theme-intro">
      <h1>One family. Room for preference.</h1>
      <p>Cool and Warm set the atmosphere. Acid and Violet mark actions. Try the same controls in Lattice and Warden.</p>
    </header>
    <div className="theme-settings" aria-label="Appearance preferences">
      <label>Theme<select value={settings.theme} onChange={event => changePreference("theme", event.target.value)}>{themeNames.map(value => <option key={value} value={value}>{value === "cool" ? "Cool" : "Warm"}</option>)}</select></label>
      <label>Accent<select value={settings.accent} onChange={event => changePreference("accent", event.target.value)}>{accentNames.map(value => <option key={value} value={value}>{value === "acid" ? "Acid" : "Electric Violet"}</option>)}</select></label>
      <label>Appearance<select value={settings.appearance} onChange={event => changePreference("appearance", event.target.value)}>{appearances.map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
      <p className="theme-support" role="status">{settings.appearance === "system" ? `Following your system: ${resolved.scheme}.` : `Using ${resolved.scheme} appearance.`}{!storageAvailable && " Preferences apply for this visit; browser storage is unavailable."}</p>
    </div>

    <section className="theme-controls" aria-labelledby={`${id}-controls`}>
      <div><h2 id={`${id}-controls`}>Shared controls</h2><p className="theme-support">Native controls, consistent states and visible keyboard focus.</p></div>
      <div className="theme-control-row">
        <button className="theme-primary" onClick={() => { setQuery(""); setSelected("foundations"); setHistory([]) }}>Reset exploration</button>
        <button onClick={() => setHealthOpen(open => !open)} aria-expanded={healthOpen} aria-controls={`${id}-health`}>Knowledge health</button>
        <button disabled>Reindexing unavailable</button>
        <a href={`#${id}-warden`}>Jump to Warden</a>
      </div>
    </section>

    <section className="theme-product" aria-labelledby={`${id}-lattice`}>
      <header className="theme-product-heading"><div><h2 id={`${id}-lattice`}>Lattice</h2><p className="theme-support">Explore connected knowledge</p></div><span className="theme-support">3 sample notes</span></header>
      <div className="theme-health" id={`${id}-health`} hidden={!healthOpen}>
        <strong>One unresolved reference</strong><p>“Old mobile checklist” is missing from this sample. Inspect the source before changing a link.</p>
        <button onClick={() => setHealthOpen(false)}>Minimize health</button>
      </div>
      <div className="theme-workspace">
        <div className="theme-results"><label htmlFor={`${id}-search`}>Find a note</label><input id={`${id}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search sample notes" />
          <div aria-live="polite" className="theme-support">{matches.length} matching {matches.length === 1 ? "note" : "notes"}</div>
          <ul>{matches.map(item => <li key={item.id}><button aria-pressed={selected === item.id} onClick={() => openNote(item.id)}>{item.title}</button></li>)}</ul>
          {matches.length === 0 && <p>No notes match. <button onClick={() => setQuery("")}>Clear search</button></p>}
        </div>
        <div className="theme-note" aria-live="polite"><h3>{note.title}</h3><p>{note.summary}</p><h4>Connected notes</h4><ul>{note.links.map(link => <li key={link}><button onClick={() => openNote(link)}>{NOTES.find(item => item.id === link)?.title}</button></li>)}</ul><button disabled={history.length === 0} onClick={() => { setSelected(history.at(-1) ?? "foundations"); setHistory(previous => previous.slice(0, -1)) }}>Previous note</button></div>
      </div>
    </section>

    <section className="theme-product" aria-labelledby={`${id}-warden`}>
      <header className="theme-product-heading"><div><h2 id={`${id}-warden`}>Warden</h2><p className="theme-support">Move a task forward</p></div><span className="theme-support">Epic: Brand foundations</span></header>
      <div className="theme-task"><div><h3>Prepare application icons</h3><p>Export the approved Inset marks for browser tabs and app launchers.</p><p className="theme-support">Design team · Sample issue</p></div><div className="theme-task-actions"><label htmlFor={`${id}-status`}>Status</label><select id={`${id}-status`} value={taskStatus} onChange={event => setTaskStatus(event.target.value)}><option value="ready">Ready</option><option value="in-progress">In progress</option><option value="done">Done</option></select><button className="theme-primary" disabled={taskStatus === "done"} onClick={() => setTaskStatus(taskStatus === "ready" ? "in-progress" : "done")}>{taskStatus === "ready" ? "Start task" : taskStatus === "in-progress" ? "Complete task" : "Task completed"}</button></div></div>
      <p className="theme-task-state" role="status">{taskStatus === "done" ? "Complete: icon exports are ready for review in this sample." : taskStatus === "in-progress" ? "In progress: the design team is preparing the exports." : "Ready: this task can be started."}</p>
    </section>
    <footer className="theme-footer">Interactive sample data. Appearance preferences are saved only in this browser; these examples do not change a vault or project.</footer>
  </main>
}

const meta = { title: "Specimens/Brand themes", component: ThemeSpecimens, parameters: { layout: "fullscreen" } } satisfies Meta<typeof ThemeSpecimens>
export default meta
type Story = StoryObj<typeof meta>
export const SharedWorkflows: Story = {}
