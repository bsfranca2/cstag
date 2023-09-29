import { createLogger } from '@cstag/logger';
import { getWorkbookData, getWorkbookStream } from '../../../jobs/util/xlsx.js';
import * as TollPlazaStatus from '../toll-plaza-status.js';

const logger = createLogger('tollPlaza');
const batchSize = 100;

export class ImportTollPlazaPeriodSheetUseCase {
  /** @type {import('@cstag/db').PrismaClient} */
  #prisma;
  #tollPlazaPeriodRepo;

  /** @param {import("@cstag/db").PrismaClient} repository */
  constructor(repository) {
    this.#prisma = repository;
    this.#tollPlazaPeriodRepo = repository.tollPlazaPeriod;
  }

  async execute({ fileStream, startAt, endAt, description }) {
    const { idTollPlazaPeriod } = await this.#tollPlazaPeriodRepo.create({
      data: {
        startAt,
        endAt,
        description,
        status: TollPlazaStatus.UnderImplementation,
      },
    });

    logger.info('Iniciando importação da planilha valores da praça');

    let success;
    try {
      const workBookReader = getWorkbookData(fileStream);
      const workBookStream = getWorkbookStream(workBookReader, batchSize);

      await this.#prisma.$transaction(async (trx) => {
        const list = [];

        for await (const { row } of workBookStream) {
          // Importar somente se ticket em 90 dias for sim
          if (row[10]?.trim()?.toUpperCase() !== 'SIM') continue;

          list.push(this.#formatRow(row, idTollPlazaPeriod));

          if (list.length >= batchSize) {
            const slice = list.splice(0, batchSize);
            await trx.tollPlaza.createMany({ data: slice });
          }
        }

        if (list.length > 0) {
          await trx.tollPlaza.createMany({ data: list });
        }
      }, {
        timeout: 60_000,
      });

      success = true;
    } catch (error) {
      logger.error('Erro na importação da planilha', error);
      success = false;
    }

    await this.#tollPlazaPeriodRepo.update({
      where: { idTollPlazaPeriod },
      data: {
        status: success ? TollPlazaStatus.Done : TollPlazaStatus.Error
      }
    });
    logger.info('Finalizado importação da planilha valores da praça');
  }

  #parseValue = (value) => value.includes('.')
  ? value.replace(/[^\d.]+/g, '')
  : value.replace(/\D/g, '')

  #formatRow = (row, idTollPlazaPeriod) => {
    const value = this.#parseValue(row[9]).trim();
    return {
      associateCompany: row[2],
      metadata: {
        entryId: Number.parseInt(row[3]) || row[3],
      },
      highway: row[4],
      km: row[5]?.toString(),
      fullRoadName: row[6],
      category: Number.parseInt(row[7]),
      value: value === '' ? null : value,
      idTollPlazaPeriod,
    }
  };
}
