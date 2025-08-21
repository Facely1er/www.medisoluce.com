// Production-safe logging utility
const isDevelopment = !import.meta.env.PROD;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      !import.meta.env.PROD && console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      !import.meta.env.PROD && console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};