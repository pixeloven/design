import React, { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Button, Input, Label, Select } from "@pixeloven/ui"
import "./WardenWorkspace.css"

const STATES = ["todo", "plan", "review", "build", "verify", "done"] as const
const TYPES = ["task", "spike", "bug", "chore", "epic", "audit"] as const
const VIEWS = ["Active", "Needs You", "Blocked", "Recurring", "Epics"] as const
type State = typeof STATES[number]
type IssueType = typeof TYPES[number]
type View = typeof VIEWS[number]
type Scenario = "normal" | "read-failure" | "gate-refusal"
const TYPE_GATES: Record<IssueType, Partial<Record<"review" | "verify", "always" | "on_result">>> = {
  task: { review: "always", verify: "always" }, spike: { review: "always", verify: "always" },
  bug: { verify: "always" }, chore: { verify: "always" }, epic: { verify: "always" }, audit: { verify: "on_result" },
}
type Issue = {
  id: string; title: string; type: IssueType; status: State; intent: string; project: string
  parent: string; dependsOn: string[]; enteredState: string; reviews: number
  plan: string; result: string; outcome?: "clean" | "findings" | "failed"
  criteria: { text: string; done: boolean }[]; decisions: string[]; log: string[]
  previous?: string; instance?: number
}
type Draft = { title: string; type: IssueType; intent: string; project: string; parent: string; dependsOn: string }
type Outcome = { kind: "success" | "refusal" | "info"; message: string }
const EMPTY_DRAFT: Draft = { title: "", type: "task", intent: "", project: "", parent: "", dependsOn: "" }
const DRAFT_KEY = "pixeloven.warden-review.issue-draft.v1"
const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

function fixture(id: string, title: string, status: State, extra: Partial<Issue> = {}): Issue {
  return { id, title, status, type: "task", project: "Field Notes", parent: "W-21", dependsOn: [], reviews: 0,
    enteredState: "2026-10-18T09:00:00Z", intent: "Make collecting and returning to field notes feel dependable, wherever the work happens.",
    plan: "", result: "", criteria: [], decisions: [], log: [], ...extra }
}
const INITIAL_ISSUES: Issue[] = [
  fixture("W-21", "Make field notes useful anywhere", "build", { type: "epic", parent: "", intent: "A small, complete loop: capture a thought, find it again, and keep it when the connection disappears.", decisions: ["16 Oct — Keep the first release focused on text notes. Images can follow."], log: ["16 Oct — The capture, recovery, and retrieval work is grouped under this epic."] }),
  fixture("W-22", "Capture a note before the moment passes", "review", { enteredState: "2026-10-17T10:00:00Z", reviews: 1,
    intent: "Let someone write the thought they came to save before asking them to organise it.",
    plan: "Open directly into an empty note. Save text first, then offer an optional title. Keep the last draft when the editor closes.",
    criteria: [{ text: "A new note is ready to type into immediately", done: false }, { text: "Closing and reopening restores the unsaved text", done: false }],
    decisions: ["17 Oct — Keep naming optional; the first line can identify a note."], log: ["17 Oct — Plan revised after the first review. Draft recovery now belongs in the initial flow."] }),
  fixture("W-23", "Keep an unsent note after leaving the editor", "build", { type: "bug", intent: "An interruption should not erase a thought. Retain the draft until it is saved or deliberately discarded.", plan: "Store the local draft as it changes and restore it when the editor opens. Make Discard a separate action.", criteria: [{ text: "Text survives closing the editor", done: true }, { text: "Discard clears only the current draft", done: false }], log: ["18 Oct — Draft restoration is in place. Checking the discard path next."] }),
  fixture("W-24", "Find a note by the words you remember", "todo", { dependsOn: ["W-23"], intent: "Help someone recover a note without remembering its title or where they filed it.", log: ["18 Oct — Start after draft recovery is settled."] }),
  fixture("W-25", "Return keyboard focus to the right place", "verify", { type: "chore", outcome: "clean", intent: "After closing a note, the next keypress should continue where the reader left off.", result: "Focus returns to the originating note after close and Escape. Opening from search preserves the search context.", criteria: [{ text: "Escape returns focus to the originating note", done: true }, { text: "The return position survives a long scrolled list", done: false }], log: ["18 Oct — Implementation is ready for a final keyboard pass."], decisions: ["17 Oct — Preserve the originating position instead of sending focus to the page heading."] }),
  fixture("W-26", "Choose the smallest useful offline view", "plan", { type: "spike", intent: "Decide what a reader needs when the connection drops, without designing a second application.", plan: "Compare the last opened note with a small recent-notes list. Record the tradeoff before building either.", log: ["18 Oct — Comparing the two reading paths."] }),
  fixture("W-27", "Review small-screen reading", "verify", { type: "audit", parent: "", outcome: "findings", previous: "W-20", instance: 2,
    intent: "Check that a short phone visit can finish one useful task at enlarged text sizes.", result: "Reading and navigation hold up. The note action row wraps poorly with enlarged text and needs a second look.", criteria: [{ text: "All actions remain reachable at enlarged text", done: false }], log: ["18 Oct — One layout finding recorded for the next pass."] }),
  fixture("W-28", "Explain the empty notebook", "todo", { type: "chore", intent: "Give a new notebook a useful first step and a quiet explanation of what belongs here." }),
  fixture("W-20", "Review small-screen reading", "done", { type: "audit", parent: "", outcome: "clean", instance: 1, result: "The initial reading flow is usable on a small screen.", log: ["18 Sep — Baseline review completed with no findings."] }),
  fixture("W-18", "A dependable reading foundation", "done", { type: "epic", parent: "", intent: "Establish readable notes and predictable navigation before adding the capture flow.", decisions: ["12 Oct — Use one reading surface across desktop and phone."] }),
  fixture("W-19", "Keep long notes comfortable to read", "done", { type: "chore", parent: "W-18", result: "Reading measure, paragraph rhythm, and enlarged text checked.", log: ["15 Oct — Reading foundation accepted."] }),
]

