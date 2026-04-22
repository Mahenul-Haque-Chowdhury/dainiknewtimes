# New Times

Next.js + Payload CMS Bengali news portal.

## Tech stack
- Next.js 16
- React 19
- TypeScript
- Payload CMS v3
- PostgreSQL

## Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 16 (or Docker)

## Environment setup
1. Copy `.env.example` to `.env`.
2. Set required values:
   - `PAYLOAD_SECRET`
   - `DATABASE_URI`
   - `NEXT_PUBLIC_SITE_URL`

## Local database (Docker)
Run:

```bash
docker compose up -d
```

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Generate Payload types

```bash
npm run generate:types
```

## Seed baseline data

```bash
npm run seed
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test
```

## Production build

```bash
npm run build
npm run start
```

## Health endpoints
- `GET /api/health`
- `GET /api/ready`

## Deployment and operations docs
- `docs/deployment.md`
- `docs/release-process.md`
- `docs/backup-restore.md`
- `docs/performance-cache-strategy.md`
- `docs/cdn-strategy.md`
