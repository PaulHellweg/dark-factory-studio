#!/usr/bin/env node
// PostToolUse — Write/Edit/MultiEdit
// Appends an entry to studio/progress.md after every file write.
// Non-blocking — always exits 0.

import { appendFileSync, existsSync, mkdirSync } from 'fs';

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const path = data.tool_input?.file_path || data.tool_input?.path || '';
  const tool = data.tool_name || 'Write';

  // Don't log writes to progress.md itself (infinite loop)
  if (path.includes('progress.md') || path.includes('.write-counter')) {
    process.exit(0);
  }

  // Don't log if studio/ doesn't exist yet
  if (!existsSync('studio')) {
    process.exit(0);
  }

  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const shortPath = path.replace(/^.*?(?=studio\/|prototype\/|app\/|src\/)/, '') || path.split('/').slice(-2).join('/');
  const entry = `- ${timestamp} · ${tool} · ${shortPath}\n`;

  try {
    appendFileSync('studio/progress.md', entry);
  } catch { /* non-critical */ }

  process.exit(0);
});
