# Phase 03 — Datenmodell

## Output: `studio/schema.prisma`

Write schema.prisma with this structure:

```prisma
// Dark Factory Studio — Phase 03 Schema
// Project: [Name]
// Generated from: spec.md + architecture.md
// Status: awaiting_approval

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or as specified in constraints
  url      = env("DATABASE_URL")
}

// ── Enums ──────────────────────────────────────

enum Role {
  // from spec.md actors
}

// ── Core Models ────────────────────────────────

model User {
  id        String   @id @default(cuid())
  // fields from spec.md actor definition
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // relations
  @@index([email])
}

// ── Domain Models ──────────────────────────────

// [one model per spec.md entity]
// [comments explaining non-obvious decisions]

// ── Join Tables / Implicit Relations ───────────

// [if needed]
```

## After Writing

1. Update `studio/task_plan.md`:
   - Set `current_status: awaiting_approval`
2. Present schema to human with:
   - Model count and relation summary
   - Key design decisions (why soft delete, why this index, etc.)
   - Any open questions (ambiguous entities in spec)
3. STOP — wait for `/df:approve`

## Documenting Decisions

Write to `studio/findings.md`:
```markdown
## Schema Decisions — Phase 03

- [Decision]: [Reason referencing spec.md]
- [Decision]: [Reason referencing architecture.md]
```
