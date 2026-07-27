const pino = require('pino');

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.token',
      'res.headers["set-cookie"]',
    ],
    censor: '[REDACTED]',
  },
  transport: isDevelopment
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined,
});

module.exports = { logger };
