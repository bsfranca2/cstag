import { createLogger } from '@cstag/logger';
import { getConnection } from './connection.js';

const logger = createLogger('@cstag/db');

let prisma = null;
class PrismaClientManager {
  constructor() {
    /** @type {Map<String,import("@prisma/client").PrismaClient>} */
    this.clients = new Map();
  }

  /**
   * @param {String} tenant
   * @returns {prisma.PrismaClient}
   */
  getClient(tenant) {
    let client = this.clients.has(tenant) ? this.clients.get(tenant) : null;
    if (!client) {
      client = new prisma.PrismaClient({
        datasources: { db: { url: getConnection(tenant) } },
      });
      this.clients.set(tenant, client);
    }
    return client;
  }

  async closeAllConnections() {
    await Promise.all(
      Object.values(this.clients).map((client) => client.$disconnect())
    );
  }
}

export const initPrismaModule = async () => {
  // eslint-disable-next-line unicorn/no-await-expression-member
  prisma = (await import('@prisma/client')).default;
  logger.info('prisma module loaded');
};

let manager = null;
/** @returns {PrismaClientManager} */
export const getPrismaClientManager = () => {
  if (!manager) {
    manager = new PrismaClientManager();
  }
  return manager;
};
