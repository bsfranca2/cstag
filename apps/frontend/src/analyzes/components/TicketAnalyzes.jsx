import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { fetchTicketAnalyzes } from '../analyzesApi.js';
import { useTicketAnalysisDetails } from './TicketAnalysisDetails';

const toISOString = (localDate) => {
  const date = localDate.split('/').reverse().join('-');
  return new Date(`${date}T00:00:00.000-03:00`).toISOString();
};

export default function TicketAnalyzes({ ticketType }) {
  const ticketAnalysisDetails = useTicketAnalysisDetails();

  const request = async (params) => {
    const { current, pageSize, period, ...query } = params;
    query.page = current;
    query.perPage = pageSize;
    query.ticketType = ticketType;
    query.divergence =
      query.divergence !== 'All' ? query.divergence : undefined;

    if (period?.length) {
      query.startAt = toISOString(period[0]);
      query.endAt = toISOString(period[1]);
    }

    const result = await fetchTicketAnalyzes(query);
    return {
      success: true,
      data: result.list,
      total: result.total,
    };
  };

  const columns = [
    {
      title: 'Divergência',
      dataIndex: 'divergence',
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
        Positive: {
          text: 'Positiva',
        },
        Negative: {
          text: 'Negativa',
        },
        Neutral: {
          text: 'Neutra',
        },
      },
      hideInTable: true,
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
      title: 'Praça',
      dataIndex: 'term',
      hideInTable: true,
    },
    {
      title: 'Placa',
      dataIndex: 'licensePlate',
      hideInTable: true,
    },
    {
      title: 'Fatura',
      dataIndex: 'invoice',
      hideInTable: true,
    },
    {
      title: 'Placa',
      dataIndex: ['ticket', 'licensePlate'],
      hideInSearch: true,
    },
    {
      title: 'Data',
      dataIndex: ['ticket', 'paidAt'],
      renderText: (paidAt) => new Date(paidAt).toLocaleString('pt-BR'),
      hideInSearch: true,
    },
    {
      title: 'Praça pedágio',
      dataIndex: ['ticket', 'highway'],
      hideInSearch: true,
    },
    {
      title: 'Valor cobrado',
      dataIndex: ['ticket', 'fare'],
      renderText: (value) => value && `R$ ${value}`,
      hideInSearch: true,
    },
    {
      title: 'Valor tabela',
      dataIndex: ['tollPlaza', 'value'],
      renderText: (value) => value && `R$ ${value}`,
      hideInSearch: true,
    },
    {
      title: 'Praça tabela',
      dataIndex: ['tollPlaza', 'fullRoadName'],
      hideInSearch: true,
    },
    {
      title: 'Cobrado',
      dataIndex: ['ticket', 'category'],
      hideInSearch: true,
    },
    {
      title: 'Suspenso',
      dataIndex: ['vehicle', 'suspended'],
      hideInSearch: true,
    },
    {
      title: 'Carregado',
      dataIndex: ['vehicle', 'total'],
      hideInSearch: true,
    },
    {
      title: 'Ações',
      dataIndex: 'action',
      valueType: 'option',
      render: (el, row) => [
        <Button
          key="tripAnalysisDetail"
          size="small"
          onClick={() => ticketAnalysisDetails.open(row)}
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
          if (record.resultType === 'Positive') return 'divergencePositive';
          if (record.resultType === 'Negative') return 'divergenceNegative';
          if (record.resultType === 'Neutral') return 'divergenceNeutral';
        }}
        columns={columns}
        pagination={{ showSizeChanger: true }}
        sticky
      />
      {ticketAnalysisDetails.drawer}
    </>
  );
}
