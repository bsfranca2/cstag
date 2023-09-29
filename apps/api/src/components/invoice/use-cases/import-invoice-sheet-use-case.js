import XlsxStreamReader from 'xlsx-stream-reader';
import { sendToQueue } from '../../../jobs/index.js'
import { queues } from '../../../jobs/queues.js';
import { getObject } from '../../../utils/storage.js'

export class ImportInvoiceSheetUseCase {
  #invoiceRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#invoiceRepo = repository.invoice;
  }

  async execute({
    tenant,
    idCompany,
    bucketName,
    objectName,
    operatorCompany,
  }) {
    const fileStream = await getObject(bucketName, objectName);
    const { identifier, issueDate } = await this.#getIdentification(fileStream);

    const exists = await this.#invoiceRepo.findFirst({
      where: {
        idCompany,
        identifier,
      },
    });
    if (exists) {
      throw new Error(
        `Fatura com o identificador ${exists.identifier} ja importada`
      );
    }
    const { id } = await this.#invoiceRepo.create({
      data: {
        idCompany,
        identifier,
        operatorCompany,
        metadata: {
          issueDate,
        },
        progress: {
          create: {
            tickets: 0,
            trips: 0,
          },
        },
        source: 'Sheet',
      },
    });

    await sendToQueue(queues.invoice, { tenant, id, bucketName, objectName });
  }

  #getIdentification = async (fileStream) => {
    return new Promise((resolve, reject) => {
      const data = {};
      const workBookReader = new XlsxStreamReader();
      const invoiceSummarySheetIndex = 1;

      workBookReader.on('error', (error) => reject(error));

      workBookReader.on('worksheet', function (workSheetReader) {
        if (Number.parseInt(workSheetReader.id) !== invoiceSummarySheetIndex) {
          workSheetReader.skip();
          return;
        }

        workSheetReader.on('row', function (row) {
          if (row.attributes.r !== '2' && row.attributes.r !== '4') {
            return;
          }

          if (row.attributes.r === '2') {
            data.identifier = row.values[2]?.toString();
          }

          if (row.attributes.r === '4') {
            const [month, days, year] = row.values[2]
              .split('/')
              .map((value) =>
                Number.parseInt(value) > 9 ? value : `0${value}`
              );
            const fullYear = year.length === 2 ? `20${year}` : year;
            data.issueDate = new Date(
              `${fullYear}-${month}-${days}T00:00:00.000-03:00`
            );
          }
        });

        workSheetReader.process();
      });
      workBookReader.on('end', function () {
        resolve(data);
      });

      fileStream.pipe(workBookReader);
    });
  };
}
