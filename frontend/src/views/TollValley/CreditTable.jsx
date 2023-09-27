import React from 'react';
import { Table } from 'antd';
import Details from './Details';

const moneyFormatter = (value) => {
  if (!value || typeof value !== 'number') return 'R$ 0.00';
  return `R$ ${value.toFixed(2)}`;
};

export default function CreditTable({ data, isLoading }) {
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
      title: 'Tipo',
      dataIndex: 'divergence',
      render: (divergence) => {
        if (divergence === 'Credit') return 'Crédito';
        if (divergence === 'Debit') return 'Débito';
        return divergence;
      },
    },
    {
      title: 'Transações',
      dataIndex: 'numberOfTransactions',
    },
    {
      title: 'Total de débito',
      dataIndex: 'totalOfDebit',
      render: moneyFormatter,
    },
    {
      title: 'Total de crédito',
      dataIndex: 'totalOfCredit',
      render: moneyFormatter,
    },
    {
      title: 'Diferença',
      dataIndex: 'differenceOfValue',
      render: moneyFormatter,
    },
    {
      render: (_, record) => <Details id={record.id} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      size='large'
      rowClassName={(record) => {
        if (record.divergence === 'Credit') return 'divergencePositive';
        if (record.divergence === 'Debit') return 'divergenceNegative';
        return '';
      }}
      pagination={{ position: ['none'], pageSize: 100 }}
    />
  );
}
