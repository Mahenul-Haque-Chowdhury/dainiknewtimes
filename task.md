# Production Task Backlog

Last updated: 2026-04-19
Project: thedailynewtimes

## Purpose
This file is the single backlog of all work needed to take the project to safe, repeatable production.

## Current Snapshot
- Product features are mostly implemented.
- Production build succeeds.
- Major gap is production hardening (security, access control, testing, release process, observability).

Estimated readiness today: 40-45%

---

## P0 - Launch Blockers (Must complete before go-live)

### 1) Public content exposure and access control
- [x] Enforce published-only access for article detail fetch by slug. (task done)
  - Scope: src/lib/payload-helpers.ts, src/app/(frontend)/post/[slug]/page.tsx
  - Done when: Draft articles are never returned by public routes.
- [x] Enforce published-only access for e-paper article zone route. (task done)
  - Scope: src/app/(epaper)/epaper/article/[date]/[page]/[zone]/page.tsx
  - Done when: Route only resolves published e-paper editions.
- [x] Rework collection permissions by role (admin/editor/reporter), not only "logged-in". (task done)
  - Scope: src/collections/Articles.ts, src/collections/EPapers.ts, src/collections/Categories.ts, src/collections/Media.ts, src/collections/Users.ts
  - Done when: CRUD permissions follow explicit role matrix approved by product owner.
- [x] Add server-side authorization checks for sensitive editor routes (zone editor and admin-adjacent flows). (task done)
  - Scope: src/app/(epaper)/epaper/zone-editor/[id]/page.tsx and related API paths
  - Done when: Unauthorized users cannot load or mutate zone data.

### 2) Secrets and environment hardening
- [x] Remove insecure fallback secret from Payload config. (task done)
  - Scope: src/payload.config.ts
  - Done when: App fails fast if PAYLOAD_SECRET is missing.
- [x] Remove unsafe fallback behavior for DATABASE_URI. (task done)
  - Scope: src/payload.config.ts
  - Done when: App fails fast with clear startup error when DATABASE_URI is missing.
- [x] Stop storing production-like credentials in tracked config files. (task done)
  - Scope: docker-compose.yml, .env
  - Done when: Sensitive values are injected from environment or secret manager.
- [x] Rotate all exposed credentials (DB password, Payload secret, admin seed defaults). (task done)
  - Scope: runtime infra + seed flow
  - Done when: New strong credentials are active and old ones are invalid.
- [x] Replace hardcoded admin seed password with environment-driven one-time bootstrap flow. (task done)
  - Scope: src/lib/seed.ts
  - Done when: No static password exists in source.

### 3) API and abuse prevention
- [x] Harden crop API source URL validation (allowlist hosts, protocol checks, path checks). (task done)
  - Scope: src/app/api/epaper/crop/route.ts
  - Done when: Endpoint rejects unknown external hosts and malformed URLs.
- [x] Add rate limiting to crop API. (task done)
  - Scope: src/app/api/epaper/crop/route.ts or middleware
  - Done when: Per-IP/request window limits block abusive traffic.
- [x] Add request timeout and size guardrails for image fetch and processing. (task done)
  - Scope: src/app/api/epaper/crop/route.ts
  - Done when: Endpoint cannot be used for resource exhaustion.

### 4) Security baseline for web responses
- [x] Add security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). (task done)
  - Scope: Next middleware/config
  - Done when: Headers are present and validated in production responses.
- [x] Review any inline script injection pattern and replace with safer approach where possible. (task done)
  - Scope: src/app/(epaper)/epaper/article/[date]/[page]/[zone]/page.tsx
  - Done when: No avoidable inline JS injection remains.

### 5) Dependency vulnerability remediation
- [x] Upgrade vulnerable dependency chain flagged by audit (drizzle-orm transitives, dompurify transitives, esbuild transitives where applicable). (task done)
  - Scope: package.json, package-lock.json
  - Done when: npm audit shows zero high vulnerabilities for production deps.
- [x] Run full regression after upgrades (build + critical flows). (task done)
  - Scope: entire app
  - Done when: No behavior regressions in core routes and admin.

### 6) Repo and release process minimums
- [x] Ensure source is tracked in a Git repository (if not managed externally). (task done)
  - Scope: project root
  - Done when: Standard git workflow (branches, PRs, tags) is available.
- [x] Add .gitignore for node_modules, .next, .env, build outputs, local media artifacts. (task done)
  - Scope: project root
  - Done when: Sensitive and generated files are excluded from VCS.
- [x] Add README with setup, env vars, local run, build, deploy, and rollback basics. (task done)
  - Scope: project root
  - Done when: New engineer can run project from docs only.
- [x] Add .env.example documenting required variables and formats. (task done)
  - Scope: project root
  - Done when: Environment setup is repeatable.

---

## P1 - Stabilization (Required for dependable production)

### 7) Quality gates and automated testing
- [x] Add linting setup and lint script. (task done)
  - Scope: project root config + npm scripts
  - Done when: npm run lint passes in CI.
