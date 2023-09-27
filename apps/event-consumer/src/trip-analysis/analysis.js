import Big from 'big.js';
import {
  deleteAnalysis,
  deleteAnalysisES,
  getCreditList,
  getIdAnalysis,
  getInvoice,
  getTicketList,
  insertAnalysis,
  saveAnalysisES,
  updateAnalysis,
} from './query.js';

/** @param {Array} list  */
const getPeriod = (list) => {
  const listSorted = list.sort((a, b) => a.date - b.date);
  return {
    startAt: listSorted[0].date,
    endAt: listSorted[listSorted.length - 1].date,
  };
};

const defaultDetails = {
  idInvoice: null,
  idCompany: null,
  companyCNPJ: null,
};

/**
 * @param {import("knex").Knex} db
 * @param {string} trip
 * @param {string} idInvoice
 */
export const analyze = async (db, tenant, uidInvoice, trip) => {
  const details = await getInvoice(db, uidInvoice);
  const { idInvoice, idCompany, companyCNPJ } = details || defaultDetails;
  const { idTripAnalysis } = (await getIdAnalysis(db, idCompany, trip)) || {};
  const ticketList = await getTicketList(db, idCompany, trip);
  const creditList = await getCreditList(db, idCompany, trip);

  if (ticketList.length === 0 && creditList.length === 0) {
    await deleteAnalysis(db, trip);
    await deleteAnalysisES(tenant, trip);
    return;
  }

  const transactions = ticketList.length + creditList.length;
  const licensePlate =
    ticketList.length > 0
      ? ticketList[0].licensePlate
      : creditList[0].licensePlate;
  const { startAt, endAt } = getPeriod([...ticketList, ...creditList]);
  const totalCredit = creditList.reduce(
    (acc, cur) => new Big(cur.value).plus(acc),
    new Big(0)
  );
  const totalDebit = ticketList.reduce(
    (acc, cur) => new Big(cur.value).plus(acc),
    new Big(0)
  );
  const difference = totalCredit.minus(totalDebit);
  let resultType = null;
  if (!difference.eq(0)) {
    resultType = difference.gt(0) ? 'Credit' : 'Debit';
  }
  const analysis = {
    id_company: idCompany,
    trip,
    difference: difference.abs().toString(),
    credit: totalCredit.toString(),
    debit: totalDebit.toString(),
    transactions,
    license_plate: licensePlate,
    start_at: startAt,
    end_at: endAt,
    result_type: resultType,
  };
  const [result] = idTripAnalysis
    ? await updateAnalysis(db, idTripAnalysis, analysis)
    : await insertAnalysis(db, idInvoice, analysis);
  await saveAnalysisES(tenant, { ...result, tenant, id_company: companyCNPJ });
};
