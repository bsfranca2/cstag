export class ListHeadquartersUseCase {
  #companyRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#companyRepo = repository.company;
  }

  async execute() {
    return await this.#companyRepo.findMany({
      where: { idHeadquarter: { equals: null } },
      orderBy: { name: 'asc' },
    });
  }
}
