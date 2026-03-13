# /df:approve

Approved die aktuelle Phase und entsperrt die nächste.

## Ausführung

1. Lies `studio/task_plan.md`
2. Prüfe: `current_status` muss `awaiting_approval` sein — sonst Fehlermeldung
3. Setze aktuelle Phase auf `done` (Checkbox abhaken)
4. Bestimme nächste Phase:
   - Phase 01 done → Phase 02 aktiv
   - Phase 02 done → Phase 03 aktiv
   - Phase 03 done → Phase 04 aktiv
   - Phase 04 done → Phase 05 aktiv
   - Phase 05 done → Pipeline komplett
5. Setze `current_phase` und `current_status: in_progress` für nächste Phase
6. Schreibe Approval-Eintrag in `studio/progress.md`
7. Schreibe in `studio/findings.md`: "Phase XX approved by human"
8. Lade den passenden Skill/Agent für die nächste Phase:
   - Phase 02: `.claude/skills/architecture-layout/SKILL.md` lesen, dann ui-designer Agent
   - Phase 03: `.claude/skills/schema-generator/SKILL.md` lesen, dann schema-agent Agent
   - Phase 04: `.claude/skills/detect-stack/SKILL.md` lesen, dann stack-advisor Agent
   - Phase 05: `.claude/skills/build-phase/PHASE.md` lesen
9. Zeige Status-Übersicht an

## Beispiel-Output

```
✓ Phase 01 (Prompt & PRD) — approved
→ Phase 02 (Design Review) — now active
  Loading architecture-layout skill...
```
