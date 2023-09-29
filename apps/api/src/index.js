
import cluster from 'node:cluster';
import os from 'node:os';
import { createLogger } from '@cstag/logger';
import { startApp, shutdown } from './server.js';

const logger = createLogger();

(() => {
  if (!cluster.isPrimary) {
    startApp().catch(logger.error);
    return;
  }

  const { SERVER_FORKS = 1 } = process.env;
  const cpusNumber = Math.min(os.availableParallelism(), +SERVER_FORKS);

  logger.info(`Primary ${process.pid} is running`);
  logger.info(`Forking server for ${cpusNumber}`);

  for (let i = 0; i < cpusNumber; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      logger.info(`Worker ${worker.process.pid} died`);
      cluster.fork();
    }
  });
})();

process.on('uncaughtException', async (err) => {
  logger.error('Uncaught Exception', err);
  shutdown(1);
});

const onStop = (event) => {
  logger.info(`Received ${event}`);
  shutdown(0);
};

['SIGINT', 'SIGTERM'].forEach((event) => process.on(event, onStop));
