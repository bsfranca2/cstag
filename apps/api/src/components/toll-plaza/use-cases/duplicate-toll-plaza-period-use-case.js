import { TollPlazaPeriodNotFoundError } from '../toll-plaza-errors.js';
import { composeTollPlazaPeriodRepo } from '../toll-plaza-period-repo.js';
import * as TollPlazaStatus from '../toll-plaza-status.js';

export class DuplicateTollPlazaPeriodUseCase {
  #tollPlazaPeriodRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tollPlazaPeriodRepo = composeTollPlazaPeriodRepo(repository);
  }

  async execute({ tollPlazaPeriodId, ...data }) {
    const tollPlazaPeriodFrom = await this.#tollPlazaPeriodRepo.findUnique({
      where: { id: tollPlazaPeriodId },
    });
    if (!tollPlazaPeriodFrom) {
      throw new TollPlazaPeriodNotFoundError(tollPlazaPeriodId);
    }
    const { idTollPlazaPeriod: idTo } = await this.#tollPlazaPeriodRepo.create({
      data: {
        ...data,
        status: TollPlazaStatus.UnderImplementation,
      },
    });
    await this.#tollPlazaPeriodRepo.duplicateTollPlazas(
      tollPlazaPeriodFrom.idTollPlazaPeriod,
      idTo
    );
    await this.#tollPlazaPeriodRepo.update({
      where: {
        idTollPlazaPeriod: idTo,
      },
      data: {
        status: TollPlazaStatus.Done,
      },
    });
  }
}
