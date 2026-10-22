import React, { useRef, useState } from "react"
import { Button, Input, Label, Select } from "@pixeloven/ui"
import { WORK_TYPES, emptyIdeaDraft, label, type IdeaDraft, type ProposedIssue, type WorkType } from "./WardenWorkspace.model"
import { Icon, Panel } from "./WardenWorkspace.panels"

export function readingIdeaExample(): IdeaDraft {
  return { ...emptyIdeaDraft(), sample: true,
    originalIdea: "I read long notes on my phone. The page feels cramped, and opening an internal reference makes me lose my place. I want a calmer reading visit that I can pick up again.",
    title: "Make a short reading visit feel continuous",
    outcome: "A reader can concentrate on a note, inspect a reference, and return to where they left off on desktop or phone.",
    finishLine: "On desktop and a 390px phone, open a long note, scroll midway, follow an internal reference, and return. The original note and reading position are restored, and all text and controls remain reachable.",
    scope: "Focused note reading, internal references, return position, and phone interaction.",
    outOfScope: "Note editing, search, offline sync, and publishing.",
    proposals: [
      { key: "example-story", type: "story", title: "Read a long note comfortably", intent: "Give a reader enough room to concentrate while keeping the way back within reach.", criteria: "Long text and note actions remain readable on desktop and phone.\nClosing the reader returns to the originating list." },
      { key: "example-bug", type: "bug", title: "Preserve reading position after following a reference", intent: "Prevent a reader from losing their place when they inspect a linked note.", criteria: "Back restores the original note at its previous reading position.\nAn unavailable reference leaves the original note accessible." },
      { key: "example-task", type: "task", title: "Check the full reading visit on a phone", intent: "Observe the complete journey against the Epic finish line.", criteria: "Record the note → reference → return check at 390px.\nRecord any remaining gap against the finish line." },
    ],
  }
}
export function discoveryBrief(draft: IdeaDraft): string {
  return [draft.sample ? "Authored reading example — edited by you as needed" : "Discovery brief", `Epic: ${draft.title}`, `Original idea and context\n${draft.originalIdea}`, `Desired outcome\n${draft.outcome}`, `Observable finish line\n${draft.finishLine}`, `In scope\n${draft.scope || "Not yet specified"}`, `Out of scope\n${draft.outOfScope || "Not yet specified"}`, "Proposed issues", ...draft.proposals.map((item, index) => `${index + 1}. ${label(item.type)}: ${item.title}\nIntent: ${item.intent || "Not yet specified"}\nDone when: ${item.criteria || "Not yet specified"}`), "Review the assumptions and refine this proposal with me. Publishing this proposal does not start execution or record approval. Continue to respect permissions already granted in the host session."].join("\n\n")
}
export function IdeaComposer({ prefix, draft, stored, onChange, onClose, onDiscard, onCreate, onStandalone }: {
  prefix: string; draft: IdeaDraft; stored: boolean; onChange: (draft: IdeaDraft) => void
  onClose: () => void; onDiscard: () => void; onCreate: () => void; onStandalone: () => void
}) {
  const [error, setError] = useState("")
  const [copyStatus, setCopyStatus] = useState("")
  const [showBrief, setShowBrief] = useState(false)
  const [discarding, setDiscarding] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const brief = useRef<HTMLTextAreaElement>(null)
  const reviewing = draft.step === "review"
  const untouched = !draft.originalIdea && !draft.title && !draft.outcome && !draft.finishLine && !draft.scope && !draft.outOfScope && !draft.proposals.length
  function field(key: keyof IdeaDraft, value: string) { onChange({ ...draft, [key]: value }); setError("") }
  function changeProposal(key: string, change: Partial<ProposedIssue>) { onChange({ ...draft, proposals: draft.proposals.map(item => item.key === key ? { ...item, ...change } : item) }); setError("") }
  function changeStep(step: IdeaDraft["step"]) { onChange({ ...draft, step }); setError(""); requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: "start" }) }) }
  function review() {
    if (![draft.originalIdea, draft.title, draft.outcome, draft.finishLine].every(value => value.trim())) { setError("Add the original idea, an Epic title, a desired outcome, and an observable finish line before reviewing."); return }
    if (!draft.proposals.length || draft.proposals.some(item => !item.title.trim())) { setError("Add at least one proposed issue and give each issue a title. Remove any rows you do not need."); return }
    changeStep("review")
  }
  async function copyBrief() {
    try { await navigator.clipboard.writeText(discoveryBrief(draft)); setCopyStatus("Discovery brief copied.") }
    catch { setShowBrief(true); setCopyStatus("Select and copy the brief below."); requestAnimationFrame(() => { brief.current?.focus(); brief.current?.select() }) }
  }
  return <Panel label={`${prefix}-idea-heading`} modal className="ww-composer ww-idea-composer" onClose={onClose}>
    <header className="ww-panel-header"><Button onClick={onClose}><Icon name="back" />Back to work</Button><span>{stored ? "Draft kept on close" : "Storage unavailable"}</span></header>
    <form className="ww-compose-form ww-idea-form" onSubmit={event => { event.preventDefault(); if (reviewing) onCreate(); else review() }}>
      <div><h2 id={`${prefix}-idea-heading`} ref={heading} tabIndex={-1} data-panel-focus>{reviewing ? "Review your proposed work" : "Start with an idea"}</h2>
        <p className="ww-secondary">{reviewing ? "Check the outcome and the issues together. You can go back and change anything." : "Describe what you have in mind. Shape it into an Epic with a clear finish line and a few useful issues."}</p></div>
      <p className="ww-local-context">Browser-local demo · You write and edit this proposal. No agent is connected.</p>
      {draft.sample && <p className="ww-sample-note">Authored reading example. This sample was written for the demo; it is not an agent response. Edit it to make it yours.</p>}
      {!reviewing ? <>
        <div className="ww-small-idea"><p>One bounded piece of work can be a standalone issue.</p><Button onClick={onStandalone}>This is one issue</Button><p className="ww-hint">Carries your idea into an issue draft and keeps this proposal recoverable.</p></div>
        {untouched && <Button className="ww-example-action" onClick={() => onChange(readingIdeaExample())}>Use authored reading example</Button>}
        <Label>Original idea and context<textarea rows={4} required value={draft.originalIdea} onChange={event => field("originalIdea", event.target.value)} placeholder="I have an idea… What is happening today, who is affected, and what would help?" /></Label>
        <Label>Epic title<Input required value={draft.title} onChange={event => field("title", event.target.value)} placeholder="Name the outcome you want to achieve" /></Label>
        <Label>Desired outcome<textarea rows={3} required value={draft.outcome} onChange={event => field("outcome", event.target.value)} placeholder="What will be different, and for whom?" /></Label>
        <Label>Observable finish line<textarea rows={3} required value={draft.finishLine} onChange={event => field("finishLine", event.target.value)} placeholder="What could someone observe or check to say this outcome has been achieved?" /></Label>
        <div className="ww-idea-scope"><Label>In scope<textarea rows={3} value={draft.scope} onChange={event => field("scope", event.target.value)} placeholder="The boundaries of this piece of work" /></Label><Label>Out of scope<textarea rows={3} value={draft.outOfScope} onChange={event => field("outOfScope", event.target.value)} placeholder="What can wait for another Epic?" /></Label></div>
        <section className="ww-proposal-section" aria-labelledby={`${prefix}-proposal-heading`}><h3 id={`${prefix}-proposal-heading`}>Proposed issues</h3><p className="ww-secondary">A Story describes a useful capability, a Task is a concrete piece of work, and a Bug describes something to fix. All will start in Todo.</p>
          <ol className="ww-proposal-list">{draft.proposals.map((item, index) => <li key={item.key}>
            <div className="ww-proposal-fields"><Label>Issue {index + 1} type<Select value={item.type} onChange={event => changeProposal(item.key, { type: event.target.value as WorkType })}>{WORK_TYPES.map(type => <option key={type} value={type}>{label(type)}</option>)}</Select></Label><Label>Issue {index + 1} title<Input required value={item.title} onChange={event => changeProposal(item.key, { title: event.target.value })} placeholder="A small, meaningful piece of work" /></Label></div>
            <details open={!item.title || undefined}><summary>Intent and completion conditions</summary><div className="ww-fields"><Label>Intent<textarea rows={2} value={item.intent} onChange={event => changeProposal(item.key, { intent: event.target.value })} /></Label><Label>Done when<textarea rows={2} value={item.criteria} onChange={event => changeProposal(item.key, { criteria: event.target.value })} placeholder="One observable condition per line" /></Label></div></details>
            <Button className="ww-remove-proposal" aria-label={`Remove proposed issue ${index + 1}${item.title ? `: ${item.title}` : ""}`} onClick={() => onChange({ ...draft, proposals: draft.proposals.filter(row => row.key !== item.key) })}>Remove issue</Button>
          </li>)}</ol>
          <Button onClick={() => onChange({ ...draft, proposals: [...draft.proposals, { key: `proposal-${Math.max(0, ...draft.proposals.map(item => Number(item.key.replace("proposal-", "")) || 0)) + 1}`, type: "task", title: "", intent: "", criteria: "" }] })}>Add proposed issue</Button>
        </section>
      </> : <>
        <section className="ww-idea-review" aria-label="Epic brief"><h3>{draft.title}</h3><dl><div><dt>Original idea and context</dt><dd>{draft.originalIdea}</dd></div><div><dt>Desired outcome</dt><dd>{draft.outcome}</dd></div><div><dt>Observable finish line</dt><dd>{draft.finishLine}</dd></div><div><dt>In scope</dt><dd>{draft.scope || "Not yet specified"}</dd></div><div><dt>Out of scope</dt><dd>{draft.outOfScope || "Not yet specified"}</dd></div></dl></section>
        <section className="ww-proposal-section"><h3>{draft.proposals.length} proposed {draft.proposals.length === 1 ? "issue" : "issues"}</h3><ol className="ww-proposal-review">{draft.proposals.map(item => <li key={item.key}><p className="ww-secondary">{label(item.type)} · Todo</p><h4>{item.title}</h4>{item.intent && <p>{item.intent}</p>}{item.criteria && <p className="ww-proposal-criteria"><strong>Done when</strong><br />{item.criteria}</p>}</li>)}</ol></section>
        <details className="ww-discovery-brief"><summary>Continue discovery with your own agent</summary><p>You can give this brief to your existing agent host for further discussion. Copying it does not install a skill or dispatch work.</p><Button onClick={copyBrief}>Copy discovery brief</Button>{copyStatus && <p role="status">{copyStatus}</p>}{showBrief && <Label>Discovery brief<textarea ref={brief} rows={10} readOnly value={discoveryBrief(draft)} /></Label>}</details>
        <p className="ww-creation-contract">Creates one Epic and its {draft.proposals.length} {draft.proposals.length === 1 ? "issue" : "issues"} together in Todo, saved only in this browser tab. Nothing starts execution, and no plan or result is approved.</p>
      </>}
      {error && <p className="ww-form-error" role="alert">{error}</p>}
      <p className="ww-hint">{stored ? "Your draft is saved as you type and survives close and reload in this tab." : "Browser storage is unavailable. Keep this page open to retain your draft."}</p>
      <footer className="ww-compose-actions">{reviewing ? <Button onClick={() => changeStep("shape")}>Edit proposal</Button> : <Button onClick={onClose}>Save draft & close</Button>}<Button variant="primary" type="submit">{reviewing ? "Create Epic and issues" : "Review proposal"}</Button></footer>
      <div className="ww-discard-draft"><Button aria-expanded={discarding} onClick={() => setDiscarding(!discarding)}>Discard idea draft</Button>{discarding && <div><p>Discard the original idea and this proposal? No issues have been created.</p><div className="ww-actions"><Button onClick={() => setDiscarding(false)}>Keep draft</Button><Button onClick={onDiscard}>Confirm discard</Button></div></div>}</div>
    </form>
  </Panel>
}
