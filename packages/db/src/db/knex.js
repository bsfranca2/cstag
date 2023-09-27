import { createLogger } from '@cstag/logger';
import { getConnection } from './connection.js';

const logger = createLogger('@cstag/db');

let knex = null;

class KnexClientManager {
  constructor() {
    /** @type {Map<String,import("knex").Knex>} */
    this.clients = new Map();
  }

  /**
   * @param {String} tenant
   * @returns {import("knex").Knex}
   */
  getClient(tenant) {
    let client = this.clients.has(tenant) ? this.clients.get(tenant) : null;
    if (!client) {
      const { schema, ...connection } = getConnection(tenant, { parse: true });
      client = knex({
        client: 'pg',
        connection,
        searchPath: [schema],
        pool: { min: 0, max: 7 },
      });
      this.clients.set(tenant, client);
    }
    return client;
  }

  async closeAllConnections() {
    // await Promise.all(
    //   Object.values(this.clients).map((client) => client)
    // )
  }
}

export const initKnexModule = async () => {
  // eslint-disable-next-line unicorn/no-await-expression-member
  knex = (await import('knex')).default;
  logger.info('knex module loaded');
};

let manager = null;
/** @returns {KnexClientManager} */
export const getKnexClientManager = () => {
  if (!manager) {
    manager = new KnexClientManager();
  }
  return manager;
};
