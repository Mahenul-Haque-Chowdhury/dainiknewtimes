# Performance and Cache Strategy

## Route-level defaults
- Home: short revalidation (fast-moving headline surface)
- Category pages: medium revalidation
- Article pages: medium/long revalidation
- Search: dynamic with bounded cache as needed
- E-paper: medium revalidation after publish

## Image handling
- Crop API enforces host allowlist, rate limit, timeout, and max size.
- Prefer serving large media via CDN edge cache.

## Monitoring targets
- Time to First Byte for homepage
- Crop API latency and error rate
- SSR error rate
