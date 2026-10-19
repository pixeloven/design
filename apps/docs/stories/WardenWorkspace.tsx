import React, { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Button, Input, Label, Select } from "@pixeloven/ui"
import {
  DEFAULT_NAV, STAGES, STORAGE_KEY, attentionReasons, blockers, editedTask, emptyDraft, initialDemo,
  label, navigationFromUrl, ordered, readDemo, reorder, scopedTasks, writeNavigation,
  type Demo, type Destination, type Focus, type Navigation, type Project, type Scenario, type Scope, type Stage, type Task,
} from "./WardenWorkspace.model"
import { Icon, Panel, ProjectComposer, TaskComposer, TaskDetail, type Outcome } from "./WardenWorkspace.panels"
import { destinationText, placementBefore, useTaskDrag, type DropTarget } from "./WardenWorkspace.drag"
import { DragControls } from "./WardenWorkspace.drag-controls"
import "./WardenWorkspace.css"

const DESTINATIONS: { value: Destination; title: string }[] = [
  { value: "projects", title: "Projects" }, { value: "all", title: "All tasks" }, { value: "attention", title: "Needs attention" },
]
const STAGE_COPY: Record<Stage, string> = { todo: "Ready to shape", plan: "Define the approach", review: "Inspect the plan", build: "Carry out the work", verify: "Inspect the result", done: "Completed work" }

