export class ListTollPlazasUseCase {
  #tollPlazaRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tollPlazaRepo = repository.tollPlaza;
  }

  #buildQuery({ tollPlazaPeriodId, fullRoadName }, { page, perPage }) {
    const where = {};
    if (tollPlazaPeriodId) {
      where.tollPlazaPeriod = {
        id: tollPlazaPeriodId,
      };
    }
    if (fullRoadName && fullRoadName.length > 0) {
      where.fullRoadName = {
        contains: fullRoadName,
        mode: 'insensitive',
      };
    }
    return {
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        idTollPlaza: 'asc',
      },
    };
  }

  async execute({ filters, pagination }) {
    const query = this.#buildQuery(filters, pagination);
    const tollPlazas = await this.#tollPlazaRepo.findMany(query);
    const tollPlazasTotal = await this.#tollPlazaRepo.count({
      where: query.where,
    });
    return {
      ...pagination,
      totalRowCount: tollPlazasTotal,
      data: tollPlazas,
    };
  }
}
