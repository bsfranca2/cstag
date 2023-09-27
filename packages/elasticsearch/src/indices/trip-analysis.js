import { keyword, integer, scaledFloat, date } from './property-type.js';

export const name = 'trip-analysis';

export const mapping = {
  properties: {
    tenant: keyword,
    id: keyword,
    resultType: keyword,
    company: keyword,
    trip: keyword,
    licensePlate: keyword,
    transactions: integer,
    difference: scaledFloat,
    debit: scaledFloat,
    credit: scaledFloat,
    startAt: date,
    endAt: date,
  },
};
