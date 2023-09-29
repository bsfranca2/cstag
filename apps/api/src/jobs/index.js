import PgBoss from 'pg-boss'
import { importInvoice } from './invoice/index.js';
import { queues } from './queues.js'
import { ticketAnalyze } from './ticket-analysis/index.js';
import { tripAnalyze } from './trip-analysis/index.js';

const boss = new PgBoss(process.env.DATABASE_URL);
boss.on('error', error => console.log(error));

export const startJobs = async () => {
  await boss.start();
  await boss.work(queues.invoice, importInvoice);
  await boss.work(queues.tripAnalysis, tripAnalyze);
  await boss.work(queues.ticketAnalysis, ticketAnalyze);
}

export const sendToQueue = async (queueName, data) => {
  await boss.send(queueName, data)
}

export * from './queues.js'
