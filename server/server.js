const express = require('express');
const { connectDB } = require('./src/mongo_db/db');
const bodyParser = require('body-parser');
const pinoHttp = require('pino-http');
const compression = require('compression');
const cors = require('cors');
const { logger } = require('./src/logger');

const isDevelopment = process.env.NODE_ENV === 'development';
module.exports = { isDevelopment };

require('dotenv').config({ path: isDevelopment ? './config/.env.dev' : './config/.env.prod' });
const MONGO_DB = process.env.MONGO_IN_CONTAINER
  ? process.env.CONTAINER_MONGO_DB
  : process.env.MONGO_DB;
const { passport } = require('./src/auth');

const app = express();
connectDB(MONGO_DB);

// Init Middleware
app.use(
  pinoHttp({
    logger,
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
    customErrorMessage: (req, res, err) => `${req.method} ${req.url} ${res.statusCode} - ${err.message}`,
  }),
);

app.use(cors({ origin: '*' }));
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// api routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/lexicon', require('./routes/api/lexicon'));
app.use('/api/newhskwords', require('./routes/api/newhskwords'));
app.use('/api/words', require('./routes/api/words'));
app.use('/api/userwords', require('./routes/api/userwords'));
app.use('/api/dictionary', require('./routes/api/dictionary'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/texts', require('./routes/api/texts'));
app.use('/api/blog', require('./routes/api/blog'));
app.use('/api/books', require('./routes/api/books'));
app.use('/api/translation', require('./routes/api/translation'));
app.use('/api/notices', require('./routes/api/notices'));
app.use('/api/videos', require('./routes/api/videos'));
app.use('/api/phoneticsLessons', require('./routes/api/phoneticsLessons'));
app.use('/api/charactersLessons', require('./routes/api/charactersLessons'));
app.use('/api/donate', require('./routes/api/donate'));
app.use('/api/project', require('./routes/api/project'));
app.use('/api/textbooks', require('./routes/api/textbooks'));
app.use('/api/ru-dictionary', require('./routes/api/ru-dictionary'));

// glcoud services routes
app.use('/gcloud/youtube', require('./routes/gcloud/youtube'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  (req.log || logger).error({ err }, `Unhandled error on ${req.method} ${req.url}`);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ msg: 'Server error' });
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception - process will exit');
  process.exit(1);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  logger.info(`Server is up on port ${PORT}. Is development MODE: ${isDevelopment}`);
});
