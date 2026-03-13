#!/usr/bin/env node
// PreCompact hook — fires before Claude Code compacts the context window.
// Backs up all planning files so nothing is lost across compaction.
// Pattern from: disler/claude-code-hooks-mastery, ECC PreCompact handling.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = `studio/.backups/${timestamp}`;

  const filesToBackup = [
    'studio/task_plan.md',
    'studio/findings.md',
    'studio/progress.md',
    'studio/spec.md',
    'studio/architecture.md',
    'studio/schema.prisma',
    'studio/project-context.md',
  ];

  const backed = [];

  try {
    mkdirSync(backupDir, { recursive: true });

    for (const file of filesToBackup) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf8');
        const filename = file.split('/').pop();
        writeFileSync(`${backupDir}/${filename}`, content);
        backed.push(filename);
      }
    }

    if (backed.length > 0) {
      console.log(`[pre-compact] Backed up ${backed.length} planning files to ${backupDir}`);
      console.log(`[pre-compact] Files: ${backed.join(', ')}`);
      console.log(`[pre-compact] After compaction: run /df:resume to restore full context.`);
    }
  } catch (e) {
    // Non-blocking — compaction should proceed even if backup fails
    console.error(`[pre-compact] Backup warning: ${e.message}`);
  }

  process.exit(0); // Never block compaction
});