export function WardenWorkspace({ mark }: { mark: ReactNode }) {
  const prefix = useId()
  const [demo, setDemo] = useState<Demo>(() => {
    const saved = readDemo()
    return { ...saved, navigation: navigationFromUrl(saved.navigation) }
  })
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 760px)").matches)
  const [stored, setStored] = useState(true)
  const [scenario, setScenario] = useState<Scenario>("normal")
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [notice, setNotice] = useState("")
  const [formError, setFormError] = useState("")
  const [draftConflict, setDraftConflict] = useState(false)
  const [projectCompletion, setProjectCompletion] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [moveResult, setMoveResult] = useState<{ id: string; message: string } | null>(null)
  const workArea = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const main = useRef<HTMLElement>(null)
  const restorePosition = useRef({ top: 0, page: 0 })
  const navRef = useRef(demo.navigation)
  const nav = demo.navigation
  navRef.current = nav
  const project = demo.projects.find(item => item.id === nav.projectId)
  const task = demo.tasks.find(item => item.id === nav.selected)
  const shown = scopedTasks(demo, nav)
  const attentionCount = demo.tasks.filter(item => attentionReasons(item, demo.tasks).length > 0).length
  const isProjects = nav.view === "projects"
  const title = nav.view === "project" ? project?.title ?? "Project unavailable" : DESTINATIONS.find(item => item.value === nav.view)?.title ?? "Projects"
  const projectTasks = project ? demo.tasks.filter(item => item.projectId === project.id) : []
  const openTasks = projectTasks.filter(item => item.status !== "done")
  const nextPlanned = ordered(openTasks)[0]
  const scopedProjectWork = scopedTasks(demo, { ...nav, focus: "all", query: "" })
  const drag = useTaskDrag({ demo, board: nav.layout === "board", root: workArea, scroll: main,
    context: JSON.stringify([nav.view, nav.projectId, nav.layout, nav.scope, nav.focus, nav.query]),
    onDrop: commitDrop, onCancel: id => setNotice(`${id} was not moved. Its stage and planning order are unchanged.`),
  })
  const projectDraftKey = nav.view === "project" && project ? project.id : "new"
  const projectDraft = demo.projectDrafts[projectDraftKey] ?? { title: projectDraftKey === "new" ? "" : project?.title ?? "", outcome: projectDraftKey === "new" ? "" : project?.outcome ?? "" }

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)")
    const change = () => setMobile(media.matches)
    media.addEventListener("change", change)
    return () => media.removeEventListener("change", change)
  }, [])
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(demo)); setStored(true) }
    catch { setStored(false) }
  }, [demo])
  useEffect(() => {
    writeNavigation(navRef.current, true, Boolean(window.history.state?.wardenOverlay))
    const restore = () => {
      const previous = navRef.current
      let next = navigationFromUrl({ ...DEFAULT_NAV })
      if (previous.selected && !next.selected && previous.view === next.view && previous.projectId === next.projectId) {
        next = { ...next, scope: previous.scope, focus: previous.focus, query: previous.query, layout: previous.layout, stage: previous.stage }
        writeNavigation(next, true)
      }
      navRef.current = next
      setDemo(current => ({ ...current, navigation: next }))
      setProjectCompletion(false)
      setOutcome(null)
      if ((previous.selected && !next.selected) || (previous.composer && !next.composer)) restoreFocus()
    }
    window.addEventListener("popstate", restore)
    window.addEventListener("hashchange", restore)
    return () => { window.removeEventListener("popstate", restore); window.removeEventListener("hashchange", restore) }
  }, [])

  function captureOrigin(source?: HTMLElement) {
    opener.current = source ?? document.activeElement as HTMLElement
    restorePosition.current = { top: main.current?.scrollTop ?? 0, page: window.scrollY }
  }
  function restoreFocus() {
    requestAnimationFrame(() => {
      if (main.current) main.current.scrollTop = restorePosition.current.top
      window.scrollTo({ top: restorePosition.current.page, behavior: "instant" })
      const source = opener.current?.isConnected ? opener.current : heading.current
      source?.focus({ preventScroll: true })
    })
  }
  function navigate(change: Partial<Navigation>, replace = false, overlay = false) {
    const next = { ...navRef.current, ...change }
    navRef.current = next
    setDemo(current => ({ ...current, navigation: next }))
    writeNavigation(next, replace, overlay || (replace && Boolean(window.history.state?.wardenOverlay)))
  }
  function chooseDestination(view: Destination, projectId = "") {
    const scope: Scope = view === "project" && demo.projects.find(item => item.id === projectId)?.completed ? "completed" : "open"
    const candidates = scopedTasks(demo, { ...navRef.current, view, projectId, scope, focus: "all", query: "" })
    const stage = scope === "completed" ? "done" : STAGES.find(value => candidates.some(item => item.status === value)) ?? "todo"
    navigate({ view, projectId, selected: "", composer: "", scope, focus: "all", stage, layout: !nav.layoutChosen && (mobile || view === "attention") ? "list" : nav.layout, query: "", expanded: false })
    setOutcome(null); setNotice(""); setProjectCompletion(false)
    if (main.current) main.current.scrollTop = 0
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }))
  }
  function chooseScope(scope: Scope) {
    const candidates = scopedTasks(demo, { ...navRef.current, scope })
    const stage = scope === "completed" ? "done" : candidates.some(item => item.status === nav.stage) ? nav.stage : STAGES.find(value => candidates.some(item => item.status === value)) ?? "todo"
    navigate({ scope, stage, focus: scope === "completed" ? "all" : nav.focus }, true)
  }
  function chooseFocus(focus: Focus) {
    const scope = focus === "all" ? nav.scope : "open"
    const candidates = scopedTasks(demo, { ...navRef.current, focus, scope })
    const stage = candidates.some(item => item.status === nav.stage) ? nav.stage : STAGES.find(value => candidates.some(item => item.status === value)) ?? "todo"
    navigate({ focus, scope, stage }, true)
  }
  function clearFilters() {
    const candidates = scopedTasks(demo, { ...nav, focus: "all", scope: "open", query: "" })
    navigate({ focus: "all", scope: "open", query: "", stage: STAGES.find(value => candidates.some(item => item.status === value)) ?? "todo" }, true)
  }
  function closePanel() {
    if (window.history.state?.wardenOverlay) window.history.back()
    else { navigate({ selected: "", composer: "", expanded: false }, true); restoreFocus() }
    setOutcome(null); setFormError("")
  }
  function openTask(id: string, source?: HTMLElement) {
    if (!nav.selected) captureOrigin(source)
    navigate({ selected: id, composer: "" }, Boolean(nav.selected), true)
    setOutcome(null)
  }
  function openComposer(kind: "task" | "project", source: HTMLElement, resume = false) {
    captureOrigin(source)
    setDraftConflict(kind === "task" && Boolean(demo.draft) && !resume)
    if (kind === "task" && !demo.draft) setDemo(current => ({ ...current, draft: emptyDraft(nav.view === "project" ? nav.projectId : "") }))
    setFormError("")
    navigate({ composer: kind }, false, true)
  }
  function updateTask(id: string, change: Partial<Task>) {
    setDemo(current => ({ ...current, tasks: current.tasks.map(item => item.id === id ? { ...item, ...change, updated: "Just now · edited in this demo" } : item) }))
  }
  function moveTask(id: string, to: Stage, action?: "approve" | "sendBack", beforeId?: string) {
    const item = demo.tasks.find(record => record.id === id)
    if (!item) return
    if (demo.projects.find(record => record.id === item.projectId)?.completed && to !== "done") {
      setOutcome({ kind: "refusal", message: "Reopen the project before adding open work. This task has not changed." }); return
    }
    if (action && scenario === "gate-refusal") {
      setOutcome({ kind: "refusal", message: "The task changed before this decision completed. Nothing moved; your reason is kept. Re-read the task, then decide again." }); return
    }
    if (to === item.status) { setOutcome({ kind: "info", message: `${id} is already in ${label(to)}.` }); return }
    const reason = (demo.reasons[id] ?? "").trim()
    const nextActor = to === "done" ? "" : item.gateRequired && (to === "review" || to === "verify")
      ? `You · ${to === "review" ? "review the plan" : "inspect the result"}`
      : action && item.responsibility ? `${item.responsibility} · ${to === "plan" ? "revise the plan" : "carry out the work"}` : ""
    setDemo(current => {
      const tasks = current.tasks.map(record => record.id === id ? { ...record, status: to, reviews: record.reviews + (action === "sendBack" ? 1 : 0), nextActor,
        decisions: action && reason ? [...record.decisions, `You · ${action === "approve" ? "Approval" : "Request changes"} comment: ${reason}`] : record.decisions,
        updated: "Just now · changed in this demo" } : record)
      return { ...current, tasks: beforeId ? reorder(tasks, id, beforeId) : tasks, reasons: action ? { ...current.reasons, [id]: "" } : current.reasons }
    })
    const message = `${id} ${action === "approve" ? "approved" : action === "sendBack" ? "returned for changes" : "moved"}: ${label(item.status)} to ${label(to)}.${beforeId ? ` Placed before ${beforeId} in the project’s planning order.` : ""}${action === "sendBack" ? ` Review count: ${item.reviews + 1}.` : ""}${to === "done" ? " Find it in Completed or All." : !nextActor ? " The previous next-actor instruction was cleared; record the new next step in Edit task." : ""}${scenario === "read-failure" ? " The saved change is retained while the read is unavailable." : ""}`
    setOutcome({ kind: "success", message }); setNotice(message)
  }
  function orderTask(id: string, before: string | null) {
    const next = reorder(demo.tasks, id, before)
    setDemo(current => ({ ...current, tasks: reorder(current.tasks, id, before) }))
    const record = next.find(item => item.id === id)
    const message = `${id} is now at planning position ${(record?.order ?? 0) + 1}. Board and List use this order.`
    setOutcome({ kind: "success", message }); setNotice(message)
  }
  function transferTask(projectId: string) {
    if (!task) return
    const destination = demo.projects.find(item => item.id === projectId)
    if (destination?.completed && task.status !== "done") { setOutcome({ kind: "refusal", message: "Reopen the destination project first. The task has not moved." }); return }
    const rank = Math.max(-1, ...demo.tasks.filter(item => item.projectId === projectId).map(item => item.order)) + 1
    updateTask(task.id, { projectId, order: rank })
    setOutcome({ kind: "success", message: `${task.id} moved to ${destination?.title ?? "standalone work"}. Its identity, stage, notes, and dependencies are preserved. Back returns to ${title}.` })
  }
  function createTask(event: FormEvent) {
    event.preventDefault()
    const draft = demo.draft ?? emptyDraft()
    if (!draft.title.trim()) return
    if (demo.projects.find(item => item.id === draft.projectId)?.completed) { setFormError("This project is completed. Reopen it or choose an open project."); return }
    const id = `W-${Math.max(0, ...demo.tasks.map(item => Number(item.id.slice(2)))) + 1}`
    const base: Task = { id, title: "", projectId: draft.projectId, status: "todo", intent: "", responsibility: "", nextActor: "", dependsOn: [], order: Math.max(-1, ...demo.tasks.filter(item => item.projectId === draft.projectId).map(item => item.order)) + 1, plan: "", result: "", criteria: [], decisions: [], log: [], gateRequired: false, reviews: 0, updated: "Just now · created in this demo" }
    const created = editedTask(base, draft)
    if (created.dependsOn.includes(id)) { setFormError("A task cannot depend on itself."); return }
    setDemo(current => ({ ...current, tasks: [...current.tasks, created], draft: null }))
    navigate({ composer: "", selected: id, scope: "open", query: "", stage: "todo" }, true, true)
    setOutcome({ kind: "success", message: `${id} created in Todo${draft.projectId ? ` in ${demo.projects.find(item => item.id === draft.projectId)?.title}` : " as standalone work"}.` })
  }
  function saveEdit(): boolean {
    if (!task) return false
    const draft = demo.edits[task.id]
    if (!draft?.title.trim()) return false
    const changed = editedTask(task, draft)
    if (changed.dependsOn.includes(task.id)) { setOutcome({ kind: "refusal", message: "A task cannot depend on itself. Your edit draft is kept." }); return false }
    setDemo(current => {
      const edits = { ...current.edits }; delete edits[task.id]
      return { ...current, tasks: current.tasks.map(item => item.id === task.id ? changed : item), edits }
    })
    setOutcome({ kind: "success", message: `${task.id} updated. Its stage and planning position are unchanged.` })
    return true
  }
  function saveProject(event: FormEvent) {
    event.preventDefault()
    if (!projectDraft.title.trim()) return
    const id = projectDraftKey === "new" ? `project-${Date.now()}` : projectDraftKey
    const next: Project = { id, title: projectDraft.title.trim(), outcome: projectDraft.outcome.trim(), completed: projectDraftKey === "new" ? false : Boolean(project?.completed) }
    setDemo(current => {
      const projectDrafts = { ...current.projectDrafts }; delete projectDrafts[projectDraftKey]
      return { ...current, projects: projectDraftKey === "new" ? [...current.projects, next] : current.projects.map(item => item.id === id ? next : item), projectDrafts }
    })
    const scope: Scope = next.completed ? "completed" : projectDraftKey === "new" ? "open" : nav.scope
    const stage: Stage = scope === "completed" ? "done" : projectDraftKey === "new" ? "todo" : nav.stage
    navigate({ view: "project", projectId: id, selected: "", composer: "", scope, stage, query: projectDraftKey === "new" ? "" : nav.query }, true)
    setNotice(projectDraftKey === "new" ? "Project created. Add its first task when you’re ready." : "Project updated. Its tasks are unchanged.")
    restoreFocus()
  }
  function completeProject() {
    if (!project || (!project.completed && openTasks.length)) return
    setDemo(current => ({ ...current, projects: current.projects.map(item => item.id === project.id ? { ...item, completed: !item.completed } : item) }))
    setProjectCompletion(false)
    chooseScope(project.completed ? "open" : "completed")
    setNotice(`${project.title} ${project.completed ? "reopened" : "completed"}. Task stages are unchanged.`)
  }
  function appendNote(event: FormEvent): Outcome | null {
    event.preventDefault()
    if (!task) return null
    const note = (demo.notes[task.id] ?? "").trim()
    if (!note) return null
    if (/^\s*##\s/m.test(note)) return { kind: "refusal", message: "Use plain text for a comment; a section heading would change its structure. Your comment draft is kept." }
    setDemo(current => ({ ...current, tasks: current.tasks.map(item => item.id === task.id ? { ...item, log: [...item.log, `You · ${note}`], updated: "Just now · comment added in this demo" } : item), notes: { ...current.notes, [task.id]: "" } }))
    return { kind: "success", message: "Your comment was posted." }
  }
  function resetDemo() {
    const fresh = initialDemo(); setDemo(fresh); navRef.current = fresh.navigation
    writeNavigation(fresh.navigation, true); setResetting(false); setScenario("normal"); setOutcome(null); setNotice("Demo reset. The original projects and tasks are restored; saved drafts and reasons are cleared.")
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }))
  }
  function commitDrop(id: string, target: DropTarget) {
    const source = demo.tasks.find(item => item.id === id)
    if (!source || !target.valid) return
    const anchor = demo.tasks.find(item => item.id === target.anchorId)
    if (anchor && anchor.projectId !== source.projectId) { setNotice("Task not moved. Use Move to project for an explicit transfer."); return }
    const stage = nav.layout === "board" ? target.stage : source.status
    if (demo.projects.find(item => item.id === source.projectId)?.completed && stage !== "done") { setNotice("Task not moved. Reopen its project first."); return }
    const before = placementBefore(demo.tasks, source, target, nav.layout === "board")
    const nextActor = source.gateRequired && (stage === "review" || stage === "verify") ? `You · ${stage === "review" ? "review the plan" : "inspect the result"}` : ""
    const changed = demo.tasks.map(item => item.id === id && stage !== item.status ? { ...item, status: stage, nextActor, updated: "Just now · moved in this demo" } : item)
    const tasks = reorder(changed, id, before)
    const visible = scopedTasks({ ...demo, tasks }, nav).some(item => item.id === id)
    setDemo(current => ({ ...current, tasks }))
    const message = `${destinationText(id, target, nav.layout === "board")}. Saved.${source.status !== stage ? " Direct move; no approval was recorded." : ""}${visible ? "" : " This task is now outside your current filters."}`
    setNotice(""); setMoveResult({ id, message }); setOutcome({ kind: "success", message })
    requestAnimationFrame(() => {
      if (!workArea.current?.querySelector(`[data-move-handle="${id}"]`)) document.querySelector<HTMLElement>("[data-move-result]")?.focus({ preventScroll: true })
    })
  }
  function taskAsk(item: Task) {
    if (item.gateRequired && item.status === "review") return "Review plan"
    if (item.gateRequired && item.status === "verify") return "Verify result"
    const blocked = blockers(item, demo.tasks)
    const missing = blocked.find(id => !demo.tasks.some(record => record.id === id))
    return missing ? `Locate missing reference ${missing}` : blocked.length ? "Inspect dependencies" : "Open task"
  }
  function taskCard(item: Task) {
    const reasons = attentionReasons(item, demo.tasks)
    const context = demo.projects.find(record => record.id === item.projectId)?.title ?? "Standalone task"
    const target = drag.session?.target
    const marker = target?.anchorId === item.id && target.valid ? target.placement : null
    const position = ordered(demo.tasks.filter(record => record.projectId === item.projectId)).findIndex(record => record.id === item.id) + 1
    return <div className={`ww-task-shell${drag.session?.taskId === item.id ? " ww-task-shell--moving" : ""}`} data-drop-task={item.id}>
      {marker && <div className={`ww-drop-marker ww-drop-marker--${marker}`} aria-hidden="true"><span>{label(marker)} {item.id}</span></div>}
      <Button className="ww-task" aria-pressed={nav.selected === item.id} data-task-id={item.id} onClick={event => openTask(item.id, event.currentTarget)}>
        <span className="ww-task-meta"><span className="ww-code">{nav.layout === "list" ? `${position}. ` : ""}{item.id}</span><span>{label(item.status)}</span></span>
        <span className="ww-task-title">{item.title}</span>
        {nav.view !== "project" && <span className="ww-task-project">{context}</span>}
        <span className="ww-task-responsible">{item.responsibility || "Unassigned"}</span>
        {reasons.length > 0 && <><span className="ww-task-reason">{reasons.join(" · ")}</span><span className="ww-task-action">{taskAsk(item)}</span></>}
      </Button>
      <Button className="ww-drag-handle" data-move-handle={item.id} aria-label={`Move ${item.id}`} title="Drag to move, or activate for placement controls" onPointerDown={event => { setMoveResult(null); drag.pointerDown(event, item.id) }} onClick={event => { if (event.detail === 0) setMoveResult(null); drag.activate(item.id, event.detail === 0) }}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h.01M11 3h.01M5 8h.01M11 8h.01M5 13h.01M11 13h.01" strokeLinecap="round" /></svg><span>Move</span>
      </Button>
      {drag.session?.taskId === item.id && <span className="ww-drag-source-label">Moving {item.id}</span>}
    </div>
  }
  function projectRow(item: Project) {
    const tasks = demo.tasks.filter(record => record.projectId === item.id)
    const next = ordered(tasks.filter(record => record.status !== "done"))[0]
    const completed = tasks.filter(record => record.status === "done").length
    const blocked = tasks.filter(record => blockers(record, demo.tasks).length > 0).length
    const decisions = tasks.filter(record => record.status !== "done" && record.gateRequired && (record.status === "review" || record.status === "verify")).length
    return <li key={item.id}><Button className="ww-project-row" onClick={() => chooseDestination("project", item.id)}>
      <span className="ww-project-description"><span className="ww-project-title">{item.title}</span><span className="ww-project-outcome">{item.outcome || "Outcome not yet described."}</span></span>
      <span className="ww-project-progress"><span>{item.completed ? "Completed project" : `${completed} of ${tasks.length} tasks completed`}</span>{item.completed && <span>{completed} of {tasks.length} tasks completed</span>}{blocked > 0 && <span>{blocked} blocked</span>}{decisions > 0 && <span>{decisions} {decisions === 1 ? "decision" : "decisions"} waiting</span>}{!tasks.length && <span>Ready for its first task</span>}</span>
    </Button>{next && <Button className="ww-project-next" onClick={event => openTask(next.id, event.currentTarget)}>Next in plan: {next.id} · {next.title}<span>{taskAsk(next)}</span></Button>}</li>
  }
  const projectAdministration = project ? <>
    <div className="ww-project-actions"><Button onClick={event => openComposer("project", event.currentTarget)}>{demo.projectDrafts[project.id] ? "Resume project edit" : "Edit project"}</Button><Button aria-expanded={projectCompletion} onClick={() => setProjectCompletion(!projectCompletion)}>{project.completed ? "Reopen project" : "Complete project"}</Button></div>
            {projectCompletion && <section className="ww-project-completion" aria-label="Project completion">
              <h3>{project.completed ? "Reopen this outcome?" : openTasks.length ? `${openTasks.length} open ${openTasks.length === 1 ? "task remains" : "tasks remain"}` : "Is the intended outcome complete?"}</h3>
              <p>{project.completed ? "The project will accept new work again. Completed tasks stay completed until you explicitly reopen them." : openTasks.length ? "Finish or transfer the remaining work before completing the project. Completing a project never completes its tasks for you." : "Task completion is a useful check; you decide whether the project’s outcome is achieved."}</p>
              {!project.completed && openTasks.length > 0 && <div className="ww-related">{openTasks.slice(0, 5).map(item => <Button key={item.id} onClick={event => openTask(item.id, event.currentTarget)}>{item.id} · {item.title}</Button>)}{openTasks.length > 5 && <p>And {openTasks.length - 5} more open tasks in this workspace.</p>}</div>}
              <div className="ww-actions"><Button onClick={() => setProjectCompletion(false)}>Keep as is</Button><Button variant="primary" disabled={!project.completed && openTasks.length > 0} onClick={completeProject}>{project.completed ? "Confirm reopen" : "Confirm project complete"}</Button></div>
            </section>}
  </> : null
  const visibleProjects = demo.projects.filter(item => (nav.scope === "all" || (nav.scope === "completed") === item.completed) && (!nav.query.trim() || `${item.title} ${item.outcome}`.toLowerCase().includes(nav.query.trim().toLowerCase())))
  return <>
    <section className="ww-workspace" aria-label="Warden project workspace">
      <header className="ww-brandbar"><div className="ww-brand">{mark}<span>Warden<small>A PixelOven project</small></span></div><span className="ww-workspace-name">Projects &amp; tasks</span>
        {demo.draft && <Button onClick={event => openComposer("task", event.currentTarget, true)}>Resume task draft</Button>}
        {nav.view !== "project" && <Button variant="primary" onClick={event => openComposer("task", event.currentTarget)}><Icon name="plus" />Add task</Button>}
      </header>
      {mobile && <nav className="ww-mobile-nav" aria-label="Workspace navigation"><Label>Workspace<Select value={nav.view === "project" ? `project:${nav.projectId}` : nav.view} onChange={event => {
        const value = event.target.value
        if (value.startsWith("project:")) chooseDestination("project", value.slice(8)); else chooseDestination(value as Destination)
      }}>{DESTINATIONS.map(item => <option key={item.value} value={item.value}>{item.title}{item.value === "attention" ? ` · ${attentionCount}` : ""}</option>)}<optgroup label="Projects">{demo.projects.map(item => <option key={item.id} value={`project:${item.id}`}>{item.title}{item.completed ? " · completed" : ""}</option>)}</optgroup></Select></Label></nav>}
      <div className={`ww-layout${task ? " ww-layout--detail" : ""}${nav.expanded ? " ww-layout--expanded" : ""}`}>
        {!mobile && <nav className="ww-sidebar" aria-label="Workspace navigation">
          {DESTINATIONS.map(item => <Button key={item.value} className="ww-navitem" aria-current={nav.view === item.value ? "page" : undefined} onClick={() => chooseDestination(item.value)}><span>{item.title}</span>{item.value === "attention" && <span className="ww-count">{attentionCount}</span>}</Button>)}
          <div className="ww-nav-projects"><p>Projects</p>{demo.projects.filter(item => !item.completed).map(item => <Button key={item.id} className="ww-navitem" aria-current={nav.view === "project" && nav.projectId === item.id ? "page" : undefined} onClick={() => chooseDestination("project", item.id)}>{item.title}</Button>)}</div>
        </nav>}
        <main ref={main} className={`ww-main${nav.view === "project" ? " ww-main--project" : ""}`} aria-label={title}>
          <header className="ww-view-heading"><div><h2 ref={heading} tabIndex={-1}>{title}</h2>
            {!(mobile && nav.view === "project" && project) && <p>{isProjects ? "Choose an outcome. Shape the work that gets it there." : nav.view === "all" ? "Work across projects, including standalone tasks." : nav.view === "attention" ? "Required decisions and unresolved dependencies, with a reason for each." : project?.outcome || "Describe the outcome this project should achieve."}</p>}
          </div>{nav.view === "project" && project && <Button variant="primary" disabled={project.completed} onClick={event => openComposer("task", event.currentTarget)}><Icon name="plus" />Add task</Button>}{isProjects && <Button variant="primary" onClick={event => openComposer("project", event.currentTarget)}><Icon name="plus" />{demo.projectDrafts.new ? "Resume project draft" : "New project"}</Button>}</header>
          {nav.view === "project" && project && <>
            {mobile && <details className="ww-project-outcome-disclosure"><summary>Outcome: {(project.outcome || "Describe the intended outcome.").slice(0, 36)}{project.outcome.length > 36 ? "…" : ""}</summary><p>{project.outcome || "Describe the outcome this project should achieve."}</p></details>}
            <div className="ww-project-meta">
              <div className="ww-project-summary" aria-label="Project work counts">
                <Button onClick={() => { navigate({ scope: "all", focus: "all", query: "" }, true) }}>{projectTasks.length} tasks</Button>
                <Button onClick={() => { navigate({ query: "" }, true); chooseScope("completed") }}>{projectTasks.filter(item => item.status === "done").length} completed</Button>
                {project.completed && <strong>Completed project</strong>}
              </div>
              <details className="ww-project-settings" key={project.id}><summary>Project settings</summary>{projectAdministration}</details>
            </div>
            {nextPlanned && <section className="ww-next-plan" aria-label="Next in your plan">
              <div><h3>Next in your plan</h3><Button className="ww-next-task" onClick={event => openTask(nextPlanned.id, event.currentTarget)}>{nextPlanned.id} · {nextPlanned.title}</Button><p>{label(nextPlanned.status)} · {nextPlanned.nextActor || "Next actor not recorded"}</p>
              {blockers(nextPlanned, demo.tasks).length > 0 && <p>{attentionReasons(nextPlanned, demo.tasks).join(". ")}</p>}</div>
              <Button className="ww-plan-order" aria-label="View planning order" title="View planning order" onClick={() => navigate({ layout: "list", layoutChosen: true, scope: "open", focus: "all", query: "" }, true)}>Order</Button>
            </section>}
          </>}
          {scenario === "read-failure" && <div className="ww-read-error" role="alert"><div><strong>The workspace couldn’t refresh.</strong><p>Showing the last saved records; counts may be out of date. Your confirmed changes and drafts remain here.</p></div><Button onClick={() => { setScenario("normal"); setNotice("Read restored. Saved changes are retained; no action was repeated.") }}>Retry read</Button></div>}
          {notice && <p className="ww-notice" role="status">{notice}</p>}
          <div ref={workArea} className="ww-work-area">
          <DragControls drag={drag} demo={demo} board={nav.layout === "board"} />
          <div className="ww-toolbar">
            {nav.view === "project" && <div className="ww-focus" role="group" aria-label="Project work focus">{(["all", "decisions", "blocked"] as const).map(focus => <Button key={focus} aria-pressed={nav.focus === focus} onClick={() => chooseFocus(focus)}>{focus === "all" ? "All work" : label(focus)} <span className="ww-count">{scopedProjectWork.filter(item => focus === "all" || (focus === "decisions" ? item.gateRequired && (item.status === "review" || item.status === "verify") : blockers(item, demo.tasks).length > 0)).length}</span></Button>)}</div>}
            {nav.view === "project" ? <Label className="ww-status-select"><span>Status</span><Select value={nav.scope} onChange={event => chooseScope(event.target.value as Scope)}>{(["open", "completed", "all"] as const).map(scope => <option key={scope} value={scope}>{label(scope)}</option>)}</Select></Label> : <div className="ww-scope" role="group" aria-label={isProjects ? "Project status" : "Task status"}>{(["open", "completed", "all"] as const).map(scope => <Button key={scope} aria-pressed={nav.scope === scope} onClick={() => chooseScope(scope)}>{label(scope)}</Button>)}</div>}
            {!isProjects && <div className="ww-layout-switch" role="group" aria-label="Task layout"><Button aria-pressed={nav.layout === "board"} onClick={() => navigate({ layout: "board", layoutChosen: true }, true)}><Icon name="board" />Board</Button><Button aria-pressed={nav.layout === "list"} onClick={() => navigate({ layout: "list", layoutChosen: true }, true)}><Icon name="list" />List</Button></div>}
            <Label className="ww-search"><span>Search {isProjects ? "projects" : "tasks"}</span><Input type="search" value={nav.query} onChange={event => navigate({ query: event.target.value }, true)} placeholder={isProjects ? "Name or outcome" : "Title, ID, intent, or project"} /></Label>
          </div>
          {(nav.query || nav.focus !== "all" || nav.scope !== "open") && <div className="ww-filter-context"><p>{nav.scope === "completed" ? "Completed work" : nav.scope === "all" ? "Open and completed work" : "Open work"}{nav.focus === "decisions" ? " · required decisions only" : nav.focus === "blocked" ? " · unresolved dependencies only" : ""}{nav.query ? ` · matching “${nav.query}”` : ""}</p><Button onClick={clearFilters}>Clear filters</Button></div>}
          {isProjects ? <>
            <p className="ww-view-count">{visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}</p>
            {visibleProjects.length ? <ul className="ww-project-list">{visibleProjects.map(projectRow)}</ul> : <div className="ww-empty"><h3>{nav.query ? "No matching projects" : "No projects here yet"}</h3><p>{nav.query ? "Try a different search or choose All to include completed projects." : "Create a project to describe an outcome and start shaping its work."}</p><Button onClick={event => openComposer("project", event.currentTarget)}>New project</Button></div>}
          </> : nav.view === "project" && !project ? <div className="ww-empty"><h3>This project is unavailable</h3><p>The link may belong to a different demo session. Your existing projects are still available.</p><Button onClick={() => chooseDestination("projects")}>Open Projects</Button></div> : <>
            <div className="ww-view-context"><span>{shown.length} {shown.length === 1 ? "task" : "tasks"}{nav.query ? " matching search" : ""}</span><span>Planning order within each project</span></div>
            {mobile && nav.layout === "board" && <Label className="ww-phone-stage">Stage<Select value={nav.stage} onChange={event => navigate({ stage: event.target.value as Stage }, true)}>{STAGES.map(stage => <option key={stage} value={stage}>{label(stage)} · {shown.filter(item => item.status === stage).length}</option>)}</Select></Label>}
            {!shown.length ? <div className="ww-empty"><h3>{nav.view === "attention" ? "No tasks need attention in this view" : nav.query ? "No matching tasks" : nav.scope === "completed" ? "No completed tasks yet" : "Room for the next task"}</h3><p>{nav.query ? "Try another search, or choose All to include completed work." : nav.view === "attention" ? "Required gates and unresolved dependencies appear here. Ordinary Review and Verify tasks stay in their projects." : nav.scope === "completed" ? "Completed tasks stay here with their result and notes." : "Capture a task with a title. Refine its intent and completion conditions as the work takes shape."}</p>{nav.scope === "open" && nav.view !== "attention" && !project?.completed && <Button onClick={event => openComposer("task", event.currentTarget)}>Add task</Button>}</div>
              : nav.layout === "list" ? <ul className="ww-list" data-drop-zone="list" aria-label={`${title} tasks`}>{shown.map(item => <li key={item.id}>{taskCard(item)}</li>)}{drag.session && <li className={`ww-drop-end${drag.session.target?.valid && !drag.session.target.anchorId ? " ww-drop-end--active" : ""}`}>Drop at end of this project’s planning order</li>}</ul>
              : <div className="ww-board" role="region" aria-label={`${title} board`} tabIndex={0}>{(mobile ? [nav.stage] : STAGES).map(stage => <section className={`ww-column${drag.session?.target?.valid && drag.session.target.stage === stage ? " ww-column--active" : ""}`} data-drop-zone={stage} key={stage} aria-label={`${label(stage)} tasks`}>
                <header><h3><span className="ww-stage-mark" data-state={stage} aria-hidden="true" />{label(stage)}</h3><span className="ww-count">{shown.filter(item => item.status === stage).length}</span></header><p className="ww-column-description">{STAGE_COPY[stage]}</p>
                <div className="ww-column-tasks">{shown.filter(item => item.status === stage).map(item => <React.Fragment key={item.id}>{taskCard(item)}</React.Fragment>)}{drag.session ? <div className={`ww-drop-end${drag.session.target?.valid && drag.session.target.stage === stage && !drag.session.target.anchorId ? " ww-drop-end--active" : ""}`}>Drop at end of {label(stage)}</div> : !shown.some(item => item.status === stage) && <p className="ww-stage-empty">No {label(stage).toLowerCase()} tasks in this view.</p>}</div>
              </section>)}</div>}
          </>}
          </div>
          {nav.selected && !task && <div className="ww-read-error" role="alert"><p>Task {nav.selected} is unavailable in this demo session. The surrounding workspace is still available.</p><Button onClick={closePanel}>Return to workspace</Button></div>}
        </main>
        {task && <TaskDetail key={task.id} prefix={prefix} task={task} demo={demo} mobile={mobile} expanded={nav.expanded} returnLabel={title}
          outcome={outcome} onClose={closePanel} onExpand={() => navigate({ expanded: !nav.expanded }, true)} onOpen={id => openTask(id)} onProject={id => chooseDestination("project", id)}
          onUpdate={change => updateTask(task.id, change)} onMove={stage => moveTask(task.id, stage)}
          onDecision={action => moveTask(task.id, action === "approve" ? task.status === "review" ? "build" : "done" : task.status === "review" ? "plan" : "build", action)}
          onRead={scenario === "gate-refusal" ? () => { setScenario("normal"); setOutcome({ kind: "info", message: `Re-read complete. ${task.id} remains in ${label(task.status)}. Your reason is kept; no decision was repeated.` }) } : undefined}
          onEdit={draft => setDemo(current => { const edits = { ...current.edits }; if (draft) edits[task.id] = draft; else delete edits[task.id]; return { ...current, edits } })}
          onSaveEdit={saveEdit} onTransfer={transferTask} onReorder={before => orderTask(task.id, before)}
          onReason={value => setDemo(current => ({ ...current, reasons: { ...current.reasons, [task.id]: value } }))}
          onNote={value => setDemo(current => ({ ...current, notes: { ...current.notes, [task.id]: value } }))} onAppend={appendNote}
        />}
      </div>
      {nav.composer === "task" && draftConflict && <Panel label={`${prefix}-draft-choice`} modal className="ww-composer" onClose={closePanel}>
        <header className="ww-panel-header"><Button onClick={closePanel}><Icon name="back" />Back to work</Button></header>
        <div className="ww-compose-form"><h2 id={`${prefix}-draft-choice`} tabIndex={-1} data-panel-focus>A task draft is already saved</h2>
          <p><strong>{demo.draft?.title || "Untitled task"}</strong> belongs to {demo.projects.find(item => item.id === demo.draft?.projectId)?.title ?? "standalone work"}. Resume it, or explicitly discard it before starting another task.</p>
          <p>The new task will start in {nav.view === "project" ? project?.title : "standalone work"}.</p>
          <div className="ww-actions"><Button onClick={() => { setDemo(current => ({ ...current, draft: emptyDraft(nav.view === "project" ? nav.projectId : "") })); setDraftConflict(false) }}>Discard draft and start here</Button><Button variant="primary" onClick={() => setDraftConflict(false)}>Resume saved draft</Button></div>
        </div>
      </Panel>}
      {nav.composer === "task" && !draftConflict && <TaskComposer prefix={prefix} demo={demo} draft={demo.draft ?? emptyDraft()} onChange={draft => setDemo(current => ({ ...current, draft }))} onClose={closePanel} onCreate={createTask} stored={stored} error={formError} onDiscard={() => { setDemo(current => ({ ...current, draft: null })); closePanel(); setNotice("Task draft discarded.") }} />}
      {nav.composer === "project" && <ProjectComposer prefix={prefix} editing={projectDraftKey !== "new"} draft={projectDraft} onChange={draft => setDemo(current => ({ ...current, projectDrafts: { ...current.projectDrafts, [projectDraftKey]: draft } }))} onClose={closePanel} onSave={saveProject} onDiscard={() => { setDemo(current => { const projectDrafts = { ...current.projectDrafts }; delete projectDrafts[projectDraftKey]; return { ...current, projectDrafts } }); closePanel(); setNotice("Project draft discarded.") }} />}
    </section>
    {moveResult && <aside className="ww-move-confirmation" aria-label="Move saved"><p role="status">{moveResult.message}</p><div className="ww-actions">
      <Button data-move-result onClick={event => { openTask(moveResult.id, event.currentTarget); setMoveResult(null) }}>Open {moveResult.id}</Button>
      <Button onClick={() => { const moved = demo.tasks.find(item => item.id === moveResult.id); if (moved) { chooseDestination(moved.projectId ? "project" : "all", moved.projectId); navigate({ scope: moved.status === "done" ? "completed" : "open", focus: "all", stage: moved.status, query: "" }, true) } setMoveResult(null) }}>Show in work</Button>
      <Button onClick={() => setMoveResult(null)}>Dismiss</Button>
    </div></aside>}
    <aside className="ww-demo" aria-label="Prototype controls">
      <p><strong>Demo storage.</strong> {stored ? "Workspace, drafts, and reasons stay in this tab through reloads. Reset clears this demo’s session data." : "Browser storage is unavailable. Changes last only while this page is open."}</p>
      <Label>Demo state<Select value={scenario} onChange={event => { setScenario(event.target.value as Scenario); setOutcome(null) }}><option value="normal">Working normally</option><option value="read-failure">Workspace read fails</option><option value="gate-refusal">Gate action is refused</option></Select></Label>
      <Button aria-expanded={resetting} onClick={() => setResetting(!resetting)}>Reset demo</Button>
      {resetting && <div className="ww-reset"><p>Restore the original projects and tasks? All demo changes, drafts, and reasons in this tab will be cleared.</p><div className="ww-actions"><Button onClick={() => setResetting(false)}>Keep my changes</Button><Button onClick={resetDemo}>Confirm reset</Button></div></div>}
    </aside>
  </>
}
