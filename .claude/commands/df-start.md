# /df:start — Dark Factory Pipeline Start
# Usage: /df:start
# Trigger: User types /df:start to begin a new project pipeline

You are now running the Dark Factory v6.1 autonomous pipeline.
Execute the following sequence completely without stopping for confirmation.

## Startup Sequence

### Step 0: State Files Check
Read all 5 state files in this exact order:
1. `tasks/lessons.md` — **Study every lesson. Apply them now.**
2. `project-context.md` — Read the stack and agent routing
3. `tasks/task_plan.md` — Check current phase
4. `tasks/progress.md` — Check what's already done
5. `tasks/findings.md` — Check for blockers

If `project-context.md` is still a template (contains `[PROJECT_NAME]`):
→ Run the detect-stack skill first to populate it from requirements.md

### Step 1: Requirements Intake
Read `requirements.md`. If it doesn't exist, ask the user for requirements and write them to `requirements.md`.

### Step 2: Brainstorm & Architecture Select
Spawn a subagent to:
- Analyze requirements
- Identify architecture pattern (use `.claude/patterns/INDEX.md`)
- Populate `project-context.md` with confirmed stack
- Write key decisions to `tasks/findings.md`

### Step 3: Spec Writing
Using the spec-writing skill, transform requirements into `SPEC.md`:
- Functional requirements
- Data models + PII field identification
- User stories
- Acceptance criteria per feature
- Out of scope (explicit)

### Step 4: Architecture Design
Using `ARCHITECTURE.md` template from `.claude/patterns/`:
- Tech stack table with rationale
- Database schema (Prisma or equivalent)
- Auth architecture
- Security decisions
- Folder structure
- Environment variables list

### Step 5: Task Planning
Write `tasks/task_plan.md`:
- Break ARCHITECTURE.md into concrete tasks
- Ordered by dependency
- Each task has clear done-criteria

### Step 6: Implementation
Route to correct agents from `project-context.md`:
- `code_agent_frontend` for UI
- `code_agent_backend` for API
- TDD enforced: test first, then implement

### Step 7: Architecture Review
Dispatch `architect-reviewer` agent:
- Reads `ARCHITECTURE.md` + implementation
- Elegance check on all non-trivial code
- Outputs `ARCHITECTURE_REVIEW.md`
- CHANGES_REQUIRED → back to Step 6
- APPROVED → continue

### Step 8: Security Audit
Dispatch `security-auditor` agent:
- Full OWASP checklist
- Outputs `SECURITY_REPORT.md`
- VETO → pipeline halts, report shown to user
- APPROVED → continue

### Step 9: Deploy
Dispatch `devops-agent`:
- Build Docker image
- Run CI checks
- Deploy to target from `project-context.md`
- Verify health check passes

### Step 10: Done
- Update `tasks/progress.md` (final entry)
- Summarize: what was built, where it's deployed, known limitations
- Check `tasks/lessons.md` — any new lessons from this run?

---

**No checkpoints. No confirmation prompts. Run autonomously from start to finish.**
Only halt if: security VETO, missing requirements, or unresolvable technical blocker.