function isBlocked(issue: Issue, issues: Issue[]) {
  return issue.dependsOn.some(id => issues.find(item => item.id === id)?.status !== "done")
}
function gateExplanation(issue: Issue) {
  if (issue.status !== "review" && issue.status !== "verify") return ""
  const condition = TYPE_GATES[issue.type][issue.status]
  if (!condition) return `This type has no ${titleCase(issue.status)} gate. You can still decide from this stage or use Move to.`
  if (condition === "on_result" && issue.outcome === "clean") return "The audit result is clean, so this gate is open. A human decision is optional."
  if (condition === "on_result") return "This audit needs a human decision because its result is not clean."
  return "This issue’s type requires a human decision here."
}
function inView(issues: Issue[], view: View) {
  return issues.filter(issue => view === "Active" ? issue.status !== "done" && issue.type !== "epic"
    : view === "Needs You" ? issue.status === "review" || issue.status === "verify"
    : view === "Blocked" ? isBlocked(issue, issues) && issue.status !== "done"
    : view === "Recurring" ? issue.type === "audit" : issue.type === "epic")
    .sort((a, b) => view === "Needs You" ? a.enteredState.localeCompare(b.enteredState)
      : view === "Recurring" ? (b.instance ?? 0) - (a.instance ?? 0)
      : view === "Active" ? a.status.localeCompare(b.status) : Number(a.id.slice(2)) - Number(b.id.slice(2)))
}
function readDraft(): Draft {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null")
    if (!saved || typeof saved !== "object") return { ...EMPTY_DRAFT }
    const fields = Object.fromEntries(Object.keys(EMPTY_DRAFT).map(key => [key, typeof (saved as Record<string, unknown>)[key] === "string" ? (saved as Record<string, string>)[key] : EMPTY_DRAFT[key as keyof Draft]])) as Draft
    return { ...fields, type: TYPES.includes(fields.type) ? fields.type : "task" }
  } catch { return { ...EMPTY_DRAFT } }
}

function Icon({ name }: { name: "plus" | "back" | "board" | "list" }) {
  const paths = { plus: "M8 3v10M3 8h10", back: "m9 3-5 5 5 5M4 8h9", board: "M2 3h3v10H2zM6.5 3h3v7h-3zM11 3h3v9h-3z", list: "M5 4h9M5 8h9M5 12h9M2 4h.1M2 8h.1M2 12h.1" }
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}

