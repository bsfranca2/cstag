import { setTimeout as sleep } from 'node:timers/promises';
import { createLogger } from '@cstag/logger';
import { Client } from '@elastic/elasticsearch';
import { getClientOptions } from './config.js';

const logger = createLogger('@cstag/elasticsearch', 'client');

/** @type {import("@elastic/elasticsearch").Client|undefined} */
let instance;

export function getClientInstance(forceNewInstance = false) {
  if (forceNewInstance || !instance) {
    instance = new Client(getClientOptions());
  }
  return instance;
}

async function tryGetClientInstance({ requestTimeout, forceNewInstance }) {
  try {
    const client = getClientInstance(forceNewInstance);
    const pingResponse = await client.ping({}, { requestTimeout });
    if (!pingResponse) {
      return null;
    }
    return client;
  } catch {
    return null;
  }
}

let isFirstTime = true;

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
    const client = await tryGetClientInstance({
      requestTimeout,
      forceNewInstance,
    });
    if (client === null) {
      forceNewInstance = true;
      logger.info(
        `Trying to get Elasticsearch client, attempt ${
          i + 1
        }/${retryTimes}, next attempt in ${waitForNextRetry}ms`
      );
      await sleep(waitForNextRetry);
      continue;
    }
    if (isFirstTime) {
      isFirstTime = false;
      logger.info('Elasticsearch client is ready');
    }
    return client;
  }
  throw new Error('Elasticsearch client is not available');
}
