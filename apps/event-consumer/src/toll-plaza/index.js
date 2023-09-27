import { getObject } from '@cstag/core/storage';
import { getKnexClientManager } from '@cstag/db';
import { createLogger } from '@cstag/logger';
import { getWorkbookData, getWorkbookStream } from '../util/xlsx.js';

const logger = createLogger('tollPlaza');

const batchSize = 100;

const formatRow = (row, idTollPlazaPeriod) => ({
  associate_company: row[2],
  metadata: {
    entryId: Number.parseInt(row[3]) || row[3],
  },
  highway: row[4],
  km: row[5]?.toString(),
  full_road_name: row[6],
  category: Number.parseInt(row[7]),
  value: row[9].includes('.')
    ? row[9].replace(/[^\d.]+/g, '')
    : row[9].replace(/\D/g, ''),
  id_toll_plaza_period: idTollPlazaPeriod,
});

export default async (message) => {
  logger.info('Iniciando importacao da planilha valores da praça', message);

  const { tenant, id, bucketName, objectName } = message;
  const clientManager = getKnexClientManager();
  const db = clientManager.getClient(tenant);

  const [{ id_toll_plaza_period: idTollPlazaPeriod }] = await db
    .table('tb_toll_plaza_period')
    .where('id', id)
    .update({
      status: 'UNDER_IMPLEMENTATION',
    })
    .returning('*');

  let success;
  try {
    const fileStream = await getObject(bucketName, objectName);
    const workBookReader = getWorkbookData(fileStream);
    const workBookStream = getWorkbookStream(workBookReader, batchSize);

    await db.transaction(async (trx) => {
      const list = [];

      for await (const { row } of workBookStream) {
        // Importar somente se ticket em 90 dias for sim
        if (row[10]?.trim()?.toUpperCase() !== 'SIM') continue;

        list.push(formatRow(row, idTollPlazaPeriod));

        if (list.length >= batchSize) {
          const slice = list.splice(0, batchSize);
          await trx.batchInsert('tb_toll_plaza', slice, slice.length);
        }
      }

      if (list.length > 0) {
        await trx.batchInsert('tb_toll_plaza', list, list.length);
      }
    });

    success = true;
  } catch (error) {
    logger.error('Erro na importacao da planilha', error);
    success = false;
  }

  await db
    .table('tb_toll_plaza_period')
    .where('id', id)
    .update({
      status: success ? 'DONE' : 'ERROR',
    });
  logger.info('Finalizado importacao da planilha valores da praça', message);
};
