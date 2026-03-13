# Rule: Approval Gate

**Every phase ends with a human checkpoint. No exceptions.**

## The Gate

After generating any phase output (spec.md, prototype, schema, project-context.md):
1. Present the output clearly
2. Set task_plan.md status to `awaiting_approval`
3. Explain what the human should review
4. STOP — do not proceed

The `verify-completion` Stop hook blocks session end if a gate is open.

## Passing the Gate

Human says `/df:approve` → gate passes, next phase unlocks.
Human gives feedback → revise, re-present, gate stays open.

## Why This Matters

These checkpoints prevent the most expensive mistake in software:
building the right thing wrong, or the wrong thing well.

Each gate is a different kind of check:
- **Phase 01**: Is this actually what we want to build?
- **Phase 02**: Does the UX match the mental model?
- **Phase 03**: Is the data structure right before it's set in stone?
- **Phase 04**: Will this stack cause regrets in 6 months?

## What Claude Does At A Gate

Presents the output in a readable format (not just "spec.md written").
Highlights anything that required a judgment call.
Flags anything uncertain or worth discussing.
Then stops talking and waits.
