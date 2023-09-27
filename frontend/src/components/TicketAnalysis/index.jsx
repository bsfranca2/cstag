import React, { useState } from 'react';
import { Card, Pagination, Row } from 'antd';
import { useQuery } from 'react-query';
import request from '../../utils/request';
import TicketAnalysisTable from './Table';
import TicketAnalysisFilter from './Filter';

export default function TicketAnalysis({ ticketType }) {
  const [pagination, setPagination] = useState({
    perPage: 10,
    page: 1,
  });

  const [filters, setFilters] = useState({});

  const fetchTicketAnalysisSearch = (data, params) =>
    request
      .post('/analyzes/ticket-analysis/search', data, { params })
      .then((res) => res.data);

  const { data, isLoading } = useQuery(
    ['ticketAnalysisSearch', ticketType, pagination, filters],
    () =>
      fetchTicketAnalysisSearch(
        { ...filters, ticketType },
        {
          ...pagination,
          page: pagination.page - 1,
        }
      )
  );

  const list = data ? data.list : [];
  const total = (data && data.total) ?? 0;

  const onFilter = ({ divergence, operatorCompany, period, ...rest }) => {
    setFilters({
      ...rest,
      divergence: divergence === 'All' ? undefined : divergence,
      operatorCompany: operatorCompany === 'All' ? undefined : operatorCompany,
      startOfPeriod: period[0] ? period[0].format('YYYY-MM-DD') : null,
      endOfPeriod: period[1] ? period[1].format('YYYY-MM-DD') : null,
    });
  };

  return (
    <>
      <Card>
        <TicketAnalysisFilter loading={isLoading} onFilter={onFilter} />
      </Card>
      <div style={{ marginBottom: 24 }} />
      <Card>
        <TicketAnalysisTable data={list} isLoading={isLoading} />
        <Row style={{ marginTop: 24 }} justify='end'>
          <Pagination
            current={pagination.page}
            pageSize={pagination.perPage}
            total={total}
            onChange={(page, perPage) => setPagination({ page, perPage })}
            onShowSizeChange={(_, size) =>
              setPagination({ ...pagination, perPage: size })
            }
          />
        </Row>
      </Card>
    </>
  );
}
