export class UpdateTollPlazaUseCase {
  #tollPlazaRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tollPlazaRepo = repository.tollPlaza;
  }

  async execute({ tollPlazaId, ...data }) {
    await this.#tollPlazaRepo.update({
      where: {
        id: tollPlazaId,
      },
      data,
    });
  }
}
