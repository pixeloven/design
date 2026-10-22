import React from "react"
import { Button, Label, Select } from "@pixeloven/ui"
import { workIssues, STAGES, label, ordered, type Demo, type Stage } from "./WardenWorkspace.model"
import { destinationText, type Placement, type useTaskDrag } from "./WardenWorkspace.drag"

export function DragControls({ drag, demo, board }: { drag: ReturnType<typeof useTaskDrag>; demo: Demo; board: boolean }) {
  const session = drag.session
  if (!session) return null
  const task = workIssues(demo).find(item => item.id === session.taskId)
  if (!task) return null
  const target = session.target
  const stage = target?.stage ?? task.status
  const siblings = ordered(workIssues(demo).filter(item => item.id !== task.id && item.epicId === task.epicId && (!board || item.status === stage)))
  const description = destinationText(task.id, target, board)
  return <>
    <section className={`ww-drag-controls ww-drag-controls--${session.mode}`} aria-label={`Move ${task.id}`}>
      <div className="ww-drag-announcement"><p role="status" aria-live="polite"><strong>{description}</strong></p><Button onClick={drag.cancel}>Cancel move</Button></div>
      <p className="ww-hint">{session.mode === "pointer" ? "Release on the marked destination to save. Escape or release outside the work to cancel." : "Choose a position, then confirm the move."} {board ? "This changes the stage directly; it does not approve work." : "List placement changes planning order only."}</p>
      {stage === "done" && task.status !== "done" && <p className="ww-hint">Done work leaves the Open filter. You can open the moved issue from the confirmation.</p>}
      {session.mode === "placement" ? <div className="ww-placement-form">
        {board && <Label>Destination stage<Select data-placement-focus value={stage} onChange={event => drag.choose(event.target.value as Stage, null, "end")}>{STAGES.map(value => <option key={value} value={value}>{label(value)}</option>)}</Select></Label>}
        <Label>Planning position<Select data-placement-focus={!board || undefined} value={target?.anchorId ? `${target.placement}:${target.anchorId}` : "end"} onChange={event => {
          const [placement, anchor] = event.target.value.split(":")
          drag.choose(stage, anchor ?? null, placement as Placement)
        }}><option value="end">End of {board ? label(stage) : "project"}</option>{siblings.flatMap(item => [<option key={`before-${item.id}`} value={`before:${item.id}`}>Before {item.id} · {item.title}</option>, <option key={`after-${item.id}`} value={`after:${item.id}`}>After {item.id} · {item.title}</option>])}</Select></Label>
        <Button variant="primary" disabled={!target?.valid} onClick={drag.commit}>Confirm move</Button>
      </div> : board ? <div className="ww-drag-stage-targets" aria-label="Drop at end of stage">{STAGES.map(value => <div key={value} data-drop-rail={value} data-active={target?.valid && target.stage === value && !target.anchorId ? "true" : undefined}><span>{label(value)}</span><small>Drop at end</small></div>)}</div> : <div className={`ww-drop-end ww-drag-list-end${target?.valid && !target.anchorId ? " ww-drop-end--active" : ""}`} data-drop-rail={task.status}>Drop at end of this Epic’s planning order</div>}
    </section>
    {session.mode === "pointer" && <div className="ww-drag-preview" aria-hidden="true" style={{ left: Math.max(8, Math.min(session.x + 18, window.innerWidth - 240)), top: Math.max(8, Math.min(session.y + 18, window.innerHeight - 100)) }}><span className="ww-code">{task.id}</span><span>{task.title}</span></div>}
  </>
}
