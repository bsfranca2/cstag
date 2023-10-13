import { createReadStream } from 'node:fs';
import { prisma } from '~/shared/prisma';
import type { ImportTollPlazaSheetDto } from './import-toll-plaza-sheet.schema';
import { TollPlazaStatus } from '../toll-plaza-status';
import { getWorkbookData, getWorkbookStream } from '~/shared/xlsx';

const logger = {
  info: console.log,
  error: console.error,
};
const batchSize = 100;

const parseValue = (value) =>
  value.includes('.') ? value.replace(/[^\d.]+/g, '') : value.replace(/\D/g, '');

const formatRow = (row, idTollPlazaPeriod) => {
  const value = parseValue(row[9]).trim();
  return {
    associateCompany: row[2],
    additionalAttributes: {
      entryId: Number.parseInt(row[3]) || row[3],
    },
    highway: row[4],
    km: row[5]?.toString(),
    fullRoadName: row[6],
    category: Number.parseInt(row[7]),
    value: value === '' ? null : value,
    idTollPlazaPeriod,
  };
};

export const importTollPlazaSheet = async (dto: ImportTollPlazaSheetDto) => {
  const { id } = await prisma.tollPlazaPeriod.create({
    data: {
      startAt: dto.startAt,
      endAt: dto.endAt,
      description: dto.description,
      status: TollPlazaStatus.UnderImplementation,
    },
  });

  logger.info('Iniciando importação da planilha valores da praça');

  let success;
  try {
    const fileStream = createReadStream(dto.sheetPath);
    const workBookReader = getWorkbookData(fileStream);
    const workBookStream = getWorkbookStream(workBookReader, batchSize);

    await prisma.$transaction(
      async (trx) => {
        const list = [];

        for await (const { row } of workBookStream) {
          // Importar somente se ticket em 90 dias for sim
          if (row[10]?.trim()?.toUpperCase() !== 'SIM') continue;

          list.push(formatRow(row, id));

          if (list.length >= batchSize) {
            const slice = list.splice(0, batchSize);
            await trx.tollPlaza.createMany({ data: slice });
          }
        }

        if (list.length > 0) {
          await trx.tollPlaza.createMany({ data: list });
        }
      },
      {
        timeout: 60_000,
      }
    );

    success = true;
  } catch (error) {
    logger.error('Erro na importação da planilha', error);
    success = false;
  }

  await prisma.tollPlazaPeriod.update({
    where: { id },
    data: {
      status: success ? TollPlazaStatus.Done : TollPlazaStatus.Error,
    },
  });
  logger.info('Finalizado importação da planilha valores da praça');
};
