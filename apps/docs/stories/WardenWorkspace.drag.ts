import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react"
import { label, ordered, type Demo, type Stage, type Task } from "./WardenWorkspace.model"

export type Placement = "before" | "after" | "end"
export type DropTarget = { stage: Stage; anchorId: string | null; placement: Placement; valid: boolean; reason: string }
export type DragSession = { taskId: string; mode: "pointer" | "placement"; x: number; y: number; target: DropTarget | null }
export function destinationText(id: string, target: DropTarget | null, board: boolean): string {
  if (!target) return `Move ${id} · choose a destination`
  if (!target.valid) return target.reason
  return `${board ? `Move ${id} to ${label(target.stage)}` : `Reorder ${id}`} · ${target.anchorId ? `${target.placement} ${target.anchorId}` : board ? `end of ${label(target.stage)}` : "end of project"}`
}
export function placementBefore(tasks: Task[], task: Task, target: DropTarget, board: boolean): string | null {
  const siblings = ordered(tasks.filter(item => item.projectId === task.projectId && item.id !== task.id))
  if (target.anchorId && target.placement === "before") return target.anchorId
  if (target.anchorId) return siblings[siblings.findIndex(item => item.id === target.anchorId) + 1]?.id ?? null
  if (!board) return null
  const last = siblings.filter(item => item.status === target.stage).at(-1)
  return last ? siblings[siblings.findIndex(item => item.id === last.id) + 1]?.id ?? null : null
}

