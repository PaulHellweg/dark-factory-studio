#!/usr/bin/env node
// PreToolUse — Write/Edit/MultiEdit
// Enforces phase ordering: no code before Phase 04 sealed,
// no schema before Phase 02 approved, etc.

import { readFileSync, existsSync } from 'fs';

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const path = (data.tool_input?.file_path || data.tool_input?.path || '').toLowerCase();

  // Read current phase from task_plan
  let currentPhase = 0;
  let phase02Approved = false;
  let phase03Approved = false;
  let phase04Sealed = false;

  try {
    const plan = readFileSync('studio/task_plan.md', 'utf8');
    const phaseMatch = plan.match(/current_phase:\s*(\d+)/);
    if (phaseMatch) currentPhase = parseInt(phaseMatch[1]);
    phase02Approved = plan.includes('phase_02: done') || plan.includes('phase: 02, status: done');
    phase03Approved = plan.includes('phase_03: done') || plan.includes('phase: 03, status: done');
  } catch { /* task_plan not yet created — Phase 01 is fine */ }

  try {
    const ctx = readFileSync('studio/project-context.md', 'utf8');
    phase04Sealed = ctx.includes('SEALED');
  } catch { /* not yet created */ }

  // Block: writing app source code before Phase 04 sealed
  const isSourceCode = (
    path.includes('/app/') ||
    path.includes('/src/') ||
    path.includes('/pages/') ||
    path.includes('/api/') ||
    (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js'))
  ) && !path.includes('prototype/') && !path.includes('studio/');

  if (isSourceCode && !phase04Sealed) {
    console.error('[gate-phase] BLOCKED: Cannot write source code before project-context.md is sealed (Phase 04 approval required).');
    process.exit(2);
  }

  // Block: writing schema.prisma before Phase 02 approved
  if (path.includes('schema.prisma') && !phase02Approved) {
    console.error('[gate-phase] BLOCKED: Cannot write schema.prisma before Design Review (Phase 02) is approved.');
    process.exit(2);
  }

  // Block: writing project-context.md outside of stack-advisor agent
  // (allow but warn if Phase 03 not done)
  if (path.includes('project-context.md') && !phase03Approved) {
    console.error('[gate-phase] BLOCKED: Cannot seal project-context.md before Schema (Phase 03) is approved.');
    process.exit(2);
  }

  process.exit(0);
});
