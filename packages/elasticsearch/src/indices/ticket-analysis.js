import { keyword, text, integer, scaledFloat, date } from './property-type.js';

const ticket = {
  properties: {
    licensePlate: keyword,
    category: integer,
    highway: text,
    fare: scaledFloat,
    paidAt: date,
    invoice: keyword,
    operatorCompany: keyword,
    type: keyword,
  },
};

const vehicle = {
  properties: {
    total: integer,
    suspended: integer,
  },
};

const tollPlaza = {
  properties: {
    fullRoadName: text,
    value: scaledFloat,
  },
};

export const name = 'ticket-analysis';

export const mapping = {
  properties: {
    tenant: keyword,
    id: keyword,
    resultType: keyword,
    value: scaledFloat,
    company: keyword,
    ticket,
    vehicle,
    tollPlaza,
  },
};
