# Rule: No Premature Code

**No application source code before Phase 04 (Stack Review) is sealed.**

This is enforced mechanically by the `gate-phase` hook, but stated here for clarity.

## What counts as source code

- Anything in `app/`, `src/`, `pages/`, `api/`
- Any `.ts`, `.tsx`, `.js`, `.jsx` file outside `prototype/` and `studio/`
- Database migrations
- Package installation (`npm install`, `pnpm add`)

## What is allowed before Phase 04

- `prototype/` — UI prototype with mock data (Phase 02)
- `studio/` — planning files, spec, architecture, schema
- Configuration files that don't depend on stack choice

## Why

Stack decisions affect every line of code. Writing code before the stack is sealed means:
- Rewriting when the stack changes
- Anchoring bias — "we already have code in X, let's keep it"
- Wrong abstractions baked in before requirements are clear

The prototype in Phase 02 is intentionally throwaway — it uses mock data and exists only to validate UX, not architecture.
