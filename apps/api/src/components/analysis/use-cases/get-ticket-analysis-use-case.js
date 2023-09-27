const formatTicket = (ticket) => {
  return {
    id: ticket.id,
    category: ticket.category,
    paidAt: ticket.paidAt,
    fare: ticket.fare,
    licensePlate: ticket.licensePlate,
    highway: ticket.highway,
    metadata: ticket.metadata,
    trip: ticket.trip,
    type: ticket.type,
    invoice: {
      id: ticket.invoice.id,
      identifier: ticket.invoice.identifier,
      operatorCompany: ticket.invoice.operatorCompany,
      source: ticket.invoice.source,
    },
  };
};

const formatTollPlaza = (tollPlaza) => {
  if (!tollPlaza) {
    return null;
  }
  return {
    id: tollPlaza.id,
    fullRoadName: tollPlaza.fullRoadName,
    category: tollPlaza.category,
    value: tollPlaza.value,
    associateCompany: tollPlaza.associateCompany,
    metadata: tollPlaza.metadata,
    startAt: tollPlaza.tollPlazaPeriod.startAt,
    endAt: tollPlaza.tollPlazaPeriod.endAt,
  };
};

const formatVehicle = (axl) => {
  if (!axl) {
    return null;
  }
  return {
    id: axl.vehicle.id,
    licensePlate: axl.vehicle.licensePlate,
    brand: axl.vehicle.brand,
    model: axl.vehicle.model,
    year: axl.vehicle.year,
    description: axl.vehicle.description,
    startAt: axl.startAt,
    endAt: axl.endAt,
    total: axl.total,
    suspended: axl.suspended,
  };
};

const formatAnalysis = (analysis) => {
  const {
    ticket,
    tollPlaza,
    axl,
    id,
    createdAt,
    updatedAt,
    resultType,
    value,
  } = analysis;
  return {
    id,
    createdAt,
    updatedAt,
    resultType,
    value,
    ticket: formatTicket(ticket),
    tollPlaza: formatTollPlaza(tollPlaza),
    vehicle: formatVehicle(axl),
  };
};

export class GetTicketAnalysisUseCase {
  #ticketAnalysisRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#ticketAnalysisRepo = repository.ticketAnalysis;
  }

  async execute({ ticketAnalysisId: id }) {
    const item = await this.#ticketAnalysisRepo.findFirst({
      where: { id },
      include: {
        ticket: {
          include: {
            invoice: true,
          },
        },
        tollPlaza: {
          include: {
            tollPlazaPeriod: true,
          },
        },
        axl: {
          include: {
            vehicle: true,
          },
        },
      },
    });
    return formatAnalysis(item);
  }
}