/** Pointer capture is confined to the handle; ordinary card touches still scroll/open. */
export function useTaskDrag({ demo, board, context, root, scroll, onDrop, onCancel }: {
  demo: Demo; board: boolean; context: string; root: RefObject<HTMLDivElement | null>; scroll: RefObject<HTMLElement | null>
  onDrop: (id: string, target: DropTarget) => void; onCancel: (id: string) => void
}) {
  const [session, setSession] = useState<DragSession | null>(null)
  const active = useRef<DragSession | null>(null)
  const pending = useRef<{ taskId: string; pointerId: number; x: number; y: number; handle: HTMLElement } | null>(null)
  const suppressClick = useRef(false)
  const latest = useRef({ demo, board, onDrop, onCancel })
  latest.current = { demo, board, onDrop, onCancel }
  function publish(next: DragSession | null) { active.current = next; setSession(next) }
  function targetFor(taskId: string, stage: Stage, anchorId: string | null = null, placement: Placement = "end"): DropTarget {
    const source = latest.current.demo.tasks.find(item => item.id === taskId)
    const anchor = latest.current.demo.tasks.find(item => item.id === anchorId)
    if (source && anchor && source.projectId !== anchor.projectId) return { stage, anchorId, placement, valid: false, reason: "Another project: use Move to project for an explicit transfer." }
    if (source && latest.current.demo.projects.find(item => item.id === source.projectId)?.completed && stage !== "done") return { stage, anchorId, placement, valid: false, reason: "Reopen the project before moving this task into open work." }
    return { stage, anchorId, placement, valid: Boolean(source), reason: "" }
  }
  function hitTest(id: string, x: number, y: number): DropTarget | null {
    const source = latest.current.demo.tasks.find(item => item.id === id)
    const host = root.current
    if (!source || !host || x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return null
    const hit = document.elementFromPoint(x, y)
    const rail = hit?.closest<HTMLElement>("[data-drop-rail]")
    if (rail && host.contains(rail)) return targetFor(id, rail.dataset.dropRail as Stage)
    const card = hit?.closest<HTMLElement>("[data-drop-task]")
    if (card && host.contains(card) && card.dataset.dropTask !== id) {
      const anchor = latest.current.demo.tasks.find(item => item.id === card.dataset.dropTask)
      if (!anchor) return null
      const bounds = card.getBoundingClientRect()
      return targetFor(id, latest.current.board ? anchor.status : source.status, anchor.id, y < bounds.top + bounds.height / 2 ? "before" : "after")
    }
    const area = hit?.closest<HTMLElement>("[data-drop-zone]")
    if (!area || !host.contains(area)) return null
    const stage = latest.current.board ? area.dataset.dropZone as Stage : source.status
    const cards = [...area.querySelectorAll<HTMLElement>("[data-drop-task]")].filter(node => node.dataset.dropTask !== id)
    const next = cards.find(node => y < node.getBoundingClientRect().top + node.getBoundingClientRect().height / 2)
    if (next) return targetFor(id, stage, next.dataset.dropTask!, "before")
    return targetFor(id, stage)
  }
  function finish(commit: boolean) {
    const current = active.current
    const pressed = pending.current
    pending.current = null
    publish(null)
    if (pressed?.handle.hasPointerCapture(pressed.pointerId)) pressed.handle.releasePointerCapture(pressed.pointerId)
    if (!current) return
    suppressClick.current = current.mode === "pointer"
    if (commit && current.target?.valid) latest.current.onDrop(current.taskId, current.target)
    else latest.current.onCancel(current.taskId)
    requestAnimationFrame(() => {
      const handle = root.current?.querySelector<HTMLElement>(`[data-move-handle="${current.taskId}"]`)
      if (handle) { if (current.mode === "placement") handle.scrollIntoView({ block: "nearest" }); handle.focus({ preventScroll: true }) }
    })
  }
  function pointerDown(event: ReactPointerEvent<HTMLButtonElement>, taskId: string) {
    if (event.button !== 0 || !event.isPrimary) return
    if (active.current) finish(false)
    suppressClick.current = false
    pending.current = { taskId, pointerId: event.pointerId, x: event.clientX, y: event.clientY, handle: event.currentTarget }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function activate(taskId: string, keyboard = false) {
    if (!keyboard && suppressClick.current) { suppressClick.current = false; return }
    suppressClick.current = false
    const source = latest.current.demo.tasks.find(item => item.id === taskId)
    if (!source) return
    publish({ taskId, mode: "placement", x: 0, y: 0, target: targetFor(taskId, source.status) })
    requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("[data-placement-focus]")?.focus())
  }
  function choose(stage: Stage, anchorId: string | null, placement: Placement) {
    const current = active.current
    if (current) publish({ ...current, target: targetFor(current.taskId, stage, anchorId, placement) })
  }
  useEffect(() => {
    function move(event: PointerEvent) {
      const pressed = pending.current
      if (!pressed || pressed.pointerId !== event.pointerId) return
      if (!active.current && Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) < 7) return
      event.preventDefault()
      const next = { taskId: pressed.taskId, mode: "pointer" as const, x: event.clientX, y: event.clientY, target: hitTest(pressed.taskId, event.clientX, event.clientY) }
      publish(next)
    }
    function up(event: PointerEvent) {
      if (pending.current?.pointerId !== event.pointerId) return
      if (active.current?.mode === "pointer") {
        const current = active.current
        active.current = { ...current, target: hitTest(current.taskId, event.clientX, event.clientY) }
        finish(true)
      } else {
        const pressed = pending.current; pending.current = null
        if (pressed?.handle.hasPointerCapture(event.pointerId)) pressed.handle.releasePointerCapture(event.pointerId)
      }
    }
    function cancel() { if (active.current || pending.current) finish(false) }
    function escape(event: KeyboardEvent) { if (event.key === "Escape" && (active.current || pending.current)) { event.preventDefault(); event.stopPropagation(); cancel() } }
    window.addEventListener("pointermove", move, { passive: false })
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", cancel)
    window.addEventListener("blur", cancel)
    window.addEventListener("keydown", escape, true)
    return () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", cancel); window.removeEventListener("blur", cancel); window.removeEventListener("keydown", escape, true)
    }
  }, [])
  useEffect(() => { if (active.current) finish(false) }, [context])
  useEffect(() => {
    if (session?.mode !== "pointer") return
    let frame = 0
    function tick() {
      const current = active.current
      if (!current || current.mode !== "pointer") return
      const overControls = document.elementFromPoint(current.x, current.y)?.closest(".ww-drag-controls")
      const boardNode = overControls ? null : root.current?.querySelector<HTMLElement>(".ww-board")
      const edgeSpeed = (position: number, start: number, end: number) => position < start + 48 ? -Math.min(16, (start + 48 - position) / 3) : position > end - 48 ? Math.min(16, (position - end + 48) / 3) : 0
      if (boardNode) {
        const box = boardNode.getBoundingClientRect()
        if (current.y >= Math.max(0, box.top) && current.y <= Math.min(window.innerHeight, box.bottom) && current.x >= box.left && current.x <= box.right) boardNode.scrollLeft += edgeSpeed(current.x, box.left, box.right)
      }
      const scroller = scroll.current
      if (scroller && !overControls) {
        const box = scroller.getBoundingClientRect()
        if (current.x >= box.left && current.x <= box.right) {
          const speed = edgeSpeed(current.y, Math.max(0, box.top), Math.min(window.innerHeight, box.bottom))
          if (scroller.scrollHeight > scroller.clientHeight && getComputedStyle(scroller).overflowY !== "visible") scroller.scrollTop += speed
          else if (current.y < 48 || current.y > window.innerHeight - 48) window.scrollBy(0, speed)
        }
      }
      const target = hitTest(current.taskId, current.x, current.y)
      if (JSON.stringify(target) !== JSON.stringify(current.target)) publish({ ...current, target })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [session?.mode])
  return { session, pointerDown, activate, choose, cancel: () => finish(false), commit: () => finish(true) }
}
