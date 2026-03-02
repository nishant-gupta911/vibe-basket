export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const logger = {
  log: (level: LogLevel, message: string, meta: Record<string, any> = {}) => {
    const payload = {
      level,
      message,
      ...meta,
      timestamp: new Date().toISOString(),
    };
    const output = JSON.stringify(payload);
    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  },
};
