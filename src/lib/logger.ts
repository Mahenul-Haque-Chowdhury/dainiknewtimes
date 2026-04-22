type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function write(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload: LogPayload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {}),
  };

  const serialized = JSON.stringify(payload);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  write("info", message, context);
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  write("warn", message, context);
}

export function logError(message: string, context?: Record<string, unknown>) {
  write("error", message, context);
}
