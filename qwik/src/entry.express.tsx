/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Express HTTP server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.builder.io/docs/deployments/node/
 *
 */
import { createQwikCity, type PlatformNode } from '@builder.io/qwik-city/middleware/node';
import qwikCityPlan from '@qwik-city-plan';
import { manifest } from '@qwik-client-manifest';
import render from './entry.ssr';
import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  transport: isDevelopment
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined,
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception - process will exit');
  process.exit(1);
});

declare global {
  interface QwikCityPlatform extends PlatformNode {}
}

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), '..', '..', 'dist');
const buildDir = join(distDir, 'build');

// Allow for dynamic port
const PORT = process.env.PORT ?? 3000;

// Create the Qwik City Node middleware
const { router, notFound } = createQwikCity({
  render,
  qwikCityPlan,
  manifest,
  getOrigin(req) {
    // behind nginx: without this, Qwik City sees plain http (nginx terminates
    // TLS and proxies over http), so its Origin/CSRF check on form-like POSTs
    // (multipart/urlencoded/text-plain) mismatches the browser's https Origin
    // and 403s. Requires nginx's `location /` to forward X-Forwarded-Proto.
    const protocol = req.headers['x-forwarded-proto'] ?? 'http';
    const host = req.headers['x-forwarded-host'] ?? req.headers.host;
    return `${protocol}://${host}`;
  },
});

// Create the express server
// https://expressjs.com/
const app = express();

// Log every page/SSR request (with response time), skip noisy static asset requests
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => !!req.url && (req.url.startsWith('/build') || req.url.startsWith('/assets')),
    },
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.originalUrl} ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${err.message}`,
    serializers: {
      req: (req) => ({ method: req.method, url: req.originalUrl }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);

// Enable gzip compression
// app.use(compression());

// Static asset handlers
// https://expressjs.com/en/starter/static-files.html
app.use(`/build`, express.static(buildDir, { immutable: true, maxAge: '1y' }));
app.use(express.static(distDir, { redirect: false }));

// Use Qwik City's page and endpoint request handler
app.use(router);

// Use Qwik City's 404 handler
app.use(notFound);

// Start the express server
app.listen(PORT, () => {
  /* eslint-disable */
  console.log(`Server started: http://localhost:${PORT}/`);
});
