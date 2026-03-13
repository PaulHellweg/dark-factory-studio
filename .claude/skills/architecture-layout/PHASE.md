# Phase 02 — Design Review

## Output: `studio/architecture.md`

Write architecture.md with exactly this structure:

```markdown
# [Project Name] — Architecture

## Pages

### [Page Name]
- **Route**: `/path`
- **Access**: [public | authenticated | role:admin]
- **Purpose**: [one sentence]
- **Components**:
  - ComponentName — [what it does]
    - SubComponent — [what it does]
- **Data needed**: [list of entities/fields from spec]
- **Mutations**: [create/update/delete actions on this page]

[Repeat for each page]

## Shared Components

| Component | Used on | Props |
|-----------|---------|-------|
| [Name] | [pages] | [key props] |

## Layouts

### MainLayout
- [what's always visible: nav, sidebar, etc.]
- [responsive behavior]

### AuthLayout
- [login/register pages layout]

## User Flows (Page Transitions)

### [Flow Name]
```
[Page A] →(action)→ [Page B] →(action)→ [Page C]
                                    ↓ (error)
                              [Error State]
```

[Repeat for each flow from spec.md]

## States

For every page, these states must be designed:
- **Loading**: skeleton or spinner
- **Empty**: no data yet — CTA to create
- **Error**: what the user sees on failure
- **Success**: confirmation after mutation
```

## After Writing

1. Load `.claude/skills/frontend-prototype/SKILL.md`
2. Build prototype in `prototype/` based on this architecture
3. After prototype is complete: update task_plan.md → `awaiting_approval`
4. Present architecture.md + working prototype to human
5. STOP — wait for `/df:approve`
