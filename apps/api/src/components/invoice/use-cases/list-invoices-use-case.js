export class ListInvoicesUseCase {
  #invoiceRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#invoiceRepo = repository.invoice;
  }

  async execute({ idCompany }) {
    const invoices = await this.#invoiceRepo.findMany({
      where: {
        idCompany,
      },
      include: {
        progress: true,
      },
    });

    // prisma nao tem suporte ao order by em campos json
    /// TODO: adicionar issueDate como campo da tabela, e nao do metadata
    return invoices
      .map((i) => this.#formatInvoice(i))
      .sort(
        (a, b) =>
          new Date(a.metadata.issueDate) - new Date(b.metadata.issueDate)
      );
  }

  #formatInvoice = (invoice) => ({
    id: invoice.id,
    identifier: invoice.identifier,
    operatorCompany: invoice.operatorCompany,
    metadata: invoice.metadata,
    progress: this.#getProgress(invoice.progress),
    createdAt: invoice.createdAt,
  });

  #getProgress({ tickets, ticketsDone, trips, tripsDone }) {
    if (ticketsDone === 0 && tripsDone === 0) {
      return { isDone: false, percentage: 0 };
    }

    const workPercentage =
      ((ticketsDone + tripsDone) * 100) / (tickets + trips);
    const importPercentage = tickets !== 0 || trips !== 0 ? 1 : 0;
    return {
      isDone: tickets === ticketsDone && trips === tripsDone,
      percentage:
        workPercentage === 0
          ? Number.parseInt(importPercentage)
          : Number.parseInt(importPercentage + (workPercentage - 1)),
    };
  }
}
