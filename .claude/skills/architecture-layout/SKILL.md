---
name: architecture-layout
description: Derives page structure, component hierarchy, and user flow diagrams from approved spec.md. Phase 02 first step — creates architecture.md before prototype building begins.
---

# Architecture Layout Skill

## Trigger

- Phase 02 becomes active (after Phase 01 approval)
- ui-designer agent loads this skill

## Input

- `studio/spec.md` (approved)

## Process

### Step 1 — Extract Pages

From spec.md, derive every distinct page/view:
- List all user flows → each step that needs UI = a page or modal
- Group by actor role (which pages does each actor see?)
- Identify shared layouts (nav, sidebar, footer)

### Step 2 — Component Tree

For each page:
- Break into components (max 3 levels deep)
- Name components by what they DO, not what they ARE
- Identify shared components (used on multiple pages)
- Mark data requirements: what data does each component need?

### Step 3 — User Flow Diagrams

For each user flow from spec.md:
- Map to page transitions: Page A → Action → Page B
- Identify loading states, error states, empty states
- Mark where data mutations happen (create, update, delete)

### Step 4 — Navigation Structure

- Primary navigation (always visible)
- Secondary navigation (contextual)
- Auth-gated routes (which pages require login?)
- Role-gated routes (which pages are actor-specific?)

## Output

Hand off to PHASE.md for the architecture.md structure.
