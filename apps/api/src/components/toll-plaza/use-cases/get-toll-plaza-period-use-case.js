import { TollPlazaPeriodNotFoundError } from '../toll-plaza-errors.js';

export class GetTollPlazaPeriodUseCase {
  #tollPlazaPeriodRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tollPlazaPeriodRepo = repository.tollPlazaPeriod;
  }

  async execute({ tollPlazaPeriodId }) {
    const tollPlazaPeriod = await this.#tollPlazaPeriodRepo.findUnique({
      where: {
        id: tollPlazaPeriodId,
      },
    });
    if (!tollPlazaPeriod) {
      throw new TollPlazaPeriodNotFoundError(tollPlazaPeriodId);
    }
    return tollPlazaPeriod;
  }
}
