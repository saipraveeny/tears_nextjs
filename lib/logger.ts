export const logger = {
  info: (context: string, message: string, data?: any) => {
    console.log(`[INFO] [${context}] ${message}`, data || "");
  },
  debug: (context: string, message: string, data?: any) => {
    console.debug(`[DEBUG] [${context}] ${message}`, data || "");
  },
  warn: (context: string, message: string, data?: any) => {
    console.warn(`[WARN] [${context}] ${message}`, data || "");
  },
  error: (context: string, message: string, data?: any) => {
    console.error(`[ERROR] [${context}] ${message}`, data || "");
  }
};

export const logError = (context: string, message: string, error: any, data?: any) => {
  console.error(`[ERROR] [${context}] ${message}: ${error.message}`, data || "");
};
