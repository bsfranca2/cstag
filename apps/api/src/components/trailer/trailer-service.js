import xlsx from 'node-xlsx';
import { Service } from '../../db/index.js';
import { LicensePlate } from '../vehicle/license-plate.js';
import { getArtespId } from '../vehicle/vehicle-category.js';

export class VehicleService extends Service {
  async list(idCompany) {
    const items = await this.db.trailer.findMany({
      where: {
        idCompany,
      },
    });
    return items.map(({ idTrailer, idCompany, ...i }) => i);
  }

  async importSheet(idCompany, file) {
    const workbook = xlsx.parse(file.buffer);
    const data = workbook[0].data
      .map((r) => ({
        idCompany,
        firstLicensePlate: r[0]?.toString(),
        secondLicensePlate: r[1]?.toString(),
        thirdLicensePlate: r[2]?.toString(),
        kindOfEquipment: r[4]?.toString(),
        model: r[4]?.toString(),
        axlesTotal: getArtespId(r[5]),
        axlesSuspended: getArtespId(r[6]),
      }))
      .filter((r) => LicensePlate.isValid(r.firstLicensePlate));
    await this.db.trailer.createMany({ data });
  }
}
