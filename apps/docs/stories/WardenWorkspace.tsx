import React, { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Button, Input, Label, Select } from "@pixeloven/ui"
import {
  createIdeaProposal, acceptEpicOutcome, reopenEpic, epics, workIssues, isEpic, makeWorkIssue, nextIssueNumber, emptyIdeaDraft, emptyEpicDraft, DEFAULT_NAV, STAGES, STORAGE_KEY, attentionReasons, blockers, editedTask, emptyDraft, initialDemo,
  label, navigationFromUrl, ordered, readDemo, reorder, scopedTasks, writeNavigation,
  type Demo, type Destination, type Focus, type Navigation, type EpicIssue as Project, type Issue, type Scenario, type Scope, type Stage, type Task, type TaskDraft,
} from "./WardenWorkspace.model"
import { Icon, Panel, ProjectComposer, TaskComposer, TaskDetail, type Outcome } from "./WardenWorkspace.panels"
import { destinationText, placementBefore, useTaskDrag, type DropTarget } from "./WardenWorkspace.drag"
import { DragControls } from "./WardenWorkspace.drag-controls"
import { IdeaComposer } from "./WardenIdea"
import "./WardenWorkspace.css"

const DESTINATIONS: { value: Destination; title: string }[] = [
  { value: "projects", title: "Epics" }, { value: "all", title: "All issues" }, { value: "attention", title: "Needs attention" },
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
  const [pendingIssueDraft, setPendingIssueDraft] = useState<TaskDraft | null>(null)
  const [projectCompletion, setProjectCompletion] = useState(false)
  const [acceptOutcome, setAcceptOutcome] = useState(false)
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
  const project = epics(demo).find(item => item.id === nav.epicId)
  const task = workIssues(demo).find(item => item.id === nav.selected)
  const shown = scopedTasks(demo, nav)
  const attentionCount = workIssues(demo).filter(item => attentionReasons(item, demo.issues).length > 0).length
  const isProjects = nav.view === "projects"
  const title = nav.view === "project" ? project?.title ?? "Epic unavailable" : DESTINATIONS.find(item => item.value === nav.view)?.title ?? "Epics"
  const projectTasks = project ? workIssues(demo).filter(item => item.epicId === project.id) : []
  const openTasks = projectTasks.filter(item => item.status !== "done")
  const nextPlanned = ordered(openTasks)[0]
  const scopedProjectWork = scopedTasks(demo, { ...nav, focus: "all", query: "" })
  const drag = useTaskDrag({ demo, board: nav.layout === "board", root: workArea, scroll: main,
    context: JSON.stringify([nav.view, nav.epicId, nav.layout, nav.scope, nav.focus, nav.query]),
    onDrop: commitDrop, onCancel: id => setNotice(`${id} was not moved. Its stage and planning order are unchanged.`),
  })
  const projectDraftKey = nav.view === "project" && project ? project.id : "new"
  const projectDraft = demo.epicDrafts[projectDraftKey] ?? { ...emptyEpicDraft(), ...(projectDraftKey === "new" ? {} : project) }

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
      if (previous.selected && !next.selected && previous.view === next.view && previous.epicId === next.epicId) {
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
  function chooseDestination(view: Destination, epicId = "") {
    const scope: Scope = view === "project" && epics(demo).find(item => item.id === epicId)?.status === "done" ? "completed" : "open"
    const candidates = scopedTasks(demo, { ...navRef.current, view, epicId, scope, focus: "all", query: "" })
    const stage = scope === "completed" ? "done" : STAGES.find(value => candidates.some(item => item.status === value)) ?? "todo"
    navigate({ view, epicId, selected: "", composer: "", scope, focus: "all", stage, layout: !nav.layoutChosen ? "list" : nav.layout, query: "", expanded: false })
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
    if (demo.issues.some(item => item.id === id && isEpic(item))) { chooseDestination("project", id); return }
    if (!nav.selected) captureOrigin(source)
    navigate({ selected: id, composer: "" }, Boolean(nav.selected), true)
    setOutcome(null)
  }
  function openComposer(kind: "task" | "project" | "idea", source: HTMLElement, resume = false) {
    if (kind === "project" && nav.view !== "project") kind = "idea"
    captureOrigin(source)
    setPendingIssueDraft(null)
    setDraftConflict(kind === "task" && Boolean(demo.draft) && !resume)
    if (kind === "task" && !demo.draft) setDemo(current => ({ ...current, draft: emptyDraft(nav.view === "project" ? nav.epicId : "") }))
    if (kind === "idea" && !demo.ideaDraft) setDemo(current => ({ ...current, ideaDraft: emptyIdeaDraft() }))
    setFormError("")
    navigate({ composer: kind }, false, true)
  }
  function updateTask(id: string, change: Partial<Task>) {
    setDemo(current => ({ ...current, issues: current.issues.map(item => item.id === id && !isEpic(item) ? { ...item, ...change, updated: "Just now · edited in this demo" } : item) }))
  }
  function moveTask(id: string, to: Stage, action?: "approve" | "sendBack", beforeId?: string) {
    const item = workIssues(demo).find(record => record.id === id)
    if (!item) return
    if (epics(demo).find(record => record.id === item.epicId)?.status === "done" && to !== "done") {
      setOutcome({ kind: "refusal", message: "Reopen the Epic before adding open work. This issue has not changed." }); return
    }
    if (action && scenario === "gate-refusal") {
      setOutcome({ kind: "refusal", message: "The issue changed before this decision completed. Nothing moved; your reason is kept. Re-read the issue, then decide again." }); return
    }
    if (to === item.status) { setOutcome({ kind: "info", message: `${id} is already in ${label(to)}.` }); return }
    const reason = (demo.reasons[id] ?? "").trim()
    const nextActor = to === "done" ? "" : item.gateRequired && (to === "review" || to === "verify")
      ? `You · ${to === "review" ? "review the plan" : "inspect the result"}`
      : action && item.responsibility ? `${item.responsibility} · ${to === "plan" ? "revise the plan" : "carry out the work"}` : ""
    setDemo(current => {
      const tasks = current.issues.map(record => record.id === id && !isEpic(record) ? { ...record, status: to, reviews: record.reviews + (action === "sendBack" ? 1 : 0), nextActor,
        decisions: action && reason ? [...record.decisions, `You · ${action === "approve" ? "Approval" : "Request changes"} comment: ${reason}`] : record.decisions,
        updated: "Just now · changed in this demo" } : record)
      return { ...current, issues: beforeId ? reorder(tasks, id, beforeId) : tasks, reasons: action ? { ...current.reasons, [id]: "" } : current.reasons }
    })
    const message = `${id} ${action === "approve" ? "approved" : action === "sendBack" ? "returned for changes" : "moved"}: ${label(item.status)} to ${label(to)}.${beforeId ? ` Placed before ${beforeId} in the Epic’s planning order.` : ""}${action === "sendBack" ? ` Review count: ${item.reviews + 1}.` : ""}${to === "done" ? " Find it in Completed or All." : !nextActor ? " The previous next-actor instruction was cleared; record the new next step in Edit issue." : ""}${scenario === "read-failure" ? " The saved change is retained while the read is unavailable." : ""}`
    setOutcome({ kind: "success", message }); setNotice(message)
  }
  function orderTask(id: string, before: string | null) {
    const next = reorder(workIssues(demo), id, before)
    setDemo(current => ({ ...current, issues: reorder(current.issues, id, before) }))
    const record = next.find(item => item.id === id)
    const message = `${id} is now at planning position ${(record?.order ?? 0) + 1}. Board and List use this order.`
    setOutcome({ kind: "success", message }); setNotice(message)
  }
  function transferTask(epicId: string) {
    if (!task) return
    const destination = epics(demo).find(item => item.id === epicId)
    if (destination?.status === "done" && task.status !== "done") { setOutcome({ kind: "refusal", message: "Reopen the destination Epic first. The issue has not moved." }); return }
    const rank = Math.max(-1, ...workIssues(demo).filter(item => item.epicId === epicId).map(item => item.order)) + 1
    updateTask(task.id, { epicId, order: rank })
    setOutcome({ kind: "success", message: `${task.id} moved to ${destination?.title ?? "standalone work"}. Its identity, stage, notes, and dependencies are preserved. Back returns to ${title}.` })
  }
  function createTask(event: FormEvent) {
    event.preventDefault()
    const draft = demo.draft ?? emptyDraft()
    if (!draft.title.trim()) return
    if (epics(demo).find(item => item.id === draft.epicId)?.status === "done") { setFormError("This Epic is completed. Reopen it or choose an open Epic."); return }
    const id = `W-${nextIssueNumber(demo.issues)}`
    const base = makeWorkIssue(id, "", "todo", draft.epicId, Math.max(-1, ...workIssues(demo).filter(item => item.epicId === draft.epicId).map(item => item.order)) + 1)
    const created = editedTask(base, draft)
    if (created.dependsOn.includes(id)) { setFormError("A issue cannot depend on itself."); return }
    setDemo(current => ({ ...current, issues: [...current.issues, created], draft: null }))
    navigate({ view: draft.epicId ? "project" : "all", epicId: draft.epicId, composer: "", selected: id, scope: "open", query: "", stage: "todo" }, true, true)
    setOutcome({ kind: "success", message: `${id} created in Todo${draft.epicId ? ` in ${epics(demo).find(item => item.id === draft.epicId)?.title}` : " as standalone work"}.` })
  }
  function saveEdit(): boolean {
    if (!task) return false
    const draft = demo.edits[task.id]
    if (!draft?.title.trim()) return false
    const changed = editedTask(task, draft)
    if (changed.dependsOn.includes(task.id)) { setOutcome({ kind: "refusal", message: "A issue cannot depend on itself. Your edit draft is kept." }); return false }
    setDemo(current => {
      const edits = { ...current.edits }; delete edits[task.id]
      return { ...current, issues: current.issues.map(item => item.id === task.id ? changed : item), edits }
    })
    setOutcome({ kind: "success", message: `${task.id} updated. Its stage and planning position are unchanged.` })
    return true
  }
  function startStandaloneFromIdea() {
    const idea = demo.ideaDraft ?? emptyIdeaDraft()
    const proposal = idea.proposals.length === 1 ? idea.proposals[0] : null
    const draft: TaskDraft = { ...emptyDraft(), type: proposal?.type ?? "task", title: proposal?.title || idea.title, intent: [idea.originalIdea, idea.outcome].filter(Boolean).join("\n\n"), criteria: proposal?.criteria || idea.finishLine }
    setPendingIssueDraft(draft)
    setDraftConflict(Boolean(demo.draft))
    if (!demo.draft) setDemo(current => ({ ...current, draft }))
    navigate({ composer: "task" }, true, true)
  }
  function createIdea() {
    if (!demo.ideaDraft) return
    const created = createIdeaProposal(demo, demo.ideaDraft)
    if (created.error) { setFormError(created.error); return }
    const navigation: Navigation = { ...navRef.current, view: "project", epicId: created.epicId, selected: "", composer: "", scope: "open", focus: "all", stage: "todo", query: "", layout: "list", expanded: false }
    setDemo({ ...created.demo, navigation })
    navRef.current = navigation
    writeNavigation(navigation, true)
    setNotice(`${created.epicId} and ${created.issueIds.length} issues created together in Todo. No execution started and no approval was recorded. Open the first issue to direct its next action.`)
    requestAnimationFrame(() => { if (main.current) main.current.scrollTop = 0; heading.current?.focus({ preventScroll: true }) })
  }
  function saveProject(event: FormEvent) {
    event.preventDefault()
    if (!project || !projectDraft.title.trim()) return
    const next = { ...project, ...projectDraft, title: projectDraft.title.trim(), intent: projectDraft.originalIdea, updated: "Just now · Epic edited in this demo" }
    setDemo(current => {
      const epicDrafts = { ...current.epicDrafts }; delete epicDrafts[project.id]
      return { ...current, issues: current.issues.map(item => item.id === project.id ? next : item), epicDrafts }
    })
    closePanel()
    setNotice("Epic updated. Its child issues and statuses are unchanged.")
  }
  function completeProject() {
    if (!project) return
    const reopening = project.status === "done"
    const changed = reopening ? reopenEpic(demo, project.id) : acceptEpicOutcome(demo, project.id, demo.reasons[project.id] ?? "", acceptOutcome)
    if (changed.error) { setNotice(changed.error); return }
    setDemo(changed.demo)
    setProjectCompletion(false); setAcceptOutcome(false)
    chooseScope(reopening ? "open" : "completed")
    setNotice(`${project.title} ${reopening ? "reopened" : "accepted and completed"}. Child issue statuses are unchanged.`)
  }
  function appendEpicNote(event: FormEvent) {
    event.preventDefault()
    if (!project) return
    const note = (demo.notes[project.id] ?? "").trim()
    if (!note) return
    setDemo(current => ({ ...current, issues: current.issues.map(item => item.id === project.id ? { ...item, log: [...item.log, `You · ${note}`], updated: "Just now · comment added in this demo" } : item), notes: { ...current.notes, [project.id]: "" } }))
    setNotice("Comment added to the Epic.")
  }
  function appendNote(event: FormEvent): Outcome | null {
    event.preventDefault()
    if (!task) return null
    const note = (demo.notes[task.id] ?? "").trim()
    if (!note) return null
    if (/^\s*##\s/m.test(note)) return { kind: "refusal", message: "Use plain text for a comment; a section heading would change its structure. Your comment draft is kept." }
    setDemo(current => ({ ...current, issues: current.issues.map(item => item.id === task.id ? { ...item, log: [...item.log, `You · ${note}`], updated: "Just now · comment added in this demo" } : item), notes: { ...current.notes, [task.id]: "" } }))
    return { kind: "success", message: "Your comment was posted." }
  }
  function resetDemo() {
    const fresh = initialDemo(); setDemo(fresh); navRef.current = fresh.navigation
    writeNavigation(fresh.navigation, true); setResetting(false); setScenario("normal"); setOutcome(null); setNotice("Demo reset. The original Epics and issues are restored; saved drafts and reasons are cleared.")
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }))
  }
  function commitDrop(id: string, target: DropTarget) {
    const source = workIssues(demo).find(item => item.id === id)
    if (!source || !target.valid) return
    const anchor = workIssues(demo).find(item => item.id === target.anchorId)
    if (anchor && anchor.epicId !== source.epicId) { setNotice("Issue not moved. Use Move to Epic for an explicit transfer."); return }
    const stage = nav.layout === "board" ? target.stage : source.status
    if (epics(demo).find(item => item.id === source.epicId)?.status === "done" && stage !== "done") { setNotice("Issue not moved. Reopen its Epic first."); return }
    const before = placementBefore(workIssues(demo), source, target, nav.layout === "board")
    const nextActor = source.gateRequired && (stage === "review" || stage === "verify") ? `You · ${stage === "review" ? "review the plan" : "inspect the result"}` : ""
    const changed = demo.issues.map(item => item.id === id && stage !== item.status ? { ...item, status: stage, nextActor, updated: "Just now · moved in this demo" } : item)
    const tasks = reorder(changed, id, before)
    const visible = scopedTasks({ ...demo, issues: tasks }, nav).some(item => item.id === id)
    setDemo(current => ({ ...current, issues: tasks }))
    const message = `${destinationText(id, target, nav.layout === "board")}. Saved.${source.status !== stage ? " Direct move; no approval was recorded." : ""}${visible ? "" : " This issue is now outside your current filters."}`
    setNotice(""); setMoveResult({ id, message }); setOutcome({ kind: "success", message })
    requestAnimationFrame(() => {
      if (!workArea.current?.querySelector(`[data-move-handle="${id}"]`)) document.querySelector<HTMLElement>("[data-move-result]")?.focus({ preventScroll: true })
    })
  }
  function taskAsk(item: Task) {
    if (item.gateRequired && item.status === "review") return "Review plan"
    if (item.gateRequired && item.status === "verify") return "Verify result"
    const blocked = blockers(item, demo.issues)
    const missing = blocked.find(id => !demo.issues.some(record => record.id === id))
    return missing ? `Locate missing reference ${missing}` : blocked.length ? "Inspect dependencies" : "Open issue"
  }
  function taskCard(item: Issue) {
    if (isEpic(item)) return <Button className="ww-task ww-epic-issue" data-task-id={item.id} onClick={() => chooseDestination("project", item.id)}><span className="ww-task-meta"><span className="ww-code">{item.id}</span><span>Epic · {label(item.status)}</span></span><span className="ww-task-title">{item.title}</span><span className="ww-task-project">{item.outcome}</span><span className="ww-task-action">Open outcome and ordered work</span></Button>
    const reasons = attentionReasons(item, demo.issues)
    const context = epics(demo).find(record => record.id === item.epicId)?.title ?? "Standalone issue"
    const target = drag.session?.target
    const marker = target?.anchorId === item.id && target.valid ? target.placement : null
    const position = ordered(workIssues(demo).filter(record => record.epicId === item.epicId)).findIndex(record => record.id === item.id) + 1
    return <div className={`ww-task-shell${drag.session?.taskId === item.id ? " ww-task-shell--moving" : ""}`} data-drop-task={item.id}>
      {marker && <div className={`ww-drop-marker ww-drop-marker--${marker}`} aria-hidden="true"><span>{label(marker)} {item.id}</span></div>}
      <Button className="ww-task" aria-pressed={nav.selected === item.id} data-task-id={item.id} onClick={event => openTask(item.id, event.currentTarget)}>
        <span className="ww-task-meta"><span className="ww-code">{nav.layout === "list" ? `${position}. ` : ""}{item.id}</span><span>{label(item.type)} · {label(item.status)}</span></span>
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
    const tasks = workIssues(demo).filter(record => record.epicId === item.id)
    const next = ordered(tasks.filter(record => record.status !== "done"))[0]
    const completed = tasks.filter(record => record.status === "done").length
    const blocked = tasks.filter(record => blockers(record, workIssues(demo)).length > 0).length
    const decisions = tasks.filter(record => record.status !== "done" && record.gateRequired && (record.status === "review" || record.status === "verify")).length
    return <li key={item.id}><Button className="ww-project-row" onClick={() => chooseDestination("project", item.id)}>
      <span className="ww-project-description"><span className="ww-project-title">{item.title}</span><span className="ww-project-outcome">{item.outcome || "Outcome not yet described."}</span></span>
      <span className="ww-project-progress"><span>{item.status === "done" ? "Completed Epic" : `${completed} of ${tasks.length} issues completed`}</span>{item.status === "done" && <span>{completed} of {tasks.length} issues completed</span>}{blocked > 0 && <span>{blocked} blocked</span>}{decisions > 0 && <span>{decisions} {decisions === 1 ? "decision" : "decisions"} waiting</span>}{!tasks.length && <span>Ready for its first issue</span>}</span>
    </Button>{next && <Button className="ww-project-next" onClick={event => openTask(next.id, event.currentTarget)}>First unfinished: {next.id} · {next.title}<span>{taskAsk(next)}</span></Button>}</li>
  }
  const projectAdministration = project ? <>
    <div className="ww-project-actions"><Button onClick={event => openComposer("project", event.currentTarget)}>{demo.epicDrafts[project.id] ? "Resume Epic edit" : "Edit Epic"}</Button><Button aria-expanded={projectCompletion} onClick={() => { setProjectCompletion(!projectCompletion); setAcceptOutcome(false) }}>{project.status === "done" ? "Reopen Epic" : "Accept outcome & complete"}</Button></div>
    {projectCompletion && <section className="ww-project-completion" aria-label="Epic outcome acceptance">
      <h3>{project.status === "done" ? "Reopen this outcome?" : openTasks.length ? `${openTasks.length} open ${openTasks.length === 1 ? "issue remains" : "issues remain"}` : "Has the observable finish line been achieved?"}</h3>
      <p>{project.status === "done" ? "The Epic will return to Todo. Its completed child issues and previous acceptance notes stay in the record." : openTasks.length ? "Finish or transfer every open child issue before accepting this outcome. Completing an Epic never completes its children for you." : "Done child issues are a useful check. The outcome still needs your explicit acceptance."}</p>
      {project.status !== "done" && openTasks.length > 0 && <div className="ww-related">{openTasks.slice(0, 5).map(item => <Button key={item.id} onClick={event => openTask(item.id, event.currentTarget)}>{item.id} · {item.title}</Button>)}{openTasks.length > 5 && <p>And {openTasks.length - 5} more open issues.</p>}</div>}
      {project.status !== "done" && !openTasks.length && <div className="ww-fields"><p><strong>Finish line:</strong> {project.finishLine || "Not recorded. Edit this Epic to add an observable finish line first."}</p><Label className="ww-accept-outcome"><Input type="checkbox" checked={acceptOutcome} disabled={!project.finishLine.trim()} onChange={event => setAcceptOutcome(event.target.checked)} /><span>I have checked that this finish line is achieved.</span></Label><Label>Outcome acceptance note<textarea rows={3} value={demo.reasons[project.id] ?? ""} onChange={event => setDemo(current => ({ ...current, reasons: { ...current.reasons, [project.id]: event.target.value } }))} placeholder="What did you observe, and where is the supporting evidence?" /></Label><p className="ww-hint">Your acceptance note draft is kept until you confirm.</p></div>}
      <div className="ww-actions"><Button onClick={() => setProjectCompletion(false)}>Keep as is</Button><Button variant="primary" disabled={project.status !== "done" && (openTasks.length > 0 || !project.finishLine.trim() || !acceptOutcome || !(demo.reasons[project.id] ?? "").trim())} onClick={completeProject}>{project.status === "done" ? "Confirm reopen" : "Accept outcome & complete Epic"}</Button></div>
    </section>}
  </> : null
  const visibleProjects = epics(demo).filter(item => (nav.scope === "all" || (nav.scope === "completed") === (item.status === "done")) && (!nav.query.trim() || `${item.title} ${item.outcome}`.toLowerCase().includes(nav.query.trim().toLowerCase())))
  return <>
    <section className="ww-workspace" aria-label="Warden Epic workspace">
      <header className="ww-brandbar"><div className="ww-brand">{mark}<span>Warden<small>A PixelOven project</small></span></div><span className="ww-workspace-name">Issues &amp; outcomes · Local demo</span>
        {demo.draft && <Button onClick={event => openComposer("task", event.currentTarget, true)}>Resume issue draft</Button>}
        <Button variant="primary" onClick={event => openComposer("idea", event.currentTarget)}>{demo.ideaDraft ? "Resume idea draft" : "Start with an idea"}</Button>
      </header>
      {mobile && <nav className="ww-mobile-nav" aria-label="Workspace navigation"><Label>Workspace<Select value={nav.view === "project" ? `project:${nav.epicId}` : nav.view} onChange={event => {
        const value = event.target.value
        if (value.startsWith("project:")) chooseDestination("project", value.slice(8)); else chooseDestination(value as Destination)
      }}>{DESTINATIONS.map(item => <option key={item.value} value={item.value}>{item.title}{item.value === "attention" ? ` · ${attentionCount}` : ""}</option>)}<optgroup label="Epics">{epics(demo).map(item => <option key={item.id} value={`project:${item.id}`}>{item.title}{item.status === "done" ? " · completed" : ""}</option>)}</optgroup></Select></Label></nav>}
      <div className={`ww-layout${task ? " ww-layout--detail" : ""}${nav.expanded ? " ww-layout--expanded" : ""}`}>
        {!mobile && <nav className="ww-sidebar" aria-label="Workspace navigation">
          {DESTINATIONS.map(item => <Button key={item.value} className="ww-navitem" aria-current={nav.view === item.value ? "page" : undefined} onClick={() => chooseDestination(item.value)}><span>{item.title}</span>{item.value === "attention" && <span className="ww-count">{attentionCount}</span>}</Button>)}
          <div className="ww-nav-projects"><p>Epics</p>{epics(demo).filter(item => item.status !== "done").map(item => <Button key={item.id} className="ww-navitem" aria-current={nav.view === "project" && nav.epicId === item.id ? "page" : undefined} onClick={() => chooseDestination("project", item.id)}>{item.title}</Button>)}</div>
        </nav>}
        <main ref={main} className={`ww-main${nav.view === "project" ? " ww-main--project" : ""}`} aria-label={title}>
          <header className="ww-view-heading"><div><h2 ref={heading} tabIndex={-1}>{title}</h2>
            {nav.view !== "project" && <p>{isProjects ? "An Epic is an outcome. Start with an idea, then shape the issues that help achieve it." : nav.view === "all" ? "Every Epic, Story, Task, and Bug, including standalone work." : "Required decisions and unresolved dependencies, with a reason for each."}</p>}
          </div><Button disabled={project?.status === "done"} onClick={event => openComposer("task", event.currentTarget)}><Icon name="plus" />New issue</Button></header>
          {nav.view === "project" && project && <>
            <section className="ww-epic-outcome" aria-label="Epic outcome and finish line"><p className="ww-epic-record">Epic · {project.id} · {label(project.status)}</p><h3>Desired outcome</h3><p>{project.outcome || "Outcome not yet described. Edit this Epic to record it."}</p><h3>Finish line</h3><p>{project.finishLine || "Not recorded in this saved Epic. Edit the Epic to make its finish line observable."}</p>{project.status === "done" && <p><strong>Acceptance:</strong> {project.acceptanceNote || "Previously completed in v2; no explicit outcome acceptance note was recorded."}</p>}</section>
            <div className="ww-project-meta">
              <div className="ww-project-summary" aria-label="Epic work counts">
                <Button onClick={() => { navigate({ scope: "all", focus: "all", query: "" }, true) }}>{projectTasks.length} issues</Button>
                <Button onClick={() => { navigate({ query: "" }, true); chooseScope("completed") }}>{projectTasks.filter(item => item.status === "done").length} completed</Button>
                {project.status === "done" && <strong>Completed Epic</strong>}
              </div>
              <details className="ww-project-settings" key={project.id} open={projectCompletion || undefined}><summary>Epic details &amp; completion</summary>{projectAdministration}</details>
            </div>
            {nextPlanned && <section className="ww-next-plan" aria-label="First unfinished issue in planning order">
              <div><h3>First unfinished issue</h3><Button className="ww-next-task" onClick={event => openTask(nextPlanned.id, event.currentTarget)}>{nextPlanned.id} · {nextPlanned.title}</Button><p>{label(nextPlanned.type)} · {label(nextPlanned.status)} · {nextPlanned.nextActor || "Next action not recorded — open this issue to direct it"}</p>
              {blockers(nextPlanned, demo.issues).length > 0 && <p>{attentionReasons(nextPlanned, demo.issues).join(". ")}</p>}</div>
              <Button className="ww-plan-order" aria-label="View planning order" title="View planning order" onClick={() => navigate({ layout: "list", layoutChosen: true, scope: "open", focus: "all", query: "" }, true)}>Order</Button>
            </section>}
            {!nextPlanned && project.status !== "done" && <section className="ww-next-plan"><div><h3>Next action</h3><p>{projectTasks.length ? "All child issues are Done. Review the finish line before accepting this outcome." : "This Epic has no child issues. Add useful work, or review whether the finish line is already achieved."}</p></div><Button onClick={() => setProjectCompletion(true)}>Review finish line</Button></section>}
          </>}
          {scenario === "read-failure" && <div className="ww-read-error" role="alert"><div><strong>The workspace couldn’t refresh.</strong><p>Showing the last saved records; counts may be out of date. Your confirmed changes and drafts remain here.</p></div><Button onClick={() => { setScenario("normal"); setNotice("Read restored. Saved changes are retained; no action was repeated.") }}>Retry read</Button></div>}
          {notice && <p className="ww-notice" role="status">{notice}</p>}
          <div ref={workArea} className="ww-work-area">
          <DragControls drag={drag} demo={demo} board={nav.layout === "board"} />
          <div className="ww-toolbar">
            {nav.view === "project" && <div className="ww-focus" role="group" aria-label="Epic work focus">{(["all", "decisions", "blocked"] as const).map(focus => <Button key={focus} aria-pressed={nav.focus === focus} onClick={() => chooseFocus(focus)}>{focus === "all" ? "All work" : label(focus)} <span className="ww-count">{scopedProjectWork.filter(item => focus === "all" || (focus === "decisions" ? item.gateRequired && (item.status === "review" || item.status === "verify") : blockers(item, demo.issues).length > 0)).length}</span></Button>)}</div>}
            {nav.view === "project" ? <Label className="ww-status-select"><span>Status</span><Select value={nav.scope} onChange={event => chooseScope(event.target.value as Scope)}>{(["open", "completed", "all"] as const).map(scope => <option key={scope} value={scope}>{label(scope)}</option>)}</Select></Label> : <div className="ww-scope" role="group" aria-label={isProjects ? "Epic status" : "Issue status"}>{(["open", "completed", "all"] as const).map(scope => <Button key={scope} aria-pressed={nav.scope === scope} onClick={() => chooseScope(scope)}>{label(scope)}</Button>)}</div>}
            {!isProjects && <div className="ww-layout-switch" role="group" aria-label="Issue layout"><Button aria-pressed={nav.layout === "list"} onClick={() => navigate({ layout: "list", layoutChosen: true }, true)}><Icon name="list" />List</Button><Button aria-pressed={nav.layout === "board"} onClick={() => navigate({ layout: "board", layoutChosen: true }, true)}><Icon name="board" />Board</Button></div>}
            <Label className="ww-search"><span>Search {isProjects ? "Epics" : "issues"}</span><Input type="search" value={nav.query} onChange={event => navigate({ query: event.target.value }, true)} placeholder={isProjects ? "Name or outcome" : "Title, ID, intent, or Epic"} /></Label>
          </div>
          {(nav.query || nav.focus !== "all" || nav.scope !== "open") && <div className="ww-filter-context"><p>{nav.scope === "completed" ? "Completed work" : nav.scope === "all" ? "Open and completed work" : "Open work"}{nav.focus === "decisions" ? " · required decisions only" : nav.focus === "blocked" ? " · unresolved dependencies only" : ""}{nav.query ? ` · matching “${nav.query}”` : ""}</p><Button onClick={clearFilters}>Clear filters</Button></div>}
          {isProjects ? <>
            <p className="ww-view-count">{visibleProjects.length} {visibleProjects.length === 1 ? "Epic" : "Epics"}</p>
            {visibleProjects.length ? <ul className="ww-project-list">{visibleProjects.map(projectRow)}</ul> : <div className="ww-empty"><h3>{nav.query ? "No matching Epics" : "No Epics here yet"}</h3><p>{nav.query ? "Try a different search or choose All to include completed Epics." : "Create an Epic to describe an outcome and start shaping its work."}</p><Button onClick={event => openComposer("project", event.currentTarget)}>Start with an idea</Button></div>}
          </> : nav.view === "project" && !project ? <div className="ww-empty"><h3>This Epic is unavailable</h3><p>The link may belong to a different demo session. Your existing Epics are still available.</p><Button onClick={() => chooseDestination("projects")}>Open Epics</Button></div> : <>
            <div className="ww-view-context"><span>{shown.length} {shown.length === 1 ? "issue" : "issues"}{nav.query ? " matching search" : ""}</span><span>Planning order within each Epic</span></div>
            {mobile && nav.layout === "board" && <Label className="ww-phone-stage">Stage<Select value={nav.stage} onChange={event => navigate({ stage: event.target.value as Stage }, true)}>{STAGES.map(stage => <option key={stage} value={stage}>{label(stage)} · {shown.filter(item => item.status === stage).length}</option>)}</Select></Label>}
            {!shown.length ? <div className="ww-empty"><h3>{nav.view === "attention" ? "No issues need attention in this view" : nav.query ? "No matching issues" : nav.scope === "completed" ? "No completed issues yet" : "Room for the next issue"}</h3><p>{nav.query ? "Try another search, or choose All to include completed work." : nav.view === "attention" ? "Required gates and unresolved dependencies appear here. Ordinary Review and Verify issues stay in their Epics." : nav.scope === "completed" ? "Completed issues stay here with their result and notes." : "Capture an issue with a title. Refine its intent and completion conditions as the work takes shape."}</p>{nav.scope === "open" && nav.view !== "attention" && project?.status !== "done" && <Button onClick={event => openComposer("task", event.currentTarget)}>Add issue</Button>}</div>
              : nav.layout === "list" ? <ul className="ww-list" data-drop-zone="list" aria-label={`${title} issues`}>{shown.map(item => <li key={item.id}>{taskCard(item)}</li>)}{drag.session && <li className={`ww-drop-end${drag.session.target?.valid && !drag.session.target.anchorId ? " ww-drop-end--active" : ""}`}>Drop at end of this Epic’s planning order</li>}</ul>
              : <div className="ww-board" role="region" aria-label={`${title} board`} tabIndex={0}>{(mobile ? [nav.stage] : STAGES).map(stage => <section className={`ww-column${drag.session?.target?.valid && drag.session.target.stage === stage ? " ww-column--active" : ""}`} data-drop-zone={stage} key={stage} aria-label={`${label(stage)} issues`}>
                <header><h3><span className="ww-stage-mark" data-state={stage} aria-hidden="true" />{label(stage)}</h3><span className="ww-count">{shown.filter(item => item.status === stage).length}</span></header><p className="ww-column-description">{STAGE_COPY[stage]}</p>
                <div className="ww-column-tasks">{shown.filter(item => item.status === stage).map(item => <React.Fragment key={item.id}>{taskCard(item)}</React.Fragment>)}{drag.session ? <div className={`ww-drop-end${drag.session.target?.valid && drag.session.target.stage === stage && !drag.session.target.anchorId ? " ww-drop-end--active" : ""}`}>Drop at end of {label(stage)}</div> : !shown.some(item => item.status === stage) && <p className="ww-stage-empty">No {label(stage).toLowerCase()} issues in this view.</p>}</div>
              </section>)}</div>}
          </>}
          </div>
          {nav.view === "project" && project && <details className="ww-epic-record-details"><summary>Idea, scope &amp; Epic activity</summary><div className="ww-fields"><section><h3>Original idea and context</h3><p>{project.originalIdea || "Not recorded in this Epic."}</p></section><section><h3>In scope</h3><p>{project.scope || "Not yet specified."}</p><h3>Out of scope</h3><p>{project.outOfScope || "Not yet specified."}</p></section><section><h3>Activity</h3><form className="ww-comment-form" onSubmit={appendEpicNote}><Label>Add an Epic comment<textarea rows={3} value={demo.notes[project.id] ?? ""} onChange={event => setDemo(current => ({ ...current, notes: { ...current.notes, [project.id]: event.target.value } }))} /></Label><div className="ww-comment-submit"><p className="ww-hint">Comment drafts stay with this Epic through reloads.</p><Button type="submit" disabled={!(demo.notes[project.id] ?? "").trim()}>Post comment</Button></div></form>{!project.log.length && !project.decisions.length && <p className="ww-secondary">No comments or decisions yet.</p>}{project.decisions.map((text, index) => <article className="ww-comment" key={`decision-${index}`}><p className="ww-comment-kind">Outcome decision</p><p className="ww-comment-text">{text}</p></article>)}{project.log.map((text, index) => <article className="ww-comment" key={`comment-${index}`}><p className="ww-comment-kind">Comment</p><p className="ww-comment-text">{text}</p></article>)}</section></div></details>}
          {nav.selected && !task && <div className="ww-read-error" role="alert"><p>Issue {nav.selected} is unavailable in this demo session. The surrounding workspace is still available.</p><Button onClick={closePanel}>Return to workspace</Button></div>}
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
      {nav.composer === "idea" && <IdeaComposer prefix={prefix} draft={demo.ideaDraft ?? emptyIdeaDraft()} stored={stored} onChange={ideaDraft => setDemo(current => ({ ...current, ideaDraft }))} onClose={closePanel} onCreate={createIdea} onStandalone={startStandaloneFromIdea} onDiscard={() => { setDemo(current => ({ ...current, ideaDraft: null })); closePanel(); setNotice("Idea draft discarded. No issues were created.") }} />}
      {nav.composer === "task" && draftConflict && <Panel label={`${prefix}-draft-choice`} modal className="ww-composer" onClose={closePanel}>
        <header className="ww-panel-header"><Button onClick={closePanel}><Icon name="back" />Back to work</Button></header>
        <div className="ww-compose-form"><h2 id={`${prefix}-draft-choice`} tabIndex={-1} data-panel-focus>An issue draft is already saved</h2>
          <p><strong>{demo.draft?.title || "Untitled issue"}</strong> belongs to {epics(demo).find(item => item.id === demo.draft?.epicId)?.title ?? "standalone work"}. Resume it, or explicitly discard it before starting another issue.</p>
          <p>The new issue will start in {pendingIssueDraft ? "standalone work, carrying your idea across" : nav.view === "project" ? project?.title : "standalone work"}.{pendingIssueDraft && " Your idea draft remains recoverable."}</p>
          <div className="ww-actions"><Button onClick={() => { setDemo(current => ({ ...current, draft: pendingIssueDraft ?? emptyDraft(nav.view === "project" ? nav.epicId : "") })); setDraftConflict(false) }}>Discard draft and start here</Button><Button variant="primary" onClick={() => setDraftConflict(false)}>Resume saved draft</Button></div>
        </div>
      </Panel>}
      {nav.composer === "task" && !draftConflict && <TaskComposer prefix={prefix} demo={demo} draft={demo.draft ?? emptyDraft()} onChange={draft => setDemo(current => ({ ...current, draft }))} onClose={closePanel} onCreate={createTask} stored={stored} error={formError} onDiscard={() => { setDemo(current => ({ ...current, draft: null })); closePanel(); setNotice("Issue draft discarded.") }} />}
      {nav.composer === "project" && <ProjectComposer prefix={prefix} editing={projectDraftKey !== "new"} draft={projectDraft} onChange={draft => setDemo(current => ({ ...current, epicDrafts: { ...current.epicDrafts, [projectDraftKey]: draft } }))} onClose={closePanel} onSave={saveProject} onDiscard={() => { setDemo(current => { const epicDrafts = { ...current.epicDrafts }; delete epicDrafts[projectDraftKey]; return { ...current, epicDrafts } }); closePanel(); setNotice("Epic draft discarded.") }} />}
    </section>
    {moveResult && <aside className="ww-move-confirmation" aria-label="Move saved"><p role="status">{moveResult.message}</p><div className="ww-actions">
      <Button data-move-result onClick={event => { openTask(moveResult.id, event.currentTarget); setMoveResult(null) }}>Open {moveResult.id}</Button>
      <Button onClick={() => { const moved = workIssues(demo).find(item => item.id === moveResult.id); if (moved) { chooseDestination(moved.epicId ? "project" : "all", moved.epicId); navigate({ scope: moved.status === "done" ? "completed" : "open", focus: "all", stage: moved.status, query: "" }, true) } setMoveResult(null) }}>Show in work</Button>
      <Button onClick={() => setMoveResult(null)}>Dismiss</Button>
    </div></aside>}
    <aside className="ww-demo" aria-label="Prototype controls">
      <p><strong>Browser-local demo.</strong> {stored ? "No production API or agent is connected. Issues, drafts, and comments stay in this tab through reloads. Reset clears this demo’s session data." : "Browser storage is unavailable. Changes last only while this page is open."}</p>
      <Label>Demo state<Select value={scenario} onChange={event => { setScenario(event.target.value as Scenario); setOutcome(null) }}><option value="normal">Working normally</option><option value="read-failure">Workspace read fails</option><option value="gate-refusal">Gate action is refused</option></Select></Label>
      <Button aria-expanded={resetting} onClick={() => setResetting(!resetting)}>Reset demo</Button>
      {resetting && <div className="ww-reset"><p>Restore the original Epics and issues? All demo changes, drafts, and reasons in this tab will be cleared.</p><div className="ww-actions"><Button onClick={() => setResetting(false)}>Keep my changes</Button><Button onClick={resetDemo}>Confirm reset</Button></div></div>}
    </aside>
  </>
}
