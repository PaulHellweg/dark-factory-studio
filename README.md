# Dark Factory Studio v6.1

Autonomous SWE lifecycle pipeline for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Spec goes in, deployed software comes out.

```
Spec → Architecture → Plan → Implement → Test → Review → Security → Deploy
```

## What's New in v6.1

### Self-Improvement Loop
After any correction, Claude writes a structured lesson to `tasks/lessons.md`. Every session starts by reading this file. Mistake rates drop over the lifetime of a project.

### Elegance Hook
A PostToolUse hook fires every 5 code writes and prompts:
> *"Knowing everything I know now, implement the elegant solution."*

Also available manually via `/df:elegance`.

### No Checkpoints
The pipeline runs start-to-finish autonomously. Only halts on:
- Security VETO from `security-auditor`
- Missing requirements
- Unresolvable technical blocker

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Node.js 18+
- Python 3 (for hooks)

## Quick Start

### New Project
```bash
git clone https://github.com/PaulHellweg/dark-factory-studio.git

# Copy DF into your project
cp -r dark-factory-studio/.claude /your-project/.claude
cp dark-factory-studio/CLAUDE.md /your-project/CLAUDE.md
mkdir -p /your-project/tasks

# Start Claude Code
cd /your-project
claude
/df:start
```

### Existing Project
```bash
cp -r dark-factory-studio/.claude /your-existing-project/.claude
cp dark-factory-studio/CLAUDE.md /your-existing-project/CLAUDE.md
# Fill in project-context.md with your stack, then:
/df:resume
```

## Web UI

Local browser dashboard alongside your Claude Code terminal session.

```bash
node ui/server.mjs
# Open http://localhost:3333
```

- **Live pipeline status** — all phases at a glance, auto-updates via SSE
- **Artifact viewer** — read spec, architecture, schema, project-context in browser
- **Approve / Feedback** — approve phases or send revisions without touching the terminal

## Commands

| Command | Action |
|---------|--------|
| `/df:start` | Start pipeline from requirements |
| `/df:approve` | Approve current phase, unlock next |
| `/df:status` | Current phase + open tasks |
| `/df:resume` | Resume after context reset |
| `/df:elegance` | Manual elegance review on current code |
| `/df:lessons` | Show lessons learned for this project |

## Pipeline Phases

| Phase | Output | Gate |
|-------|--------|------|
| Spec | `SPEC.md` | Human review |
| Architecture | `ARCHITECTURE.md` | Human review |
| Plan | `tasks/task_plan.md` | Auto |
| Implement | Source code (TDD) | Tests pass |
| Review | `ARCHITECTURE_REVIEW.md` | Architect reviewer (opus) |
| Security | `SECURITY_REPORT.md` | Security auditor (opus) — VETO power |
| Deploy | Production | Health check |

## Agents & Model Routing

| Agent | Model | Role |
|-------|-------|------|
| `security-auditor` | opus | Security audit, VETO power |
| `architect-reviewer` | opus | Quality + elegance review |
| `nextjs-agent` | sonnet | Next.js App Router |
| `vue-agent` | sonnet | Vue 3 + Nuxt |
| `svelte-agent` | sonnet | SvelteKit |
| `typescript-node-agent` | sonnet | Hono/Express API |
| `fastapi-agent` | sonnet | Python FastAPI |
| `rust-agent` | sonnet | Axum + SQLx |
| `go-agent` | sonnet | Chi/Gin |
| `django-agent` | sonnet | Django + DRF |
| `spring-boot-agent` | sonnet | Spring Boot 3 |
| `cli-agent` | sonnet | CLI tools |
| `react-native-agent` | sonnet | Expo mobile |
| `devops-agent` | haiku | Docker + CI/CD |

## Hooks

| Hook | Trigger | What |
|------|---------|------|
| `pre_tool_use.py` | PreToolUse Bash | Blocks rm -rf, DROP DB, force push, secrets, eval |
| `post_tool_use.py` | PostToolUse Write | Progress reminders (every 2 writes), elegance trigger (every 5 writes) |
| `secret-scanner.mjs` | PreToolUse Write | Blocks API keys, passwords, private keys in source |
| `gate-phase.mjs` | PreToolUse Write | Enforces phase ordering |
| `block-dangerous.mjs` | PreToolUse Bash | Blocks destructive DB operations |
| `session-start.mjs` | SessionStart | Shows pipeline state on start |
| `pre-compact.mjs` | PreCompact | Backs up planning files before compaction |
| `verify-completion.mjs` | Stop | Blocks session end if approval gate open |

## The Self-Improvement Loop

```
User correction or failed test
        ↓
Stop. Identify root cause.
        ↓
Append to tasks/lessons.md:
  - Mistake (specific)
  - Root Cause (why)
  - Rule (concrete prevention)
  - Pattern (what to watch for)
        ↓
Apply rule immediately
        ↓
Next session: read lessons.md first
        ↓
Mistake rate drops over time
```

## File Structure

```
your-project/
├── CLAUDE.md                      ← Pipeline constitution
├── tasks/
│   ├── lessons.md                 ← Self-improvement log
│   ├── task_plan.md               ← Current tasks
│   ├── progress.md                ← Completion log
│   └── findings.md                ← Research + decisions
└── .claude/
    ├── settings.json              ← Hook config
    ├── hooks/
    │   ├── pre_tool_use.py        ← Security + dangerous op blocking
    │   ├── post_tool_use.py       ← Progress + elegance triggers
    │   ├── secret-scanner.mjs     ← Secret detection
    │   ├── gate-phase.mjs         ← Phase ordering
    │   ├── block-dangerous.mjs    ← Destructive command blocking
    │   ├── session-start.mjs      ← Context restore on start
    │   ├── pre-compact.mjs        ← Backup before compaction
    │   └── verify-completion.mjs  ← Approval gate enforcement
    ├── agents/                    ← 14 specialized agents
    ├── skills/                    ← Phase-specific workflows
    └── commands/                  ← Slash commands
```

## Security Model

1. **PreToolUse hooks** block dangerous operations deterministically
2. **secret-scanner** catches API keys, passwords, private keys before write
3. **security-auditor** (opus) runs full OWASP Top 10 before deploy
4. **VETO is absolute** — only a human can override
5. **lessons.md** captures security mistakes so they never repeat

## Credits

Built on patterns from:
- [obra/superpowers](https://github.com/obra/superpowers) — systematic debugging, verification
- [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) — hook patterns
- [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) — SessionStart/PreCompact
- [BehiSecc/vibesec](https://github.com/BehiSecc/awesome-claude-skills) — OWASP Top 10, secret scanning

## License

MIT
