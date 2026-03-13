---
name: security-hardening
description: Use during code review, before any deploy, or when implementing auth, payments, file uploads, user input, or APIs. Checks OWASP Top 10 patterns: injection, broken auth, IDOR, XSS, misconfiguration. Derived from BehiSecc/vibesec and Trail of Bits patterns.
---

# Security Hardening Skill

This skill runs alongside code review and the security-auditor agent.
The security-auditor has VETO power. This skill is the pre-check before it gets there.

## When To Auto-Activate

- Any file containing: auth, login, password, token, session, role, permission
- Any file containing: SQL, query, database, db
- Any file containing: upload, file, multer, formdata
- Any file with user input going into: HTML, SQL, shell commands, file paths
- Any tRPC/API route that handles money or PII

---

## OWASP Top 10 Quick Checks

### A01 — Broken Access Control
- Every API route/tRPC procedure: does it check the caller's role?
- Multi-tenant: every DB query filters by `tenantId` — no exceptions
- IDOR check: `GET /resource/:id` — does the code verify the resource belongs to the caller?
- Admin routes: protected by both middleware AND per-route check?

```typescript
// WRONG — only middleware, still IDOR-vulnerable:
router.get('/invoice/:id', requireAuth, async (ctx) => {
  return db.invoice.findUnique({ where: { id: ctx.params.id } })
})

// CORRECT — scoped to caller:
router.get('/invoice/:id', requireAuth, async (ctx) => {
  return db.invoice.findUnique({
    where: { id: ctx.params.id, userId: ctx.user.id }
  })
})
```

### A02 — Cryptographic Failures
- Passwords: bcrypt or argon2 with cost factor >= 10. Never MD5/SHA1/plain.
- Tokens: `crypto.randomBytes(32).toString('hex')` — never sequential IDs
- Sensitive data in DB: marked PII in schema, not logged, not in error messages
- HTTPS enforced — no mixed content

### A03 — Injection
- SQL: parameterized queries only. No string concatenation into queries.
- Prisma: safe by default but raw queries (`$queryRaw`, `$executeRaw`) need review
- Shell: no `exec(userInput)`. If shell needed, use `execFile` with arg array.
- Template engines: escape user content, never `dangerouslySetInnerHTML` without sanitization

### A04 — Insecure Design
- Rate limiting on: login, registration, password reset, OTP
- Account enumeration: login error says "invalid credentials", not "user not found"
- Password reset: token expires in <=15 min, single-use

### A05 — Security Misconfiguration
- `.env` in `.gitignore` — never committed
- Debug mode off in production (`NODE_ENV=production`)
- Error messages to user: generic. Detailed errors to logs only.
- CORS: explicit allowlist, not `*` in production

### A06 — Vulnerable Components
- `npm audit` — no critical vulnerabilities
- Dependencies pinned in package.json (no `^` on security-critical deps)

### A07 — Auth Failures
- Session invalidated on logout (server-side)
- JWT: short expiry (15min access token), refresh token rotation
- Auth.js: configure `session.strategy`, check `callbacks.session` doesn't expose sensitive fields

### A08 — Software Integrity
- No `eval()`, no `new Function()` with user input
- No dynamic `require()` with user-controlled paths

### A09 — Logging
- Log: auth events, access control failures, input validation failures
- Do NOT log: passwords, tokens, full credit card numbers, raw PII

### A10 — SSRF
- Any URL fetched from user input: validate against allowlist
- Internal metadata endpoints (169.254.x.x) blocked

---

## Checklist Output

Write a brief security review to findings.md:

```markdown
## Security Review — [component]

- [ ] Access control: each route scoped to caller
- [ ] Multi-tenant: tenantId filter on all queries
- [ ] Input validation: zod schemas on all inputs
- [ ] No secrets in code
- [ ] Rate limiting: configured on auth routes
- [ ] OWASP A01-A10: reviewed

Issues found: [list or "none"]
```
