export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const shouldLogDebug = () => process.env.NODE_ENV !== 'production';

export const logger = {
  debug(prefix: string, ...args: unknown[]) {
    if (shouldLogDebug()) console.log([], ...args);
  },
  info(prefix: string, ...args: unknown[]) {
    console.info([], ...args);
  },
  warn(prefix: string, ...args: unknown[]) {
    console.warn([], ...args);
  },
  error(prefix: string, ...args: unknown[]) {
    console.error([], ...args);
  },
};
