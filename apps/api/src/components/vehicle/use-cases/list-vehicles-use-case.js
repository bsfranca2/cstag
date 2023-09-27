export class ListVehiclesUseCase {
  #vehicleRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#vehicleRepo = repository.vehicle;
  }

  async execute({ idCompany }) {
    const items = await this.#vehicleRepo.findMany({
      where: {
        idCompany,
      },
      select: {
        id: true,
        createdAt: true,
        licensePlate: true,
        model: true,
        brand: true,
        year: true,
        description: true,
        axlesRegistries: {
          select: {
            id: true,
            createdAt: true,
            startAt: true,
            endAt: true,
            total: true,
            suspended: true,
          },
        },
        clientRegistries: {
          select: {
            id: true,
            createdAt: true,
            startAt: true,
            endAt: true,
            client: true,
            group: true,
            subgroup: true,
            segment: true,
          },
        },
      },
    });
    return items;
  }
}
