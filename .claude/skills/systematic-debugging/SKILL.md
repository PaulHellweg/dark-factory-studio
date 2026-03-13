---
name: systematic-debugging
description: Use when encountering any bug, test failure, unexpected behavior, or production issue — before proposing any fix. Four-phase root cause process: reproduce, isolate, identify, verify. Never skip phases. Source: obra/superpowers pattern.
---

# Systematic Debugging Skill

**Rule: No fix before root cause is confirmed. Every time. No exceptions.**

If you think you know the cause after 30 seconds, you're probably wrong.
If you're under pressure, you're especially wrong. Do the phases.

---

## Phase 1 — Reproduce

Create a minimal, reliable reproduction.

- Can you make it fail on demand? If not, you don't understand it yet.
- What is the *exact* failure? Error message, stack trace, wrong output — copy it precisely.
- What is the *exact* expected behavior? Write it down.
- What changed recently? Git log, dependency updates, env changes.

**Exit criterion**: You can make it fail reliably, you know what "fixed" looks like.

---

## Phase 2 — Isolate

Narrow the blast radius until you have the smallest possible failing case.

- Binary search through the call stack: which function is the last correct one?
- Remove code until the bug disappears — that removed code is the cause (or hides it).
- Check: is this environment-specific? OS, Node version, test vs prod, CI vs local?
- Check: is this data-specific? Which inputs trigger it, which don't?

**Tools**: `console.log` at boundaries, debugger breakpoints, `git bisect` for regressions.

**Exit criterion**: You have a 5-line reproduction that isolates the exact component.

---

## Phase 3 — Identify Root Cause

Read the actual code that causes the failure.

- Trace the execution path from the reproduction to the error.
- Identify the *assumption* that was wrong, not just the line that crashed.
- Ask: why does this code exist? What was the author trying to do?
- If the bug is in a dependency: read its source. Don't assume.

**Root cause statement** (write this before touching code):
> "The bug is that [specific thing] assumes [wrong assumption], but [actual reality]."

If you can't write that sentence clearly, you haven't found the root cause yet.

**Exit criterion**: Clear root cause statement written in findings.md.

---

## Phase 4 — Verify Fix

Before calling it done:

1. Run the minimal reproduction from Phase 1 — confirm it passes.
2. Run the full test suite — confirm no regressions.
3. Review the fix: does it address the root cause, or does it patch a symptom?
4. Are there other places in the codebase with the same wrong assumption? Find and fix them.

**Exit criterion**: Minimal repro passes, no regressions, root cause addressed (not just patched).

---

## What To Write in findings.md

```markdown
## Bug: [short description]

**Reproduced**: yes — [how to trigger it]
**Isolated to**: [specific file/function/line]
**Root cause**: [exact statement]
**Fix**: [what was changed and why it addresses root cause]
**Verified**: [test that proves it's fixed]
**Similar patterns**: [other places checked]
```

---

## Anti-Patterns (forbidden)

- Changing code before completing Phase 1
- "Probably a race condition" without proving it
- Adding try/catch to hide the error
- Updating a dependency hoping it fixes it
- Asking the human "does this fix it?" without running tests yourself
