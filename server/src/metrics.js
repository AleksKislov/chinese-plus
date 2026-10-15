const http = require('http');
const client = require('prom-client');
const { logger } = require('./logger');

// Prometheus metrics, scraped by Grafana Alloy (monitoring/alloy-config.alloy).
// Served on a separate port that is NOT published in docker-compose: the app port (10000)
// is public, the metrics port is reachable only inside the docker network.
// Labels stay low-cardinality (no user ids): per-user numbers live in the TutorUsage collection.
const register = new client.Registry();

const tutorRequests = new client.Counter({
  name: 'tutor_llm_requests_total',
  help: 'AI tutor LLM calls',
  labelNames: ['kind', 'status'], // kind: chat | summary, status: ok | error
  registers: [register],
});

const tutorTokens = new client.Counter({
  name: 'tutor_llm_tokens_total',
  help: 'AI tutor LLM tokens',
  labelNames: ['kind', 'type'], // type: prompt | completion | cached (part of prompt)
  registers: [register],
});

const tutorCost = new client.Counter({
  name: 'tutor_llm_cost_usd_total',
  help: 'AI tutor LLM cost estimate in USD (TUTOR_PRICE_* env)',
  labelNames: ['kind'],
  registers: [register],
});

const tutorDuration = new client.Histogram({
  name: 'tutor_llm_request_duration_seconds',
  help: 'AI tutor LLM call duration',
  labelNames: ['kind'],
  buckets: [1, 2, 4, 8, 15, 30, 60],
  registers: [register],
});

const tutorRejected = new client.Counter({
  name: 'tutor_rejected_total',
  help: 'AI tutor messages rejected before the LLM call',
  labelNames: ['reason'], // busy | user_limit | global_limit
  registers: [register],
});

function startMetricsServer() {
  const port = Number(process.env.METRICS_PORT) || 9464;
  http
    .createServer(async (req, res) => {
      if (req.method !== 'GET' || req.url !== '/metrics') {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'Content-Type': register.contentType });
      res.end(await register.metrics());
    })
    .listen(port, () => logger.info(`Metrics on port ${port}`));
}

module.exports = {
  startMetricsServer,
  tutorRequests,
  tutorTokens,
  tutorCost,
  tutorDuration,
  tutorRejected,
};
