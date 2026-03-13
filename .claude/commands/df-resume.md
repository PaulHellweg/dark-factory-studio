# /df:resume

Stellt den Kontext nach einem Context-Reset oder neuer Session wieder her.

## Ausführung

1. Lies alle vorhandenen Studio-Dateien:
   - `studio/task_plan.md` — Pipeline-State
   - `studio/spec.md` — PRD (falls vorhanden)
   - `studio/architecture.md` — Architektur (falls vorhanden)
   - `studio/schema.prisma` — Schema (falls vorhanden)
   - `studio/project-context.md` — Stack (falls vorhanden)
   - `studio/findings.md` — Entscheidungen
   - `studio/progress.md` — letzte 10 Einträge

2. Falls Backups existieren (`studio/.backups/`): prüfe ob aktuellerer Stand als aktuelle Dateien

3. Zeige vollständige Status-Übersicht (wie /df:status)

4. Lade den passenden Skill für die aktuelle Phase:
   - Phase 01: `.claude/skills/prd-interviewer/SKILL.md`
   - Phase 02: `.claude/skills/architecture-layout/SKILL.md`
   - Phase 03: `.claude/skills/schema-generator/SKILL.md`
   - Phase 04: `.claude/skills/detect-stack/SKILL.md`
   - Phase 05: `.claude/skills/build-phase/PHASE.md`

5. Zusammenfassung: "Kontext wiederhergestellt. Du bist in Phase XX. Nächster Schritt: ..."
