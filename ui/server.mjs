#!/usr/bin/env node
// Dark Factory Studio — Local UI Server
// Zero dependencies. Serves dashboard + REST API for studio/ files.
// Usage: node ui/server.mjs [port]

import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, watch } from 'fs';
import { join, extname } from 'path';

const PORT = parseInt(process.argv[2] || '3333');
const ROOT = process.cwd();
const STUDIO = join(ROOT, 'studio');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

// SSE clients for live updates
const sseClients = new Set();

// Watch studio/ for changes and notify SSE clients
if (existsSync(STUDIO)) {
  watch(STUDIO, { recursive: false }, () => {
    for (const res of sseClients) {
      try { res.write(`data: ${JSON.stringify({ type: 'update' })}\n\n`); }
      catch { sseClients.delete(res); }
    }
  });
}

function readStudioFile(name) {
  const path = join(STUDIO, name);
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}

function getStatus() {
  const plan = readStudioFile('task_plan.md');
  if (!plan) return { active: false };

  const phaseMatch = plan.match(/current_phase:\s*(\d+)/);
  const statusMatch = plan.match(/current_status:\s*(\S+)/);
  const projectMatch = plan.match(/project:\s*(.+)/);
  const startedMatch = plan.match(/started:\s*(.+)/);

  const phases = [];
  const phaseNames = ['Prompt & PRD', 'Design Review', 'Datenmodell', 'Stack Review', 'Build'];
  for (let i = 1; i <= 5; i++) {
    const doneRe = new RegExp(`phase_0?${i}:.*done|phase: 0?${i}, status: done`);
    const activeRe = new RegExp(`phase_0?${i}:.*active|phase_0?${i}:.*in_progress`);
    const awaitRe = new RegExp(`phase_0?${i}:.*awaiting`);
    let status = 'locked';
    if (doneRe.test(plan)) status = 'done';
    else if (awaitRe.test(plan) || (parseInt(phaseMatch?.[1]) === i && statusMatch?.[1] === 'awaiting_approval')) status = 'awaiting_approval';
    else if (activeRe.test(plan) || (parseInt(phaseMatch?.[1]) === i && statusMatch?.[1] === 'in_progress')) status = 'in_progress';
    phases.push({ phase: i, name: phaseNames[i - 1], status });
  }

  const openTasks = (plan.match(/^\s*- \[ \] .+/gm) || []).map(t => t.trim().replace(/^- \[ \] /, ''));
  const doneTasks = (plan.match(/^\s*- \[x\] .+/gm) || []).map(t => t.trim().replace(/^- \[x\] /, ''));

  return {
    active: true,
    project: projectMatch?.[1]?.trim() || 'Unknown',
    started: startedMatch?.[1]?.trim() || '',
    currentPhase: parseInt(phaseMatch?.[1]) || 1,
    currentStatus: statusMatch?.[1] || 'unknown',
    phases,
    openTasks,
    doneTasks,
  };
}

function getArtifact(phase) {
  const files = {
    1: 'spec.md',
    2: 'architecture.md',
    3: 'schema.prisma',
    4: 'project-context.md',
  };
  const name = files[phase];
  if (!name) return null;
  return readStudioFile(name);
}

function getFindings() {
  return readStudioFile('findings.md');
}

function getProgress() {
  const content = readStudioFile('progress.md');
  if (!content) return [];
  return content.trim().split('\n').filter(l => l.trim()).slice(-20).reverse();
}

