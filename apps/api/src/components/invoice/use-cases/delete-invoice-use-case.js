import { sendToQueue, queues } from '@cstag/amqp';
import { deleteByQuery, indicies } from '@cstag/elasticsearch';
import { composeInvoiceRepo } from '../invoice-repo.js';

export class DeleteInvoiceUseCase {
  #invoiceRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#invoiceRepo = composeInvoiceRepo(repository);
  }

  // Por enquanto resolve, mas e lento dessa forma
  async execute({ tenant, companyCNPJ, invoiceId }) {
    const trips = await this.#invoiceRepo.findTrips(invoiceId);

    const { identifier } = await this.#invoiceRepo.delete({
      where: {
        id: invoiceId,
      },
    });

    await deleteByQuery({
      index: indicies.ticketAnalysis.name,
      refresh: true,
      query: {
        bool: {
          filter: [
            { term: { tenant } },
            { term: { company: companyCNPJ } },
            { term: { 'ticket.idInvoice': identifier } },
          ],
        },
      },
    });

    await Promise.all(
      trips.map((trip) =>
        sendToQueue(queues.tripAnalysis, { tenant, invoiceId, trip })
      )
    );
  }
}
