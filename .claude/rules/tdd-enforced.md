# Rule: TDD Enforced (Phase 05)

**In Phase 05 (Build), follow RED-GREEN-REFACTOR. No production code without a failing test first.**

## The Cycle

1. **RED** — Write a test that describes the expected behavior. Run it. It must fail.
2. **GREEN** — Write the minimum code to make the test pass. No more.
3. **REFACTOR** — Clean up while tests stay green.

## When This Applies

- Phase 05 only (Build phase)
- All application code in `app/` or `src/`
- API routes, business logic, data access layers
- Utility functions

## When This Does NOT Apply

- Phase 02 prototype (throwaway, mock data)
- Configuration files, environment setup
- CSS/styling-only changes
- One-line type fixes

## What To Write

- Tests go in `__tests__/` or co-located `*.test.ts` files
- Use the test framework specified in `project-context.md`
- Test names describe behavior, not implementation: "creates invoice for valid order" not "test createInvoice function"

## Why

TDD in the build phase catches bugs at write-time, not deploy-time. Combined with the systematic-debugging skill, this ensures issues are found and fixed at the root cause level.
