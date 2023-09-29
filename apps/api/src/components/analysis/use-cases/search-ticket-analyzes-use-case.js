// TODO: Remove elasticsearch
import { getClient, buildTicketAnalyzesQuery } from '@cstag/elasticsearch';

export class SearchTicketAnalyzesUseCase {
  async execute(data) {
    const client = await getClient();
    const pagination = {
      page: Number.parseInt(data.page) || 1,
      perPage: Number.parseInt(data.perPage) || 20,
    };

    const query = buildTicketAnalyzesQuery(data, pagination);
    const result = await client.search({
      ...query,
      track_total_hits: true,
    });

    return {
      ...pagination,
      total: result.hits.total.value,
      list: result.hits.hits.map((item) => item._source),
    };
  }
}
