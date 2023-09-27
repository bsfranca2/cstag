import { sendToQueue, queues } from '@cstag/amqp';
import { getObject } from '@cstag/core/storage';
import { getKnexClientManager } from '@cstag/db';
import { createLogger } from '@cstag/logger';
import { getWorkbookData, getWorkbookStream } from '../util/xlsx.js';

const logger = createLogger();

const batchSize = 100;

const SheetIndex = {
  TollTicket: 5,
  TollValleyTicket: 7,
  TollValleyCredit: 12,
  MonthlyPayment: 10,
};

const toDate = (date, time) => {
  const formattedDate = date.split('/').reverse().join('-');
  const formattedTime = time.split(':').length > 2 ? time : time + ':00';
  return new Date(`${formattedDate}T${formattedTime}.000-03:00`);
};

const toValue = (value) =>
  value.includes('.')
    ? value.replace(/[^\d.]+/g, '')
    : value.replace(/\D/g, '');

const formatTollTicket = (r) => ({
  license_plate: r[1].toString(),
  metadata: {
    tag: r[2],
    brand: r[4],
  },
  category: Number.parseInt(r[5]),
  highway: r[9]?.toString(),
  fare: toValue(r[10]),
  paid_at: toDate(r[6], r[7]),
  type: 'TICKET',
});

const formatTollValleyTicket = (r) => ({
  license_plate: r[1].toString(),
  metadata: {
    tag: r[2],
    brand: r[4],
    shipperName: r[12],
    shipperCNPJ: r[13],
  },
  category: Number.parseInt(r[5]),
  highway: r[9]?.toString(),
  fare: toValue(r[10]),
  paid_at: toDate(r[6], r[7]),
  trip: r[11]?.toString(),
  type: 'TOLL_VALLEY_TICKET',
});

const formatTollValleyCredit = (r) => ({
  license_plate: r[1].toString(),
  metadata: {
    tag: r[2],
    shipperName: r[9],
    shipperCNPJ: r[10],
  },
  description: r[5],
  value: toValue(r[8]),
  received_at: toDate(r[3], r[4]),
  trip: r[6]?.toString(),
});

const formatMonthlyPayment = (r) => {
  const [month, year] = r[5].split('/').map((i) => Number.parseInt(i));
  return {
    license_plate: r[1].toString(),
    category: Number.parseInt(r[4]),
    tag: r[2].toString(),
    month: month - 1,
    year,
    value: toValue(r[6]),
  };
};

const batchInsert = async (trx, idInvoice, list) => {
  const tickets = list
    .filter(
      (data) =>
        data.sheet === SheetIndex.TollTicket ||
        data.sheet === SheetIndex.TollValleyTicket
    )
    .map((data) => ({ ...data.row, id_invoice: idInvoice }));
  const credits = list
    .filter((data) => data.sheet === SheetIndex.TollValleyCredit)
    .map((data) => ({ ...data.row, id_invoice: idInvoice }));
  const payments = list
    .filter((data) => data.sheet === SheetIndex.MonthlyPayment)
    .map((data) => ({ ...data.row, id_invoice: idInvoice }));

  if (tickets.length > 0)
    await trx.batchInsert('tb_ticket', tickets, tickets.length);
  if (credits.length > 0)
    await trx.batchInsert('tb_toll_valley_credit', credits, credits.length);
  if (payments.length > 0)
    await trx.batchInsert('tb_monthly_payment', payments, payments.length);
};

export default async (message) => {
  logger.info('Iniciando importação da planilha de fatura', message);

  const { tenant, id, bucketName, objectName } = message;
  const clientManager = getKnexClientManager(tenant);
  const db = clientManager.getClient(tenant);

  const { id_invoice: idInvoice } = await db
    .first('id_invoice')
    .from('tb_invoice')
    .where('id', id);

  const fileStream = await getObject(bucketName, objectName);
  const workBookReader = getWorkbookData(fileStream, {
    sheets: Object.values(SheetIndex),
    formatting: true,
  });
  const workBookStream = getWorkbookStream(workBookReader, batchSize);

  let ticketsTotal = 0;
  await db.transaction(async (trx) => {
    const list = [];

    for await (const data of workBookStream) {
      let row;
      switch (data.sheet) {
        case SheetIndex.TollTicket: {
          row = formatTollTicket(data.row);
          ticketsTotal += 1;

          break;
        }
        case SheetIndex.TollValleyTicket: {
          row = formatTollValleyTicket(data.row);
          ticketsTotal += 1;

          break;
        }
        case SheetIndex.TollValleyCredit: {
          row = formatTollValleyCredit(data.row);

          break;
        }
        case SheetIndex.MonthlyPayment: {
          row = formatMonthlyPayment(data.row);

          break;
        }
        // No default
      }

      list.push({ ...data, row });
      if (list.length >= batchSize) {
        const slice = list.splice(0, batchSize);
        await batchInsert(trx, idInvoice, slice);
      }
    }

    if (list.length > 0) {
      await batchInsert(trx, idInvoice, list);
    }
  });

  const tripsQuery = db
    .distinct('tt.trip')
    .from('tb_ticket as tt')
    .join('tb_invoice as ti', 'ti.id_invoice', 'tt.id_invoice')
    .where('ti.id_invoice', idInvoice)
    .whereNotNull('tt.trip')
    .union([
      db
        .distinct('ttvc.trip')
        .from('tb_toll_valley_credit as ttvc')
        .join('tb_invoice as ti', 'ti.id_invoice', 'ttvc.id_invoice')
        .where('ti.id_invoice', idInvoice)
        .whereNotNull('ttvc.trip'),
    ]);
  const tripsStream = tripsQuery.stream({ highWaterMark: 5 });

  const promises = [];
  let tripsTotal = 0;
  for await (const { trip } of tripsStream) {
    promises.push(
      sendToQueue(queues.tripAnalysis, { tenant, invoiceId: id, trip })
    );
    tripsTotal += 1;
  }

  await db
    .table('tb_invoice_progress')
    .update({ tickets: ticketsTotal, trips: tripsTotal })
    .where('id_invoice', idInvoice);

  promises.push(sendToQueue(queues.ticketAnalysis, { tenant, invoiceId: id }));
  await Promise.all(promises);

  logger.info('Finalizado importação da planilha de fatura', message);
};
