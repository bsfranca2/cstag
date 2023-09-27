import { sendToQueue, queues } from '@cstag/amqp';
import * as TollPlazaStatus from '../toll-plaza-status.js';

export class ImportTollPlazaPeriodSheetUseCase {
  #tollPlazaPeriodRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tollPlazaPeriodRepo = repository.tollPlazaPeriod;
  }

  async execute({
    tenant,
    startAt,
    endAt,
    description,
    bucketName,
    objectName,
  }) {
    const { id } = await this.#tollPlazaPeriodRepo.create({
      data: {
        startAt,
        endAt,
        description,
        status: TollPlazaStatus.Pending,
      },
    });

    await sendToQueue(queues.tollPlaza, { tenant, id, bucketName, objectName });
  }
}
