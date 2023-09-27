import { createLogger } from '@cstag/logger';
import { getClient } from '../client.js';
import * as ticketAnalysis from './ticket-analysis.js';
import * as tripAnalysis from './trip-analysis.js';

const logger = createLogger('@cstag/elasticsearch', 'ensureAllIndiceExists');

const createIndiceIfNotExists = async (indice, mappings) => {
  const client = await getClient();
  const exists = await client.indices.exists({ index: indice });
  if (!exists) {
    await client.indices.create({ index: indice, mappings });
  }
};

// eslint-disable-next-line import/no-default-export
export default async function ensureIndiceIntegrity() {
  await getClient();
  await Promise.all(
    [ticketAnalysis, tripAnalysis].map(({ name, mapping }) =>
      createIndiceIfNotExists(name, mapping)
    )
  );
  logger.info('Ensure indice integrity done');
}
