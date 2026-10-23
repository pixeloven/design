import React, { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Button, Input, Label, Select } from "@pixeloven/ui"
import { epics, workIssues, inactiveDraftText, legacyDraftText, taskDraft, ISSUE_TYPES, WORK_TYPES, STAGES, blockers, label, ordered, type CreationDraft, type Demo, type EpicDraft, type IdeaDraft, type Stage, type Task, type TaskDraft } from "./WardenWorkspace.model"
import "./WardenWorkspace.panel-actions.css"

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
    <p>{outcome.message}</p>{outcome.kind === "refusal" && onRead && <Button onClick={onRead}>Re-read issue</Button>}
  </div>
}
function TaskFields({ prefix, draft, onChange, includeType = true }: { prefix: string; draft: TaskDraft; onChange: (draft: TaskDraft) => void; includeType?: boolean }) {
  function field(key: keyof TaskDraft, value: string) { onChange({ ...draft, [key]: value }) }
  return <>
    {includeType && <Label>Issue type<Select value={draft.type} onChange={event => field("type", event.target.value)}>{WORK_TYPES.map(type => <option key={type} value={type}>{label(type)}</option>)}</Select></Label>}
    <Label htmlFor={`${prefix}-intent`}>Context<textarea id={`${prefix}-intent`} rows={4} value={draft.intent} onChange={event => field("intent", event.target.value)} placeholder={draft.type === "spike" ? "What question or uncertainty needs investigation?" : "Why does this work matter?"} /></Label>
    <Label htmlFor={`${prefix}-criteria`}>Requirements &amp; done when<textarea id={`${prefix}-criteria`} rows={3} value={draft.criteria} onChange={event => field("criteria", event.target.value)} placeholder="One requirement or completion condition per line" /></Label>
    <Label htmlFor={`${prefix}-plan`}>Plan<textarea id={`${prefix}-plan`} rows={4} value={draft.plan} onChange={event => field("plan", event.target.value)} placeholder="Describe the approach and what needs review." /></Label>
    <Label htmlFor={`${prefix}-result`}>Result<textarea id={`${prefix}-result`} rows={4} value={draft.result} onChange={event => field("result", event.target.value)} placeholder={draft.type === "spike" ? "Record findings, evidence, and the decision or recommendation." : "Record what happened and the evidence for completion."} /></Label>
    {draft.type === "spike" && <p className="ww-hint">For a Spike, the result is your findings and decision. Keep that investigation as a record; create a linked follow-up when there is more work to do.</p>}
    <Label htmlFor={`${prefix}-responsibility`}>Responsible for this work<Input id={`${prefix}-responsibility`} value={draft.responsibility} onChange={event => field("responsibility", event.target.value)} placeholder="Person, agent, or accountable role" /></Label>
    <Label htmlFor={`${prefix}-next`}>Required next actor<Input id={`${prefix}-next`} value={draft.nextActor} onChange={event => field("nextActor", event.target.value)} placeholder="Who is needed next, and for what?" /></Label>
    <Label htmlFor={`${prefix}-dependencies`}>Depends on<Input id={`${prefix}-dependencies`} value={draft.dependsOn} onChange={event => field("dependsOn", event.target.value)} placeholder="W-101, W-102" aria-describedby={`${prefix}-dependency-help`} /></Label>
    <p className="ww-hint" id={`${prefix}-dependency-help`}>Issue IDs separated by commas. An unavailable reference stays visible as a blocker.</p>
  </>
}
export function IssueComposer({ prefix, demo, draft, onChange, onClose, onCreate, onDiscard, stored, error, returnLabel }: {
  prefix: string; demo: Demo; draft: CreationDraft; onChange: (draft: CreationDraft) => void; onClose: () => void; returnLabel: string
  onCreate: (event: FormEvent) => void; onDiscard: () => void; stored: boolean; error: string
}) {
  const source = demo.issues.find(issue => issue.id === draft.sourceIssueId)
  return <Panel label={`${prefix}-compose-heading`} modal className="ww-composer" onClose={onClose}>
    <header className="ww-panel-header"><Button onClick={onClose}><Icon name="back" />Back to {returnLabel}</Button><span>Draft kept on close</span></header>
    <form className="ww-compose-form" onSubmit={onCreate}>
      <div><h2 id={`${prefix}-compose-heading`}>{draft.sourceIssueId ? "New follow-up issue" : "New issue"}</h2><p className="ww-secondary">{draft.type === "epic" ? "Name a bounded outcome. Refine its context and finish line as the work becomes clearer." : "Start with a title. Refine context, requirements, and the plan as you learn."}</p></div>
      {draft.sourceIssueId && <p className="ww-hint">Follow-up to <strong>{draft.sourceIssueId} · {source?.title ?? "Source unavailable"}</strong>. The original issue remains in place. This link does not create a dependency.</p>}
      <Label htmlFor={`${prefix}-new-title`}>Title<Input data-panel-focus id={`${prefix}-new-title`} required value={draft.title} onChange={event => onChange({ ...draft, title: event.target.value })} placeholder="What needs to happen?" /></Label>
      <Label>Issue type<Select value={draft.type} onChange={event => onChange({ ...draft, type: event.target.value as CreationDraft["type"] })}>{ISSUE_TYPES.map(type => <option key={type} value={type}>{label(type)}</option>)}</Select></Label>
      {draft.type === "spike" && <p className="ww-hint">A Spike investigates a design or implementation question and records findings and a decision.</p>}
      {draft.type === "epic" ? <p className="ww-hint">An Epic is a top-level outcome. It has no parent Epic.</p> : <Label>Epic<Select value={draft.epicId} onChange={event => onChange({ ...draft, epicId: event.target.value })}>
        <option value="">Standalone issue</option>{epics(demo).map(project => <option key={project.id} value={project.id} disabled={project.status === "done"}>{project.title}{project.status === "done" ? " · completed" : ""}</option>)}
      </Select></Label>}
      <p className="ww-hint">Starts in Todo. You can add or revise details after capture.</p>
      <details className="ww-form-details"><summary>{draft.type === "epic" ? "Add context, outcome and scope (optional)" : "Add context and requirements (optional)"}</summary><div className="ww-fields">
        <Label>Context<textarea rows={3} value={draft.intent} onChange={event => onChange({ ...draft, intent: event.target.value })} placeholder="What do you know so far?" /></Label>
        {draft.type === "epic" ? <>
          <Label>Desired outcome<textarea rows={3} value={draft.outcome ?? ""} onChange={event => onChange({ ...draft, outcome: event.target.value })} /></Label>
          <Label>Observable finish line<textarea rows={3} value={draft.finishLine ?? ""} onChange={event => onChange({ ...draft, finishLine: event.target.value })} placeholder="What can someone observe or check to accept this outcome?" /></Label>
          <Label>In scope<textarea rows={2} value={draft.scope ?? ""} onChange={event => onChange({ ...draft, scope: event.target.value })} /></Label>
          <Label>Out of scope<textarea rows={2} value={draft.outOfScope ?? ""} onChange={event => onChange({ ...draft, outOfScope: event.target.value })} /></Label>
          <p className="ww-hint">An observable finish line is required when you accept the outcome and complete the Epic.</p>
        </> : <Label>Requirements &amp; done when<textarea rows={3} value={draft.criteria} onChange={event => onChange({ ...draft, criteria: event.target.value })} placeholder="One requirement or completion condition per line" /></Label>}
      </div></details>
      {draft.type !== "epic" && (draft.plan || draft.result || draft.responsibility || draft.nextActor || draft.dependsOn) && <p className="ww-hint">Additional details from your saved draft are kept. You can edit them after creating the issue.</p>}
      {inactiveDraftText(draft) && <details className="ww-form-details"><summary>Details from another type are kept</summary><p className="ww-hint">These details will be saved in an activity note when you create this {label(draft.type)}. They do not create dependencies. Changing type keeps this text in the draft.</p><Label>Retained draft details<textarea rows={5} readOnly value={inactiveDraftText(draft)} /></Label></details>}
      {error && <p className="ww-form-error" role="alert">{error}</p>}
      <p className="ww-hint">{stored ? "Draft and workspace stay in this tab through reloads, until Reset demo or the tab’s session ends." : "Storage is unavailable. Keep this page open to retain the draft and workspace."}</p>
      <footer className="ww-compose-actions"><Button onClick={onDiscard}>Discard draft</Button><Button type="submit" variant="primary" disabled={!draft.title.trim()}>{draft.type === "epic" ? "Create Epic" : "Create issue"}</Button></footer>
    </form>
  </Panel>
}
export function EpicEditor({ prefix, draft, onChange, onClose, onSave, onDiscard, returnLabel }: {
  prefix: string; draft: EpicDraft; onChange: (draft: EpicDraft) => void; onClose: () => void; onSave: (event: FormEvent) => void; onDiscard: () => void; returnLabel: string
}) {
  return <Panel label={`${prefix}-project-heading`} modal className="ww-composer" onClose={onClose}>
    <header className="ww-panel-header"><Button onClick={onClose}><Icon name="back" />Back to {returnLabel}</Button><span>Draft kept on close</span></header>
    <form className="ww-compose-form" onSubmit={onSave}>
      <div><h2 id={`${prefix}-project-heading`}>Edit Epic</h2></div>
      <Label>Epic title<Input data-panel-focus required value={draft.title} onChange={event => onChange({ ...draft, title: event.target.value })} /></Label>
      <details className="ww-form-details" open><summary>Outcome and scope</summary><div className="ww-fields">
      <Label>Context<textarea rows={3} value={draft.originalIdea} onChange={event => onChange({ ...draft, originalIdea: event.target.value })} /></Label>
      <Label>Desired outcome<textarea rows={3} value={draft.outcome} onChange={event => onChange({ ...draft, outcome: event.target.value })} /></Label>
      <Label>Observable finish line<textarea rows={3} value={draft.finishLine} onChange={event => onChange({ ...draft, finishLine: event.target.value })} placeholder="What can someone observe or check to accept this outcome?" /></Label>
      <Label>In scope<textarea rows={2} value={draft.scope} onChange={event => onChange({ ...draft, scope: event.target.value })} /></Label>
      <Label>Out of scope<textarea rows={2} value={draft.outOfScope} onChange={event => onChange({ ...draft, outOfScope: event.target.value })} /></Label>
      </div></details>
      <p className="ww-hint">An observable finish line is required when you accept the outcome and complete the Epic.</p>
      <footer className="ww-compose-actions"><Button onClick={onDiscard}>Discard edits</Button><Button type="submit" variant="primary" disabled={!draft.title.trim()}>Save Epic</Button></footer>
    </form>
  </Panel>
}

