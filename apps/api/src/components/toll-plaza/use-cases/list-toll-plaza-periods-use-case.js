export class ListTollPlazaPeriodsUseCase {
  #tollPlazaPeriodRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tollPlazaPeriodRepo = repository.tollPlazaPeriod;
  }

  async execute() {
    return await this.#tollPlazaPeriodRepo.findMany({
      orderBy: [{ inactived: 'asc' }, { startAt: 'desc' }, { endAt: 'desc' }],
    });
  }
}
