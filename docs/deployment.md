# Deployment Guide

## Environments
- `staging`: pre-production validation
- `production`: live traffic

## Required secrets
- `PAYLOAD_SECRET`
- `DATABASE_URI`
- `NEXT_PUBLIC_SITE_URL`
- Optional: AdSense vars and `ERROR_MONITOR_WEBHOOK_URL`

## Release flow
1. Merge to main after CI passes.
2. Deploy to staging.
3. Run smoke tests and editor workflow validation.
4. Approve production deployment.
5. Post-deploy verification:
   - Homepage
   - Category page
   - Article page
   - E-paper page
   - `/api/health`
   - `/api/ready`

## Rollback
- Redeploy previous known-good image/build.
- Restore database from latest valid backup if data migration introduced issues.

## Security checks before production
- No default or fallback secrets.
- No high severity `npm audit` issues in production dependencies.
- Security headers verified.
