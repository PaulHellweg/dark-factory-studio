# /df:status

Zeigt den aktuellen Pipeline-Stand an.

## Ausführung

1. Lies `studio/task_plan.md` — falls nicht vorhanden: "Keine Pipeline aktiv. Starte mit /df:start"
2. Zeige Übersicht:

```
═══ Dark Factory Studio ═══
Project: [Name]
Started: [Datum]

Phase 01 PRD:           ✓ done
Phase 02 Design:        ✓ done
Phase 03 Schema:        → in_progress (3 open tasks)
Phase 04 Stack:         ○ locked
Phase 05 Build:         ○ locked

Current: Phase 03 — Datenmodell
Status: in_progress

Open Tasks:
- [ ] Task 1
- [ ] Task 2
```

3. Falls `awaiting_approval`: Weise darauf hin, dass `/df:approve` nötig ist
4. Falls `studio/findings.md` existiert: zeige letzte 3 Einträge
5. Falls `studio/progress.md` existiert: zeige letzte 5 Einträge
