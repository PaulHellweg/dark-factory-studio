# Dark Factory Studio

A structured 5-phase pipeline for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that turns a freeform project idea into a production-ready app — with human approval at every step.

```
Your idea → PRD → UI Prototype → Schema → Stack Decision → Working App
```

## Why

AI makes building fast, but it also makes building the **wrong thing** fast.
Dark Factory Studio forces the right order: understand first, design second, build last.
Every phase ends with a human checkpoint — you approve before the next phase begins.

Safety rules (no premature code, no secrets in source, no destructive commands) are enforced by **deterministic hooks**, not by asking the AI nicely.

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Node.js 18+

## Quick Start

```bash
# Clone into your new project
git clone https://github.com/PaulHellweg/dark-factory-studio.git
cp -r dark-factory-studio/.claude ./
cp dark-factory-studio/CLAUDE.md ./
mkdir -p studio

# Start Claude Code
claude

# Begin the pipeline
/df:start
```

Claude will interview you about your project, then guide you through all 5 phases.

## Web UI

Dark Factory Studio includes a local browser dashboard that runs alongside your Claude Code terminal session.

```bash
node ui/server.mjs
# Open http://localhost:3333
```

The UI provides:
- **Live pipeline status** — see all 5 phases at a glance, auto-updates when files change
- **Phase 01 input form** — structured project intake (vision, actors, constraints) saved to `studio/prompt-input.md`
- **Artifact viewer** — read spec.md, architecture.md, schema.prisma, project-context.md directly in the browser
- **Approve / Feedback buttons** — approve phases or send revision feedback without touching the terminal
- **Activity log** — live progress tracking

The UI watches `studio/` for file changes via SSE and refreshes automatically. No build step, no dependencies — just `node ui/server.mjs`.

## The 5 Phases

### Phase 01 — Prompt & PRD
Claude interviews you: What does the app do? Who uses it? What are the constraints?
Outputs `studio/spec.md`. You review and approve.

### Phase 02 — Design Review
Derives page structure and component hierarchy from your spec.
Builds a working UI prototype (Next.js + Tailwind, mock data only).
Outputs `studio/architecture.md` + `prototype/`. You review and approve.

### Phase 03 — Data Model
Generates a complete Prisma schema from your spec and architecture.
Outputs `studio/schema.prisma`. You review and approve.

### Phase 04 — Stack Decision
Proposes a tech stack layer by layer, each choice tied to your constraints.
Presents tradeoffs and alternatives. You pick, swap, or approve.
Outputs `studio/project-context.md` (sealed). You review and approve.

### Phase 05 — Build
The actual app gets built in `app/` using TDD, following your approved spec, schema, and stack. Security audit runs before completion.

## Commands

| Command | What it does |
|---------|-------------|
| `/df:start` | Start a new project, begin Phase 01 |
| `/df:approve` | Approve current phase, unlock the next |
| `/df:status` | Show pipeline progress |
| `/df:resume` | Restore context after a new session or context reset |

## How Approvals Work

After each phase, Claude presents the output and **stops**. You can:
- **Approve** with `/df:approve` — next phase unlocks
- **Give feedback** — Claude revises, presents again, still waits for approval
- You cannot skip phases. Code cannot be written before the stack is decided.

## What the Hooks Enforce

These rules run as deterministic hooks — they **always** fire, regardless of prompt.

| Rule | What happens |
|------|-------------|
| No code before Phase 04 | Writing to `app/` or `src/` is blocked until stack is sealed |
| No secrets in code | API keys, passwords, private keys in source files are blocked |
| No destructive commands | `rm -rf`, `DROP TABLE`, force push without lease are blocked |
| No skipping gates | Session cannot end while a phase is awaiting approval |
| Context backup | All planning files are backed up before context compaction |
| Progress tracking | Every file write is logged to `studio/progress.md` |
| Plan re-reading | Claude is reminded to re-read the task plan every 2 write operations |

## Model Routing

Different phases use different Claude models based on task complexity:

| Model | Used for | Why |
|-------|---------|-----|
| Sonnet | PRD, UI design, schema generation | Well-defined tasks, fast execution |
| Opus | Stack decisions, security audit, architecture review | Tradeoff analysis, high-stakes judgment |
| Haiku | DevOps, docs, dependency checks | Simple tasks, cost-efficient |

## Project Structure (After Full Pipeline)

```
your-project/
├── CLAUDE.md                  ← Pipeline config (always loaded)
├── studio/                    ← Phase artifacts
│   ├── spec.md                ← Your approved PRD
│   ├── architecture.md        ← Approved page/component structure
│   ├── schema.prisma          ← Approved data model
│   ├── project-context.md     ← Sealed stack decision
│   ├── task_plan.md           ← Current progress
│   ├── findings.md            ← Decisions and discoveries
│   └── progress.md            ← Auto-generated session log
├── prototype/                 ← Throwaway UI prototype (mock data)
├── app/                       ← The real app (built in Phase 05)
└── .claude/
    ├── settings.json          ← Hook configuration
    ├── hooks/                 ← 8 deterministic enforcement hooks
    ├── agents/                ← 4 phase-specific agents
    ├── skills/                ← 9 workflow skills
    ├── rules/                 ← 3 rule documents
    └── commands/              ← 4 slash commands
```

## Credits

Built on patterns from:
- [obra/superpowers](https://github.com/obra/superpowers) — systematic debugging, verification-before-completion
- [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) — hook patterns, rules concept
- [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) — SessionStart/PreCompact patterns
- [BehiSecc/vibesec](https://github.com/BehiSecc/awesome-claude-skills) — OWASP Top 10 skill, secret scanning

## License

MIT
