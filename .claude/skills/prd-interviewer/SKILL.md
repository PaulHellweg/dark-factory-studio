---
name: prd-interviewer
description: Structured intake process for Phase 01. Transforms freeform project descriptions into complete spec.md through guided interview. Asks one question at a time until all required fields are filled.
---

# PRD Interviewer Skill

## Trigger

- `/df:start`
- "new project", "let's start", "I want to build..."
- Phase 01 active in task_plan.md

## Interview Process

### Step 1 — Capture the Vision (1 question)

Ask: "Was soll die App tun? Beschreib es so, wie du es einem Kollegen erklären würdest."

Accept freeform text. Extract:
- Core purpose (1 sentence)
- Key features (list)
- What it is NOT (boundaries)

### Step 2 — Identify Actors (1 question per gap)

Ask: "Wer benutzt die App? Welche verschiedenen Rollen gibt es?"

For each actor, clarify:
- What can they do?
- What can they NOT do?
- How do they authenticate?

### Step 3 — Define Constraints (1 question)

Ask: "Gibt es technische oder geschäftliche Einschränkungen? (Budget, Hosting, Compliance, bestehende Systeme)"

Categories:
- Hosting (self-hosted, cloud, specific provider)
- Auth (external provider, self-managed)
- Compliance (GDPR, HIPAA, etc.)
- Integrations (existing APIs, databases)
- Budget (API costs, infrastructure)
- Timeline

### Step 4 — User Flows (1 question per core flow)

For each primary actor, ask: "Beschreib den wichtigsten Workflow für [Actor]. Was passiert Schritt für Schritt?"

Capture:
- Trigger → Steps → Expected outcome
- Error cases
- Edge cases

### Step 5 — Validate Completeness

Before writing spec.md, confirm:
- [ ] At least 1 actor defined with permissions
- [ ] At least 1 user flow per actor
- [ ] Constraints section filled (even if "none")
- [ ] Core purpose is a single clear sentence
- [ ] Boundaries defined (what the app does NOT do)

If anything is missing, ask the specific missing question. Do not ask about things already answered.

## Output

Hand off to PHASE.md for the spec.md structure.
