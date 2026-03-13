#!/usr/bin/env node
// SessionStart hook — fires when Claude Code starts or resumes a session.
// Injects current pipeline state into Claude's context so it always knows where it is.
// Pattern from: disler/claude-code-hooks-mastery, ECC session management.

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  const lines = [];

  // ── Git context ──
  try {
    const branch = execSync('git branch --show-current 2>/dev/null', { encoding: 'utf8' }).trim();
    const status = execSync('git status --short 2>/dev/null', { encoding: 'utf8' }).trim();
    const lastCommit = execSync('git log --oneline -3 2>/dev/null', { encoding: 'utf8' }).trim();
    if (branch) {
      lines.push(`[session-start] Git: ${branch}${status ? ` · ${status.split('\n').length} uncommitted files` : ' · clean'}`);
      lines.push(`[session-start] Last commits:\n${lastCommit}`);
    }
  } catch { /* not a git repo */ }

  // ── Dark Factory Studio pipeline state ──
  if (existsSync('studio/task_plan.md')) {
    const plan = readFileSync('studio/task_plan.md', 'utf8');

    const phaseMatch = plan.match(/current_phase:\s*(\d+)/);
    const statusMatch = plan.match(/current_status:\s*(\S+)/);
    const projectMatch = plan.match(/project:\s*(.+)/);

    const phase = phaseMatch?.[1] || '?';
    const status = statusMatch?.[1] || '?';
    const project = projectMatch?.[1]?.trim() || 'unknown';

    const phaseNames = { '1':'PRD', '2':'Design Review', '3':'Datenmodell', '4':'Stack', '5':'Build' };

    lines.push('');
    lines.push(`[session-start] ═══ Dark Factory Studio ═══`);
    lines.push(`[session-start] Project: ${project}`);
    lines.push(`[session-start] Phase ${phase} — ${phaseNames[phase] || 'unknown'} · Status: ${status}`);

    if (status === 'awaiting_approval') {
      lines.push(`[session-start] ⚠ Waiting for human approval. Present current phase output and use /df:approve.`);
    }

    // Open tasks
    const openTasks = (plan.match(/^\s*- \[ \] .+/gm) || []);
    if (openTasks.length > 0) {
      lines.push(`[session-start] Open tasks (${openTasks.length}):`);
      openTasks.slice(0, 3).forEach(t => lines.push(`  ${t.trim()}`));
      if (openTasks.length > 3) lines.push(`  ... and ${openTasks.length - 3} more`);
    }
  } else {
    lines.push('[session-start] No studio/task_plan.md found. Run /df:start to begin a new project.');
  }

  // ── Recent progress ──
  if (existsSync('studio/progress.md')) {
    const progress = readFileSync('studio/progress.md', 'utf8').trim();
    const recentLines = progress.split('\n').slice(-4);
    if (recentLines.length > 0) {
      lines.push('[session-start] Recent activity:');
      recentLines.forEach(l => lines.push(`  ${l}`));
    }
  }

  if (lines.length > 0) {
    console.log(lines.join('\n'));
  }

  process.exit(0);
});
