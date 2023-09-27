import cluster from 'node:cluster';
import os from 'node:os';
import { createLogger } from '@cstag/logger';
import { startApp, shutdown } from './server.js';
const logger = createLogger();

const { CLUSTER_FORKS_MIN = 1 } = process.env;
const numCpus = Math.min(os.cpus().length, CLUSTER_FORKS_MIN);

process.on('uncaughtException', async (err) => {
  logger.error('Uncaught Exception', err);
  // logMailer
  shutdown(1);
});

process.on('SIGTERM', () => {
  logger.error('Received SIGTERM');
  shutdown(0);
});

process.on('SIGINT', () => {
  logger.error('Received SIGINT');
  shutdown(0);
});

const startWorker = () => {
  const worker = cluster.fork();
  logger.log('startWorker#ForkedStart', { pid: worker.id });
};

if (cluster.isPrimary && numCpus > 1) {
  logger.log('Master Process is running', { pid: process.pid });
  for (let i = 0; i < numCpus; i++) {
    startWorker();
  }

  cluster.on('exit', (worker) => {
    logger.log('startWorker#ForkedDied', { pid: worker.process.pid });
    startWorker();
  });
} else {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  startApp().catch(logger.error);
}
