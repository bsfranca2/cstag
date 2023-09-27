import ProTable from '@ant-design/pro-table';
import { Button, Card, Space, Statistic } from 'antd';
import { useState } from 'react';
import { fetchTripAnalyzes } from '../analyzesApi.js';
import { useTripAnalysisDetails } from '../components/TripAnalysisDetails';

const toISOString = (localDate) => {
  const date = localDate.split('/').reverse().join('-');
  return new Date(`${date}T00:00:00.000-03:00`).toISOString();
};

function TripAnalyzesStatistic({ data }) {
  const { numberOfAnalyzes, totalOfCredit, totalOfDebit, totalOfDifference } =
    data;

  const differenceStyle = {};
  if (totalOfCredit !== totalOfDebit) {
    if (totalOfCredit > totalOfDebit) differenceStyle.color = '#3f8600';
    else differenceStyle.color = '#cf1322';
  }

  return (
    <Card>
      <Space size="large">
        <Statistic title="Nº de Análises" value={numberOfAnalyzes} />
        <Statistic
          title="Soma total do crédito"
          prefix="R$"
          value={totalOfCredit}
          precision={2}
        />
        <Statistic
          title="Soma total do débito"
          prefix="R$"
          value={totalOfDebit}
          precision={2}
        />
        <Statistic
          title="Diferença"
          prefix="R$"
          value={totalOfDifference}
          valueStyle={differenceStyle}
          precision={2}
        />
      </Space>
    </Card>
  );
}

export default function CreditAnalysis() {
  const [statistic, setStatistic] = useState({});
  const tripAnalysisDetails = useTripAnalysisDetails();

  const request = async (params) => {
    const { current, pageSize, period, ...query } = params;
    query.page = current;
    query.perPage = pageSize;
    query.divergence =
      query.resultType !== 'All' ? query.resultType : undefined;

    if (period?.length) {
      query.startAt = toISOString(period[0]);
      query.endAt = toISOString(period[1]);
    }

    fetchTripAnalyzes({ ...query, statistics: true }).then((data) =>
      setStatistic(data)
    );
    const result = await fetchTripAnalyzes(query);
    return {
      success: true,
      data: result.list,
      total: result.total,
    };
  };

  const columns = [
    {
      title: 'Viagem',
      dataIndex: 'trip',
    },
    {
      title: 'Placa',
      dataIndex: 'licensePlate',
    },
    {
      title: 'Divergência',
      dataIndex: 'resultType',
      valueType: 'select',
      valueEnum: {
        All: {
          text: 'Todos',
        },
        With: {
          text: 'Com',
        },
        Without: {
          text: 'Sem',
        },
        Credit: {
          text: 'Crédito',
        },
        Debit: {
          text: 'Débito',
        },
      },
    },
    {
      title: 'Transações',
      dataIndex: 'transactions',
      hideInSearch: true,
    },
    {
      title: 'Total de crédito',
      dataIndex: 'credit',
      renderText: (value) => value && `R$ ${value}`,
      hideInSearch: true,
    },
    {
      title: 'Total de débito',
      dataIndex: 'debit',
      renderText: (value) => value && `R$ ${value}`,
      hideInSearch: true,
    },
    {
      title: 'Diferença',
      dataIndex: 'difference',
      renderText: (value) => value && `R$ ${value}`,
      hideInSearch: true,
    },
    {
      title: 'Período',
      dataIndex: 'period',
      valueType: 'dateRange',
      fieldProps: {
        format: 'DD/MM/YYYY',
      },
      hideInTable: true,
    },
    {
      title: 'Ações',
      dataIndex: 'action',
      valueType: 'option',
      render: (el, row) => [
        <Button
          key="tripAnalysisDetail"
          size="small"
          onClick={() => tripAnalysisDetails.open(row)}
        >
          Detalhes
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        request={request}
        rowKey="id"
        rowClassName={(record) => {
          if (record.resultType === 'Credit') return 'divergencePositive';
          if (record.resultType === 'Debit') return 'divergenceNegative';
        }}
        columns={columns}
        pagination={{ showSizeChanger: true }}
        sticky
        tableExtraRender={() => <TripAnalyzesStatistic data={statistic} />}
      />
      {tripAnalysisDetails.drawer}
    </>
  );
}
