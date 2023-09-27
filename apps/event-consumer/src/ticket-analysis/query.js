import { getClient, indicies } from '@cstag/elasticsearch';

/** @param {import("knex").Knex} db */
export const getTickets = (db, idInvoice, idTicket) => {
  const q = db
    .from('tb_ticket as tt')
    .join('tb_invoice as ti', 'ti.id_invoice', 'tt.id_invoice')
    .select(
      'tt.id_ticket as idTicket',
      'tt.license_plate as licensePlate',
      'tt.category',
      'tt.highway',
      'tt.fare',
      'tt.paid_at as paidAt',
      'ti.operator_company as operatorCompany',
      'ti.source',
      'ti.id_company as idCompany'
    );
  if (idInvoice) {
    q.where('ti.id_invoice', idInvoice);
  }
  if (idTicket) {
    q.where('tt.id', idTicket);
  }
  return q;
};

/** @param {import("knex").Knex} db */
export const getVehicleAxles = (db, idCompany, licensePlate) => {
  return db
    .from('tb_vehicle_axl as tva')
    .join('tb_vehicle as tv', 'tv.id_vehicle', 'tva.id_vehicle')
    .select(
      'tva.id_vehicle_axl as idAxl',
      'tva.total',
      'tva.suspended',
      'tva.start_at as startAt',
      'tva.end_at as endAt'
    )
    .where('tv.id_company', idCompany)
    .andWhere('tv.license_plate', licensePlate);
};

/** @param {import("knex").Knex} db */
export const getTollPlazaList = (db, category) => {
  const subquery = db
    .from('tb_toll_plaza as ttp')
    .select(
      'ttp.id_toll_plaza as idTollPlaza',
      'ttp.full_road_name as fullRoadName',
      'ttp.highway',
      'ttp.km',
      'ttp.value'
    )
    .where('ttp.category', category)
    .orderBy('ttp.value', 'desc');

  return db
    .from(subquery.as('subquery'))
    .distinctOn('fullRoadName')
    .select('idTollPlaza', 'fullRoadName', 'highway', 'km', 'value');
};

/** @param {import("knex").Knex} db */
export const getIdInvoice = (db, uidInvoice, idTicket) => {
  if (idTicket) {
    return db
      .from('tb_ticket as tt')
      .first('tt.id_invoice as idInvoice')
      .where('tt.id', idTicket);
  }

  return db
    .from('tb_invoice as ti')
    .first('ti.id_invoice as idInvoice')
    .where('ti.id', uidInvoice);
};

/** @param {import("knex").Knex} db */
export const transactionInsertAnalysis = async (db, idInvoice, data) => {
  const batch = data.map((i) => ({
    value: i.value,
    result_type: i.resultType,
    id_toll_plaza: i.idTollPlaza,
    id_vehicle_axl: i.idAxl,
    id_ticket: i.idTicket,
  }));
  return db.transaction(async (trx) => {
    const result = await trx.raw(
      `? on conflict ("id_ticket")
          do update set
          "value" = excluded."value",
          "result_type" = excluded."result_type",
          "id_toll_plaza" = excluded."id_toll_plaza",
          "id_vehicle_axl" = excluded."id_vehicle_axl",
          "updated_at" = timezone('utc'::text, now())
        returning "updated_at", "id_ticket_analysis"`,
      [trx('tb_ticket_analysis').insert(batch)]
    );
    const news = result.rows.reduce((pv, cv) => {
      return cv.updated_at ? pv - 1 : pv;
    }, data.length);
    await trx.raw(
      `begin; update tb_invoice_progress set tickets_done = tickets_done + ${news} where id_invoice = ${idInvoice}; commit;`
    );
    return result.rows.map((i) => i.id_ticket_analysis);
  });
};

const formatToES = (tenant) => (i) => ({
  tenant,
  id: i.id,
  resultType: i.resultType,
  value: i.value,
  company: i.company,
  ticket: {
    licensePlate: i.tLicensePlate,
    category: i.tCategory,
    highway: i.tHighway,
    fare: i.tFare,
    paidAt: i.tPaidAt,
    invoice: i.tIdInvoice,
    operatorCompany: i.tOperatorCompany,
    type: i.tType,
  },
  vehicle: i.idVehicleAxl
    ? {
        total: i.axlTotal,
        suspended: i.axlSuspended,
      }
    : null,
  tollPlaza: i.idTollPlaza
    ? {
        fullRoadName: i.tpFullRoadName,
        value: i.tpValue,
      }
    : null,
});

/** @param {import("knex").Knex} db */
export const getAnalysis = async (db, tenant, ids) => {
  const result = await db
    .from('tb_ticket_analysis as tta')
    .select(
      'tta.id',
      'tta.result_type as resultType',
      'tta.value',
      'tc.cnpj as company',
      'tt.license_plate as tLicensePlate',
      'tt.category as tCategory',
      'tt.highway as tHighway',
      'tt.fare as tFare',
      'tt.paid_at as tPaidAt',
      'ti.identifier as tIdInvoice',
      'ti.operator_company as tOperatorCompany',
      'tt.type as tType',
      'tva.total as axlTotal',
      'tva.suspended as axlSuspended',
      'ttp.full_road_name as tpFullRoadName',
      'ttp.value as tpValue',
      'tta.id_vehicle_axl as idVehicleAxl',
      'tta.id_toll_plaza as idTollPlaza'
    )
    .join('tb_ticket as tt', 'tt.id_ticket', 'tta.id_ticket')
    .join('tb_invoice as ti', 'ti.id_invoice', 'tt.id_invoice')
    .join('tb_company as tc', 'tc.id_company', 'ti.id_company')
    .leftJoin(
      'tb_vehicle_axl as tva',
      'tva.id_vehicle_axl',
      'tta.id_vehicle_axl'
    )
    .leftJoin('tb_toll_plaza as ttp', 'ttp.id_toll_plaza', 'tta.id_toll_plaza')
    .whereIn('tta.id_ticket_analysis', ids);
  return result.map(formatToES(tenant));
};

export const saveAnalysisES = async (data) => {
  const index = indicies.ticketAnalysis.name;
  const operations = data.flatMap((doc) => [
    { index: { _index: index, _id: `${doc.tenant}${doc.id}` } },
    doc,
  ]);
  const client = await getClient();
  await client.bulk({ refresh: true, operations });
};
