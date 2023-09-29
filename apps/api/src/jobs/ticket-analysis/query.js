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
