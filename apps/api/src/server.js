import crypto from 'node:crypto';
import { startConnection } from '@cstag/amqp';
import { getPrismaClientManager, initPrismaModule } from '@cstag/db';
import { ensureAllIndiceExists } from '@cstag/elasticsearch';
import { createLogger } from '@cstag/logger';
import cors from 'cors';
import express from 'express';
import { queryParser } from 'express-query-parser';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './error.js';
import loggerMiddleware from './middleware/request.js';
import { getRouter } from './routes.js';
const logger = createLogger('server');
let server;

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'CStag API',
    description: 'Api do cstag todas as operacoes',
    version: '1.0.0',
  },
};

export const shutdown = async (code = 0) => {
  if (server) {
    server.close(async () => {
      await getPrismaClientManager().closeAllConnections();
      logger.info('Exit process');
      process.exit(code);
    });
  } else {
    logger.info('Exiting process');
    process.exit(code);
  }
};

const requestId = (req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};

export const initServer = async () => {
  const app = express();
  try {
    app.use(helmet());
    app.use(cors({ exposedHeaders: ['X-Request-Id'] }));
    app.use(express.json());
    app.use(
      queryParser({
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true,
      })
    );
    app.disable('x-powered-by');
    app.use(requestId);
    app.use(loggerMiddleware);
    app.use(getRouter());
    app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('*', (_, res) =>
      res.status(404).json({ message: 'Resource not found' })
    );
    app.use(errorHandler);

    const isTest = false;
    const port = Number.parseInt(process.env.PORT) || 3000;
    if (!isTest) {
      try {
        server = app.listen(port, () => {
          logger.info(`server is running on port ${port}`);
        });
      } catch (error) {
        logger.error(
          `Error occurred when tried to listen to port ${port}, exiting process`,
          error
        );
        process.exit();
      }
    }
  } catch (error) {
    logger.error('Startup ERROR', error);
    shutdown(1);
  }
  return app;
};

export const startApp = async () => {
  await ensureAllIndiceExists();
  await startConnection();
  await initPrismaModule();
  await initServer();
};
