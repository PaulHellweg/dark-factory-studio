#!/usr/bin/env node
// PreToolUse — Bash
// Blocks destructive commands unconditionally.

import { readFileSync } from 'fs';

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const cmd = (data.tool_input?.command || '').toLowerCase();

  const blocked = [
    { pattern: /rm\s+-rf/, label: 'rm -rf' },
    { pattern: /drop\s+database/i, label: 'DROP DATABASE' },
    { pattern: /drop\s+table/i, label: 'DROP TABLE' },
    { pattern: /git\s+push.*--force(?!-with-lease)/, label: 'force push without --force-with-lease' },
    { pattern: /truncate\s+table/i, label: 'TRUNCATE TABLE' },
    { pattern: /prisma\s+migrate\s+reset/, label: 'prisma migrate reset' },
    { pattern: /prisma\s+db\s+push\s+--force/, label: 'prisma db push --force' },
  ];

  for (const { pattern, label } of blocked) {
    if (pattern.test(cmd)) {
      console.error(`[block-dangerous] BLOCKED: "${label}" is not allowed.`);
      process.exit(2);
    }
  }

  // Phase gate: no migrations before Phase 04 sealed
  if (/prisma\s+migrate/.test(cmd) || /prisma\s+db\s+push/.test(cmd)) {
    try {
      const ctx = readFileSync('studio/project-context.md', 'utf8');
      if (!ctx.includes('SEALED')) {
        console.error('[block-dangerous] BLOCKED: DB migrations require sealed project-context.md (Phase 04 approval).');
        process.exit(2);
      }
    } catch {
      console.error('[block-dangerous] BLOCKED: DB migrations require sealed project-context.md (Phase 04 approval).');
      process.exit(2);
    }
  }

  process.exit(0);
});
