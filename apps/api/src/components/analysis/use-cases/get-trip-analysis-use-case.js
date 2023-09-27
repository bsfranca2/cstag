export class GetTripAnalysisUseCase {
  #tripAnalysisRepo;
  #tollValleyCreditRepo;
  #ticketRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#tripAnalysisRepo = repository.tripAnalysis;
    this.#tollValleyCreditRepo = repository.tollValleyCredit;
    this.#ticketRepo = repository.ticket;
  }

  async execute({ tripAnalysisId: id }) {
    const analysis = await this.#tripAnalysisRepo.findFirst({ where: { id } });
    const creditList = await this.#tollValleyCreditRepo.findMany({
      where: {
        trip: analysis.trip,
        invoice: {
          idCompany: analysis.idCompany,
        },
      },
    });
    const ticketList = await this.#ticketRepo.findMany({
      where: {
        trip: analysis.trip,
        invoice: {
          idCompany: analysis.idCompany,
        },
      },
    });
    /// TODO: format result
    return {
      ...analysis,
      ticketList,
      creditList,
    };
  }
}
