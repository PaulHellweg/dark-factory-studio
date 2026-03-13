---
name: verification-before-completion
description: Use before declaring any task "done", "finished", or "complete". Systematic verification that the work actually meets requirements. Prevents premature completion. Source: obra/superpowers pattern.
---

# Verification Before Completion Skill

## Trigger

- "done", "finished", "complete", "fixed", "ready"
- Before any `/df:approve` recommendation
- Before ending a build session

## The Rule

**Never declare something done without verifying it yourself.**

"I think it works" is not verification. "The tests pass" is not full verification.
Run the checks below before saying the word "done".

## Verification Checklist

### 1. Requirements Match

- Re-read the original requirement (spec.md section, task description, user request)
- List each requirement point
- For each point: does the implementation satisfy it? Check, don't assume.

### 2. Tests Pass

- Run the full test suite, not just the new test
- Check: did any existing test break?
- Check: is the new test actually testing the right thing? (read the assertion)

### 3. Manual Verification

- Can you trace through the code and confirm it does what it should?
- What happens with edge case inputs? (empty, null, very large, special characters)
- What happens when the dependency fails? (network down, DB error, timeout)

### 4. No Side Effects

- Did this change break any other feature?
- Did this change modify shared state that other code depends on?
- Are there any files changed that shouldn't be?

### 5. Clean State

- No debug code left (console.log, TODO, commented-out code)
- No hardcoded values that should be configurable
- No skipped tests

## Output

Before declaring done, write to findings.md:

```markdown
## Verification — [task/feature]

- Requirements: [x/y satisfied]
- Tests: [pass/fail, count]
- Manual check: [what was verified]
- Side effects: [none found / list]
- Clean: [yes / issues]

Verdict: [DONE / NOT DONE — reason]
```

## If NOT DONE

List specifically what's missing. Don't say "almost done" — say what the gap is and fix it.
