// TODO: Refactor storage
import { getObject } from '@cstag/core/storage';
import { getWorkbookData, getWorkbookStream } from '../../../utils/xlsx.js';
import { LicensePlate } from '../license-plate.js';
import { getArtespId } from '../vehicle-category.js';

export class ImportVehicleSheetUseCase {
  #vehicleRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#vehicleRepo = repository.vehicle;
  }

  async execute({ idCompany, bucketName, objectName, startAt, endAt }) {
    const fileStream = await getObject(bucketName, objectName);
    const workBookReader = getWorkbookData(fileStream);
    const workBookStream = getWorkbookStream(workBookReader);
    const data = [];
    for await (const { row: r } of workBookStream) {
      if (!LicensePlate.isValid(r[1]?.toString())) continue;
      data.push({
        idCompany,
        licensePlate: r[1]?.toString(),
        description: r[2]?.toString(),
        brand: r[3]?.toString(),
        model: r[4]?.toString(),
        year: Number.parseInt(r[5]) || null,
        axlesRegistries: {
          create: [
            {
              total: getArtespId(r[6]),
              suspended: getArtespId(r[7]),
              startAt,
              endAt,
            },
          ],
        },
        clientRegistries: {
          create: [
            {
              client: r[8]?.toString(),
              segment: r[9]?.toString(),
              startAt,
              endAt,
            },
          ],
        },
      });
    }
    await Promise.all(
      data.map((item) => this.#vehicleRepo.create({ data: item }))
    );
  }
}
