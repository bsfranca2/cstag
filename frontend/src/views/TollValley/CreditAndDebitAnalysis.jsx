import { Card, Pagination, Row } from 'antd';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import request from '../../utils/request';
import Table from './CreditTable';
import Filter from './CreditFilter';
import Statistics from './CreditStatistics';

export default function CreditAnalysis() {
  const [pagination, setPagination] = useState({
    perPage: 10,
    page: 1,
  });

  const [filters, setFilters] = useState({});

  const fetchCreditDebitAnalysisSearch = (data, params) =>
    request
      .post('/analyzes/credit-debit-analysis/search', data, { params })
      .then((res) => res.data);

  const { data, isLoading } = useQuery(
    ['creditDebitAnalysisSearch', pagination, filters],
    () =>
      fetchCreditDebitAnalysisSearch(filters, {
        ...pagination,
        page: pagination.page - 1,
      })
  );

  const list = data ? data.list : [];
  const total = (data && data.total) ?? 0;

  const onFilter = ({ divergence, operatorCompany, period, ...rest }) => {
    setFilters({
      ...rest,
      divergence: divergence === 'All' ? undefined : divergence,
      startOfPeriod: period[0] ? period[0].format('YYYY-MM-DD') : null,
      endOfPeriod: period[1] ? period[1].format('YYYY-MM-DD') : null,
    });
  };

  return (
    <>
      <Card>
        <Filter loading={isLoading} onFilter={onFilter} />
      </Card>
      <div style={{ marginBottom: 24 }} />
      <Card>
        <Statistics filters={filters} />
      </Card>
      <div style={{ marginBottom: 24 }} />
      <Card>
        <Table data={list} isLoading={isLoading} />
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
