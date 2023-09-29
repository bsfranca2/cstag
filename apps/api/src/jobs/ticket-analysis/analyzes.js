import find from './algorithm/toll-plaza-find.js';
import { getTollPlazaList, getVehicleAxles } from './query.js';

/// TODO Alterar caso nao tenha divergencia na placa procurar por divergencia no veiculo
/// TODO Adicionar cache na procura da praca

export const composeAnalyze = (db) => {
  return async (ticket) => {
    const analysis = await analyzeTollPlaza(db, ticket);
    const axlAnalysis = await analyzeAxles(db, ticket);
    if (analysis) {
      return { ...analysis, idAxl: axlAnalysis.idAxl };
    }
    return axlAnalysis;
  };
};

export async function analyzeTollPlaza(db, ticket) {
  try {
    const tollPlazaList = await getTollPlazaList(db, ticket.category);
    const { tollPlaza } = find(ticket.highway, tollPlazaList);
    const divergence = { resultType: null, value: null };
    if (tollPlaza.value !== ticket.fare) {
      divergence.resultType =
        tollPlaza.value > ticket.fare ? 'Positive' : 'Negative';
      divergence.value =
        tollPlaza.value > ticket.fare
          ? tollPlaza.value - ticket.fare
          : ticket.fare - tollPlaza.value;
    }
    return {
      ...divergence,
      idTollPlaza: tollPlaza.idTollPlaza,
      idTicket: ticket.idTicket,
      idAxl: null,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function analyzeAxles(db, ticket) {
  const { idTicket, licensePlate, category, paidAt, idCompany } = ticket;
  const axles = await getVehicleAxles(db, idCompany, licensePlate);
  const axl = axles.find(
    ({ startAt, endAt }) =>
      (startAt < paidAt || startAt.valueOf() === paidAt.valueOf()) &&
      (endAt === null ||
        endAt > paidAt ||
        endAt?.valueOf() === paidAt.valueOf())
  );
  if (axl && category !== axl.total && category !== axl.suspended) {
    return {
      value: 0,
      resultType: 'Neutral',
      idTollPlaza: null,
      idAxl: axl.idAxl,
      idTicket,
    };
  }
  return {
    value: null,
    resultType: null,
    idTollPlaza: null,
    idAxl: axl?.idAxl,
    idTicket,
  };
}
