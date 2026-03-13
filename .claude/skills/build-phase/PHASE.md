# Phase 05 — Build

## Prerequisites

All must exist and be approved:
- `studio/spec.md`
- `studio/architecture.md`
- `studio/schema.prisma`
- `studio/project-context.md` (SEALED)

## Process

### Step 1 — Initialize Project

1. Read `studio/project-context.md` for exact stack
2. Create `app/` directory with the chosen framework
3. Install exact packages from project-context.md package list
4. Set up project structure matching architecture.md

### Step 2 — Database Setup

1. Copy `studio/schema.prisma` to `app/prisma/schema.prisma`
2. Configure database connection
3. Run initial migration: `prisma migrate dev --name init`

### Step 3 — Build Order

Follow this order strictly:
1. **Auth** — login, registration, session management
2. **Layouts** — shared components, navigation (reference prototype)
3. **Core models** — CRUD for primary entities, TDD enforced
4. **User flows** — implement flows from spec.md one by one
5. **Edge cases** — error handling, empty states, loading states
6. **Polish** — responsive design, accessibility basics

### Step 4 — Quality Gates

Before marking Phase 05 complete:
- [ ] All user flows from spec.md work end-to-end
- [ ] All tests pass (`npm test`)
- [ ] Security hardening skill checklist passed
- [ ] No hardcoded secrets (secret-scanner hook enforces)
- [ ] Responsive on mobile and desktop
- [ ] Error states handled for all mutations

### Step 5 — Security Audit

Load `.claude/skills/security-hardening/SKILL.md` and run checklist.
The security-auditor agent (opus) has VETO power — if it flags critical issues, they must be fixed.

### Step 6 — Final Review

The architect-reviewer agent (opus) does a read-only review of:
- Architecture alignment with architecture.md
- Schema usage matches schema.prisma
- No scope creep beyond spec.md

## Planning

Use Manus pattern throughout:
- Update `studio/task_plan.md` with build tasks (one per user flow)
- Check off tasks as completed
- Write to `studio/findings.md` for decisions during build
- The reread-plan hook reminds you every 2 ops

## Reference

- Use `prototype/` as UI reference — but rebuild from scratch in `app/`
- The prototype is for UX validation, not code reuse
