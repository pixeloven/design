import { test } from "node:test"
import assert from "node:assert/strict"
import {
  DEFAULT_NAV, WORK_TYPES, acceptEpicOutcome, createEpic, createIssue, editedTask, emptyDraft, emptyEpicDraft, emptyIdeaDraft,
  followUpDraft, initialDemo, legacyDraftText, migrateDemo, navigationFromUrl, reopenEpic, reorder, scopedTasks, taskDraft,
} from "../stories/WardenWorkspace.model.ts"

// The previous public preview persisted this shape. Keep the fixture independent
// of the new factories so a migration cannot silently redefine its own input.
function savedV2() {
  const draft = { title: "Unsaved title", intent: "Keep my intent", projectId: "old-project", responsibility: "You", nextActor: "Review the result", criteria: "Keep the source", dependsOn: "W-8" }
  return {
    version: 2,
    projects: [{ id: "old-project", title: "Existing outcome", outcome: "Keep this outcome", completed: true }],
    tasks: [{ id: "W-9", title: "Existing work", projectId: "old-project", status: "done", intent: "Original intent", responsibility: "You", nextActor: "", dependsOn: ["W-8"], order: 4, plan: "A substantial plan", result: "The recorded result", criteria: [{ text: "Keep the source", done: true }], decisions: ["Original decision"], log: ["Original comment"], gateRequired: true, reviews: 2, updated: "Recorded before migration" }],
    draft, edits: { "W-9": { ...draft, title: "Unsaved edit" } },
    projectDrafts: { "old-project": { title: "Unsaved outcome edit", outcome: "Preserve this edit" }, new: { title: "New idea draft", outcome: "Preserve new work too" } },
    reasons: { "W-9": "Unposted decision reason" }, notes: { "W-9": "Unposted comment" },
    navigation: { view: "project", projectId: "old-project", selected: "W-9", layout: "board", layoutChosen: true, scope: "completed", focus: "all", query: "Existing", stage: "done", expanded: true, composer: "" },
  }
}

test("saved v2 work and all draft channels survive normalization to Issues", () => {
  const previous = savedV2()
  const original = structuredClone(previous)
  const migrated = migrateDemo(previous)
  assert.ok(migrated)
  assert.equal(migrated.version, 3)
  assert.equal("projects" in migrated, false)
  assert.equal("tasks" in migrated, false)
  assert.equal(migrated.issues.length, 2)
  const epic = migrated.issues.find(issue => issue.id === "old-project")
  const child = migrated.issues.find(issue => issue.id === "W-9")
  assert.equal(epic.type, "epic")
  assert.equal(epic.status, "done")
  assert.equal(epic.outcome, "Keep this outcome")
  assert.equal(epic.acceptanceNote, "", "migration must not invent outcome acceptance")
  for (const key of ["id", "title", "status", "intent", "plan", "result", "criteria", "dependsOn", "order", "decisions", "log", "reviews", "updated"]) {
    assert.deepEqual(child[key], previous.tasks[0][key], `preserve ${key}`)
  }
  assert.equal(child.type, "task")
  assert.equal(child.epicId, epic.id)
  assert.equal(migrated.draft.title, "Unsaved title")
  assert.equal(migrated.draft.epicId, epic.id)
  assert.equal(migrated.edits[child.id].title, "Unsaved edit")
  assert.equal(migrated.edits[child.id].plan, child.plan, "old edit drafts must not erase an existing plan")
  assert.equal(migrated.edits[child.id].result, child.result, "old edit drafts must not erase result evidence")
  assert.equal(migrated.epicDrafts[epic.id].outcome, "Preserve this edit")
  assert.equal(migrated.epicDrafts.new.title, "New idea draft")
  assert.deepEqual(migrated.notes, previous.notes)
  assert.deepEqual(migrated.reasons, previous.reasons)
  assert.equal(migrated.navigation.epicId, epic.id)
  assert.equal(migrated.navigation.selected, child.id)
  assert.equal(migrated.navigation.layout, "board", "respect the person's chosen layout")
  assert.equal(migrated.navigation.query, "Existing")
  assert.deepEqual(previous, original, "migration leaves the original saved data intact")
  assert.deepEqual(migrateDemo(migrated), migrated, "reading v3 is idempotent")
})

