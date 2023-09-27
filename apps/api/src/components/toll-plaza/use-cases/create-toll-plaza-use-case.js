export class CreateTollPlazaUseCase {
  #tollPlazaRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tollPlazaRepo = repository.tollPlaza;
  }

  async execute({ tollPlazaPeriodId, ...data }) {
    await this.#tollPlazaRepo.create({
      data: {
        ...data,
        tollPlazaPeriod: {
          connect: {
            id: tollPlazaPeriodId,
          },
        },
      },
    });
  }
}
