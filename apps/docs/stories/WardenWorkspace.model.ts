/** Authored browser-local demo. Issue records are proposed contracts, not production API types. */
export const STAGES = ["todo", "plan", "review", "build", "verify", "done"] as const
export const WORK_TYPES = ["story", "task", "bug", "spike"] as const
export type Stage = typeof STAGES[number]
export type WorkType = typeof WORK_TYPES[number]
export type IssueType = "epic" | WorkType
export type Scope = "open" | "completed" | "all"
export type Focus = "all" | "decisions" | "blocked"
/** Internal destination names preserve existing bookmarks. A project destination displays an Epic. */
export type Destination = "projects" | "project" | "all" | "attention"
export type Scenario = "normal" | "read-failure" | "gate-refusal"
export type Criterion = { text: string; done: boolean }
type IssueRecord = {
  id: string; title: string; epicId: string; status: Stage; intent: string
  responsibility: string; nextActor: string; dependsOn: string[]; order: number
  plan: string; result: string; criteria: Criterion[]; decisions: string[]; log: string[]
  gateRequired: boolean; reviews: number; updated: string
  /** Local link rendering helper; readable provenance is also kept in the record. */
  sourceIssueId?: string
}
export type WorkIssue = IssueRecord & { type: WorkType }
export type EpicIssue = IssueRecord & {
  type: "epic"; epicId: ""; outcome: string; finishLine: string; originalIdea: string
  scope: string; outOfScope: string; acceptanceNote: string
}
export type Issue = EpicIssue | WorkIssue
/** Existing interaction helpers use Task as a name for any non-Epic issue. */
export type Task = WorkIssue
export type TaskDraft = { type: WorkType; title: string; intent: string; epicId: string; responsibility: string; nextActor: string; criteria: string; dependsOn: string; plan: string; result: string; sourceIssueId?: string }
export type EpicDraft = { title: string; outcome: string; finishLine: string; originalIdea: string; scope: string; outOfScope: string }
export type ProposedIssue = { key: string; type: WorkType; title: string; intent: string; criteria: string }
/** Read-only compatibility shape for drafts authored in the previous preview. */
export type IdeaDraft = EpicDraft & { step: "shape" | "review"; proposals: ProposedIssue[]; sample: boolean }
export type Navigation = {
  view: Destination; epicId: string; selected: string; layout: "board" | "list"; layoutChosen?: boolean
  scope: Scope; focus: Focus; query: string; stage: Stage; expanded: boolean; composer: "" | "task" | "project" | "followup" | "recovery"
}
export type Demo = {
  version: 3; issues: Issue[]; ideaDraft: IdeaDraft | null; draft: TaskDraft | null
  edits: Record<string, TaskDraft>; epicDrafts: Record<string, EpicDraft>
  followUpDrafts: Record<string, TaskDraft>
  reasons: Record<string, string>; notes: Record<string, string>; navigation: Navigation
}
export const STORAGE_KEY = "pixeloven.warden-review.workspace.v3"
export const LEGACY_STORAGE_KEY = "pixeloven.warden-review.workspace.v2"
export const DEFAULT_NAV: Navigation = { view: "projects", epicId: "", selected: "", layout: "list", layoutChosen: false, scope: "open", focus: "all", query: "", stage: "todo", expanded: false, composer: "" }
export const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
export const isEpic = (issue: Issue): issue is EpicIssue => issue.type === "epic"
export const epics = (demo: Demo): EpicIssue[] => demo.issues.filter(isEpic)
export const workIssues = (demo: Demo): WorkIssue[] => demo.issues.filter((issue): issue is WorkIssue => !isEpic(issue))
export const emptyDraft = (epicId = ""): TaskDraft => ({ type: "task", title: "", intent: "", epicId, responsibility: "", nextActor: "", criteria: "", dependsOn: "", plan: "", result: "" })
export const emptyEpicDraft = (): EpicDraft => ({ title: "", outcome: "", finishLine: "", originalIdea: "", scope: "", outOfScope: "" })
export const emptyIdeaDraft = (): IdeaDraft => ({ ...emptyEpicDraft(), step: "shape", proposals: [], sample: false })
export function taskDraft(task: Task): TaskDraft {
  return { type: task.type, title: task.title, intent: task.intent, epicId: task.epicId, responsibility: task.responsibility, nextActor: task.nextActor, criteria: task.criteria.map(item => item.text).join("\n"), dependsOn: task.dependsOn.join(", "), plan: task.plan, result: task.result, ...(task.sourceIssueId ? { sourceIssueId: task.sourceIssueId } : {}) }
}
export function makeWorkIssue(id: string, title: string, status: Stage, epicId: string, order: number, extra: Partial<WorkIssue> = {}): WorkIssue {
  return { id, type: "task", title, status, epicId, order, intent: "", responsibility: "", nextActor: "", dependsOn: [], plan: "", result: "", criteria: [], decisions: [], log: [], gateRequired: false, reviews: 0, updated: "Just now · created in this demo", ...extra }
}
export function makeEpic(id: string, draft: EpicDraft, extra: Partial<EpicIssue> = {}): EpicIssue {
  return { ...makeWorkIssue(id, draft.title, "todo", "", 0), ...draft, type: "epic", epicId: "", intent: draft.originalIdea, acceptanceNote: "", ...extra }
}
function fixture(id: string, title: string, status: Stage, epicId: string, order: number, extra: Partial<Task> = {}): Task {
  return makeWorkIssue(id, title, status, epicId, order, { updated: "18 Oct · authored example", ...extra })
}
export function initialDemo(): Demo {
  const projects: EpicIssue[] = [
    makeEpic("reading", { title: "Improve note reading", outcome: "Read a note comfortably, follow an internal reference, and return to the same place — at a desk or on a phone.", finishLine: "A reader opens a long note on desktop and phone, follows an internal reference, then returns to the original note with its reading position preserved.", originalIdea: "Reading long notes feels cramped, and following a link makes it too easy to lose my place.", scope: "Focused reading, internal references, and return behavior on desktop and phone.", outOfScope: "Search, note editing, and publishing." }),
    makeEpic("release", { ...emptyEpicDraft(), title: "Release preparation", outcome: "Give the next release a clear scope, dependable handover, and a useful explanation of what changed.", finishLine: "A reviewer can identify accepted changes, unresolved follow-ups, and recovery instructions from the handover." }),
    makeEpic("library", { ...emptyEpicDraft(), title: "Library maintenance", outcome: "Make a large collection easier to navigate by reviewing titles, references, and reading paths in a deliberate order.", finishLine: "Every entry in the agreed collection has a recorded review outcome and a usable reading path." }),
    makeEpic("foundation", { ...emptyEpicDraft(), title: "Reading foundation", outcome: "Agree a consistent reading measure and a predictable place for note actions.", finishLine: "The reading measure and note-action placement are recorded and explicitly accepted." }, { status: "done", acceptanceNote: "Authored example: the reading direction is accepted.", decisions: ["Authored example · Outcome accepted: the reading measure and note-action placement are recorded."] }),
  ]
  const tasks: WorkIssue[] = [
    fixture("W-101", "Give the focused reader room to breathe", "review", "reading", 0, {
      type: "story", intent: "When a person opens a long note, help them concentrate on its meaning. Keep the originating project within reach without making navigation compete with the text.",
      responsibility: "Reader agent", nextActor: "You · review the plan", gateRequired: true,
      plan: "Use an adjacent reader for a quick inspection and an expanded reading view for longer notes. Keep the title, intent, and completion conditions in the reading flow.\n\nOn a phone, let the note fill the screen. Back returns to the list and the position that opened it. Closing the reader must preserve the search, filter, and selected layout.",
      criteria: [{ text: "Long text remains readable in adjacent and expanded views", done: false }, { text: "Closing the reader restores its originating place", done: false }],
      decisions: ["17 Oct · Author’s example: keep a focused view and an expanded view within the same reading journey."],
      log: ["18 Oct · Author’s example: the plan is ready for a decision; no implementation or testing is claimed."],
    }),
    fixture("W-102", "Follow an internal note and return without losing your place", "plan", "reading", 1, {
      type: "bug", intent: "Let a reader inspect a referenced note, then return to the original note at a useful position.", responsibility: "Reader agent", nextActor: "Reader agent · refine the plan", dependsOn: ["W-101"],
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
    fixture("W-111", "Explore reference navigation on a phone", "plan", "reading", 3, { type: "spike", intent: "Find a return pattern that preserves a reader’s place without crowding a small screen.", plan: "Compare an adjacent reference with a full-screen reference. Check Back, scroll restoration, and an unavailable note before recommending an approach.", criteria: [{ text: "Record findings and a recommendation for the return pattern", done: false }], nextActor: "You · investigate the two navigation patterns" }),
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
  return { version: 3, issues: [...projects, ...tasks], ideaDraft: null, draft: null, edits: {}, epicDrafts: {}, followUpDrafts: {}, reasons: {}, notes: {}, navigation: { ...DEFAULT_NAV } }
}
type LegacyTaskDraft = Omit<TaskDraft, "type" | "epicId" | "plan" | "result"> & { projectId: string; plan?: string; result?: string }
type LegacyTask = Omit<WorkIssue, "type" | "epicId"> & { projectId: string }
type LegacyProject = { id: string; title: string; outcome: string; completed: boolean }
type LegacyNavigation = Omit<Navigation, "epicId" | "composer"> & { projectId: string; composer: "" | "task" | "project" }
type LegacyDemo = { version: 2; tasks: LegacyTask[]; projects: LegacyProject[]; draft: LegacyTaskDraft | null; edits: Record<string, LegacyTaskDraft>; projectDrafts: Record<string, Pick<EpicDraft, "title" | "outcome">>; reasons: Record<string, string>; notes: Record<string, string>; navigation: LegacyNavigation }
const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value)
const strings = (value: Record<string, unknown>, keys: string[]) => keys.every(key => typeof value[key] === "string")
const textList = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === "string")
const dictionary = (value: unknown, check: (item: unknown) => boolean) => record(value) && Object.values(value).every(check)
function validIssueBase(value: unknown): value is IssueRecord & Record<string, unknown> {
  return record(value) && strings(value, ["id", "title", "intent", "responsibility", "nextActor", "plan", "result", "updated"]) && STAGES.some(stage => stage === value.status) && Number.isFinite(value.order) && Number.isFinite(value.reviews) && typeof value.gateRequired === "boolean" && textList(value.dependsOn) && textList(value.decisions) && textList(value.log) && Array.isArray(value.criteria) && value.criteria.every(item => record(item) && typeof item.text === "string" && typeof item.done === "boolean")
}
function validIssue(value: unknown): value is Issue {
  if (!validIssueBase(value) || !record(value) || typeof value.epicId !== "string" || !(value.sourceIssueId === undefined || typeof value.sourceIssueId === "string")) return false
  return value.type === "epic" ? value.epicId === "" && strings(value, ["outcome", "finishLine", "originalIdea", "scope", "outOfScope", "acceptanceNote"]) : WORK_TYPES.some(type => type === value.type)
}
function validEpicDraft(value: unknown): value is EpicDraft & Record<string, unknown> { return record(value) && strings(value, ["title", "outcome", "finishLine", "originalIdea", "scope", "outOfScope"]) }
function validTaskDraft(value: unknown): value is TaskDraft { return record(value) && strings(value, ["title", "intent", "epicId", "responsibility", "nextActor", "criteria", "dependsOn", "plan", "result"]) && WORK_TYPES.some(type => type === value.type) && (value.sourceIssueId === undefined || typeof value.sourceIssueId === "string") }
function validLegacyTaskDraft(value: unknown): value is LegacyTaskDraft { return record(value) && strings(value, ["title", "intent", "projectId", "responsibility", "nextActor", "criteria", "dependsOn"]) }
function validIdeaDraft(value: unknown): value is IdeaDraft {
  return validEpicDraft(value) && record(value) && (value.step === "shape" || value.step === "review") && typeof value.sample === "boolean" && Array.isArray(value.proposals) && value.proposals.every(item => record(item) && strings(item, ["key", "title", "intent", "criteria"]) && WORK_TYPES.some(type => type === item.type))
}
function validNavigation(value: unknown, legacy = false): boolean {
  return record(value) && strings(value, [legacy ? "projectId" : "epicId", "selected", "query"]) && ["projects", "project", "all", "attention"].includes(String(value.view)) && ["board", "list"].includes(String(value.layout)) && ["open", "completed", "all"].includes(String(value.scope)) && ["all", "decisions", "blocked"].includes(String(value.focus)) && STAGES.some(stage => stage === value.stage) && typeof value.expanded === "boolean" && ["", "task", "project", "idea", "recovery", "followup"].includes(String(value.composer))
}
/** No v2 record is discarded; the original v2 storage key is also left untouched. */
export function migrateDemo(value: unknown): Demo | null {
  if (!record(value)) return null
  if (value.version === 3) {
    if (!Array.isArray(value.issues) || !value.issues.every(validIssue) || !validNavigation(value.navigation) || !(value.ideaDraft === null || validIdeaDraft(value.ideaDraft)) || !(value.draft === null || validTaskDraft(value.draft)) || !dictionary(value.edits, validTaskDraft) || !dictionary(value.epicDrafts, validEpicDraft) || !dictionary(value.reasons, item => typeof item === "string") || !dictionary(value.notes, item => typeof item === "string")) return null
    if (!(value.followUpDrafts === undefined || dictionary(value.followUpDrafts, validTaskDraft))) return null
    const saved = value as unknown as Demo
    return { ...saved, followUpDrafts: saved.followUpDrafts ?? {}, navigation: { ...saved.navigation, composer: String(saved.navigation.composer) === "idea" ? "recovery" : saved.navigation.composer } }
  }
  if (value.version !== 2 || !Array.isArray(value.tasks) || !value.tasks.every(item => validIssueBase(item) && record(item) && typeof item.projectId === "string") || !Array.isArray(value.projects) || !value.projects.every(item => record(item) && strings(item, ["id", "title", "outcome"]) && typeof item.completed === "boolean") || !validNavigation(value.navigation, true) || !(value.draft === null || validLegacyTaskDraft(value.draft)) || !dictionary(value.edits, validLegacyTaskDraft) || !dictionary(value.projectDrafts, item => record(item) && strings(item, ["title", "outcome"])) || !dictionary(value.reasons, item => typeof item === "string") || !dictionary(value.notes, item => typeof item === "string")) return null
  const saved = value as unknown as LegacyDemo
  const migrateDraft = (draft: LegacyTaskDraft, issue?: LegacyTask): TaskDraft => {
    const { projectId, ...fields } = draft
    return { ...emptyDraft(projectId), ...fields, plan: draft.plan ?? issue?.plan ?? "", result: draft.result ?? issue?.result ?? "" }
  }
  const projects = saved.projects.map(project => makeEpic(project.id, { ...emptyEpicDraft(), title: project.title, outcome: project.outcome }, { status: project.completed ? "done" : "todo", decisions: project.completed ? ["Migrated from v2 · Previously marked complete. No explicit outcome acceptance note was recorded."] : [], updated: "Migrated from the saved v2 workspace" }))
  const tasks: WorkIssue[] = saved.tasks.map(task => { const { projectId, ...fields } = task; return { ...fields, type: "task", epicId: projectId } })
  const epicDrafts = Object.fromEntries(Object.entries(saved.projectDrafts).map(([id, draft]) => [id, { ...emptyEpicDraft(), ...draft }]))
  const { projectId, ...navigation } = saved.navigation
  return { version: 3, issues: [...projects, ...tasks], ideaDraft: null, followUpDrafts: {},
    draft: saved.draft ? migrateDraft(saved.draft) : null, edits: Object.fromEntries(Object.entries(saved.edits).map(([id, draft]) => [id, migrateDraft(draft, saved.tasks.find(item => item.id === id))])), epicDrafts,
    reasons: saved.reasons, notes: saved.notes, navigation: { ...DEFAULT_NAV, ...navigation, epicId: projectId, layout: navigation.layoutChosen ? navigation.layout : "list" } }
}
export function readDemo(): Demo {
  try {
    for (const key of [STORAGE_KEY, LEGACY_STORAGE_KEY]) {
      const raw = sessionStorage.getItem(key)
      if (!raw) continue
      let parsed: unknown
      try { parsed = JSON.parse(raw) } catch { parsed = null }
      const migrated = migrateDemo(parsed)
      if (migrated) return migrated
      // Preserve unreadable data before a fresh workspace can be saved over it.
      sessionStorage.setItem(`${key}.recovery.${Date.now()}`, raw)
    }
  } catch { /* Storage failure leaves the existing source data intact. */ }
  return initialDemo()
}
export function nextIssueNumber(issues: Issue[]): number {
  return Math.max(0, ...issues.map(item => /^W-\d+$/.test(item.id) ? Number(item.id.slice(2)) : 0)) + 1
}
export function blockers(task: Issue, tasks: Issue[]): string[] {
  return task.status === "done" ? [] : task.dependsOn.filter(id => tasks.find(item => item.id === id)?.status !== "done")
}
export function attentionReasons(task: Issue, tasks: Issue[]): string[] {
  if (task.status === "done") return []
  const reasons: string[] = []
  if (task.gateRequired && (task.status === "review" || task.status === "verify")) reasons.push(task.status === "review" ? "Plan needs your approval" : "Result needs your approval")
  const blocked = blockers(task, tasks)
  if (blocked.length) reasons.push(blocked.map(id => tasks.some(item => item.id === id) ? `Waiting for ${id} · ${tasks.find(item => item.id === id)?.title}` : `Missing reference ${id}`).join(" · "))
  return reasons
}
export function ordered<T extends Issue>(tasks: T[]): T[] { return [...tasks].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)) }
export function scopedTasks(demo: Demo, nav: Navigation): Issue[] {
  const query = nav.query.trim().toLowerCase()
  return ordered(demo.issues.filter(task =>
    (nav.view !== "project" || task.epicId === nav.epicId) &&
    (nav.view !== "attention" || attentionReasons(task, demo.issues).length > 0) &&
    (nav.scope === "all" || (nav.scope === "completed") === (task.status === "done")) &&
    (nav.focus !== "decisions" || task.gateRequired && (task.status === "review" || task.status === "verify")) &&
    (nav.focus !== "blocked" || blockers(task, demo.issues).length > 0) &&
    (!query || [task.id, task.type, task.title, task.intent, epics(demo).find(project => project.id === task.epicId)?.title ?? "Standalone"].join(" ").toLowerCase().includes(query))
  ))
}
export function editedTask(task: Task, draft: TaskDraft): Task {
  const criteria = draft.criteria.split("\n").map(text => text.trim()).filter(Boolean).map(text => ({ text, done: task.criteria.find(item => item.text === text)?.done ?? false }))
  return { ...task, type: draft.type, plan: draft.plan.trim(), result: draft.result.trim(), title: draft.title.trim(), intent: draft.intent.trim(), responsibility: draft.responsibility.trim(), nextActor: draft.nextActor.trim(), dependsOn: [...new Set(draft.dependsOn.split(/[,\s]+/).filter(Boolean))], criteria, updated: "Just now · edited in this demo" }
}
export function reorder(tasks: Issue[], id: string, beforeId: string | null): Issue[] {
  const task = tasks.find(item => item.id === id)
  if (!task || isEpic(task) || id === beforeId) return tasks
  const siblings = ordered(tasks.filter(item => !isEpic(item) && item.epicId === task.epicId && item.id !== id))
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
  const composer = params.get("wardenComposer")
  return { ...DEFAULT_NAV, view: ["projects", "project", "all", "attention"].includes(view ?? "") ? view as Destination : "projects", epicId: params.get("wardenProject") ?? "", selected: params.get("wardenTask") ?? "", layout: params.get("wardenLayout") === "board" ? "board" : "list", layoutChosen: params.get("wardenLayoutChosen") === "1", scope: scope === "all" || scope === "completed" ? scope : "open", focus: params.get("wardenFocus") === "decisions" ? "decisions" : params.get("wardenFocus") === "blocked" ? "blocked" : "all", query: params.get("wardenQuery") ?? "", stage: STAGES.includes(stage as Stage) ? stage as Stage : "todo", expanded: params.get("wardenExpanded") === "1", composer: composer === "idea" ? "recovery" : composer === "task" || composer === "project" || composer === "followup" || composer === "recovery" ? composer : "" }
}
export function writeNavigation(nav: Navigation, replace: boolean, overlay = false, returnIssueId?: string) {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const fields = { wardenView: nav.view, wardenProject: nav.epicId, wardenTask: nav.selected, wardenLayout: nav.layout, wardenLayoutChosen: nav.layoutChosen ? "1" : "", wardenScope: nav.scope, wardenFocus: nav.focus, wardenQuery: nav.query, wardenStage: nav.stage, wardenExpanded: nav.expanded ? "1" : "", wardenComposer: nav.composer }
  Object.entries(fields).forEach(([key, value]) => { if (value) params.set(key, value); else params.delete(key) })
  const state = { ...window.history.state, wardenOverlay: overlay, wardenReturnIssueId: overlay ? returnIssueId ?? window.history.state?.wardenReturnIssueId ?? "" : "" }
  window.history[replace ? "replaceState" : "pushState"](state, "", `${window.location.pathname}${window.location.search}#${params}`)
}

