export class ListLicensePlatesUseCase {
  #vehicleRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#vehicleRepo = repository.vehicle;
  }

  async execute({ idCompany }) {
    const items = await this.#vehicleRepo.findMany({
      distinct: ['licensePlate'],
      select: {
        licensePlate: true,
      },
      where: {
        idCompany,
      },
    });
    return items.map((i) => i.licensePlate);
  }
}
