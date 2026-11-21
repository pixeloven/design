---
id: pxo:ddr/0008
title: Shared controls are published only on shared evidence
status: accepted
date: 2026-10-23
sources:
  - docs/brand-family.md#shared-implementation-boundary
  - docs/brand-foundations-plan.md#shared-controls-acceptance
affects:
  - packages/ui
---

# DDR-0008: Shared controls are published only on shared evidence

**Status:** accepted · **Date:** 2026-10-23, first written in the brand-family guide.
**Backfilled** on 2026-11-21. This record adds no new content.

## Decision

> The published native controls are Button, Input, Select and Label. Their native
> semantics, focus, disabled, invalid and selected states are shared. Font loading,
> theme persistence, validation messages and product state remain with consumers.

> Panels, menus, tooltips, navigation, asynchronous feedback and draft handling
> are candidates for further reuse. First compare working Lattice and Warden
> requirements; publish a component only when its shared behavior is clear.
> Document product differences instead of making a general wrapper conceal them.
>
> — [`docs/brand-family.md`](../docs/brand-family.md#shared-implementation-boundary), Shared implementation boundary

## Sources

- [Brand family: shared implementation boundary](../docs/brand-family.md#shared-implementation-boundary)
- [Approved brand foundations: shared controls acceptance](../docs/brand-foundations-plan.md#shared-controls-acceptance)
