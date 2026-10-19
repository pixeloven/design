import React, { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Button, Input, Label, Select } from "@pixeloven/ui"
import { STAGES, attentionReasons, blockers, label, ordered, type Demo, type ProjectDraft, type Stage, type Task, type TaskDraft } from "./WardenWorkspace.model"

export type Outcome = { kind: "success" | "refusal" | "info"; message: string }
export function Icon({ name }: { name: "plus" | "back" | "board" | "list" }) {
  const paths = { plus: "M8 3v10M3 8h10", back: "m9 3-5 5 5 5M4 8h9", board: "M2 3h3v10H2zM6.5 3h3v7h-3zM11 3h3v9h-3z", list: "M5 4h9M5 8h9M5 12h9M2 4h.1M2 8h.1M2 12h.1" }
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}
/** Native modal focus and inert background on phone; adjacent nonmodal reading on desktop. */
export function Panel({ children, label: heading, modal, className, onClose }: { children: ReactNode; label: string; modal: boolean; className: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (modal) node.showModal(); else node.show()
    node.querySelector<HTMLElement>("[data-panel-focus]")?.focus({ preventScroll: true })
    return () => { if (node.open) node.close() }
  }, [modal])
  return <dialog ref={dialog} aria-labelledby={heading} className={className}
    onCancel={event => { event.preventDefault(); onClose() }}
    onKeyDown={event => { if (!modal && event.key === "Escape") { event.preventDefault(); onClose() } }}>{children}</dialog>
}
export function Feedback({ outcome, onRead }: { outcome: Outcome | null; onRead?: () => void }) {
  const feedback = useRef<HTMLDivElement>(null)
  useEffect(() => { if (outcome) feedback.current?.scrollIntoView({ block: "nearest" }) }, [outcome])
  if (!outcome) return null
  return <div ref={feedback} className={`ww-outcome ww-outcome--${outcome.kind}`} role={outcome.kind === "refusal" ? "alert" : "status"}>
    <p>{outcome.message}</p>{outcome.kind === "refusal" && onRead && <Button onClick={onRead}>Re-read task</Button>}
  </div>
}
function TaskFields({ prefix, draft, onChange }: { prefix: string; draft: TaskDraft; onChange: (draft: TaskDraft) => void }) {
  function field(key: keyof TaskDraft, value: string) { onChange({ ...draft, [key]: value }) }
  return <>
    <Label htmlFor={`${prefix}-intent`}>Intent<textarea id={`${prefix}-intent`} rows={4} value={draft.intent} onChange={event => field("intent", event.target.value)} placeholder="Why does this work matter?" /></Label>
    <Label htmlFor={`${prefix}-criteria`}>Done when<textarea id={`${prefix}-criteria`} rows={3} value={draft.criteria} onChange={event => field("criteria", event.target.value)} placeholder="One completion condition per line" /></Label>
    <Label htmlFor={`${prefix}-responsibility`}>Responsible for this work<Input id={`${prefix}-responsibility`} value={draft.responsibility} onChange={event => field("responsibility", event.target.value)} placeholder="Person, agent, or accountable role" /></Label>
    <Label htmlFor={`${prefix}-next`}>Required next actor<Input id={`${prefix}-next`} value={draft.nextActor} onChange={event => field("nextActor", event.target.value)} placeholder="Who is needed next, and for what?" /></Label>
    <Label htmlFor={`${prefix}-dependencies`}>Depends on<Input id={`${prefix}-dependencies`} value={draft.dependsOn} onChange={event => field("dependsOn", event.target.value)} placeholder="W-101, W-102" aria-describedby={`${prefix}-dependency-help`} /></Label>
    <p className="ww-hint" id={`${prefix}-dependency-help`}>Task IDs separated by commas. An unavailable reference stays visible as a blocker.</p>
  </>
}
export function TaskComposer({ prefix, demo, draft, onChange, onClose, onCreate, onDiscard, stored, error }: {
  prefix: string; demo: Demo; draft: TaskDraft; onChange: (draft: TaskDraft) => void; onClose: () => void
  onCreate: (event: FormEvent) => void; onDiscard: () => void; stored: boolean; error: string
}) {
  return <Panel label={`${prefix}-compose-heading`} modal className="ww-composer" onClose={onClose}>
    <header className="ww-panel-header"><Button onClick={onClose}><Icon name="back" />Back to work</Button><span>Draft kept on close</span></header>
    <form className="ww-compose-form" onSubmit={onCreate}>
      <div><h2 id={`${prefix}-compose-heading`}>Add a task</h2><p className="ww-secondary">Start with a title. Shape the details when you’re ready.</p></div>
      <Label htmlFor={`${prefix}-new-title`}>Title<Input data-panel-focus id={`${prefix}-new-title`} required value={draft.title} onChange={event => onChange({ ...draft, title: event.target.value })} placeholder="What needs to happen?" /></Label>
      <Label>Project<Select value={draft.projectId} onChange={event => onChange({ ...draft, projectId: event.target.value })}>
        <option value="">Standalone task</option>{demo.projects.map(project => <option key={project.id} value={project.id} disabled={project.completed}>{project.title}{project.completed ? " · completed" : ""}</option>)}
      </Select></Label>
      <p className="ww-hint">Starts in Todo, at the end of this project’s planning order. Reopen a completed project before adding work.</p>
      <details className="ww-form-details"><summary>Add intent and details</summary><div className="ww-fields"><TaskFields prefix={`${prefix}-new`} draft={draft} onChange={onChange} /></div></details>
      {error && <p className="ww-form-error" role="alert">{error}</p>}
      <p className="ww-hint">{stored ? "Draft and workspace stay in this tab through reloads, until Reset demo or the tab’s session ends." : "Storage is unavailable. Keep this page open to retain the draft and workspace."}</p>
      <footer className="ww-compose-actions"><Button onClick={onDiscard}>Discard draft</Button><Button type="submit" variant="primary" disabled={!draft.title.trim()}>Create task</Button></footer>
    </form>
  </Panel>
}
export function ProjectComposer({ prefix, editing, draft, onChange, onClose, onSave, onDiscard }: {
  prefix: string; editing: boolean; draft: ProjectDraft; onChange: (draft: ProjectDraft) => void; onClose: () => void; onSave: (event: FormEvent) => void; onDiscard: () => void
}) {
  return <Panel label={`${prefix}-project-heading`} modal className="ww-composer" onClose={onClose}>
    <header className="ww-panel-header"><Button onClick={onClose}><Icon name="back" />Back to work</Button><span>Draft kept on close</span></header>
    <form className="ww-compose-form" onSubmit={onSave}>
      <h2 id={`${prefix}-project-heading`}>{editing ? "Edit project" : "Create a project"}</h2>
      <Label>Project name<Input data-panel-focus required value={draft.title} onChange={event => onChange({ ...draft, title: event.target.value })} placeholder="A meaningful piece of work" /></Label>
      <Label>Intended outcome<textarea rows={5} value={draft.outcome} onChange={event => onChange({ ...draft, outcome: event.target.value })} placeholder="What will be different when this project is complete?" /></Label>
      <p className="ww-hint">{editing ? "Changing the outcome leaves task records and stages intact." : "The project starts open. Add its tasks from the project workspace."}</p>
      <footer className="ww-compose-actions"><Button onClick={onDiscard}>Discard draft</Button><Button type="submit" variant="primary" disabled={!draft.title.trim()}>{editing ? "Save project" : "Create project"}</Button></footer>
    </form>
  </Panel>
}

