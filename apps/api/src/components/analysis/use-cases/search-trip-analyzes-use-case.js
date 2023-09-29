// TODO: Remove elasticsearch
import { search, buildTripAnalyzesQuery } from '@cstag/elasticsearch';

export class SearchTripAnalyzesUseCase {
  async execute({ statistics = false, ...data }) {
    const pagination = {
      page: Number.parseInt(data.page) || 1,
      perPage: Number.parseInt(data.perPage) || 20,
    };
    const query = buildTripAnalyzesQuery(data, pagination);

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
      } = await search({
        ...query,
        size: 0,
        track_total_hits: true,
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

    const { hits } = await search({
      ...query,
      track_total_hits: true,
    });

    return {
      ...pagination,
      total: hits.total.value,
      list: hits.hits.map((item) => item._source),
    };
  }
}
