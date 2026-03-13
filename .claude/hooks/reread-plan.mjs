#!/usr/bin/env node
// PreToolUse — Write/Edit/MultiEdit
// Manus 2-op rule: every 2 write operations, remind Claude to re-read task_plan.md.
// Non-blocking — outputs reminder, never blocks.

import { readFileSync, existsSync, writeFileSync } from 'fs';

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  const counterFile = 'studio/.write-counter';

  let count = 0;
  try {
    count = parseInt(readFileSync(counterFile, 'utf8').trim()) || 0;
  } catch { /* first run */ }

  count++;
  try {
    writeFileSync(counterFile, String(count));
  } catch { /* studio/ may not exist yet */ }

  if (count % 2 === 0 && existsSync('studio/task_plan.md')) {
    console.log('[reread-plan] Reminder: You have made ' + count + ' write operations since last re-read.');
    console.log('[reread-plan] Re-read studio/task_plan.md before continuing to ensure alignment with the plan.');

    // Also remind about findings every 4 ops
    if (count % 4 === 0) {
      console.log('[reread-plan] Also: update studio/findings.md with any decisions or discoveries.');
    }
  }

  process.exit(0);
});
