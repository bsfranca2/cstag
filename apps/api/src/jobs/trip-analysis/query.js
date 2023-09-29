/** @param {import("knex").Knex} db */
export const getInvoice = (db, uidInvoice) => {
  return db
    .from('tb_invoice as ti')
    .first(
      'ti.id_invoice as idInvoice',
      'ti.id_company as idCompany',
      'tc.cnpj as companyCNPJ'
    )
    .join('tb_company as tc', 'tc.id_company', 'ti.id_company')
    .where('ti.id', uidInvoice);
};

/** @param {import("knex").Knex} db */
export const getIdAnalysis = (db, idCompany, trip) => {
  return db
    .from('tb_trip_analysis as tta')
    .where('tta.id_company', idCompany)
    .andWhere('tta.trip', trip)
    .first('tta.id_trip_analysis as idTripAnalysis');
};

/** @param {import("knex").Knex} db */
export const updateAnalysis = (db, idTripAnalysis, analysis) => {
  return db('tb_trip_analysis')
    .update({
      ...analysis,
      updated_at: db.raw(`timezone('utc'::text, now())`),
    })
    .where('id_trip_analysis', idTripAnalysis)
    .returning('*');
};

const waitingForUpdate = new Map();

/** @param {import("knex").Knex} db */
const updateProgress = async (db, idInvoice) => {
  const tripsSubquery = db
    .distinct('tt.trip')
    .from('tb_ticket as tt')
    .join('tb_invoice as ti', 'ti.id_invoice', 'tt.id_invoice')
    .where('ti.id_invoice', idInvoice)
    .whereNotNull('tt.trip')
    .union([
      db
        .distinct('ttvc.trip')
        .from('tb_toll_valley_credit as ttvc')
        .join('tb_invoice as ti', 'ti.id_invoice', 'ttvc.id_invoice')
        .where('ti.id_invoice', idInvoice)
        .whereNotNull('ttvc.trip'),
    ]);

  const [{ count }] = await db
    .count('*')
    .from('tb_trip_analysis')
    .whereIn('trip', tripsSubquery);

  const [{ trips, trips_done: tripsDone }] = await db('tb_invoice_progress')
    .update({ trips_done: Number.parseInt(count) })
    .where('id_invoice', idInvoice)
    .returning('*');

  if (tripsDone === trips) {
    clearInterval(waitingForUpdate.get(idInvoice));
    waitingForUpdate.delete(idInvoice);
  }
};

/** @param {import("knex").Knex} db */
export const insertAnalysis = (db, idInvoice, analysis) => {
  // solucao provisoria para atualizar progresso em pararelo
  if (!waitingForUpdate.has(idInvoice)) {
    waitingForUpdate.set(
      idInvoice,
      setInterval(() => updateProgress(db, idInvoice), 15_000)
    );
  }

  return db('tb_trip_analysis').insert(analysis).returning('*');
};

/** @param {import("knex").Knex} db */
export const getTicketList = (db, idCompany, trip) => {
  return db
    .from('tb_ticket as tt')
    .select(
      'tt.id_ticket as idTicket',
      'tt.license_plate as licensePlate',
      'tt.fare as value',
      'tt.paid_at as date'
    )
    .join('tb_invoice as ti', 'ti.id_invoice', 'tt.id_invoice')
    .where('ti.id_company', idCompany)
    .andWhere('tt.trip', trip);
};

/** @param {import("knex").Knex} db */
export const getCreditList = (db, idCompany, trip) => {
  return db
    .from('tb_toll_valley_credit as ttvc')
    .select(
      'ttvc.id_toll_valley_credit as idCredit',
      'ttvc.license_plate as licensePlate',
      'ttvc.value',
      'ttvc.received_at as date'
    )
    .join('tb_invoice as ti', 'ti.id_invoice', 'ttvc.id_invoice')
    .where('ti.id_company', idCompany)
    .andWhere('ttvc.trip', trip);
};

/** @param {import("knex").Knex} db */
export const deleteAnalysis = (db, trip) => {
  return db('tb_trip_analysis').where('trip', trip).del();
};
