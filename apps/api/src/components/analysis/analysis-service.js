// TODO: Remove elasticsearch
import { getClient } from '@cstag/elasticsearch';
import { Service } from '../../db/index.js';
const formatDate = (date) => {
  // Date format YYYY-MM-DD
  if (!date) return null;
  return new Date(`${date}T00:00:00.000-03:00`);
};

/// TODO: Add tenant to query
export class AnalysisService extends Service {
  async searchTicket(company, params) {
    const client = await getClient();
    const {
      idInvoice,
      licensePlate,
      divergence,
      startAt,
      endAt,
      operatorCompany,
      term,
      ticketType,
    } = params;
    const page = Number.parseInt(params.page) || 1;
    const perPage = Number.parseInt(params.perPage) || 20;

    const sort =
      term && term.trim() !== '' ? [] : [{ 'ticket.paidAt': 'desc' }];
    const query = {
      filter: [{ term: { company } }],
    };

    if (idInvoice) {
      query.filter.push({ term: { 'ticket.idInvoice': idInvoice } });
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
        dateFilter['ticket.paidAt'].gte = formatDate(startAt);
      }
      if (endAt) {
        dateFilter['ticket.paidAt'].lte = formatDate(endAt);
      }
      query.must = { ...query.must, range: dateFilter };
    }

    const result = await client.search({
      index: 'ticket-analysis',
      track_total_hits: true,
      size: perPage,
      from: (page - 1) * perPage,
      sort,
      query: {
        bool: query,
      },
    });

    return {
      page,
      perPage,
      total: result.hits.total.value,
      list: result.hits.hits.map((item) => item._source),
    };
  }

  async searchTrip(company, params) {
    const client = await getClient();
    const {
      statistics = false,
      trip,
      licensePlate,
      divergence,
      startAt,
      endAt,
    } = params;
    const query = {
      filter: [{ term: { company } }],
    };

    if (trip) {
      query.filter.push({ term: { trip } });
    }
    if (licensePlate) {
      query.filter.push({ term: { licensePlate } });
    }
    if (divergence) {
      if (divergence === 'Credit/Debit') {
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
        range.startAt = { gte: formatDate(startAt) };
      }
      if (endAt) {
        range.endAt = { lte: formatDate(endAt) };
      }
      query.must = { ...query.must, range };
    }

    if (statistics) {
      const {
        aggregations: {
          graph: { buckets },
          totalDebit: { value: totalDebit },
          totalCredit: { value: totalCredit },
        },
        hits: {
          total: { value: total },
        },
      } = await client.search({
        index: 'trip-analysis',
        size: 0,
        track_total_hits: true,
        query: {
          bool: query,
        },
        aggregations: {
          graph: {
            terms: {
              field: 'resultType',
            },
          },
          totalDebit: {
            sum: {
              field: 'debit',
            },
          },
          totalCredit: {
            sum: {
              field: 'credit',
            },
          },
        },
      });
      const { Credit: positive = 0, Debit: negative = 0 } = buckets.reduce(
        (pv, cv) => {
          pv[cv.key] = cv.doc_count;
          return pv;
        },
        {}
      );
      return {
        totalOfDebit: totalDebit,
        totalOfCredit: totalCredit,
        numberOfAnalyzes: total,
        totalOfDifference: Math.abs(totalCredit - totalDebit),
        graph: {
          positive,
          negative,
        },
      };
    }

    const page = Number.parseInt(params.page) || 1;
    const perPage = Number.parseInt(params.perPage) || 20;
    const pagination = { size: perPage, from: (page - 1) * perPage };
    const sort = [{ endAt: 'desc' }, { trip: 'asc' }];
    const result = await client.search({
      ...pagination,
      index: 'trip-analysis',
      track_total_hits: true,
      sort,
      query: {
        bool: query,
      },
    });
    return {
      page,
      perPage,
      total: result.hits.total.value,
      list: result.hits.hits.map((item) => item._source),
    };
  }

  async getTicketStatistics(company) {
    const client = await getClient();
    const {
      aggregations: {
        positive: { buckets },
      },
      hits: {
        total: { value: total },
      },
    } = await client.search({
      index: 'ticket-analysis',
      size: 0,
      track_total_hits: true,
      query: {
        bool: {
          filter: [
            {
              term: {
                company,
              },
            },
          ],
        },
      },
      aggregations: {
        positive: {
          terms: {
            field: 'resultType',
          },
          aggs: {
            totalValue: {
              sum: {
                field: 'value',
              },
            },
          },
        },
      },
    });
    const { Positive = 0, Negative = 0 } = buckets.reduce((pv, cv) => {
      pv[cv.key] = cv.totalValue.value;
      return pv;
    }, {});
    const { Positive: positiveCount = 0, Negative: negativeCount = 0 } =
      buckets.reduce((pv, cv) => {
        pv[cv.key] = cv.doc_count;
        return pv;
      }, {});
    /// TODO: add math lib for totalOfDifference
    return {
      totalOfDebit: Negative,
      totalOfCredit: Positive,
      numberOfAnalyzes: total,
      totalOfDifference: Math.abs(Positive - Negative),
      graph: {
        positive: positiveCount,
        negative: negativeCount,
      },
    };
  }

  async dashboard(company) {
    const ticket = await this.getTicketStatistics(company);
    const trip = await this.searchTrip(company, { statistics: true });

    const graphPositive = ticket.graph.positive + trip.graph.positive;
    const graphNegative = ticket.graph.negative + trip.graph.negative;
    const numberOfAnalyzes = ticket.numberOfAnalyzes + trip.numberOfAnalyzes;

    return {
      totalOfDebit: ticket.totalOfDebit + trip.totalOfDebit,
      totalOfCredit: ticket.totalOfCredit + trip.totalOfCredit,
      totalOfDifference: ticket.totalOfDifference + trip.totalOfDifference,
      numberOfAnalyzes,
      graph: {
        positive: graphPositive,
        negative: graphNegative,
        neutral: numberOfAnalyzes - (graphPositive + graphNegative),
      },
    };
  }
}
