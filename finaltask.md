# Final Production Checklist (Remaining + Important)

Last updated: 2026-04-19
Project: thedailynewtimes

## Current Status Snapshot
- Build and quality checks are passing locally:
  - typecheck
  - lint
  - unit/integration tests
  - production build
  - e2e smoke tests
- Core production hardening work is largely complete.
- Practical production readiness is close, but not fully finished.

Estimated readiness now: ~78%

---

## Remaining Tasks Before Go-Live (High Priority)

- [ ] Replace deployment placeholder with real deployment steps.
  - File: .github/workflows/deploy.yml
  - Note: Current workflow still prints placeholder text.

- [ ] Commit and tag a release candidate in git.
  - Note: Working tree is currently untracked/uncommitted.
  - Goal: Reproducible release baseline.

- [ ] Resolve or formally accept production dependency audit findings.
  - Command: npm run audit:prod
  - Note: Audit currently reports moderate vulnerabilities.

- [ ] Tighten Content Security Policy for production.
  - File: middleware.ts
  - Note: Current CSP includes unsafe-inline and unsafe-eval.

- [ ] Expand e2e tests beyond smoke checks.
  - File: tests/e2e/smoke.spec.ts
  - Add scenarios for: category, post, search, archive, epaper, admin login.

- [ ] Wire real error monitoring and alert routing.
  - File: src/lib/error-monitor.ts
  - Env: ERROR_MONITOR_WEBHOOK_URL

- [ ] Run and document backup/restore drill with evidence.
  - Docs: docs/backup-restore.md
  - Outcome needed: verified recovery time and recovery point.

---

## Important Things Already Implemented (Do Not Regress)

- Required environment variables fail fast at startup.
  - src/lib/env.ts, src/payload.config.ts

- Published-only access is enforced for public content queries.
  - src/lib/payload-helpers.ts

- Role-based access control is applied in key collections.
  - src/collections/Articles.ts
  - src/collections/EPapers.ts
  - src/collections/Categories.ts
  - src/collections/Users.ts

- Sensitive zone-editor route has server-side auth guard.
  - src/app/(epaper)/epaper/zone-editor/[id]/layout.tsx

- Crop API has abuse protections (allowlist, rate-limit, timeout, max-size).
  - src/app/api/epaper/crop/route.ts

- Health and readiness endpoints are available.
  - src/app/api/health/route.ts
  - src/app/api/ready/route.ts

- CI enforces key quality gates.
  - .github/workflows/ci.yml

---

## Final Go-Live Gate Checklist

- [ ] Staging deployment from CI completed.
- [ ] Staging validation passed (critical journeys + admin flow).
- [ ] Security audit reviewed and signed off.
- [ ] Production deployment approved and executed.
- [ ] Post-deploy checks completed:
  - Homepage
  - Category page
  - Post page
  - E-paper
  - /api/health
  - /api/ready
  - Error monitoring signal

---

## Suggested Short-Term Plan (2-4 Days)

1. Day 1: deployment workflow + release commit/tag.
2. Day 2: audit resolution plan + CSP hardening.
3. Day 3: e2e expansion + monitoring hookup.
4. Day 4: backup/restore drill + staging rehearsal + go-live sign-off.