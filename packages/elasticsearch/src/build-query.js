import { indicies } from './indices/index.js';

export const buildTicketAnalyzesQuery = (options, pagination) => {
  const {
    tenant,
    company,
    invoice,
    licensePlate,
    divergence,
    startAt,
    endAt,
    operatorCompany,
    term,
    ticketType,
  } = options;
  const page = pagination.page || 1;
  const perPage = pagination.perPage || 20;
  const sort = term && term.trim() !== '' ? [] : [{ 'ticket.paidAt': 'desc' }];
  const query = {
    filter: [{ term: { tenant } }, { term: { company } }],
  };

  if (invoice) {
    query.filter.push({ term: { 'ticket.invoice': invoice } });
  }
  if (licensePlate) {
    query.filter.push({ term: { 'ticket.licensePlate': licensePlate } });
  }
  if (operatorCompany) {
    query.filter.push({
      term: { 'ticket.operatorCompany': operatorCompany },
    });
  }
  if (ticketType) {
    query.filter.push({ term: { 'ticket.type': ticketType } });
  }
  if (divergence) {
    if (divergence === 'With') {
      query.filter.push({
        terms: { resultType: ['Neutral', 'Positive', 'Negative'] },
      });
    } else if (divergence === 'Without') {
      query.must_not = { exists: { field: 'resultType' } };
    } else {
      query.filter.push({ term: { resultType: divergence } });
    }
  }
  if (term && term.trim() !== '') {
    query.must = {
      multi_match: {
        query: term,
        fields: ['ticket.highway', 'tollPlaza.fullRoadName'],
      },
    };
  }
  if (startAt || endAt) {
    const dateFilter = { 'ticket.paidAt': {} };
    if (startAt) {
      dateFilter['ticket.paidAt'].gte = startAt;
    }
    if (endAt) {
      dateFilter['ticket.paidAt'].lte = endAt;
    }
    query.must = { ...query.must, range: dateFilter };
  }

  return {
    index: indicies.ticketAnalysis.name,
    size: perPage,
    from: (page - 1) * perPage,
    sort,
    query: {
      bool: query,
    },
  };
};

export const buildTripAnalyzesQuery = (options, pagination) => {
  const { tenant, company, trip, licensePlate, divergence, startAt, endAt } =
    options;
  const query = {
    filter: [{ term: { tenant } }, { term: { company } }],
  };

  if (trip) {
    query.filter.push({ term: { trip } });
  }
  if (licensePlate) {
    query.filter.push({ term: { licensePlate } });
  }
  if (divergence) {
    if (divergence === 'With') {
      query.filter.push({ terms: { resultType: ['Credit', 'Debit'] } });
    } else if (divergence === 'Without') {
      query.must_not = { exists: { field: 'resultType' } };
    } else {
      query.filter.push({ term: { resultType: divergence } });
    }
  }
  if (startAt || endAt) {
    const range = {};
    if (startAt) {
      range.startAt = { gte: startAt };
    }
    if (endAt) {
      range.endAt = { lte: endAt };
    }
    query.must = { ...query.must, range };
  }

  const { page, perPage } = pagination;
  const sort = [{ endAt: 'desc' }, { trip: 'asc' }];
  return {
    index: indicies.tripAnalysis.name,
    size: perPage,
    from: (page - 1) * perPage,
    sort,
    query: {
      bool: query,
    },
  };
};
