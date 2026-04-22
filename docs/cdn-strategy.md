# CDN Strategy

## Goals
- Offload origin traffic for media-heavy pages.
- Improve global latency.

## Recommended setup
- Put static assets and media behind CDN (CloudFront/Cloudflare/Vercel edge).
- Cache `/media/*` and other immutable assets with long TTL.
- Keep API routes on shorter TTL or bypass as needed.

## Purge policy
- Purge by path on high-priority article updates.
- Use versioned asset URLs when possible.

## Security
- Restrict origin access to CDN where possible.
- Ensure HTTPS end-to-end.