/** Native modal focus/inert behavior on phone; a nonmodal adjacent dialog on desktop. */
function Panel({ children, label, modal, className, onClose }: { children: ReactNode; label: string; modal: boolean; className: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (modal) node.showModal(); else node.show()
    node.querySelector<HTMLElement>("[data-panel-focus]")?.focus({ preventScroll: true })
    return () => { if (node.open) node.close() }
  }, [modal])
  return <dialog ref={dialog} aria-labelledby={label} className={className}
    onCancel={event => { event.preventDefault(); onClose() }}
    onKeyDown={event => { if (!modal && event.key === "Escape") { event.preventDefault(); onClose() } }}>{children}</dialog>
}

const VIEW_COPY: Record<View, string> = {
  Active: "Shape the work, follow its progress, and make the next decision.",
  "Needs You": "Review and verification, with the longest waiting work first.",
  Blocked: "See what needs to finish before this work can move forward.",
  Recurring: "Audit instances, newest first, with the previous result close at hand.",
  Epics: "The larger intent, with progress drawn from its child issues.",
}

export function WardenWorkspace({ mark }: { mark: ReactNode }) {
  const prefix = useId()
  const [issues, setIssues] = useState(INITIAL_ISSUES)
  const [view, setView] = useState<View>("Active")
  const [layout, setLayout] = useState<"board" | "list">("board")
  const [phoneState, setPhoneState] = useState<State>("todo")
  const [selected, setSelected] = useState<string | null>(null)
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState(readDraft)
  const [stored, setStored] = useState(true)
  const [scenario, setScenario] = useState<Scenario>("normal")
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [notice, setNotice] = useState("")
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 760px)").matches)
  const opener = useRef<HTMLElement | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const phoneViewControl = useRef<HTMLSelectElement>(null)
  const issue = issues.find(item => item.id === selected)
  const shown = inView(issues, view)
  const hasDraft = Object.entries(draft).some(([key, value]) => value !== EMPTY_DRAFT[key as keyof Draft])

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)")
    const update = () => setMobile(media.matches)
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])
  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); setStored(true) }
    catch { setStored(false) }
  }, [draft])

  function restoreFocus() {
    requestAnimationFrame(() => (opener.current?.isConnected ? opener.current : phoneViewControl.current ?? heading.current)?.focus({ preventScroll: true }))
  }
  function closeDetail() { setSelected(null); setOutcome(null); restoreFocus() }
  function chooseView(next: View) {
    setView(next); setNotice("")
    const nextIssues = inView(issues, next)
    setPhoneState(STATES.find(state => nextIssues.some(item => item.status === state)) ?? "todo")
  }
  function openIssue(id: string, source?: HTMLElement) {
    if (!selected) opener.current = source ?? document.activeElement as HTMLElement
    setSelected(id); setOutcome(null)
  }
  function closeComposer() { setComposing(false); setNotice(hasDraft ? "Draft kept. You can return to it whenever you’re ready." : ""); restoreFocus() }
  function revise(id: string, change: Partial<Issue>) { setIssues(current => current.map(item => item.id === id ? { ...item, ...change } : item)) }
  function move(to: State, decision?: "approve" | "sendBack") {
    if (!issue) return
    if (decision && scenario === "gate-refusal") {
      setOutcome({ kind: "refusal", message: "This sample issue changed before the decision completed. Nothing moved. Re-read it before deciding again." }); return
    }
    if (to === issue.status) { setOutcome({ kind: "info", message: `This issue is already in ${titleCase(to)}.` }); return }
    revise(issue.id, { status: to, enteredState: new Date().toISOString(), reviews: issue.reviews + (decision === "sendBack" ? 1 : 0) })
    setOutcome({ kind: "success", message: `${issue.id} moved from ${titleCase(issue.status)} to ${titleCase(to)}.${decision === "sendBack" ? ` Sent back ${issue.reviews + 1} times.` : ""}` })
  }
  function create(event: FormEvent) {
    event.preventDefault()
    if (!draft.title.trim()) return
    const id = `W-${Math.max(...issues.map(item => Number(item.id.slice(2)))) + 1}`
    const created = fixture(id, draft.title.trim(), "todo", { type: draft.type, intent: draft.intent.trim() || "Intent has not been written yet.", project: draft.project.trim(), parent: draft.parent, dependsOn: draft.dependsOn.split(/[,\s]+/).filter(Boolean), enteredState: new Date().toISOString() })
    setIssues(current => [...current, created]); setDraft({ ...EMPTY_DRAFT }); setComposing(false)
    setView(draft.type === "epic" ? "Epics" : "Active"); setPhoneState("todo"); setSelected(id)
    setOutcome({ kind: "success", message: `${id} created in Todo. This change exists only in the sample workspace.` })
  }
  function appendLog(event: FormEvent) {
    event.preventDefault()
    if (!issue) return
    const entry = (notes[issue.id] ?? "").trim()
    if (!entry) return
    if (/^\s*##\s/m.test(entry)) { setOutcome({ kind: "refusal", message: "Use plain text for a Log entry; a section heading would change the note’s structure." }); return }
    revise(issue.id, { log: [...issue.log, `${new Date().toISOString().slice(0, 10)} — You — ${entry}`] })
    setNotes(current => ({ ...current, [issue.id]: "" })); setOutcome({ kind: "success", message: "Your note was appended to this sample issue’s Log." })
  }

  function card(item: Issue) {
    const children = issues.filter(child => child.parent === item.id)
    const blockers = item.dependsOn.filter(id => issues.find(other => other.id === id)?.status !== "done")
    return <Button key={item.id} className="ww-issue" aria-pressed={selected === item.id} onClick={event => openIssue(item.id, event.currentTarget)}>
      <span className="ww-issue-meta"><span className="ww-code">{item.id}</span><span>{item.type}</span></span>
      <span className="ww-issue-title">{item.title}</span>
      <span className="ww-issue-context">{item.project || "No project"}</span>
      {view === "Needs You" && <span className="ww-issue-note">Since {new Date(item.enteredState).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}{item.reviews ? ` · ${item.reviews} sent back` : ""}</span>}
      {view === "Blocked" && <span className="ww-issue-note">Waiting for {blockers.map(id => `${id} · ${issues.find(other => other.id === id)?.title ?? "Issue not found"}`).join("; ")}</span>}
      {view === "Epics" && <span className="ww-issue-note">{children.length ? `${children.filter(child => child.status === "done").length} of ${children.length} child issues done` : "No child issues yet"}</span>}
      {view === "Recurring" && <span className="ww-issue-note">Instance {item.instance ?? "—"}{item.previous ? ` · follows ${item.previous}` : " · first in series"}</span>}
      {view === "Active" && isBlocked(item, issues) && <span className="ww-issue-note">Blocked · {blockers.join(", ")}</span>}
      {layout === "list" && <span className="ww-list-state">{titleCase(item.status)}</span>}
    </Button>
  }

  return <section className="ww-workspace" aria-label="Synthetic Warden workspace">
    <header className="ww-brandbar"><div className="ww-brand">{mark}<span>Warden<small>A PixelOven project</small></span></div>
      <span className="ww-workspace-name">Field Notes workspace</span>
      <Button variant="primary" onClick={event => { opener.current = event.currentTarget; setSelected(null); setOutcome(null); setComposing(true) }}><Icon name="plus" />{hasDraft ? "Resume draft" : "New issue"}</Button>
    </header>
    <div className={`ww-layout${issue ? " ww-layout--detail" : ""}`}>
      {!mobile && <nav className="ww-sidebar" aria-label="Saved views">{VIEWS.map(name => <Button key={name} aria-current={view === name ? "page" : undefined} className="ww-navitem" onClick={() => chooseView(name)}><span>{name}</span><span className="ww-count">{inView(issues, name).length}</span></Button>)}</nav>}
      <main className="ww-main" aria-label={mobile ? `${view} issues` : undefined}>
        <header className="ww-view-heading">{mobile ? <Label className="ww-phone-view">Saved view<Select ref={phoneViewControl} value={view} onChange={event => chooseView(event.target.value as View)}>{VIEWS.map(name => <option key={name} value={name}>{name} · {inView(issues, name).length}</option>)}</Select></Label> : <div><h2 ref={heading} tabIndex={-1}>{view}</h2><p>{VIEW_COPY[view]}</p></div>}
          <div className="ww-layout-switch" role="group" aria-label="View layout"><Button aria-pressed={layout === "board"} onClick={() => setLayout("board")}><Icon name="board" /><span>Board</span></Button><Button aria-pressed={layout === "list"} onClick={() => setLayout("list")}><Icon name="list" /><span>List</span></Button></div>
        </header>
        {!mobile && <div className="ww-view-context"><span>{shown.length} {shown.length === 1 ? "issue" : "issues"}</span><span>{view === "Active" ? "Open work · epics live in their own view" : view === "Needs You" ? "Your next decision" : view === "Epics" ? "Includes completed epics" : view === "Recurring" ? "Audit issues · newest instance first" : "Dependencies determine what is blocked"}</span></div>}
        {mobile && layout === "board" && <Label className="ww-phone-stage">Stage<Select value={phoneState} onChange={event => setPhoneState(event.target.value as State)}>{STATES.map(state => <option key={state} value={state}>{titleCase(state)} · {shown.filter(item => item.status === state).length}</option>)}</Select></Label>}
        {notice && <p className="ww-notice" role="status">{notice}</p>}
        {scenario === "read-failure" && <div className="ww-read-error" role="alert"><div><strong>The board couldn’t refresh.</strong><p>Your last view and draft are still here. Try reading the board again.</p></div><Button onClick={() => { setScenario("normal"); setNotice("The sample board refreshed. Your work is unchanged.") }}>Retry read</Button></div>}
        {shown.length === 0 ? <div className="ww-empty"><h3>{view === "Needs You" ? "No decisions waiting." : view === "Blocked" ? "Nothing is blocked." : "No issues in this view."}</h3><p>{view === "Needs You" ? "You’re clear to return to the work in progress." : "Choose another saved view to see the rest of the work."}</p><Button onClick={() => chooseView("Active")}>Go to Active</Button></div>
          : layout === "list" ? <ul className="ww-list" aria-label={`${view} issues`}>{shown.map(item => <li key={item.id}>{card(item)}</li>)}</ul>
          : <div className="ww-board" role="region" aria-label={mobile ? `${view} board, ${titleCase(phoneState)} stage` : `${view} board, six workflow stages`} tabIndex={0}>{(mobile ? [phoneState] : STATES).map(state => <section className="ww-column" key={state} aria-label={titleCase(state)}>{!mobile && <><header><h3><span className="ww-stage-mark" data-state={state} aria-hidden="true" />{titleCase(state)}</h3><span className="ww-count">{shown.filter(item => item.status === state).length}</span></header><p className="ww-column-owner">{state === "review" || state === "verify" ? "Your decision" : state === "done" ? "Completed work" : state === "todo" ? "Ready to shape" : "Work in progress"}</p></>}<div className="ww-column-issues">{shown.filter(item => item.status === state).map(card)}{mobile && !shown.some(item => item.status === state) && <p className="ww-stage-empty">No issues in {titleCase(state)} in this view. Choose another stage to continue.</p>}</div></section>)}</div>}
      </main>
      {issue && <Panel key={issue.id} label={`${prefix}-issue-title`} modal={mobile} className="ww-detail" onClose={closeDetail}>
        <header className="ww-panel-header"><Button onClick={closeDetail}><Icon name="back" />Back to {view}</Button><span className="ww-code">{issue.id}</span></header>
        <div className="ww-detail-scroll"><div className="ww-detail-intro"><p className="ww-context">{issue.project || "No project"} · {titleCase(issue.type)}</p><h2 id={`${prefix}-issue-title`} tabIndex={-1} data-panel-focus>{issue.title}</h2><Label className="ww-move">Move to<Select value={issue.status} onChange={event => move(event.target.value as State)}>{STATES.map(state => <option key={state} value={state}>{titleCase(state)}</option>)}</Select></Label>{gateExplanation(issue) && <p className="ww-gate-context">{gateExplanation(issue)}</p>}</div>
          {outcome && <div className={`ww-outcome ww-outcome--${outcome.kind}`} role="status"><p>{outcome.message}</p>{outcome.kind === "refusal" && scenario === "gate-refusal" && <Button onClick={() => { setScenario("normal"); setOutcome({ kind: "info", message: `Re-read complete. ${issue.id} is still in ${titleCase(issue.status)}. No decision has been repeated.` }) }}>Re-read issue</Button>}</div>}
          <section className="ww-section"><h3>Intent</h3><p>{issue.intent}</p></section>
          {issue.parent && <p className="ww-parent">Part of <Button onClick={() => openIssue(issue.parent)}>{issues.find(item => item.id === issue.parent)?.title ?? issue.parent}</Button></p>}
          {(issue.status === "verify" || issue.status === "done") && issue.result && <section className="ww-section"><h3>Result{issue.outcome && <span className="ww-result">{titleCase(issue.outcome)}</span>}</h3><p>{issue.result}</p></section>}
          {issue.plan && <section className="ww-section"><h3>Plan</h3><p>{issue.plan}</p></section>}
          {issue.criteria.length > 0 && <section className="ww-section"><h3>Done when<span className="ww-secondary">{issue.criteria.filter(item => item.done).length}/{issue.criteria.length}</span></h3><div className="ww-checklist">{issue.criteria.map((item, index) => <Label key={item.text}><Input type="checkbox" checked={item.done} onChange={() => revise(issue.id, { criteria: issue.criteria.map((criterion, number) => number === index ? { ...criterion, done: !criterion.done } : criterion) })} /><span>{item.text}</span></Label>)}</div></section>}
          {issue.type === "epic" && <section className="ww-section"><h3>Child issues</h3>{issues.filter(item => item.parent === issue.id).length ? <div className="ww-related">{issues.filter(item => item.parent === issue.id).map(child => <Button key={child.id} onClick={() => openIssue(child.id)}><span>{child.title}</span><span>{titleCase(child.status)}</span></Button>)}</div> : <p>No child issues yet. Choose this epic as the parent when creating an issue.</p>}</section>}
          {issue.dependsOn.length > 0 && <section className="ww-section"><h3>Depends on</h3><div className="ww-related">{issue.dependsOn.map(id => { const dependency = issues.find(item => item.id === id); return <Button key={id} disabled={!dependency} onClick={() => openIssue(id)}><span>{dependency?.title ?? id}</span><span>{dependency ? titleCase(dependency.status) : "Not found"}</span></Button> })}</div></section>}
          {issue.previous && <section className="ww-section"><h3>Previous instance</h3><Button onClick={() => openIssue(issue.previous!)}>{issue.previous} · {titleCase(issues.find(item => item.id === issue.previous)?.outcome ?? "no result")}</Button></section>}
          <details className="ww-record"><summary>Decisions &amp; Log</summary><section className="ww-section"><h3>Decisions</h3>{issue.decisions.length ? issue.decisions.map(line => <p key={line}>{line}</p>) : <p>No decisions recorded in this note.</p>}</section><section className="ww-section"><h3>Log</h3>{issue.log.length ? <ol className="ww-log">{issue.log.map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}</ol> : <p>No Log entries yet.</p>}<form className="ww-log-form" onSubmit={appendLog}><Label htmlFor={`${prefix}-log`}>Add the reason for your decision</Label><textarea id={`${prefix}-log`} rows={3} value={notes[issue.id] ?? ""} onChange={event => setNotes(current => ({ ...current, [issue.id]: event.target.value }))} /><Button type="submit" disabled={!(notes[issue.id] ?? "").trim()}>Append to Log</Button></form></section></details>
          <details className="ww-record"><summary>Issue details</summary><dl className="ww-metadata"><div><dt>Issue</dt><dd>{issue.id}</dd></div><div><dt>State</dt><dd>{issue.status}</dd></div><div><dt>Sent back</dt><dd>{issue.reviews} times</dd></div><div><dt>Gate policy</dt><dd>{issue.type === "task" || issue.type === "spike" ? "Review and verify: always" : issue.type === "audit" ? "Verify: on result · monthly cadence" : "Verify: always"}</dd></div><div><dt>Entered state</dt><dd>{new Date(issue.enteredState).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC</dd></div></dl></details>
        </div>
        {(issue.status === "review" || issue.status === "verify") && <footer className="ww-decision"><div><strong>{issue.status === "review" ? "Ready to build?" : "Ready to call this done?"}</strong><p>{issue.status === "review" ? "Approve moves this issue to Build. Send back returns it to Plan." : "Approve moves this issue to Done. Send back returns it to Build."}</p></div><div className="ww-decision-buttons"><Button onClick={() => move(issue.status === "review" ? "plan" : "build", "sendBack")}>Send back</Button><Button variant="primary" onClick={() => move(issue.status === "review" ? "build" : "done", "approve")}>Approve to {issue.status === "review" ? "Build" : "Done"}</Button></div></footer>}
      </Panel>}
    </div>
    <footer className="ww-demo"><p><strong>Synthetic workspace.</strong> No API connection or real writes. Sample changes reset on reload.</p><Label>Demo state<Select value={scenario} onChange={event => { setScenario(event.target.value as Scenario); setOutcome(null) }}><option value="normal">Working normally</option><option value="read-failure">Board read fails</option><option value="gate-refusal">Next gate action is refused</option></Select></Label>{scenario === "gate-refusal" && <p>Open a Review or Verify issue and try a decision. Re-reading will clear the simulated refusal.</p>}</footer>
    {composing && <Panel label={`${prefix}-composer-title`} modal className="ww-composer" onClose={closeComposer}>
      <header className="ww-panel-header"><Button onClick={closeComposer}><Icon name="back" />Back to work</Button><span className="ww-secondary">Draft retained on close</span></header>
      <form onSubmit={create} className="ww-compose-form"><div><h2 id={`${prefix}-composer-title`}>New issue</h2><p className="ww-secondary">Start with the work that needs to happen.</p></div>
        <Label htmlFor={`${prefix}-title`}>Title<Input data-panel-focus id={`${prefix}-title`} required value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} placeholder="What needs to happen?" /></Label>
        <Label htmlFor={`${prefix}-intent`}>Intent<textarea id={`${prefix}-intent`} rows={4} value={draft.intent} onChange={event => setDraft(current => ({ ...current, intent: event.target.value }))} placeholder="Why does this matter, and what would a useful result be?" /></Label>
        <div className="ww-form-pair"><Label>Type<Select value={draft.type} onChange={event => setDraft(current => ({ ...current, type: event.target.value as IssueType }))}>{TYPES.map(type => <option key={type} value={type}>{titleCase(type)}</option>)}</Select></Label><Label>Project (optional)<Input value={draft.project} onChange={event => setDraft(current => ({ ...current, project: event.target.value }))} placeholder="e.g. Field Notes" /></Label></div>
        <Label>Parent issue (optional)<Select value={draft.parent} onChange={event => setDraft(current => ({ ...current, parent: event.target.value }))}><option value="">No parent</option>{issues.map(item => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}</Select></Label>
        <Label htmlFor={`${prefix}-dependencies`}>Depends on (optional)<Input id={`${prefix}-dependencies`} aria-describedby={`${prefix}-dependencies-hint`} value={draft.dependsOn} onChange={event => setDraft(current => ({ ...current, dependsOn: event.target.value }))} placeholder="W-23, W-24" list={`${prefix}-issue-ids`} /></Label><p id={`${prefix}-dependencies-hint`} className="ww-field-hint">Issue IDs, separated by commas. Unresolved dependencies keep the issue blocked.</p><datalist id={`${prefix}-issue-ids`}>{issues.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</datalist>
        <p className="ww-draft-status" role="status">{!hasDraft && "No draft saved. "}{stored ? "Your draft stays in this tab, including after a reload." : "Browser storage is unavailable. Your draft stays while this page is open."} New issues start in Todo.</p>
        <footer className="ww-compose-actions"><Button disabled={!hasDraft} onClick={event => { const field = event.currentTarget.closest("dialog")?.querySelector<HTMLElement>("[data-panel-focus]"); setDraft({ ...EMPTY_DRAFT }); setNotice("Draft discarded."); requestAnimationFrame(() => field?.focus({ preventScroll: true })) }}>Discard draft</Button><Button type="submit" variant="primary" disabled={!draft.title.trim()}>Create issue</Button></footer>
      </form>
    </Panel>}
  </section>
}
