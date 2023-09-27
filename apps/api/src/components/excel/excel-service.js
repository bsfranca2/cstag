import { writeFile } from 'node:fs/promises';
import xlsx from 'node-xlsx';
import { Service } from '../../db/index.js';

const formatTicket = (ticketAnalysis) => {
  return ticketAnalysis.reduce(
    (pv, cv) => {
      const item = [
        cv.ticket.licensePlate,
        cv.ticket.paidAt,
        cv.ticket.highway,
        cv.ticket.fare.toString(),
        cv.tollPlaza?.value?.toString(),
        cv.tollPlaza?.fullRoadName,
        cv.ticket.category,
        cv.axl?.suspended,
        cv.axl?.total,
      ];
      if (cv.ticket.type === 'Ticket') {
        pv.ticket.push(item);
      } else {
        pv.tollValley.push(item);
      }
      return pv;
    },
    {
      ticket: [],
      tollValley: [],
    }
  );
};

const formatTrip = (tripAnalysis) => {
  return tripAnalysis.map((cv) => {
    const item = [
      cv.trip,
      cv.licensePlate,
      cv.resultType,
      cv.transactions.toString(),
      cv.debit.toString(),
      cv.credit.toString(),
      cv.difference.toString(),
    ];
    return item;
  });
};

export class VehicleService extends Service {
  /// TODO: refactor
  async download(idCompany) {
    const ticketAnalysis = await this.db.ticketAnalysis.findMany({
      where: {
        ticket: {
          invoice: {
            idCompany,
          },
        },
      },
      include: {
        ticket: true,
        tollPlaza: true,
        axl: true,
      },
      take: 10_000,
    });
    const tripAnalysis = await this.db.tripAnalysis.findMany({
      where: {
        idCompany,
      },
      take: 1000,
    });
    const { ticket, tollValley } = formatTicket(ticketAnalysis);
    const trip = formatTrip(tripAnalysis);
    const ticketHeader = [
      'Placa',
      'Data',
      'Praça pedágio',
      'Valor cobrado',
      'Valor tabela',
      'Praça tabela',
      'Cobrado',
      'Suspenso',
      'Carregado',
    ];
    const tripHeader = [
      'Viagem',
      'Placa',
      'Tipo',
      'Transações',
      'Total de débito',
      'Total de crédito',
      'Diferença',
    ];
    const workbook = [
      { name: 'PP Valor praca', data: [ticketHeader, ...ticket] },
      { name: 'VP Valor praca', data: [ticketHeader, ...tollValley] },
      { name: 'VP Credito Debito', data: [tripHeader, ...trip] },
    ];
    const filename = `/tmp/${idCompany}_${Date.now()}.xlsx`;
    const buffer = xlsx.build(workbook);
    await writeFile(filename, buffer);
    return filename;
  }
}
