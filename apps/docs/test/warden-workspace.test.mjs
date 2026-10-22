import { test } from "node:test"
import assert from "node:assert/strict"
import {
  DEFAULT_NAV, acceptEpicOutcome, createIdeaProposal, editedTask, emptyIdeaDraft,
  initialDemo, migrateDemo, reopenEpic, reorder, scopedTasks, taskDraft,
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
  assert.equal(migrated.ideaDraft.title, "New idea draft")
  assert.deepEqual(migrated.notes, previous.notes)
  assert.deepEqual(migrated.reasons, previous.reasons)
  assert.equal(migrated.navigation.epicId, epic.id)
  assert.equal(migrated.navigation.selected, child.id)
  assert.equal(migrated.navigation.layout, "board", "respect the person's chosen layout")
  assert.equal(migrated.navigation.query, "Existing")
  assert.deepEqual(previous, original, "migration leaves the original saved data intact")
  assert.deepEqual(migrateDemo(migrated), migrated, "reading v3 is idempotent")
})

function proposal() {
  return { ...emptyIdeaDraft(), step: "review", originalIdea: "I lose my place while reading", title: "Continuous reading", outcome: "Return comfortably to the original note", finishLine: "Follow a reference and return to the same paragraph", proposals: [
    { key: "one", type: "story", title: "Follow a reference", intent: "Read related context", criteria: "Reference opens\nOriginal position is retained" },
    { key: "two", type: "bug", title: "Recover a missing reference", intent: "Keep the original note available", criteria: "The original note remains open" },
  ] }
}

test("reviewed proposal creates one Epic and typed children together without starting work", () => {
  const before = initialDemo()
  const original = structuredClone(before)
  const result = createIdeaProposal({ ...before, ideaDraft: proposal() }, proposal())
  assert.equal(result.error, "")
  assert.equal(result.demo.ideaDraft, null)
  assert.equal(result.demo.issues.length, before.issues.length + 3)
  const added = result.demo.issues.slice(before.issues.length)
  assert.deepEqual(added.map(issue => issue.type), ["epic", "story", "bug"])
  assert.ok(added.every(issue => issue.status === "todo"))
  assert.ok(added.every(issue => !issue.decisions.length))
  assert.ok(added.slice(1).every(issue => issue.epicId === result.epicId))
  assert.deepEqual(added.slice(1).map(issue => issue.id), result.issueIds)
  assert.equal(new Set(result.demo.issues.map(issue => issue.id)).size, result.demo.issues.length)
  assert.deepEqual(added[1].criteria.map(item => item.done), [false, false])
  assert.deepEqual(before, original)
})

test("an unreviewed or incomplete proposal cannot create partial work or consume the draft", () => {
  for (const draft of [
    { ...proposal(), step: "shape" },
    { ...proposal(), finishLine: " " },
    { ...proposal(), proposals: [] },
    { ...proposal(), proposals: [...proposal().proposals, { key: "bad", type: "task", title: " ", intent: "", criteria: "" }] },
  ]) {
    const before = { ...initialDemo(), ideaDraft: draft }
    const result = createIdeaProposal(before, draft)
    assert.ok(result.error)
    assert.equal(result.demo, before)
    assert.equal(result.epicId, "")
    assert.deepEqual(result.issueIds, [])
  }
})

test("Epic acceptance requires the finish line, human confirmation and all child dispositions", () => {
  const created = createIdeaProposal(initialDemo(), proposal())
  assert.match(acceptEpicOutcome(created.demo, created.epicId, "Accepted", true).error, /open child/)
  const finished = { ...created.demo, issues: created.demo.issues.map(issue => issue.epicId === created.epicId ? { ...issue, status: "done" } : issue) }
  assert.equal(finished.issues.find(issue => issue.id === created.epicId).status, "todo")
  assert.ok(acceptEpicOutcome(finished, created.epicId, "Accepted", false).error)
  assert.ok(acceptEpicOutcome(finished, created.epicId, " ", true).error)
  const withoutFinish = { ...finished, issues: finished.issues.map(issue => issue.id === created.epicId ? { ...issue, finishLine: "" } : issue) }
  assert.ok(acceptEpicOutcome(withoutFinish, created.epicId, "Accepted", true).error)
  const accepted = acceptEpicOutcome(finished, created.epicId, "The return path meets the finish line", true)
  assert.equal(accepted.error, "")
  const epic = accepted.demo.issues.find(issue => issue.id === created.epicId)
  assert.equal(epic.status, "done")
  assert.equal(epic.acceptanceNote, "The return path meets the finish line")
  assert.ok(epic.decisions[0].includes(epic.finishLine))
  for (const child of finished.issues.filter(issue => issue.id !== epic.id)) assert.deepEqual(accepted.demo.issues.find(issue => issue.id === child.id), child)
  const reopened = reopenEpic(accepted.demo, epic.id)
  assert.equal(reopened.error, "")
  const reopenedEpic = reopened.demo.issues.find(issue => issue.id === epic.id)
  assert.equal(reopenedEpic.status, "todo")
  assert.equal(reopenedEpic.acceptanceNote, epic.acceptanceNote)
  assert.deepEqual(reopenedEpic.decisions.slice(0, -1), epic.decisions)
  for (const child of accepted.demo.issues.filter(issue => issue.epicId === epic.id)) assert.deepEqual(reopened.demo.issues.find(issue => issue.id === child.id), child)
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
  assert.equal(migrated.navigation.composer, "idea")
  assert.equal(migrated.ideaDraft.outcome, "Preserve new work too")
})

test("All issues includes Epics; Epic scope returns its own children only", () => {
  const demo = initialDemo()
  const all = scopedTasks(demo, { ...DEFAULT_NAV, view: "all", scope: "all" })
  assert.equal(all.length, demo.issues.length)
  assert.ok(all.some(issue => issue.type === "epic"))
  assert.ok(all.some(issue => issue.type !== "epic" && !issue.epicId))
  const children = scopedTasks(demo, { ...DEFAULT_NAV, view: "project", epicId: "reading", scope: "all" })
  assert.deepEqual(children.map(issue => issue.id), ["W-101", "W-102", "W-103"])
  assert.ok(children.every(issue => issue.type !== "epic"))
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