export type DemoTransition = { demo: Demo; error: string }
export function followUpDraft(demo: Demo, source: Task): TaskDraft {
  const epicId = epics(demo).some(epic => epic.id === source.epicId && epic.status !== "done") ? source.epicId : ""
  return demo.followUpDrafts[source.id] ?? { ...emptyDraft(epicId), sourceIssueId: source.id }
}
/** Capture consumes only its own draft channel. A follow-up never converts its source. */
export function createIssue(demo: Demo, draft: TaskDraft): DemoTransition & { issueId: string } {
  const source = draft.sourceIssueId ? workIssues(demo).find(issue => issue.id === draft.sourceIssueId) : undefined
  const epic = epics(demo).find(issue => issue.id === draft.epicId)
  const error = !draft.title.trim() ? "Give this issue a title." : !WORK_TYPES.includes(draft.type) ? "Choose an issue type." : draft.epicId && !epic ? "Choose an available Epic or standalone work." : epic?.status === "done" ? "This Epic is completed. Reopen it or choose an open Epic." : draft.sourceIssueId && !source ? "The source issue is unavailable. Your follow-up draft is kept." : ""
  if (error) return { demo, error, issueId: "" }
  const issueId = `W-${nextIssueNumber(demo.issues)}`
  const base = makeWorkIssue(issueId, "", "todo", draft.epicId, Math.max(-1, ...workIssues(demo).filter(issue => issue.epicId === draft.epicId).map(issue => issue.order)) + 1,
    source ? { sourceIssueId: source.id, log: [`Created as a follow-up to [[${source.id}]] · ${source.title}.`] } : {})
  const created = editedTask(base, draft)
  if (created.dependsOn.includes(issueId)) return { demo, error: "An issue cannot depend on itself.", issueId: "" }
  const followUpDrafts = { ...demo.followUpDrafts }
  if (source) delete followUpDrafts[source.id]
  return { demo: { ...demo, issues: [...demo.issues, created], draft: source ? demo.draft : null, followUpDrafts }, error: "", issueId }
}
export function createEpic(demo: Demo, draft: EpicDraft): DemoTransition & { epicId: string } {
  if (!draft.title.trim()) return { demo, error: "Give this Epic a title.", epicId: "" }
  const epicId = `W-${nextIssueNumber(demo.issues)}`
  const epicDrafts = { ...demo.epicDrafts }; delete epicDrafts.new
  return { demo: { ...demo, issues: [...demo.issues, makeEpic(epicId, { ...draft, title: draft.title.trim() })], epicDrafts }, error: "", epicId }
}
/** Recovery is text-only: all authored fields survive, without creating or replacing drafts. */
export function legacyDraftText(draft: IdeaDraft): string {
  return [`Title\n${draft.title}`, `Original idea and context\n${draft.originalIdea}`, `Desired outcome\n${draft.outcome}`, `Observable finish line\n${draft.finishLine}`, `In scope\n${draft.scope}`, `Out of scope\n${draft.outOfScope}`,
    ...draft.proposals.map((issue, index) => `${index + 1}. ${label(issue.type)}: ${issue.title}\nContext\n${issue.intent}\nDone when\n${issue.criteria}`)].join("\n\n")
}
/** Child completion is never outcome acceptance; callers must request this transition explicitly. */
export function acceptEpicOutcome(demo: Demo, id: string, note: string, finishLineConfirmed: boolean): DemoTransition {
  const epic = epics(demo).find(item => item.id === id)
  const error = !epic ? "This Epic is unavailable." : epic.status === "done" ? "This Epic is already complete." : workIssues(demo).some(item => item.epicId === id && item.status !== "done") ? "Finish or transfer every open child issue before accepting the outcome." : !epic.finishLine.trim() ? "Record an observable finish line before accepting this outcome." : !finishLineConfirmed ? "Check whether the finish line has been achieved." : !note.trim() ? "Record an outcome acceptance note." : ""
  if (error || !epic) return { demo, error }
  return { demo: { ...demo, issues: demo.issues.map(item => item.id === id && isEpic(item) ? { ...item, status: "done", nextActor: "", acceptanceNote: note.trim(), decisions: [...item.decisions, `You · Outcome accepted against finish line “${item.finishLine}”: ${note.trim()}`], updated: "Just now · outcome decision recorded" } : item), reasons: { ...demo.reasons, [id]: "" } }, error: "" }
}
export function reopenEpic(demo: Demo, id: string): DemoTransition {
  const epic = epics(demo).find(item => item.id === id)
  if (!epic || epic.status !== "done") return { demo, error: "Only a completed Epic can be reopened." }
  return { demo: { ...demo, issues: demo.issues.map(item => item.id === id && isEpic(item) ? { ...item, status: "todo", nextActor: "You · review the reopened outcome", decisions: [...item.decisions, "You · Explicitly reopened this Epic. Previous outcome acceptance remains in the record."], updated: "Just now · Epic reopened" } : item) }, error: "" }
}
