# Dark Factory Studio — v7

> Prompt rein → Approved Design → Approved Schema → Approved Stack → Produkt raus.
> Human bleibt in der Kontrolle. Jede Phase hat einen Approval Gate.
> Alle Sicherheitsregeln sind deterministisch in Hooks — nicht in CLAUDE.md als Bitten.

---

## Upgrade-Quelle: Community Research

Dieses Setup integriert Best-Practices aus:
- **obra/superpowers** (26k ★) — systematic-debugging, verification-before-completion, TDD-Methodik
- **affaan-m/everything-claude-code** (35k ★) — Hook-Event-Vollständigkeit, rules/ Konzept, context modes
- **disler/claude-code-hooks-mastery** — SessionStart/PreCompact Pattern, JSON hook responses
- **BehiSecc/vibesec + Trail of Bits** — OWASP Top 10 skill, secret-scanner hook
- **ChrisWiles/claude-code-showcase** — Branch-protection hooks, skill-evaluation patterns

---

## Kernprinzip: Deterministisch vs. Probabilistisch

| Mechanismus | Verhalten | Einsatz |
|---|---|---|
| Hooks | 100% deterministisch — laufen immer | Sicherheitsregeln, Gate-Enforcement |
| Skills | Probabilistisch — Claude entscheidet | Workflows, Domain-Knowledge |
| CLAUDE.md | Immer geladen, aber "suggestions" | Kontext, Routing, Non-Negotiables |
| Agents | Isolierter Context | Spezialisierte Tasks |

→ Alles was "immer passieren muss" gehört in Hooks. Nie in CLAUDE.md.

---

## Setup

```bash
cp -r dark-factory-studio/.claude  ./
cp dark-factory-studio/CLAUDE.md   ./
mkdir -p studio
claude
/df:start
```

---

## Vollständige Dateistruktur

```
project/
├── CLAUDE.md                          ← root, ~600 tokens
├── studio/                            ← alle Phase-Artefakte
│   ├── spec.md                        ← Phase 01
│   ├── architecture.md                ← Phase 02
│   ├── schema.prisma                  ← Phase 03
│   ├── project-context.md             ← Phase 04 (SEALED)
│   ├── task_plan.md                   ← Manus planning
│   ├── findings.md                    ← Decisions
│   ├── progress.md                    ← Session log (Hook-geschrieben)
│   └── .backups/                      ← PreCompact Backups
├── prototype/                         ← Phase 02 (mock data, kein Backend)
└── .claude/
    ├── settings.json                  ← 8 Hook-Events konfiguriert
    ├── rules/
    │   ├── no-premature-code.md
    │   ├── approval-gate.md
    │   └── tdd-enforced.md
    ├── agents/
    │   ├── prd-agent.md               ← sonnet · Phase 01
    │   ├── ui-designer.md             ← sonnet · Phase 02
    │   ├── schema-agent.md            ← sonnet · Phase 03
    │   └── stack-advisor.md           ← opus  · Phase 04
    ├── skills/
    │   ├── prd-interviewer/           ← Phase 01 · SKILL.md + PHASE.md
    │   ├── architecture-layout/       ← Phase 02 · SKILL.md + PHASE.md
    │   ├── frontend-prototype/        ← Phase 02 · SKILL.md
    │   ├── schema-generator/          ← Phase 03 · SKILL.md + PHASE.md
    │   ├── detect-stack/              ← Phase 04 · SKILL.md
    │   ├── build-phase/               ← Phase 05 · PHASE.md
    │   ├── systematic-debugging/      ← Build · obra/superpowers pattern
    │   ├── verification-before-completion/ ← Build · obra/superpowers
    │   └── security-hardening/        ← Build · OWASP Top 10 + vibesec
    ├── hooks/
    │   ├── session-start.mjs          ← SessionStart: context restore
    │   ├── pre-compact.mjs            ← PreCompact: backup planning files
    │   ├── secret-scanner.mjs         ← PreToolUse Write: block hardcoded secrets
    │   ├── gate-phase.mjs             ← PreToolUse Write: enforce phase ordering
    │   ├── block-dangerous.mjs        ← PreToolUse Bash: rm -rf, DROP, migrate
    │   ├── reread-plan.mjs            ← PreToolUse Write: Manus 2-op rule
    │   ├── update-progress.mjs        ← PostToolUse Write: progress.md log
    │   └── verify-completion.mjs      ← Stop: block if gate open
    └── commands/
        ├── df-start.md                ← /df:start
        ├── df-approve.md              ← /df:approve
        ├── df-status.md               ← /df:status
        └── df-resume.md               ← /df:resume
```

