import { getStringEnv } from "@/lib/env";
import { logError, logWarn } from "@/lib/logger";

interface ReportErrorArgs {
  source: string;
  message: string;
  error?: unknown;
  context?: Record<string, unknown>;
}

function normalizeError(error: unknown): Record<string, unknown> | undefined {
  if (!error) return undefined;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    value: String(error),
  };
}

export async function reportError({
  source,
  message,
  error,
  context,
}: ReportErrorArgs): Promise<void> {
  const normalizedError = normalizeError(error);
  const payload = {
    source,
    message,
    ...(context ? { context } : {}),
    ...(normalizedError ? { error: normalizedError } : {}),
  };

  logError(message, payload);

  const webhookUrl = getStringEnv("ERROR_MONITOR_WEBHOOK_URL");

  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: "error",
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch (webhookError) {
    logWarn("Failed to send error webhook", {
      source,
      webhookUrl,
      webhookError: normalizeError(webhookError),
    });
  }
}
