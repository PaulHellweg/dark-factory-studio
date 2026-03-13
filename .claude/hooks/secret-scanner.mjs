#!/usr/bin/env node
// PreToolUse — Write/Edit/MultiEdit
// Scans file content for hardcoded secrets before writing.
// Pattern from: varlock-claude-skill, ECC security hooks, parry prompt injection scanner.

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const content = data.tool_input?.content || data.tool_input?.new_string || '';
  const path = data.tool_input?.file_path || data.tool_input?.path || '';

  // Skip non-code files
  const skipExts = ['.md', '.txt', '.json', '.yaml', '.yml', '.toml'];
  const ext = '.' + path.split('.').pop();
  if (skipExts.includes(ext) && !path.includes('.env')) {
    process.exit(0);
  }

  // Secret patterns — ordered by severity
  const patterns = [
    // Anthropic / OpenAI
    { re: /sk-ant-[a-zA-Z0-9_-]{20,}/, label: 'Anthropic API key' },
    { re: /sk-[a-zA-Z0-9]{20,}/, label: 'OpenAI API key' },
    // AWS
    { re: /AKIA[0-9A-Z]{16}/, label: 'AWS Access Key ID' },
    { re: /(?:aws_secret|AWS_SECRET)[^=]*=\s*['"]?[A-Za-z0-9/+=]{40}['"]?/, label: 'AWS Secret' },
    // Generic high-entropy secrets (not in .env.example)
    { re: /(?:password|passwd|secret|token|api_key|apikey)\s*[:=]\s*['"][^'"${}]{8,}['"](?!\s*#\s*example)/i, label: 'Hardcoded credential' },
    // Private keys
    { re: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/, label: 'Private key' },
    // Stripe
    { re: /sk_live_[a-zA-Z0-9]{24,}/, label: 'Stripe live secret key' },
    // GitHub
    { re: /ghp_[a-zA-Z0-9]{36}/, label: 'GitHub personal access token' },
    // Database URLs with password
    { re: /(?:postgresql|postgres|mysql):\/\/[^:]+:[^@${}]{6,}@/, label: 'DB connection string with password' },
  ];

  const found = [];
  for (const { re, label } of patterns) {
    if (re.test(content)) {
      found.push(label);
    }
  }

  // Allowlist: .env.example and test fixture files are OK
  const isAllowed = path.includes('.env.example') || path.includes('__fixtures__') || path.includes('/test/');

  if (found.length > 0 && !isAllowed) {
    console.error(`[secret-scanner] BLOCKED: Potential secret(s) detected in ${path}:`);
    found.forEach(f => console.error(`  • ${f}`));
    console.error('[secret-scanner] Use environment variables instead. Never hardcode credentials.');
    process.exit(2);
  }

  process.exit(0);
});
