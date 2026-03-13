---
name: detect-stack
description: Derives stack proposal from spec.md constraints, architecture.md structure, and schema.prisma complexity. Presents tradeoffs layer by layer. Phase 04 skill used by stack-advisor agent (opus).
---

# Detect Stack Skill

## Trigger

- Phase 04 becomes active (after Phase 03 approval)
- stack-advisor agent loads this skill

## Input

- `studio/spec.md` — constraints section is primary driver
- `studio/architecture.md` — page count, real-time needs, complexity
- `studio/schema.prisma` — model count, relation complexity

## Stack Layers

Propose each layer independently. Every choice must reference a constraint.

### 1. Framework
- Default: Next.js (App Router)
- Consider: Remix (if heavy forms), Astro (if content-heavy), SvelteKit (if spec says so)
- Reference: page count from architecture.md, SSR needs

### 2. Database
- Default: PostgreSQL
- Consider: SQLite (if self-hosted + simple), MySQL (if existing infra)
- Reference: schema complexity, hosting constraint

### 3. ORM
- Default: Prisma
- Consider: Drizzle (if performance-critical), Kysely (if raw SQL needed)
- Reference: schema.prisma already exists — switching ORM costs

### 4. Auth
- Default: Auth.js v5
- Consider: Lucia (more control), Clerk (faster setup, external), Keycloak (enterprise)
- Reference: spec constraints on auth provider

### 5. Styling
- Default: Tailwind CSS
- Consider: CSS Modules (if team preference), Panda CSS (if design tokens)

### 6. UI Components
- Default: shadcn/ui
- Consider: Radix (unstyled), MUI (enterprise), none (simple app)

### 7. State Management
- Default: React Server Components + Server Actions
- Consider: Zustand (if complex client state), TanStack Query (if heavy fetching)

### 8. Deployment
- Default: Vercel
- Consider: Docker + VPS (if self-hosted), Fly.io (if edge needed)
- Reference: hosting constraint from spec

### 9. Testing
- Default: Vitest + Playwright
- Consider: Jest (if existing), Cypress (if E2E-heavy)

### 10. Monorepo
- Default: no (single app)
- Consider: Turborepo (if multiple packages needed)

## Output: `studio/project-context.md`

```markdown
# SEALED — Phase 04 approved

## Project: [Name]
## Stack Decision Date: [ISO date]

### Framework
- **Choice**: [tech]
- **Why**: [constraint reference]
- **Alternatives considered**: [tech] (tradeoff), [tech] (tradeoff)

[Repeat for each layer]

### Risk Assessment
- [Risk 1]: [mitigation]
- [Risk 2]: [mitigation]

### Package List
```json
{
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

### Environment Variables Required
- `DATABASE_URL` — [description]
- [others from stack choices]
```

## Important

- Do NOT seal until human explicitly approves
- Every choice must trace to a constraint
- If constraints conflict, flag it and ask human to resolve
- This document drives every build agent — accuracy matters more than speed
