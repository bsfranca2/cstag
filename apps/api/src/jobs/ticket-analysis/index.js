import { pipeline } from 'node:stream/promises';
import { db } from '@cstag/db';
import { createGroupBy } from '../util/group-by.js';
import { composeAnalyze } from './analyzes.js';
import {
  getIdInvoice,
  getTickets,
  transactionInsertAnalysis,
} from './query.js';

const BATCH_SIZE = 100;

export const ticketAnalyze = async (job) => {
  try {
    // console.log('Iniciando analise do ticket', data)
    const { invoiceId, idTicket } = job.data;

    const { idInvoice } = await getIdInvoice(db, invoiceId, idTicket);
    const analyze = composeAnalyze(db);
    await pipeline(
      getTickets(db, idInvoice, idTicket).stream({ highWaterMark: BATCH_SIZE }),
      async function* (readable) {
        for await (const ticket of readable) {
          yield analyze(ticket);
        }
      },
      createGroupBy(BATCH_SIZE),
      async function* (readable) {
        for await (const batch of readable) {
          yield* await transactionInsertAnalysis(db, idInvoice, batch);
        }
      },
      // createGroupBy(BATCH_SIZE),
      // async function* (readable) {
      //   for await (const ids of readable) {
      //     // const analysisList = await getAnalysis(db, tenant, ids);
      //     // await saveAnalysisES(analysisList);
      //   }
      // }
    );

    // console.log('Finalizado analise to ticket', data)
  } catch (error) {
    console.error('Erro ao analisar ticket', error);
  }
};
