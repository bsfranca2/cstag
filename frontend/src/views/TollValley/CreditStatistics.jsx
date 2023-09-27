import { message, Space, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import request from '../../utils/request';

const fetchCreditDebitStatistics = (data) =>
  request
    .post('/analyzes/credit-debit-analysis/statistics', data)
    .then((res) => res.data);

export default function CreditTable({ filters }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchCreditDebitStatistics(filters)
      .then((response) => setData(response))
      .catch(() => message.error('Erro ao tentar careregar estatitcas'))
      .then(() => setIsLoading(false));
  }, [filters]);

  const {
    numberOfAnalyzes,
    totalOfCredit,
    totalOfDebit,
    totalOfDifference,
  } = data;

  const differenceStyle = {};
  if (totalOfCredit !== totalOfDebit) {
    if (totalOfCredit > totalOfDebit) differenceStyle.color = '#3f8600';
    else differenceStyle.color = '#cf1322';
  }

  return (
    <Space size='large'>
      <Statistic
        title='Nº de Análises'
        value={numberOfAnalyzes}
        loading={isLoading}
      />
      <Statistic
        title='Soma total do débito'
        prefix='R$'
        value={totalOfDebit}
        precision={2}
        loading={isLoading}
      />
      <Statistic
        title='Soma total do crédito'
        prefix='R$'
        value={totalOfCredit}
        precision={2}
        loading={isLoading}
      />
      <Statistic
        title='Diferença'
        prefix='R$'
        value={totalOfDifference}
        valueStyle={differenceStyle}
        precision={2}
        loading={isLoading}
      />
    </Space>
  );
}
