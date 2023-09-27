import React from 'react';
import { Table, Tooltip } from 'antd';
import moment from 'moment';
import AxlesTooltip from '../AxlesTooltip';
import Details from './Details';

const dateFormatter = (value) => {
  if (!value) return '';
  return moment(value).format('DD/MM/YYYY');
};

const timeFormatter = (value) => {
  if (!value) return '';
  return moment(value).format('HH:mm');
};

const moneyFormatter = (value) => {
  if (!value || typeof value !== 'number') return '';
  return `R$ ${value.toFixed(2)}`;
};

const axlesFormatter = (categoryId) =>
  categoryId && <AxlesTooltip id={categoryId} />;

const getDivergenceLabel = (type) => {
  if (type === 'Positive') return 'Positiva';
  if (type === 'Negative') return 'Negativo';
  return '';
};

const getSquareClass = (type) => {
  if (type) return type.toLowerCase();
  return '';
};

export default function TicketAnalysisTable({ data, isLoading }) {
  const columns = [
    {
      title: '',
      dataIndex: 'divergenceType',
      render: (type) =>
        type && (
          <Tooltip title={`Divergência ${getDivergenceLabel(type)}`}>
            <div className={['square', getSquareClass(type)].join(' ')} />
          </Tooltip>
        ),
    },
    {
      title: 'Placa',
      dataIndex: ['ticket', 'licensePlate'],
    },
    {
      title: 'Data',
      dataIndex: ['ticket', 'paidAt'],
      render: dateFormatter,
    },
    {
      title: 'Hora',
      dataIndex: ['ticket', 'paidAt'],
      render: timeFormatter,
    },
    {
      title: 'Praça pedágio',
      dataIndex: ['ticket', 'highway'],
    },
    {
      title: 'Valor cobrado',
      dataIndex: ['ticket', 'fare'],
      render: moneyFormatter,
    },
    {
      title: 'Valor tabela',
      dataIndex: ['plaza', 'value'],
      render: moneyFormatter,
    },
    {
      title: 'Praça tabela',
      dataIndex: ['plaza', 'fullRoadName'],
    },
    {
      title: 'Cobrado',
      dataIndex: ['ticket', 'category'],
      render: axlesFormatter,
    },
    {
      title: 'Suspenso',
      dataIndex: ['vehicle', 'suspended'],
      render: axlesFormatter,
    },
    {
      title: 'Carregado',
      dataIndex: ['vehicle', 'total'],
      render: axlesFormatter,
    },
    {
      render: (_, record) => <Details ticket={record.ticket} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      size='large'
      rowClassName={(record) => {
        if (record.divergenceType === 'Positive') return 'divergencePositive';
        if (record.divergenceType === 'Negative') return 'divergenceNegative';
        if (record.divergenceType === 'Neutral') return 'divergenceNeutral';
        return '';
      }}
      pagination={{ position: ['none'], pageSize: 100 }}
    />
  );
}
