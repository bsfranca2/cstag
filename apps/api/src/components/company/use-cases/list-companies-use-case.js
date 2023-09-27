export class ListCompaniesUseCase {
  #companyRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#companyRepo = repository.company;
  }

  async execute() {
    return await this.#companyRepo.findMany({
      include: {
        headquarter: true,
      },
      orderBy: [{ name: 'asc' }],
    });
  }
}
