import { Service } from '../../db/index.js';

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export class VehicleService extends Service {
  async listByYear(idCompany, year, category) {
    const query = {
      year,
      invoice: {
        idCompany,
      },
    };
    if (category && typeof category === 'number') {
      query.category = category;
    }
    const items = await this.db.monthlyPayment.findMany({ where: query });
    const group = new Map();
    items.forEach((item) => {
      const { licensePlate, month, value, category } = item;
      const groupItem = group.has(licensePlate)
        ? group.get(licensePlate)
        : { licensePlate, category };
      const monthProp = months[month - 1];
      /// TODO: add lib number
      groupItem[monthProp] = Number(value);
      group.set(licensePlate, groupItem);
    });
    const data = [...group.values()].sort((a, b) =>
      a.licensePlate.localeCompare(b.licensePlate)
    );
    const total = data.reduce(
      (acc, item) => {
        const {
          january = 0,
          february = 0,
          march = 0,
          april = 0,
          may = 0,
          june = 0,
          july = 0,
          august = 0,
          september = 0,
          october = 0,
          november = 0,
          december = 0,
        } = item;
        return {
          january: acc.january + january,
          february: acc.february + february,
          march: acc.march + march,
          april: acc.april + april,
          may: acc.may + may,
          june: acc.june + june,
          july: acc.july + july,
          august: acc.august + august,
          september: acc.september + september,
          october: acc.october + october,
          november: acc.november + november,
          december: acc.december + december,
        };
      },
      {
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        may: 0,
        june: 0,
        july: 0,
        august: 0,
        september: 0,
        october: 0,
        november: 0,
        december: 0,
      }
    );
    return { data, total };
  }
}
