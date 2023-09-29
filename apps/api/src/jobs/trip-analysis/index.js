import { db } from '@cstag/db'
import { createLogger } from '@cstag/logger';
import { analyze } from './analysis.js';

const logger = createLogger();

export const tripAnalyze = async (job) => {
  try {
    // logger.info('Iniciando analise de viagem', message);

    const { tenant, invoiceId, trip } = job.data;

    await analyze(db, tenant, invoiceId, trip);

    // logger.info('Finalizado analise de viagem', message);
  } catch (error) {
    logger.error('Erro ao analisar viagem', JSON.stringify(job), error);
  }
};
