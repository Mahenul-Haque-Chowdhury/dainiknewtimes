type RequiredServerEnvKey =
  | "PAYLOAD_SECRET"
  | "DATABASE_URI"
  | "NEXT_PUBLIC_SITE_URL";

function getRequiredEnv(key: RequiredServerEnvKey): string {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const serverEnv = {
  PAYLOAD_SECRET: getRequiredEnv("PAYLOAD_SECRET"),
  DATABASE_URI: getRequiredEnv("DATABASE_URI"),
  NEXT_PUBLIC_SITE_URL: getRequiredEnv("NEXT_PUBLIC_SITE_URL"),
};

export function getSiteUrl(): string {
  return serverEnv.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
}

export function getStringEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}
