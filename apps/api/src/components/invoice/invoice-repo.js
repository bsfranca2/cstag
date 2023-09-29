import assignIn from 'lodash.assignin';

/** @param {import("@cstag/db").PrismaClient} prismaRepository */
export const composeInvoiceRepo = (prismaRepository) => {
  const repository = {
    /**
     * @desc Retornar todas as viagens de vale pedagio de uma fatura
     * @param {string} invoiceId
     * @returns {Promise<string[]>}
     */
    findTrips: async (invoiceId) => {
      const trips = await prismaRepository.$executeRaw`
      SELECT DISTINCT tt.trip FROM tb_ticket tt
      INNER JOIN tb_invoice ti ON ti.id_invoice = tt.id_invoice
      WHERE ti.id = ${invoiceId} AND tt.trip IS NOT NULL
      UNION SELECT DISTINCT ttvc.trip FROM tb_toll_valley_credit ttvc
      INNER JOIN tb_invoice ti ON ti.id_invoice = ttvc.id_invoice
      WHERE ti.id = ${invoiceId} AND ttvc.trip IS NOT NULL`;
      return trips.map((i) => i.trip);
    },
  };
  return assignIn(repository, prismaRepository.invoice);
};