- [x] Add unit tests for utility and helper logic. (task done)
  - Scope: src/lib/*, key pure helpers
  - Done when: Core helper coverage baseline exists.
- [x] Add integration tests for critical data flows. (task done)
  - Scope: payload helpers + route handlers
  - Done when: Published filter, search, archive, e-paper retrieval are verified.
- [x] Add end-to-end smoke tests for top journeys. (task done)
  - Scope: home, category, post, search, archive, epaper, admin login
  - Done when: CI can validate core user paths on every release candidate.
- [x] Add typecheck script and gate in CI. (task done)
  - Scope: package.json + CI workflow
  - Done when: type errors fail pipeline.

### 8) CI/CD and deployment pipeline
- [x] Create CI workflow for install, typecheck, lint, test, build, audit summary. (task done)
  - Scope: .github/workflows
  - Done when: PR and main branch checks run automatically.
- [x] Define deployment workflow (staging then production) with required approvals. (task done)
  - Scope: CI/CD config
  - Done when: Releases are predictable and auditable.
- [x] Add release versioning and changelog process. (task done)
  - Scope: repo process/docs
  - Done when: Every production deployment has release notes.

### 9) Observability and incident readiness
- [x] Add structured server logging for route errors and critical mutations. (task done)
  - Scope: server routes/actions/helpers
  - Done when: Errors are traceable with request context.
- [x] Add error monitoring (for example Sentry) for server and client. (task done)
  - Scope: app-wide
  - Done when: Unhandled errors trigger alerts with stack traces.
- [x] Add health/readiness endpoints and uptime checks. (task done)
  - Scope: app routes + platform monitor
  - Done when: Platform can detect degraded service quickly.
- [x] Define backup and restore process for PostgreSQL and media. (task done)
  - Scope: infra runbook
  - Done when: Recovery drill is documented and tested.

### 10) Performance and scalability
- [x] Define cache strategy per route (home, article, search, archive, epaper). (task done)
  - Scope: app routes + revalidate settings
  - Done when: Revalidation values are intentional and documented.
- [x] Optimize expensive image workflows (crop endpoint + e-paper assets). (task done)
  - Scope: api crop + media serving strategy
  - Done when: Response times and memory usage are within target.
- [x] Add CDN strategy for media and static assets. (task done)
  - Scope: deployment architecture
  - Done when: Global latency and origin load are reduced.

### 11) Content and CMS workflow hardening
- [x] Implement draft/publish workflow validations for all public-facing content. (task done)
  - Scope: collections + helper queries + pages
  - Done when: Public pages never show draft content.
- [x] Add editorial audit metadata (who changed what, when) where needed. (task done)
  - Scope: collections/hooks
  - Done when: Content change history is reviewable.
- [x] Validate slug uniqueness and canonical URL strategy for SEO consistency. (task done)
  - Scope: collections + page metadata
  - Done when: No duplicate or conflicting article URLs.

---

## P2 - Product Completion and Polish

### 12) Replace placeholder/stub UX and business integrations
- [x] Wire SiteSettings global into Header and Footer (site title, tagline, social links, contact, editor info). (task done)
  - Scope: src/components/layout/Header.tsx, src/components/layout/Footer.tsx, src/lib/payload-helpers.ts
  - Done when: Content admins can update branding/contact without code changes.
- [x] Replace placeholder footer data with real business data. (task done)
  - Scope: src/components/layout/Footer.tsx
  - Done when: No template placeholders remain.
- [x] Replace placeholder social href values with CMS-driven links. (task done)
  - Scope: src/components/layout/Header.tsx
  - Done when: Social buttons point to real channels.
- [x] Replace ad placeholders with real ad integration. (task done)
  - Scope: src/components/ui/AdZone.tsx and placements across pages
  - Done when: Ad inventory can be configured and measured.
- [x] Connect Video section to real data source or remove until ready. (task done)
  - Scope: src/components/home/VideoSection.tsx, src/app/(frontend)/page.tsx
  - Done when: Section has production content behavior.

### 13) Type safety and maintainability cleanup
- [x] Reduce broad any usage in critical routes/components. (task done)
  - Scope: epaper pages/components, article/category/search/archive pages, payload helpers
  - Done when: Critical paths use generated payload types where possible.
- [x] Add stricter runtime validation for external inputs. (task done)
  - Scope: API routes and query param handling
  - Done when: Invalid input fails safely with clear responses.

### 14) UX and accessibility improvements
- [x] Run accessibility pass (keyboard nav, labels, focus states, contrast checks). (task done)
  - Scope: key templates and interactive components
  - Done when: Critical pages pass baseline a11y audit.
- [x] Add consistent empty/error/loading states for all major pages. (task done)
  - Scope: frontend pages and shared components
  - Done when: User experience remains clear during failures.

---

## Go-Live Exit Criteria

- [x] No known draft-content exposure paths remain. (task done)
- [x] No hardcoded secrets or default credentials in source. (task done)
- [x] Zero high vulnerabilities in production dependency audit. (task done)
- [x] Access control matrix implemented and verified by role tests. (task done)
- [x] CI pipeline enforces typecheck + lint + tests + build. (task done)
- [x] Critical e2e smoke tests pass on release candidate. (task done)
- [x] Monitoring, alerting, and backup/restore runbook are active. (task done)
- [x] Placeholder business content and integrations are replaced. (task done)
- [x] Deployment and rollback process documented and tested. (task done)

---

## Suggested Implementation Order

1. Fix public data exposure + permissions.
2. Harden secrets and API abuse controls.
3. Clear high dependency vulnerabilities.
4. Establish CI and testing baseline.
5. Add observability and backup safeguards.
6. Replace placeholders and complete business integrations.
7. Performance tuning and final release rehearsal.