function oldIdeaDraft() {
  return { ...emptyIdeaDraft(), step: "review", originalIdea: "I lose my place while reading", title: "Continuous reading", outcome: "Return comfortably to the original note", finishLine: "Follow a reference and return to the same paragraph", proposals: [
    { key: "one", type: "story", title: "Follow a reference", intent: "Read related context", criteria: "Reference opens\nOriginal position is retained" },
    { key: "two", type: "bug", title: "Recover a missing reference", intent: "Keep the original note available", criteria: "The original note remains open" },
  ] }
}

test("saved v3 idea text is recoverable without overwriting existing drafts or records", () => {
  const previous = initialDemo()
  delete previous.followUpDrafts
  previous.ideaDraft = { ...oldIdeaDraft(), scope: "Keep this scope", outOfScope: "Keep this exclusion" }
  previous.draft = { ...emptyDraft(), title: "Already writing an issue", intent: "Do not replace this" }
  previous.edits["W-101"] = { ...taskDraft(previous.issues.find(issue => issue.id === "W-101")), plan: "Unsaved plan refinement" }
  previous.epicDrafts.new = { ...emptyEpicDraft(), title: "Existing Epic draft" }
  previous.navigation.composer = "idea"
  const original = structuredClone(previous)
  const migrated = migrateDemo(previous)
  assert.ok(migrated)
  for (const key of ["issues", "draft", "ideaDraft", "epicDrafts", "edits", "notes", "reasons"]) assert.deepEqual(migrated[key], previous[key])
  assert.equal(migrated.navigation.composer, "recovery")
  const recovered = legacyDraftText(migrated.ideaDraft)
  for (const field of ["title", "originalIdea", "outcome", "finishLine", "scope", "outOfScope"]) assert.ok(recovered.includes(previous.ideaDraft[field]))
  for (const proposed of previous.ideaDraft.proposals) for (const field of ["title", "intent", "criteria"]) assert.ok(recovered.includes(proposed[field]))
  assert.deepEqual(migrateDemo(JSON.parse(JSON.stringify(migrated))), migrated)
  assert.deepEqual(previous, original)
})

test("old idea bookmarks open text recovery while direct Epic and follow-up routes remain available", () => {
  const previousWindow = globalThis.window
  try {
    globalThis.window = { location: { hash: "#wardenView=projects&wardenComposer=idea" } }
    assert.equal(navigationFromUrl(DEFAULT_NAV).composer, "recovery")
    window.location.hash = "#wardenView=projects&wardenComposer=project"
    assert.equal(navigationFromUrl(DEFAULT_NAV).composer, "project")
    window.location.hash = "#wardenView=all&wardenTask=W-111&wardenComposer=followup"
    const navigation = navigationFromUrl(DEFAULT_NAV)
    assert.equal(navigation.composer, "followup")
    assert.equal(navigation.selected, "W-111")
  } finally { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow }
})

test("a title is enough to capture every work type as a standalone issue", () => {
  const before = initialDemo()
  const original = structuredClone(before)
  for (const type of WORK_TYPES) {
    const draft = { ...emptyDraft(), title: " A useful next step ", type }
    const result = createIssue({ ...before, draft }, draft)
    assert.equal(result.error, "")
    assert.equal(result.demo.draft, null)
    const added = result.demo.issues.at(-1)
    assert.equal(result.demo.issues.length, before.issues.length + 1)
    assert.equal(added.title, "A useful next step")
    assert.equal(added.type, type)
    assert.equal(added.status, "todo")
    assert.equal(added.epicId, "")
    assert.deepEqual(added.decisions, [])
    assert.deepEqual(added.criteria, [])
    assert.ok(!before.issues.some(issue => issue.id === added.id))
  }
  assert.deepEqual(before, original)
})

test("invalid capture preserves the issue and draft collections", () => {
  for (const draft of [
    { ...emptyDraft(), title: " " },
    { ...emptyDraft("missing"), title: "Keep me" },
    { ...emptyDraft("foundation"), title: "Keep me" },
    { ...emptyDraft(), title: "Keep me", sourceIssueId: "missing" },
  ]) {
    const before = { ...initialDemo(), draft }
    const result = createIssue(before, draft)
    assert.ok(result.error)
    assert.equal(result.demo, before)
    assert.equal(result.issueId, "")
  }
})

