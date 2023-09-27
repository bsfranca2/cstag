export class UpdateTollPlazaPeriodUseCase {
  #tollPlazaPeriodRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tollPlazaPeriodRepo = repository.tollPlazaPeriod;
  }

  async execute({ tollPlazaPeriodId, ...data }) {
    await this.#tollPlazaPeriodRepo.update({
      where: { id: tollPlazaPeriodId },
      data,
    });
  }
}
