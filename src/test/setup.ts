import "@testing-library/jest-dom/vitest";

process.env.PAYLOAD_SECRET ??= "test-secret";
process.env.DATABASE_URI ??= "postgres://test:test@localhost:5432/test";
process.env.NEXT_PUBLIC_SITE_URL ??= "http://localhost:3000";
