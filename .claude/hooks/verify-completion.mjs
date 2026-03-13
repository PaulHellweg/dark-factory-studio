#!/usr/bin/env node
// Stop hook — fires when Claude tries to end a session.
// Blocks if there's an open approval gate or uncompleted tasks.

import { readFileSync, existsSync } from 'fs';

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  if (!existsSync('studio/task_plan.md')) {
    process.exit(0); // No pipeline active
  }

  const plan = readFileSync('studio/task_plan.md', 'utf8');

  // Check for open approval gate
  const statusMatch = plan.match(/current_status:\s*(\S+)/);
  const status = statusMatch?.[1] || '';

  if (status === 'awaiting_approval') {
    const phaseMatch = plan.match(/current_phase:\s*(\d+)/);
    const phase = phaseMatch?.[1] || '?';
    console.error(`[verify-completion] BLOCKED: Phase ${phase} is awaiting human approval.`);
    console.error('[verify-completion] Present the phase output to the human and wait for /df:approve before ending.');
    process.exit(2);
  }

  // Check for open tasks in current phase
  const openTasks = (plan.match(/^\s*- \[ \] .+/gm) || []);
  if (openTasks.length > 0 && status === 'in_progress') {
    console.error(`[verify-completion] WARNING: ${openTasks.length} open task(s) in current phase:`);
    openTasks.slice(0, 5).forEach(t => console.error(`  ${t.trim()}`));
    console.error('[verify-completion] Complete or defer these tasks before ending the session.');
    process.exit(2);
  }

  process.exit(0);
});
