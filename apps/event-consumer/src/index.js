import { startConnection, registerConsumer, queues } from '@cstag/amqp';
import { initKnexModule } from '@cstag/db';
import { ensureAllIndiceExists } from '@cstag/elasticsearch';
import invoice from './invoice/index.js';
import ticketAnalysis from './ticket-analysis/index.js';
import tollPlaza from './toll-plaza/index.js';
import tripAnalysis from './trip-analysis/index.js';

const init = async () => {
  await initKnexModule();
  await ensureAllIndiceExists();
  await startConnection({ prefetch: 1 });
  await registerConsumer(queues.tollPlaza, tollPlaza);
  await registerConsumer(queues.invoice, invoice);
  await registerConsumer(queues.tripAnalysis, tripAnalysis);
  await registerConsumer(queues.ticketAnalysis, ticketAnalysis);
};

// eslint-disable-next-line unicorn/prefer-top-level-await
init();
