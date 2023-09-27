import { setTimeout as sleep } from 'node:timers/promises';
import { createLogger } from '@cstag/logger';
import amqp from 'amqp-connection-manager';
import { server } from './config.js';

const logger = createLogger('@cstag/amqp', 'client');

/** @type {import("amqp-connection-manager").AmqpConnectionManager|null} */
let connection = null;
function getConnectionInstance(forceNewInstance = false) {
  if (forceNewInstance || !connection) {
    connection = amqp.connect(server);
  }
  return connection;
}

async function tryGetConnectionInstance({ requestTimeout, forceNewInstance }) {
  try {
    const connection = getConnectionInstance(forceNewInstance);
    if (!connection.isConnected()) {
      await connection.connect({ timeout: requestTimeout });
    }
    return connection;
  } catch {
    return null;
  }
}

const _retryTimes = 3;
const _requestTimeout = 3 * 1000;
const _waitForNextRetry = 5 * 1000;
const _defaultArgs = {
  retryTimes: _retryTimes,
  requestTimeout: _requestTimeout,
  waitForNextRetry: _waitForNextRetry,
};
export async function getClient({
  retryTimes,
  requestTimeout,
  waitForNextRetry,
} = _defaultArgs) {
  let forceNewInstance = false;
  for (let i = 0; i < retryTimes; i++) {
    const connection = await tryGetConnectionInstance({
      requestTimeout,
      forceNewInstance,
    });
    if (connection === null) {
      forceNewInstance = true;
      logger.info(
        `Trying to get RabbitMQ connection, attempt ${
          i + 1
        }/${retryTimes}, next attempt in ${waitForNextRetry}ms`
      );
      await sleep(waitForNextRetry);
      continue;
    }
    logger.info('RabbitMQ connection is ready');
    return connection;
  }
  throw new Error('RabbitMQ connection is not available');
}

export async function closeClient() {
  if (connection) {
    const client = await getClient();
    await client.close();
    connection = null;
  }
}
