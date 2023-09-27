import { getKnexClientManager } from '@cstag/db';
import { createLogger } from '@cstag/logger';
import { analyze } from './analysis.js';

const logger = createLogger();

export default async (message) => {
  try {
    // logger.info('Iniciando analise de viagem', message);

    const { tenant, invoiceId, trip } = message;
    const clientManager = getKnexClientManager(tenant);
    const db = clientManager.getClient(tenant);

    await analyze(db, tenant, invoiceId, trip);

    // logger.info('Finalizado analise de viagem', message);
  } catch (error) {
    logger.error('Erro ao analisar viagem', message, error);
  }
};