function handleApprove(currentPhase, plan) {
  if (!plan) return { ok: false, error: 'No task_plan.md found' };

  const phaseNames = { 1: 'Prompt & PRD', 2: 'Design Review', 3: 'Datenmodell', 4: 'Stack Review', 5: 'Build' };

  // Mark current phase as done
  let updated = plan
    .replace(new RegExp(`(phase_0?${currentPhase}:.*status:\\s*)\\S+`), `$1done`)
    .replace(new RegExp(`- \\[ \\] (phase_0?${currentPhase}:)`), `- [x] $1`);

  // Unlock and activate next phase
  const next = currentPhase + 1;
  if (next <= 5) {
    updated = updated
      .replace(new RegExp(`(phase_0?${next}:.*status:\\s*)\\S+`), `$1active`)
      .replace(/current_phase:\s*\d+/, `current_phase: ${next}`)
      .replace(/current_status:\s*\S+/, 'current_status: in_progress');
  } else {
    updated = updated.replace(/current_status:\s*\S+/, 'current_status: complete');
  }

  writeFileSync(join(STUDIO, 'task_plan.md'), updated);

  // Log to progress
  const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const entry = `- ${ts} · APPROVED · Phase ${currentPhase} (${phaseNames[currentPhase]})\n`;
  const progressPath = join(STUDIO, 'progress.md');
  const existing = existsSync(progressPath) ? readFileSync(progressPath, 'utf8') : '';
  writeFileSync(progressPath, existing + entry);

  return { ok: true, phase: currentPhase, next: next <= 5 ? next : null };
}

function handleFeedback(currentPhase, feedback) {
  const findingsPath = join(STUDIO, 'findings.md');
  const existing = existsSync(findingsPath) ? readFileSync(findingsPath, 'utf8') : '';
  const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const entry = `\n## Feedback — Phase ${currentPhase} (${ts})\n\n${feedback}\n`;
  writeFileSync(findingsPath, existing + entry);

  const progressPath = join(STUDIO, 'progress.md');
  const existingProgress = existsSync(progressPath) ? readFileSync(progressPath, 'utf8') : '';
  writeFileSync(progressPath, existingProgress + `- ${ts} · FEEDBACK · Phase ${currentPhase}\n`);

  return { ok: true };
}

function serveStatic(res, filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // SSE endpoint for live updates
  if (path === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // API routes
  if (path === '/api/status') return json(res, getStatus());
  if (path === '/api/findings') return json(res, { content: getFindings() });
  if (path === '/api/progress') return json(res, { entries: getProgress() });

  if (path.match(/^\/api\/artifact\/\d$/)) {
    const phase = parseInt(path.split('/').pop());
    const content = getArtifact(phase);
    return json(res, { phase, content });
  }

  if (path === '/api/approve' && req.method === 'POST') {
    const status = getStatus();
    if (!status.active) return json(res, { ok: false, error: 'No active pipeline' }, 400);
    if (status.currentStatus !== 'awaiting_approval') return json(res, { ok: false, error: 'Current phase is not awaiting approval' }, 400);
    const plan = readStudioFile('task_plan.md');
    return json(res, handleApprove(status.currentPhase, plan));
  }

  if (path === '/api/feedback' && req.method === 'POST') {
    const status = getStatus();
    if (!status.active) return json(res, { ok: false, error: 'No active pipeline' }, 400);
    const body = await readBody(req);
    if (!body.feedback) return json(res, { ok: false, error: 'No feedback provided' }, 400);
    return json(res, handleFeedback(status.currentPhase, body.feedback));
  }

  if (path === '/api/prompt' && req.method === 'POST') {
    const body = await readBody(req);
    // Save the structured prompt to studio/prompt-input.md for Claude Code to pick up
    const promptPath = join(STUDIO, 'prompt-input.md');
    const content = `# Project Input\n\n## Vision\n${body.vision || ''}\n\n## Actors\n${body.actors || ''}\n\n## Constraints\n${body.constraints || ''}\n\n## Notes\n${body.notes || ''}\n`;
    if (!existsSync(STUDIO)) { writeFileSync(promptPath, ''); } // studio/ should exist
    writeFileSync(promptPath, content);
    return json(res, { ok: true, path: promptPath });
  }

  // Static files
  if (path === '/' || path === '/index.html') return serveStatic(res, join(ROOT, 'ui', 'index.html'));

  // Fallback
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n  Dark Factory Studio UI`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log(`  Studio dir: ${STUDIO}`);
  console.log(`  Watching for changes...\n`);
});