test("direct Epic capture needs only a title; the finish line is required at acceptance", () => {
  const before = initialDemo()
  const draft = { ...emptyEpicDraft(), title: "An outcome to refine" }
  before.epicDrafts.new = draft
  before.draft = { ...emptyDraft(), title: "Unrelated draft" }
  const created = createEpic(before, draft)
  assert.equal(created.error, "")
  assert.equal(created.demo.epicDrafts.new, undefined)
  assert.deepEqual(created.demo.draft, before.draft)
  const epic = created.demo.issues.at(-1)
  assert.equal(epic.type, "epic")
  assert.equal(epic.epicId, "")
  assert.equal(epic.finishLine, "")
  assert.match(acceptEpicOutcome(created.demo, epic.id, "Accepted", true).error, /finish line/)
  assert.equal(createEpic(before, { ...draft, title: " " }).demo, before)
})

test("follow-up creation preserves its Spike, ordinary draft and other follow-up drafts", () => {
  const before = initialDemo()
  const source = before.issues.find(issue => issue.id === "W-111")
  source.status = "done"
  source.result = "The full-screen reference preserved position. Use it on phones."
  before.draft = { ...emptyDraft(), title: "An unrelated saved issue" }
  before.ideaDraft = oldIdeaDraft()
  before.followUpDrafts["W-101"] = { ...emptyDraft("reading"), title: "Another follow-up", sourceIssueId: "W-101" }
  const draft = { ...followUpDraft(before, source), title: "Implement the chosen return behavior", type: "story" }
  before.followUpDrafts[source.id] = draft
  const original = structuredClone(before)
  const result = createIssue(before, draft)
  assert.equal(result.error, "")
  const added = result.demo.issues.at(-1)
  assert.equal(added.sourceIssueId, source.id)
  assert.equal(added.epicId, "reading")
  assert.equal(added.status, "todo")
  assert.deepEqual(added.dependsOn, [], "provenance must not invent blocking dependencies")
  assert.ok(added.log.some(text => text.includes(`[[${source.id}]]`)))
  assert.deepEqual(result.demo.issues.find(issue => issue.id === source.id), source)
  assert.deepEqual(result.demo.draft, before.draft)
  assert.deepEqual(result.demo.ideaDraft, before.ideaDraft)
  assert.deepEqual(result.demo.followUpDrafts["W-101"], before.followUpDrafts["W-101"])
  assert.equal(result.demo.followUpDrafts[source.id], undefined)
  assert.deepEqual(before, original)
  assert.deepEqual(migrateDemo(JSON.parse(JSON.stringify(result.demo))), result.demo)
  const closedEpic = { ...before, issues: before.issues.map(issue => issue.id === "reading" ? { ...issue, status: "done" } : issue), followUpDrafts: {} }
  assert.equal(followUpDraft(closedEpic, source).epicId, "", "new follow-up work must not reopen a completed Epic")
})

test("Epic acceptance requires the finish line, human confirmation and all child dispositions", () => {
  const epic = createEpic(initialDemo(), { ...emptyEpicDraft(), title: "Continuous reading", finishLine: "Return to the same paragraph" })
  const created = { ...createIssue(epic.demo, { ...emptyDraft(epic.epicId), title: "Preserve reading position" }), epicId: epic.epicId }
  assert.match(acceptEpicOutcome(created.demo, created.epicId, "Accepted", true).error, /open child/)
  const finished = { ...created.demo, issues: created.demo.issues.map(issue => issue.epicId === created.epicId ? { ...issue, status: "done" } : issue) }
  assert.equal(finished.issues.find(issue => issue.id === created.epicId).status, "todo")
  assert.ok(acceptEpicOutcome(finished, created.epicId, "Accepted", false).error)
  assert.ok(acceptEpicOutcome(finished, created.epicId, " ", true).error)
  const withoutFinish = { ...finished, issues: finished.issues.map(issue => issue.id === created.epicId ? { ...issue, finishLine: "" } : issue) }
  assert.ok(acceptEpicOutcome(withoutFinish, created.epicId, "Accepted", true).error)
  const accepted = acceptEpicOutcome(finished, created.epicId, "The return path meets the finish line", true)
  assert.equal(accepted.error, "")
  const acceptedEpic = accepted.demo.issues.find(issue => issue.id === created.epicId)
  assert.equal(acceptedEpic.status, "done")
  assert.equal(acceptedEpic.acceptanceNote, "The return path meets the finish line")
  assert.ok(acceptedEpic.decisions[0].includes(acceptedEpic.finishLine))
  for (const child of finished.issues.filter(issue => issue.id !== acceptedEpic.id)) assert.deepEqual(accepted.demo.issues.find(issue => issue.id === child.id), child)
  const reopened = reopenEpic(accepted.demo, acceptedEpic.id)
  assert.equal(reopened.error, "")
  const reopenedEpic = reopened.demo.issues.find(issue => issue.id === acceptedEpic.id)
  assert.equal(reopenedEpic.status, "todo")
  assert.equal(reopenedEpic.acceptanceNote, acceptedEpic.acceptanceNote)
  assert.deepEqual(reopenedEpic.decisions.slice(0, -1), acceptedEpic.decisions)
  for (const child of accepted.demo.issues.filter(issue => issue.epicId === acceptedEpic.id)) assert.deepEqual(reopened.demo.issues.find(issue => issue.id === child.id), child)
})

