# /df:start

Startet die Dark Factory Studio Pipeline für ein neues Projekt.

## Was dieser Command tut

1. Liest alle vorhandenen Inputs (Prompt, Projektname, Actors, Constraints)
2. Erstellt `studio/` Verzeichnis falls nicht vorhanden
3. Initialisiert `studio/task_plan.md` mit Phase 01 als aktiv
4. Spawnt den `prd-agent` für Phase 01

## Vorbereitung

Bevor du `/df:start` ausführst, stelle sicher dass du bereit bist zu beschreiben:
- Was die App tun soll (Freiform)
- Wer sie benutzt (Actors)
- Was sie NICHT darf oder kosten soll (Constraints)

## Ausführung

```
mkdir -p studio
```

Dann: Lade `.claude/skills/prd-interviewer/SKILL.md` und `.claude/skills/prd-interviewer/PHASE.md`.

Führe den PRD-Interview-Prozess durch. Stelle Fragen, bis alle Pflichtfelder gefüllt sind.
Schreibe `studio/spec.md` und `studio/task_plan.md`.
Warte auf `/df:approve`.

## task_plan.md Template

```markdown
# Dark Factory Studio — Task Plan

project: [Name]
started: [ISO date]

## Phases

- [ ] phase_01: Prompt & PRD — status: active
- [ ] phase_02: Design Review — status: locked
- [ ] phase_03: Datenmodell — status: locked
- [ ] phase_04: Stack Review — status: locked
- [ ] phase_05: Build — status: locked

## Current Phase: 01

current_phase: 1
current_status: in_progress

## Open Tasks

- [ ] Complete PRD interview
- [ ] Write studio/spec.md
- [ ] Await human approval
```
