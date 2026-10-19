/** Synthetic, browser-local records. These are proposed contracts, not production API types. */
export const STAGES = ["todo", "plan", "review", "build", "verify", "done"] as const
export type Stage = typeof STAGES[number]
export type Scope = "open" | "completed" | "all"
export type Focus = "all" | "decisions" | "blocked"
export type Destination = "projects" | "project" | "all" | "attention"
export type Scenario = "normal" | "read-failure" | "gate-refusal"
export type Project = { id: string; title: string; outcome: string; completed: boolean }
export type Criterion = { text: string; done: boolean }
export type Task = {
  id: string; title: string; projectId: string; status: Stage; intent: string
  responsibility: string; nextActor: string; dependsOn: string[]; order: number
  plan: string; result: string; criteria: Criterion[]; decisions: string[]; log: string[]
  gateRequired: boolean; reviews: number; updated: string
}
export type TaskDraft = { title: string; intent: string; projectId: string; responsibility: string; nextActor: string; criteria: string; dependsOn: string }
export type ProjectDraft = { title: string; outcome: string }
export type Navigation = {
  view: Destination; projectId: string; selected: string; layout: "board" | "list"; layoutChosen?: boolean
  scope: Scope; focus: Focus; query: string; stage: Stage; expanded: boolean; composer: "" | "task" | "project"
}
export type Demo = {
  version: 2; projects: Project[]; tasks: Task[]; draft: TaskDraft | null
  edits: Record<string, TaskDraft>; projectDrafts: Record<string, ProjectDraft>
  reasons: Record<string, string>; notes: Record<string, string>; navigation: Navigation
}
export const STORAGE_KEY = "pixeloven.warden-review.workspace.v2"
export const DEFAULT_NAV: Navigation = { view: "projects", projectId: "", selected: "", layout: "board", layoutChosen: false, scope: "open", focus: "all", query: "", stage: "todo", expanded: false, composer: "" }
export const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
export const emptyDraft = (projectId = ""): TaskDraft => ({ title: "", intent: "", projectId, responsibility: "", nextActor: "", criteria: "", dependsOn: "" })
export function taskDraft(task: Task): TaskDraft {
  return { title: task.title, intent: task.intent, projectId: task.projectId, responsibility: task.responsibility, nextActor: task.nextActor, criteria: task.criteria.map(item => item.text).join("\n"), dependsOn: task.dependsOn.join(", ") }
}
function fixture(id: string, title: string, status: Stage, projectId: string, order: number, extra: Partial<Task> = {}): Task {
  return { id, title, status, projectId, order, intent: "", responsibility: "", nextActor: "", dependsOn: [], plan: "", result: "", criteria: [], decisions: [], log: [], gateRequired: false, reviews: 0, updated: "18 Oct · authored example", ...extra }
}
export function initialDemo(): Demo {
  const projects: Project[] = [
    { id: "reading", title: "Improve note reading", outcome: "Read a note comfortably, follow an internal reference, and return to the same place — at a desk or on a phone.", completed: false },
    { id: "release", title: "Release preparation", outcome: "Give the next release a clear scope, dependable handover, and a useful explanation of what changed.", completed: false },
    { id: "library", title: "Library maintenance", outcome: "Make a large collection easier to navigate by reviewing titles, references, and reading paths in a deliberate order.", completed: false },
    { id: "foundation", title: "Reading foundation", outcome: "Agree a consistent reading measure and a predictable place for note actions.", completed: true },
  ]
  const tasks: Task[] = [
    fixture("W-101", "Give the focused reader room to breathe", "review", "reading", 0, {
      intent: "When a person opens a long note, help them concentrate on its meaning. Keep the originating project within reach without making navigation compete with the text.",
      responsibility: "Reader agent", nextActor: "You · review the plan", gateRequired: true,
      plan: "Use an adjacent reader for a quick inspection and an expanded reading view for longer notes. Keep the title, intent, and completion conditions in the reading flow.\n\nOn a phone, let the note fill the screen. Back returns to the list and the position that opened it. Closing the reader must preserve the search, filter, and selected layout.",
      criteria: [{ text: "Long text remains readable in adjacent and expanded views", done: false }, { text: "Closing the reader restores its originating place", done: false }],
      decisions: ["17 Oct · Author’s example: keep a focused view and an expanded view within the same reading journey."],
      log: ["18 Oct · Author’s example: the plan is ready for a decision; no implementation or testing is claimed."],
    }),
    fixture("W-102", "Follow an internal note and return without losing your place", "plan", "reading", 1, {
      intent: "Let a reader inspect a referenced note, then return to the original note at a useful position.", responsibility: "Reader agent", nextActor: "Reader agent · refine the plan", dependsOn: ["W-101"],
      plan: "Keep a small navigation trail while reading references. If a reference cannot be loaded, preserve the original note and give the missing reference a readable explanation.",
      criteria: [{ text: "Back restores the original note and reading position", done: false }, { text: "Unavailable references leave the original note accessible", done: false }],
    }),
    fixture("W-103", "Validate a short reading visit on a phone", "todo", "reading", 2, {
      intent: "Check that someone can read, decide, and return during a short phone visit, including with enlarged text and the software keyboard open.", responsibility: "You", nextActor: "You · after reader work finishes", dependsOn: ["W-101", "W-102"],
      criteria: [{ text: "Task content and actions remain reachable with the keyboard open", done: false }, { text: "Back returns to the same project, filter, and position", done: false }],
    }),
    fixture("W-104", "Write a concise account of the release", "build", "release", 0, { intent: "Explain what changed, who benefits, and what remains to be checked.", responsibility: "Release agent", nextActor: "Release agent · prepare the draft", plan: "Group the explanation around the reader’s tasks and link each change to its supporting record." }),
    fixture("W-105", "Review the handover outline", "verify", "release", 1, { intent: "Make the handover understandable to someone who did not follow the work.", responsibility: "You", nextActor: "You · inspect the result", gateRequired: true,
      result: "Authored example: the outline separates accepted changes, follow-up work, and recovery instructions. This illustrates a result awaiting review; it is not evidence of a live check.",
      criteria: [{ text: "Accepted changes have useful source references", done: true }, { text: "Remaining work has a clear next action", done: false }], log: ["18 Oct · Author’s example: outline offered for review."] }),
    fixture("W-106", "Reconcile an unavailable release reference", "todo", "release", 2, { intent: "Recover the supporting record before relying on its result.", dependsOn: ["W-099"], nextActor: "You · locate the missing reference" }),
    fixture("W-107", "Check the release-note headings", "verify", "release", 3, { intent: "Keep headings descriptive and consistently ordered.", responsibility: "Release agent", nextActor: "Release agent · record the check", result: "Authored example: a heading outline is ready for inspection. No required human gate is configured for this task." }),
    fixture("W-108", "Collect a useful example of a short task", "todo", "", 0, { intent: "Keep one small standalone task that can be captured without first creating a project.", responsibility: "You", nextActor: "You · choose an example" }),
    fixture("W-109", "Agree the reading measure", "done", "foundation", 0, { intent: "Make long-form reading comfortable across the supported layouts.", responsibility: "You", result: "Authored example: the project’s reading direction was accepted. This is completed synthetic work, not a live delivery record.", criteria: [{ text: "The reading direction is recorded", done: true }] }),
    fixture("W-110", "Record the release scope", "done", "release", 4, { intent: "Keep the intended release boundary easy to find.", responsibility: "You", result: "Authored example: the release scope is recorded alongside its open handover work." }),
  ]
  const subjects = ["Clarify a note title", "Review a source reference", "Check a reading path", "Connect related notes", "Refine a collection description", "Resolve an ambiguous link", "Check a long-form example", "Summarize a navigation decision", "Review a collection entry", "Record an editorial follow-up"]
  for (let index = 0; index < 50; index++) {
    const status = STAGES[index % STAGES.length]
    tasks.push(fixture(`W-${201 + index}`, `${subjects[index % subjects.length]} · collection ${Math.floor(index / 10) + 1}`, status, "library", index, {
      intent: "Review this part of the collection in context and record a clear, useful outcome before moving on.", responsibility: index % 4 ? "Library agent" : "You",
      nextActor: status === "done" ? "" : index % 12 === 2 ? "You · review the plan" : "Library agent · continue the recorded work",
      gateRequired: index % 12 === 2, plan: "Read the surrounding collection, inspect the reference, and record any change in the task’s authored notes.",
      result: status === "done" ? "Authored example: this collection entry has a recorded outcome." : "",
      criteria: [{ text: "The outcome is recorded with its context", done: status === "done" }],
    }))
  }
  return { version: 2, projects, tasks, draft: null, edits: {}, projectDrafts: {}, reasons: {}, notes: {}, navigation: { ...DEFAULT_NAV } }
}
export function readDemo(): Demo {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as Demo | null
    if (value?.version === 2 && Array.isArray(value.tasks) && Array.isArray(value.projects) && value.navigation && value.edits && value.projectDrafts && value.reasons && value.notes) return { ...value, navigation: { ...DEFAULT_NAV, ...value.navigation } }
  } catch { /* A fresh model keeps references and drafts consistent. */ }
  return initialDemo()
}
export function blockers(task: Task, tasks: Task[]): string[] {
  return task.status === "done" ? [] : task.dependsOn.filter(id => tasks.find(item => item.id === id)?.status !== "done")
}
export function attentionReasons(task: Task, tasks: Task[]): string[] {
  if (task.status === "done") return []
  const reasons: string[] = []
  if (task.gateRequired && (task.status === "review" || task.status === "verify")) reasons.push(task.status === "review" ? "Plan needs your approval" : "Result needs your approval")
  const blocked = blockers(task, tasks)
  if (blocked.length) reasons.push(blocked.map(id => tasks.some(item => item.id === id) ? `Waiting for ${id} · ${tasks.find(item => item.id === id)?.title}` : `Missing reference ${id}`).join(" · "))
  return reasons
}
export function ordered(tasks: Task[]): Task[] { return [...tasks].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)) }
export function scopedTasks(demo: Demo, nav: Navigation): Task[] {
  const query = nav.query.trim().toLowerCase()
  return ordered(demo.tasks.filter(task =>
    (nav.view !== "project" || task.projectId === nav.projectId) &&
    (nav.view !== "attention" || attentionReasons(task, demo.tasks).length > 0) &&
    (nav.scope === "all" || (nav.scope === "completed") === (task.status === "done")) &&
    (nav.focus !== "decisions" || task.gateRequired && (task.status === "review" || task.status === "verify")) &&
    (nav.focus !== "blocked" || blockers(task, demo.tasks).length > 0) &&
    (!query || [task.id, task.title, task.intent, demo.projects.find(project => project.id === task.projectId)?.title ?? "Standalone"].join(" ").toLowerCase().includes(query))
  ))
}
export function editedTask(task: Task, draft: TaskDraft): Task {
  const criteria = draft.criteria.split("\n").map(text => text.trim()).filter(Boolean).map(text => ({ text, done: task.criteria.find(item => item.text === text)?.done ?? false }))
  return { ...task, title: draft.title.trim(), intent: draft.intent.trim(), responsibility: draft.responsibility.trim(), nextActor: draft.nextActor.trim(), dependsOn: [...new Set(draft.dependsOn.split(/[,\s]+/).filter(Boolean))], criteria, updated: "Just now · edited in this demo" }
}
export function reorder(tasks: Task[], id: string, beforeId: string | null): Task[] {
  const task = tasks.find(item => item.id === id)
  if (!task || id === beforeId) return tasks
  const siblings = ordered(tasks.filter(item => item.projectId === task.projectId && item.id !== id))
  const index = beforeId ? siblings.findIndex(item => item.id === beforeId) : siblings.length
  if (index < 0) return tasks
  siblings.splice(index, 0, task)
  const ranks = new Map(siblings.map((item, order) => [item.id, order]))
  return tasks.map(item => ranks.has(item.id) ? { ...item, order: ranks.get(item.id)! } : item)
}
export function navigationFromUrl(fallback: Navigation): Navigation {
  const params = new URLSearchParams(window.location.hash.slice(1))
  if (!params.has("wardenView")) return fallback
  const view = params.get("wardenView")
  const scope = params.get("wardenScope")
  const stage = params.get("wardenStage")
  return { ...DEFAULT_NAV, view: ["projects", "project", "all", "attention"].includes(view ?? "") ? view as Destination : "projects", projectId: params.get("wardenProject") ?? "", selected: params.get("wardenTask") ?? "", layout: params.get("wardenLayout") === "list" ? "list" : "board", layoutChosen: params.get("wardenLayoutChosen") === "1", scope: scope === "all" || scope === "completed" ? scope : "open", focus: params.get("wardenFocus") === "decisions" ? "decisions" : params.get("wardenFocus") === "blocked" ? "blocked" : "all", query: params.get("wardenQuery") ?? "", stage: STAGES.includes(stage as Stage) ? stage as Stage : "todo", expanded: params.get("wardenExpanded") === "1", composer: params.get("wardenComposer") === "task" ? "task" : params.get("wardenComposer") === "project" ? "project" : "" }
}
export function writeNavigation(nav: Navigation, replace: boolean, overlay = false) {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const fields = { wardenView: nav.view, wardenProject: nav.projectId, wardenTask: nav.selected, wardenLayout: nav.layout, wardenLayoutChosen: nav.layoutChosen ? "1" : "", wardenScope: nav.scope, wardenFocus: nav.focus, wardenQuery: nav.query, wardenStage: nav.stage, wardenExpanded: nav.expanded ? "1" : "", wardenComposer: nav.composer }
  Object.entries(fields).forEach(([key, value]) => { if (value) params.set(key, value); else params.delete(key) })
  const state = { ...window.history.state, wardenOverlay: overlay }
  window.history[replace ? "replaceState" : "pushState"](state, "", `${window.location.pathname}${window.location.search}#${params}`)
}
