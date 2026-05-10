/**
 * Centralized Logging Utility
 * Provides consistent logging across all modules with context, levels, and timestamps
 */

const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const LOG_LEVEL = process.env.LOG_LEVEL || "INFO";

const isLoggable = (level) => {
  const levels = [
    LOG_LEVELS.ERROR,
    LOG_LEVELS.WARN,
    LOG_LEVELS.INFO,
    LOG_LEVELS.DEBUG,
  ];
  const currentLevelIndex = levels.indexOf(LOG_LEVEL);
  return currentLevelIndex >= levels.indexOf(level);
};

const formatLog = (level, context, message, data = null) => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}]` : "";
  const logEntry = {
    timestamp,
    level,
    context: contextStr,
    message,
    ...(data && { data }),
  };
  return logEntry;
};

const log = (level, context, message, data = null) => {
  if (!isLoggable(level)) return;

  const logEntry = formatLog(level, context, message, data);
  const contextStr = logEntry.context;
  const logString = `${logEntry.timestamp} ${level} ${contextStr} ${message}`;

  if (level === LOG_LEVELS.ERROR) {
    console.error(logString, data ? JSON.stringify(data) : "");
  } else if (level === LOG_LEVELS.WARN) {
    console.warn(logString, data ? JSON.stringify(data) : "");
  } else {
    console.log(logString, data ? JSON.stringify(data) : "");
  }
};

export const logger = {
  error: (context, message, data = null) =>
    log(LOG_LEVELS.ERROR, context, message, data),
  warn: (context, message, data = null) =>
    log(LOG_LEVELS.WARN, context, message, data),
  info: (context, message, data = null) =>
    log(LOG_LEVELS.INFO, context, message, data),
  debug: (context, message, data = null) =>
    log(LOG_LEVELS.DEBUG, context, message, data),
};

/**
 * Error logging with stack trace
 */
export const logError = (context, message, error, additionalData = null) => {
  const errorData = {
    message: error?.message,
    stack: error?.stack,
    ...additionalData,
  };
  logger.error(context, message, errorData);
};

/**
 * Log function execution with timing
 */
export const logExecution = async (
  context,
  functionName,
  fn,
  params = null,
) => {
  const startTime = Date.now();
  logger.info(context, `[START] ${functionName}`, params);

  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    logger.info(context, `[SUCCESS] ${functionName}`, {
      duration: `${duration}ms`,
    });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(context, `[FAILED] ${functionName}`, error, {
      duration: `${duration}ms`,
    });
    throw error;
  }
};

export default logger;