type DetailProps = {
  prefix: string; task: Task; demo: Demo; mobile: boolean; expanded: boolean; returnLabel: string; outcome: Outcome | null
  onClose: () => void; onExpand: () => void; onOpen: (id: string) => void; onProject: (id: string) => void
  onUpdate: (change: Partial<Task>) => void; onMove: (stage: Stage) => void; onDecision: (action: "approve" | "sendBack") => void; onRead?: () => void
  onEdit: (draft: TaskDraft | null) => void; onSaveEdit: () => boolean; onTransfer: (projectId: string) => void
  onReorder: (beforeId: string | null) => void; onReason: (value: string) => void; onNote: (value: string) => void; onAppend: (event: FormEvent) => void
}
export function TaskDetail(props: DetailProps) {
  const { prefix, task, demo, mobile, expanded, returnLabel, outcome } = props
  const [editing, setEditing] = useState(Boolean(demo.edits[task.id]))
  const [stage, setStage] = useState(task.status)
  const [destination, setDestination] = useState(task.projectId)
  const [placement, setPlacement] = useState("")
  const project = demo.projects.find(item => item.id === task.projectId)
  const siblings = ordered(demo.tasks.filter(item => item.projectId === task.projectId))
  const position = siblings.findIndex(item => item.id === task.id)
  const draft = demo.edits[task.id]
  const reason = demo.reasons[task.id] ?? ""
  const gated = task.status === "review" || task.status === "verify"
  const attention = attentionReasons(task, demo.tasks)
  useEffect(() => { setStage(task.status) }, [task.status])
  useEffect(() => { setDestination(task.projectId) }, [task.projectId])
  function startEditing() {
    props.onEdit(draft ?? { title: task.title, intent: task.intent, projectId: task.projectId, responsibility: task.responsibility, nextActor: task.nextActor, criteria: task.criteria.map(item => item.text).join("\n"), dependsOn: task.dependsOn.join(", ") })
    setEditing(true)
  }
  return <Panel label={`${prefix}-task-heading`} modal={mobile || expanded} className={`ww-detail${expanded ? " ww-detail--expanded" : ""}`} onClose={props.onClose}>
    <header className="ww-panel-header">
      <Button onClick={props.onClose}><Icon name="back" />Back to {returnLabel}</Button>
      {!mobile && <Button onClick={props.onExpand}>{expanded ? "Use side panel" : "Expand reading"}</Button>}
    </header>
    <div className="ww-detail-scroll">
      <div className="ww-detail-intro">
        <div className="ww-task-context"><span className="ww-code">{task.id}</span><span className="ww-stage"><span className="ww-stage-mark" data-state={task.status} aria-hidden="true" />{label(task.status)}</span></div>
        <h2 id={`${prefix}-task-heading`} tabIndex={-1} data-panel-focus>{task.title}</h2>
        <div className="ww-project-link">{project ? <Button onClick={() => props.onProject(project.id)}>{project.title}</Button> : <span className="ww-secondary">Standalone task</span>}</div>
      </div>
      <Feedback outcome={outcome} onRead={props.onRead} />
      {editing && draft ? <form className="ww-edit-form" onSubmit={event => { event.preventDefault(); if (props.onSaveEdit()) setEditing(false) }}>
        <h3>Edit task</h3>
        <Label>Title<Input required value={draft.title} onChange={event => props.onEdit({ ...draft, title: event.target.value })} /></Label>
        <TaskFields prefix={`${prefix}-edit`} draft={draft} onChange={props.onEdit} />
        <p className="ww-hint">Use Move to project below for an explicit transfer. Closing keeps this edit draft.</p>
        <div className="ww-actions"><Button onClick={() => { props.onEdit(null); setEditing(false) }}>Discard edits</Button><Button type="submit" variant="primary" disabled={!draft.title.trim()}>Save changes</Button></div>
      </form> : <>
        <section className="ww-section"><h3>Intent</h3><p>{task.intent || "Intent has not been written yet."}</p></section>
        {task.plan && <section className="ww-section"><h3>Plan</h3>{task.plan.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>}
        {task.result && <section className="ww-section"><h3>Result</h3><p>{task.result}</p></section>}
        <section className="ww-section"><h3>Done when<span className="ww-secondary">{task.criteria.filter(item => item.done).length}/{task.criteria.length}</span></h3>
          {task.criteria.length ? <div className="ww-checklist">{task.criteria.map((item, index) => <Label key={`${index}-${item.text}`}><Input type="checkbox" checked={item.done} onChange={() => props.onUpdate({ criteria: task.criteria.map((criterion, number) => number === index ? { ...criterion, done: !criterion.done } : criterion) })} /><span>{item.text}</span></Label>)}</div> : <p className="ww-secondary">No completion conditions recorded.</p>}
        </section>
        <Button className="ww-edit-button" onClick={startEditing}>Edit task</Button>
      </>}
      <section className="ww-section ww-responsibility"><h3>Responsibility &amp; next step</h3>
        <dl className="ww-metadata"><div><dt>Responsible</dt><dd>{task.responsibility || "Unassigned"}</dd></div><div><dt>Needed next</dt><dd>{task.status === "done" ? "No next action · completed" : task.nextActor || "Not specified"}</dd></div></dl>
        {attention.length > 0 && <p className="ww-attention-reason">{attention.join(". ")}.</p>}
        <p className="ww-hint">Last recorded update: {task.updated}.</p>
      </section>
      {task.dependsOn.length > 0 && <section className="ww-section"><h3>Dependencies</h3><div className="ww-related">{task.dependsOn.map(id => {
        const dependency = demo.tasks.find(item => item.id === id)
        return dependency ? <Button key={id} onClick={() => props.onOpen(id)}><span><span className="ww-code">{id}</span> {dependency.title}</span><span>{label(dependency.status)}</span></Button>
          : <p key={id}><span className="ww-code">{id}</span> · Reference unavailable. Edit the dependency after locating the record.</p>
      })}</div></section>}
      {gated && <section className="ww-section ww-decision"><h3>{task.status === "review" ? "Decide on this plan" : "Decide on this result"}</h3>
        <p>{task.gateRequired ? "A human decision is required here." : "No required human gate is configured. A decision is optional."}</p>
        <p>{task.status === "review" ? "Approve moves this task to Build. Send back returns it to Plan." : "Approve completes this task. Send back returns it to Build."} Send back also increases the review count.</p>
        {task.criteria.some(item => !item.done) && <p>Unchecked completion conditions remain visible and do not prevent approval.</p>}
        <Label>Decision reason (optional)<textarea rows={2} value={reason} onChange={event => props.onReason(event.target.value)} placeholder="What should the next person know?" /></Label>
        <div className="ww-actions"><Button onClick={() => props.onDecision("sendBack")}>Send back to {task.status === "review" ? "Plan" : "Build"}</Button><Button variant="primary" onClick={() => props.onDecision("approve")}>Approve to {task.status === "review" ? "Build" : "Done"}</Button></div>
      </section>}
      <details className="ww-record"><summary>Organize task</summary><div className="ww-fields">
        <div><h3>Workflow stage</h3><p className="ww-hint">Move changes the stage directly. It does not approve a plan or increase the review count.</p></div>
        <div className="ww-inline-form"><Label>Move to<Select value={stage} onChange={event => setStage(event.target.value as Stage)}>{STAGES.map(value => <option key={value} value={value} disabled={Boolean(project?.completed && value !== "done")}>{label(value)}</option>)}</Select></Label><Button disabled={stage === task.status} onClick={() => props.onMove(stage)}>Move task</Button></div>
        {project?.completed && <p className="ww-hint">Reopen the project before reopening its tasks. Child stages stay unchanged until you change them.</p>}
        <div><h3>Planning order</h3><p className="ww-hint">Position {position + 1} of {siblings.length} in {project?.title ?? "standalone work"}. Shared by Board and List, independently of stage.</p></div>
        <div className="ww-actions"><Button disabled={position === 0} onClick={() => props.onReorder(siblings[position - 1]?.id ?? null)}>Move up</Button><Button disabled={position === siblings.length - 1} onClick={() => props.onReorder(siblings[position + 2]?.id ?? null)}>Move down</Button></div>
        <div className="ww-inline-form"><Label>Place before<Select value={placement} onChange={event => setPlacement(event.target.value)}><option value="">End of project</option>{siblings.filter(item => item.id !== task.id).map(item => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}</Select></Label><Button onClick={() => props.onReorder(placement || null)}>Set position</Button></div>
        <div><h3>Move to project</h3><p className="ww-hint">The task keeps {task.id}, its stage, notes, and dependencies. It joins the end of the destination’s planning order.</p></div>
        <div className="ww-inline-form"><Label>Destination<Select value={destination} onChange={event => setDestination(event.target.value)}><option value="">Standalone task</option>{demo.projects.map(item => <option key={item.id} value={item.id} disabled={item.completed && task.status !== "done"}>{item.title}{item.completed ? " · completed" : ""}</option>)}</Select></Label><Button disabled={destination === task.projectId} onClick={() => props.onTransfer(destination)}>Move to project</Button></div>
        <p className="ww-hint">Open tasks can move only into open projects. Reopen a completed destination first.</p>
      </div></details>
      <details className="ww-record"><summary>Authored decisions &amp; notes</summary>
        <section className="ww-section"><h3>Decisions</h3>{task.decisions.length ? task.decisions.map((entry, index) => <p key={index}>{entry}</p>) : <p className="ww-secondary">No authored decisions.</p>}</section>
        <section className="ww-section"><h3>Notes</h3>{task.log.length ? <ol className="ww-log">{task.log.map((entry, index) => <li key={index}>{entry}</li>)}</ol> : <p className="ww-secondary">No authored notes.</p>}
          <form className="ww-log-form" onSubmit={props.onAppend}><Label>Add a note<textarea rows={3} value={demo.notes[task.id] ?? ""} onChange={event => props.onNote(event.target.value)} /></Label><Button type="submit" disabled={!(demo.notes[task.id] ?? "").trim()}>Append note</Button></form>
        </section>
      </details>
      <details className="ww-record"><summary>Record details</summary><dl className="ww-metadata"><div><dt>Task</dt><dd className="ww-code">{task.id}</dd></div><div><dt>Sent back</dt><dd>{task.reviews} times</dd></div><div><dt>Gate policy</dt><dd>{task.gateRequired ? "Human decision required in Review and Verify" : "No required human gate"}</dd></div><div><dt>Blocking references</dt><dd>{blockers(task, demo.tasks).join(", ") || "None"}</dd></div></dl></details>
      <section className="ww-section ww-completion"><h3>{task.status === "done" ? "Completed task" : "Complete this task"}</h3>
        <p className="ww-hint">{task.status === "done" ? "Reopening returns this task to Todo and keeps its recorded result." : "Complete moves directly to Done. Find the task again with Completed or All, including in search."}</p>
        <Button disabled={task.status === "done" && Boolean(project?.completed)} onClick={() => props.onMove(task.status === "done" ? "todo" : "done")}>{task.status === "done" ? "Reopen task" : "Complete task"}</Button>
        {task.status === "done" && project?.completed && <p className="ww-hint">Open {project.title} and explicitly reopen the project first.</p>}
      </section>
    </div>
  </Panel>
}