---

## Hook-Events Übersicht

| Hook | Event | Blockiert? | Was |
|---|---|---|---|
| `session-start` | SessionStart | Nein | Zeigt Pipeline-State + Git-Context beim Start |
| `pre-compact` | PreCompact | Nein | Backupt alle studio/*.md vor Compaction |
| `secret-scanner` | PreToolUse Write | **Ja** | Blockiert API-Keys, Passwörter in Code |
| `gate-phase` | PreToolUse Write | **Ja** | Blockiert Code vor Phase 04, Schema vor Phase 02 |
| `block-dangerous` | PreToolUse Bash | **Ja** | Blockiert rm -rf, DROP TABLE, migrate ohne SEALED |
| `reread-plan` | PreToolUse Write | Nein | Erinnert an task_plan alle 2 Ops |
| `update-progress` | PostToolUse Write | Nein | Schreibt in progress.md |
| `verify-completion` | Stop | **Ja** | Blockiert Session-Ende wenn Gate offen |

---

## Skills Übersicht

| Skill | Phase | Auto-trigger |
|---|---|---|
| `prd-interviewer` | 01 | "let's start", "new project", /df:start |
| `architecture-layout` | 02 | nach Phase 01 approval |
| `frontend-prototype` | 02 | nach architecture-layout |
| `schema-generator` | 03 | nach Phase 02 approval |
| `detect-stack` | 04 | nach Phase 03 approval |
| `build-phase` | 05 | nach Phase 04 SEAL |
| `systematic-debugging` | 05 | "bug", "not working", "error", "fails" |
| `verification-before-completion` | 05 | "done", "finished", "complete", "fixed" |
| `security-hardening` | 05 | auth, payments, file upload, user input code |

---

## Agents & Routing

| Agent | Modell | Phase | Warum opus/sonnet |
|---|---|---|---|
| prd-agent | sonnet | 01 | Klar-definierter Task, kein Strategic Reasoning |
| ui-designer | sonnet | 02 | Code-Gen + Struktur, kein Tradeoff-Judgment |
| schema-agent | sonnet | 03 | Ableitung aus Spec, keine Architektur-Entscheidungen |
| stack-advisor | **opus** | 04 | Tradeoff-Analyse — diese Entscheidung hat downstream-Kosten |
| security-auditor | **opus** | 05 | VETO-Berechtigung braucht bestes Reasoning |
| architect-reviewer | **opus** | 05 | Finales Architektur-Urteil |
| devops-engineer | haiku | 05 | Docker/CI — günstig, klar definiert |

---

## Integration mit Dark Factory v6

Phase 05 nutzt den DF v6 Build-Loop.

Mapping:
- `studio/spec.md` → ersetzt `requirements.md`
- `studio/project-context.md` → ersetzt manuelle Stack-Konfiguration
- `prototype/` → UI-Referenz für alle Build-Agents

DF v6 Skills die in Phase 05 geladen werden:
`write-plan`, `execute-plan`, `tdd`, `code-review`, `security-audit`, `finish-branch`

---

## Quellen & Credits

```
obra/superpowers          github.com/obra/superpowers
affaan-m/everything-cc    github.com/affaan-m/everything-claude-code
disler/hooks-mastery      github.com/disler/claude-code-hooks-mastery
BehiSecc/vibesec          github.com/BehiSecc/awesome-claude-skills
hesreallyhim/awesome-cc   github.com/hesreallyhim/awesome-claude-code
Anthropic Skills Docs     code.claude.com/docs/en/skills
```
