# Phase 01 — Prompt & PRD

## Output: `studio/spec.md`

Write spec.md with exactly this structure:

```markdown
# [Project Name] — Specification

## Core Purpose
[One sentence. What does this app do?]

## Actors

### [Actor Name]
- **Role**: [description]
- **Auth**: [how they log in]
- **Can**: [list of permissions]
- **Cannot**: [explicit restrictions]

[Repeat for each actor]

## Features

### [Feature Name]
- **Priority**: must-have | should-have | nice-to-have
- **Actors**: [who uses this]
- **Description**: [what it does]

[Repeat for each feature]

## User Flows

### [Flow Name] — [Actor]
1. [Step]
2. [Step]
3. [Step]
- **Happy path result**: [expected outcome]
- **Error cases**: [what can go wrong]

[Repeat for each flow]

## Constraints

- **Hosting**: [requirement or "no preference"]
- **Auth**: [requirement or "no preference"]
- **Compliance**: [requirements or "none"]
- **Integrations**: [existing systems or "none"]
- **Budget**: [limits or "no hard limit"]
- **Timeline**: [deadline or "no deadline"]

## Non-Goals
[What this app explicitly does NOT do in v1]

## Open Questions
[Anything that needs clarification before design phase]
```

## After Writing

1. Update `studio/task_plan.md`:
   - Set `current_status: awaiting_approval`
   - Check off completed tasks
2. Present spec.md to human
3. Highlight any assumptions you made
4. Highlight open questions
5. STOP — wait for `/df:approve`