export function LegacyDraftRecovery({ prefix, draft, onClose }: { prefix: string; draft: IdeaDraft | null; onClose: () => void }) {
  return <Panel label={`${prefix}-recovery-heading`} modal className="ww-composer" onClose={onClose}>
    <header className="ww-panel-header"><Button onClick={onClose}><Icon name="back" />Back to work</Button></header>
    <div className="ww-compose-form"><h2 id={`${prefix}-recovery-heading`} tabIndex={-1} data-panel-focus>Earlier draft</h2>
      {draft ? <><p>The text from the earlier preview is kept here. Select and copy anything useful into an issue or Epic when you need it.</p><Label>Saved draft text<textarea rows={15} readOnly value={legacyDraftText(draft)} /></Label><p className="ww-hint">This recovery view leaves your existing issue and Epic drafts unchanged.</p></> : <p>No earlier draft is saved in this tab.</p>}
    </div>
  </Panel>
}

type DetailProps = {
  prefix: string; task: Task; demo: Demo; mobile: boolean; expanded: boolean; returnLabel: string; outcome: Outcome | null
  onClose: () => void; onExpand: () => void; onOpen: (id: string) => void; onProject: (id: string) => void
  onFollowUp: (source: HTMLElement) => void
  onUpdate: (change: Partial<Task>) => void; onMove: (stage: Stage) => void; onDecision: (action: "approve" | "sendBack") => void; onRead?: () => void
  onEdit: (draft: TaskDraft | null) => void; onSaveEdit: () => boolean; onTransfer: (epicId: string) => void
  onReorder: (beforeId: string | null) => void; onReason: (value: string) => void; onNote: (value: string) => void; onAppend: (event: FormEvent) => Outcome | null
}
export function TaskDetail(props: DetailProps) {
  const { prefix, task, demo, mobile, expanded, returnLabel, outcome } = props
  const [editing, setEditing] = useState(Boolean(demo.edits[task.id]))
  const [editField, setEditField] = useState<"title" | "dependencies">("title")
  const [stage, setStage] = useState(task.status)
  const [destination, setDestination] = useState(task.epicId)
  const [placement, setPlacement] = useState("")
  const [activityFilter, setActivityFilter] = useState<"comments" | "decisions">("comments")
  const [commentOutcome, setCommentOutcome] = useState<Outcome | null>(null)
  const editForm = useRef<HTMLFormElement>(null)
  const project = epics(demo).find(item => item.id === task.epicId)
  const sourceIssue = demo.issues.find(item => item.id === task.sourceIssueId)
  const followUps = demo.issues.filter(item => item.sourceIssueId === task.id)
  const siblings = ordered(workIssues(demo).filter(item => item.epicId === task.epicId))
  const position = siblings.findIndex(item => item.id === task.id)
  const draft = demo.edits[task.id]
  const reason = demo.reasons[task.id] ?? ""
  const decisionStage = task.status === "review" || task.status === "verify"
  const blocked = blockers(task, demo.issues)
  const missing = blocked.filter(id => !demo.issues.some(item => item.id === id))
  const checked = task.criteria.filter(item => item.done).length
  const ask = decisionStage
    ? `${task.gateRequired ? "" : "Optional: "}${task.status === "review" ? "Review this plan" : "Verify this result"}`
    : task.status === "done" ? "Issue completed"
      : missing.length ? `Locate ${missing.length === 1 ? `missing reference ${missing[0]}` : "the missing references"}`
        : blocked.length ? "Inspect the dependencies" : task.type === "spike" && task.status === "build" ? "Investigate the question" : "Next step"
  const request = task.status === "review" ? task.type === "spike" ? "Is the investigation approach ready to carry out?" : "Is the proposed approach ready to build?"
    : task.status === "verify" ? task.type === "spike" ? "Do the findings answer the question and support a decision?" : "Does this result meet the completion conditions?"
      : task.status === "done" ? "The recorded result and comments remain available. Reopening returns the issue to Todo."
        : missing.length ? "A supporting record is unavailable. Locate it, then correct the dependency if needed."
          : blocked.length ? "This work depends on unfinished issues. Open their records to see what is needed."
            : task.nextActor || "No next action is recorded. Edit this issue to name the actor and the action they should take."
  useEffect(() => { setStage(task.status) }, [task.status])
  useEffect(() => { setDestination(task.epicId) }, [task.epicId])
  useEffect(() => {
    if (!editing) return
    const field = editField === "dependencies" ? document.getElementById(`${prefix}-edit-dependencies`) : editForm.current?.querySelector<HTMLInputElement>("[data-edit-title]")
    field?.focus()
  }, [editing, editField, prefix])
  function startEditing(field: "title" | "dependencies" = "title") {
    props.onEdit(draft ?? taskDraft(task))
    setEditField(field)
    setEditing(true)
    if (editing) requestAnimationFrame(() => {
      const input = field === "dependencies" ? document.getElementById(`${prefix}-edit-dependencies`) : editForm.current?.querySelector<HTMLInputElement>("[data-edit-title]")
      input?.focus()
    })
  }
  const intent = <section className="ww-section"><h3>Context</h3><p>{task.intent || "Context has not been written yet. Add what you know in Edit issue."}</p></section>
  const plan = (task.plan || task.status === "review") && <section className="ww-section" id={`${prefix}-task-plan`}><h3>Plan</h3>{task.plan ? task.plan.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p className="ww-secondary">No plan has been recorded.</p>}</section>
  const result = (task.result || task.type === "spike" || task.status === "verify" || task.status === "done") && <section className="ww-section" id={`${prefix}-task-result`}><h3>{task.type === "spike" ? "Findings & decision" : "Result"}</h3><p>{task.result || (task.type === "spike" ? "Record what you learn in Result, including the evidence and recommendation. The Spike remains the investigation record." : "No result has been recorded.")}</p></section>
  const criteria = <section className="ww-section"><h3>Requirements &amp; done when<span className="ww-secondary">{checked}/{task.criteria.length}</span></h3>
    {task.criteria.length ? <div className="ww-checklist">{task.criteria.map((item, index) => <Label key={`${index}-${item.text}`}><Input type="checkbox" checked={item.done} onChange={() => props.onUpdate({ criteria: task.criteria.map((criterion, number) => number === index ? { ...criterion, done: !criterion.done } : criterion) })} /><span>{item.text}</span></Label>)}</div> : <p className="ww-secondary">No completion conditions recorded.</p>}
  </section>
  function dependencies(ids: string[]) {
    return <div className="ww-related ww-task-dependencies">{ids.map(id => {
      const dependency = demo.issues.find(item => item.id === id)
      return dependency ? <Button key={id} onClick={() => props.onOpen(id)}><span><span className="ww-code">{id}</span> {dependency.title}</span><span>{label(dependency.status)}</span></Button>
        : <p key={id}><span className="ww-code">{id}</span> · Reference unavailable</p>
    })}</div>
  }
  const comments = [
    ...task.decisions.map((text, index) => ({ key: `decision-${index}`, kind: "Decision note", decision: true, text })),
    ...task.log.map((text, index) => ({ key: `comment-${index}`, kind: "Comment", decision: false, text })),
  ]
  const activity = activityFilter === "decisions" ? comments.filter(entry => entry.decision) : comments
  return <Panel label={`${prefix}-task-heading`} modal={mobile || expanded} className={`ww-detail${expanded ? " ww-detail--expanded" : ""}`} onClose={props.onClose}>
    <header className="ww-panel-header">
      <Button onClick={props.onClose}><Icon name="back" />Back to {returnLabel}</Button>
      {!mobile && <Button onClick={props.onExpand}>{expanded ? "Use side panel" : "Expand reading"}</Button>}
    </header>
    <div className="ww-detail-scroll">
      <div className="ww-detail-intro">
        <div className="ww-task-context"><span className="ww-code">{task.id}</span><span>{label(task.type)}</span><span className="ww-stage"><span className="ww-stage-mark" data-state={task.status} aria-hidden="true" />{label(task.status)}</span></div>
        <h2 id={`${prefix}-task-heading`} tabIndex={-1} data-panel-focus>{task.title}</h2>
        <div className="ww-project-link">{project ? <Button onClick={() => props.onProject(project.id)}>{project.title}</Button> : <span className="ww-secondary">Standalone issue</span>}</div>
        {task.sourceIssueId && <div className="ww-source-link"><span>Follow-up to</span>{sourceIssue ? <Button onClick={() => props.onOpen(sourceIssue.id)}>{sourceIssue.id} · {sourceIssue.title}</Button> : <span>{task.sourceIssueId} · Source unavailable</span>}</div>}
      </div>
      <Feedback outcome={outcome} onRead={props.onRead} />
      {editing && draft ? <form ref={editForm} className="ww-edit-form" onSubmit={event => { event.preventDefault(); if (props.onSaveEdit()) setEditing(false) }}>
        <h3>Edit issue</h3>
        <Label>Title<Input data-edit-title required value={draft.title} onChange={event => props.onEdit({ ...draft, title: event.target.value })} /></Label>
        <TaskFields prefix={`${prefix}-edit`} draft={draft} onChange={props.onEdit} />
        <p className="ww-hint">Use Manage issue for an explicit Epic transfer. Closing keeps this edit draft.</p>
        <div className="ww-actions"><Button onClick={() => { props.onEdit(null); setEditing(false) }}>Discard edits</Button><Button type="submit" variant="primary" disabled={!draft.title.trim()}>Save changes</Button></div>
      </form> : <div className="ww-task-reading">
        {task.status === "review" ? <>{plan}{criteria}{intent}{result}</> : task.status === "verify" || task.status === "done" ? <>{result}{criteria}{intent}{plan}</> : <>{intent}{plan}{result}{criteria}</>}
      </div>}
      <section className="ww-task-actions" aria-labelledby={`${prefix}-task-ask`}>
        <div className="ww-task-ask"><h3 id={`${prefix}-task-ask`}>{ask}</h3><p>{request}</p></div>
        <p className="ww-task-actors"><span>Responsible: <strong>{task.responsibility || "Unassigned"}</strong></span>{task.status !== "done" && task.nextActor && (decisionStage || blocked.length > 0) && <span>Needed next: <strong>{task.nextActor}</strong></span>}</p>
        {blocked.length > 0 && <div className="ww-task-blockers">{decisionStage && <p className="ww-hint">This issue also has unresolved dependencies.</p>}{dependencies(blocked)}</div>}
        {decisionStage && <>
          <p className="ww-hint">These actions only change this local demo record. No agent runs.</p>
          <p className="ww-task-consequence">{task.status === "review" ? "Approve moves this issue to Build. Request changes returns it to Plan." : "Approve completes this issue. Request changes returns it to Build."} Request changes increases the review count.</p>
          {!task.gateRequired && <p className="ww-hint">No required human gate is configured for this issue.</p>}
          {checked < task.criteria.length && <p className="ww-hint">{checked} of {task.criteria.length} completion conditions checked. Unchecked conditions do not prevent approval.</p>}
          <details className="ww-decision-comment-entry" open={Boolean(reason) || undefined}><summary>{reason ? "Decision comment · draft kept" : "Comment with this decision (optional)"}</summary><Label className="ww-decision-comment" htmlFor={`${prefix}-decision-comment`}>Decision comment<textarea id={`${prefix}-decision-comment`} rows={2} value={reason} onChange={event => props.onReason(event.target.value)} placeholder="Explain the approval or what needs to change…" /></Label></details>
          <div className="ww-task-primary-actions"><Button onClick={() => props.onDecision("sendBack")}>Request changes</Button><Button variant="primary" onClick={() => props.onDecision("approve")}>{task.status === "review" ? "Approve plan" : "Approve & complete"}</Button></div>
        </>}
        <div className="ww-task-utility-actions">
          {missing.length > 0 && <Button variant={decisionStage ? "secondary" : "primary"} onClick={() => startEditing("dependencies")}>Edit {missing.length === 1 ? "dependency" : "dependencies"}</Button>}
          <Button onClick={() => startEditing()} disabled={editing}>{editing ? "Editing issue" : "Edit issue"}</Button>
          <Button onClick={event => props.onFollowUp(event.currentTarget)}>{demo.followUpDrafts[task.id] ? "Resume follow-up draft" : "Create follow-up issue"}</Button>
          {!decisionStage && <Button disabled={task.status === "done" && Boolean(project?.status === "done")} onClick={() => props.onMove(task.status === "done" ? "todo" : "done")}>{task.status === "done" ? "Reopen issue" : "Complete issue"}</Button>}
        </div>
        {!decisionStage && task.status !== "done" && <p className="ww-hint">Complete moves directly to Done. The issue remains in Completed and All.</p>}
        {task.status === "done" && project?.status === "done" && <p className="ww-hint">Reopen {project.title} before reopening this task. Completed child tasks stay unchanged.</p>}
        <details className="ww-task-manage"><summary>Manage issue</summary><div className="ww-fields">
          <div><h3>Change workflow stage</h3><p className="ww-hint">Move changes the stage directly. It does not approve the work or increase the review count.</p></div>
          <div className="ww-inline-form"><Label>Move to<Select value={stage} onChange={event => setStage(event.target.value as Stage)}>{STAGES.map(value => <option key={value} value={value} disabled={Boolean(project?.status === "done" && value !== "done")}>{label(value)}</option>)}</Select></Label><Button disabled={stage === task.status} onClick={() => props.onMove(stage)}>Move issue</Button></div>
          {project?.status === "done" && <p className="ww-hint">Reopen the Epic before reopening its issues.</p>}
          <div><h3>Planning order</h3><p className="ww-hint">Position {position + 1} of {siblings.length} in {project?.title ?? "standalone work"}. Shared by Board and List, independently of stage.</p></div>
          <div className="ww-actions"><Button disabled={position === 0} onClick={() => props.onReorder(siblings[position - 1]?.id ?? null)}>Move up</Button><Button disabled={position === siblings.length - 1} onClick={() => props.onReorder(siblings[position + 2]?.id ?? null)}>Move down</Button></div>
          <div className="ww-inline-form"><Label>Place before<Select value={placement} onChange={event => setPlacement(event.target.value)}><option value="">End of Epic</option>{siblings.filter(item => item.id !== task.id).map(item => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}</Select></Label><Button onClick={() => props.onReorder(placement || null)}>Set position</Button></div>
          <div><h3>Move to Epic</h3><p className="ww-hint">The task keeps {task.id}, its stage, comments, and dependencies. It joins the end of the destination’s planning order.</p></div>
          <div className="ww-inline-form"><Label>Destination<Select value={destination} onChange={event => setDestination(event.target.value)}><option value="">Standalone issue</option>{epics(demo).map(item => <option key={item.id} value={item.id} disabled={item.status === "done" && task.status !== "done"}>{item.title}{item.status === "done" ? " · completed" : ""}</option>)}</Select></Label><Button disabled={destination === task.epicId} onClick={() => props.onTransfer(destination)}>Move to Epic</Button></div>
          <p className="ww-hint">Open issues can move only into open Epics. Reopen a completed destination first.</p>
        </div></details>
      </section>
      {task.dependsOn.some(id => !blocked.includes(id)) && <section className="ww-section"><h3>Other dependencies</h3>{dependencies(task.dependsOn.filter(id => !blocked.includes(id)))}</section>}
      {followUps.length > 0 && <section className="ww-section"><h3>Follow-up issues</h3><div className="ww-related">{followUps.map(issue => <Button key={issue.id} onClick={() => props.onOpen(issue.id)}><span>{issue.id} · {issue.title}</span><span>{label(issue.type)} · {label(issue.status)}</span></Button>)}</div></section>}
      <section className="ww-section ww-comments" aria-labelledby={`${prefix}-activity-heading`}>
        <h3 id={`${prefix}-activity-heading`}>Activity</h3>
        <div className="ww-activity-filters" role="group" aria-label="Activity filters">
          <Button aria-pressed={activityFilter === "comments"} aria-controls={`${prefix}-activity-feed`} onClick={() => setActivityFilter("comments")}>Comments <span className="ww-count">{comments.length}</span></Button>
          <Button aria-pressed={activityFilter === "decisions"} aria-controls={`${prefix}-activity-feed`} onClick={() => setActivityFilter("decisions")}>Decisions <span className="ww-count">{task.decisions.length}</span></Button>
        </div>
        <form className="ww-comment-form" onSubmit={event => { const result = props.onAppend(event); setCommentOutcome(result); if (result?.kind === "success") setActivityFilter("comments") }}>
          <Label htmlFor={`${prefix}-comment`}>Add a comment<textarea id={`${prefix}-comment`} rows={3} value={demo.notes[task.id] ?? ""} onChange={event => { props.onNote(event.target.value); setCommentOutcome(null) }} placeholder="Add context, a question, or an update…" /></Label>
          <Feedback outcome={commentOutcome} />
          <div className="ww-comment-submit"><p className="ww-hint">Your draft is kept when you close this issue.</p><Button type="submit" disabled={!(demo.notes[task.id] ?? "").trim()}>Post comment</Button></div>
        </form>
        <div id={`${prefix}-activity-feed`} className="ww-comment-feed">
          <p className="ww-activity-count ww-secondary" role="status">{activity.length ? `${activity.length} ${activityFilter === "decisions" ? activity.length === 1 ? "decision note" : "decision notes" : activity.length === 1 ? "comment" : "comments"}` : activityFilter === "decisions" ? "No decision notes yet." : "No comments yet."}</p>
          {activity.map(entry => <article className="ww-comment" key={entry.key}><p className="ww-comment-kind">{entry.kind}</p><p className="ww-comment-text">{entry.text}</p></article>)}
        </div>
      </section>
      <details className="ww-record"><summary>Record details</summary><dl className="ww-metadata"><div><dt>Issue</dt><dd className="ww-code">{task.id}</dd></div><div><dt>Last update</dt><dd>{task.updated}</dd></div><div><dt>Sent back</dt><dd>{task.reviews} times</dd></div><div><dt>Gate policy</dt><dd>{task.gateRequired ? "Human decision required in Review and Verify" : "No required human gate"}</dd></div><div><dt>Blocking references</dt><dd>{blocked.join(", ") || "None"}</dd></div></dl></details>
    </div>
  </Panel>
}
