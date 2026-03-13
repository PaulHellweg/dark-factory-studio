# Dark Factory Studio — Root CLAUDE.md

> Always loaded. Target: ~600 tokens. Non-negotiables only.
> Phase-specific context lives in `.claude/skills/*/PHASE.md`.
> Rules live in `.claude/rules/` — read the relevant one when in doubt.

## Pipeline Phases

5 mandatory phases. No skipping. Each ends with a human approval gate.

```
01 PROMPT & PRD   → spec.md approved
02 DESIGN REVIEW  → UI prototype approved
03 DATENMODELL    → schema.prisma approved
04 STACK REVIEW   → project-context.md SEALED
05 BUILD          → Dark Factory agents execute
```

## Rules (read when relevant)

- `.claude/rules/no-premature-code.md`   — no source code before Phase 04 sealed
- `.claude/rules/approval-gate.md`       — how gates work and why
- `.claude/rules/tdd-enforced.md`        — RED-GREEN-REFACTOR in Phase 05

## Planning Files (Manus Pattern)

Every phase maintains:
- `studio/task_plan.md`  — current phase, tasks, checkboxes
- `studio/findings.md`   — decisions, discoveries, open questions
- `studio/progress.md`   — session log (written by hook)

Re-read `studio/task_plan.md` before every file write.
Write to `findings.md` after every 2 tool operations.

## Approval Gate Protocol

After generating phase output:
1. Write output file
2. Set task_plan.md → `current_status: awaiting_approval`
3. Present output to human — highlight decisions and uncertainties
4. STOP — the verify-completion hook enforces this

On feedback: revise, keep `awaiting_approval`, re-present.
On `/df:approve`: set phase done, unlock next, load next phase skill.

## Model Routing

- `opus`   → stack-advisor, security-auditor, architect-reviewer
- `sonnet` → prd-agent, ui-designer, schema-agent, all coding
- `haiku`  → devops-engineer, docs, dependency checks

## Required Files Per Phase

| Before phase | Must exist |
|---|---|
| 02 Design    | `studio/spec.md` (approved) |
| 03 Schema    | `studio/spec.md`, `studio/architecture.md` |
| 04 Stack     | above + `studio/schema.prisma` |
| 05 Build     | all above + `studio/project-context.md` (SEALED) |

## Hard Stops

Stop and wait for human if:
- Phase output written but not yet approved
- Any attempt to write app code before Phase 04 sealed (gate-phase hook blocks mechanically)
- `project-context.md` not sealed and build starts
- secret-scanner hook fires
- block-dangerous hook fires
