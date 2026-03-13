---
name: frontend-prototype
description: Builds a working UI prototype in Next.js with Tailwind and mock data. No backend, no API calls, no real auth. Every interactive element works with hardcoded data. Phase 02 second step.
---

# Frontend Prototype Skill

## Trigger

- After architecture.md is written in Phase 02
- ui-designer agent loads this after architecture-layout

## Input

- `studio/architecture.md` (just written)
- `studio/spec.md` (approved)

## Rules

1. **Mock data only** — no API calls, no database, no real auth
2. **Every page from architecture.md must exist** — even if simple
3. **Interactive elements must work** — buttons show feedback, forms validate, modals open/close
4. **Use hardcoded data** that matches the spec entities
5. **Navigation must work** — all links go somewhere real
6. **Responsive** — must work on mobile and desktop

## Tech Stack (Prototype Only)

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- No component library unless spec requires specific components
- Mock data in `prototype/lib/mock-data.ts`

## Process

1. `npx create-next-app@latest prototype --typescript --tailwind --app --no-src-dir --no-eslint`
2. Create mock data file from spec entities
3. Build layouts from architecture.md
4. Build each page with its components
5. Wire up navigation
6. Add interactive states (loading, empty, error) with mock triggers
7. Test: every page loads, every link works, every button does something visible

## Directory Structure

```
prototype/
├── app/
│   ├── layout.tsx          ← MainLayout
│   ├── page.tsx            ← Landing/Dashboard
│   ├── [route]/
│   │   └── page.tsx
│   └── globals.css
├── components/
│   ├── layout/             ← Nav, Sidebar, Footer
│   └── [feature]/          ← Feature-specific components
├── lib/
│   └── mock-data.ts        ← All mock data
└── package.json
```

## Important

This prototype is **throwaway**. It exists to validate UX, not architecture.
The real app in Phase 05 may use a completely different structure.
Do not over-engineer. Speed > perfection.