test("malformed stored v3 records are rejected before rendering", () => {
  assert.equal(migrateDemo({ version: 3, issues: [{ type: "epic" }], navigation: {} }), null)
  const invalid = initialDemo()
  invalid.issues[0].type = "unsupported"
  assert.equal(migrateDemo(invalid), null)
})

test("old unchosen Board defaults to List while a new-project draft stays reachable", () => {
  const previous = savedV2()
  previous.navigation = { ...previous.navigation, view: "projects", projectId: "", selected: "", composer: "project", layoutChosen: false }
  const migrated = migrateDemo(previous)
  assert.equal(migrated.navigation.layout, "list")
  assert.equal(migrated.navigation.composer, "project")
  assert.equal(migrated.epicDrafts.new.outcome, "Preserve new work too")
})

test("All issues includes Epics; Epic scope returns its own children only", () => {
  const demo = initialDemo()
  const all = scopedTasks(demo, { ...DEFAULT_NAV, view: "all", scope: "all" })
  assert.equal(all.length, demo.issues.length)
  assert.ok(all.some(issue => issue.type === "epic"))
  assert.ok(all.some(issue => issue.type !== "epic" && !issue.epicId))
  const children = scopedTasks(demo, { ...DEFAULT_NAV, view: "project", epicId: "reading", scope: "all" })
  assert.deepEqual(children.map(issue => issue.id), ["W-101", "W-102", "W-103", "W-111"])
  assert.ok(children.every(issue => issue.type !== "epic"))
  assert.deepEqual(scopedTasks(demo, { ...DEFAULT_NAV, view: "all", query: "spike" }).map(issue => issue.id), ["W-111"])
})

test("refining type, plan and result preserves workflow, comments and checked criteria", () => {
  const before = initialDemo().issues.find(issue => issue.id === "W-105")
  const after = editedTask(before, { ...taskDraft(before), type: "bug", plan: "Reproduce then correct the error", result: "Corrected; source linked", criteria: `${before.criteria[0].text}\nA new condition` })
  assert.equal(after.type, "bug")
  assert.equal(after.plan, "Reproduce then correct the error")
  assert.equal(after.result, "Corrected; source linked")
  assert.equal(after.status, before.status)
  assert.equal(after.order, before.order)
  assert.deepEqual(after.log, before.log)
  assert.deepEqual(after.decisions, before.decisions)
  assert.deepEqual(after.criteria.map(item => item.done), [true, false])
})

test("ordering children cannot move their Epic or a different Epic's work", () => {
  const { issues } = initialDemo()
  assert.deepEqual(reorder(issues, "reading", "W-101"), issues)
  assert.deepEqual(reorder(issues, "W-101", "W-104"), issues)
  const after = reorder(issues, "W-103", "W-101")
  for (const issue of issues.filter(item => item.epicId !== "reading")) assert.deepEqual(after.find(item => item.id === issue.id), issue)
  assert.equal(after.find(issue => issue.id === "W-103").order, 0)
  assert.equal(after.find(issue => issue.id === "reading").status, "todo")
})
