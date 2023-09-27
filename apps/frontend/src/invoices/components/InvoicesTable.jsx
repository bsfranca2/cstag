import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { useState } from 'react';
import { useInvoicesWithLocalFilter, useDeleteInvoice } from '../useInvoices';

export default function InvoicesTable() {
  const [term, setTerm] = useState(null);
  const invoices = useInvoicesWithLocalFilter(term);

  const deleteInvoice = useDeleteInvoice();

  const columns = [
    {
      title: 'Número',
      dataIndex: 'identifier',
    },
    {
      title: 'Data de emissão',
      dataIndex: ['metadata', 'issueDate'],
      renderText: (text) => new Date(text).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Progresso',
      dataIndex: ['progress', 'percentage'],
      valueType: 'progress',
    },
    {
      title: 'Operadora',
      dataIndex: 'operatorCompany',
    },
    {
      title: 'Ações',
      dataIndex: 'action',
      valueType: 'option',
      render: (el, record) => [
        <Popconfirm
          key="deleteInvoice"
          title="Deseja realmente excluir esta fatura?"
          onConfirm={() => deleteInvoice.mutate({ invoiceId: record.id })}
        >
          <Button type="link" danger>
            Excluir
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      request={false}
      dataSource={invoices.data}
      loading={invoices.isLoading}
      rowKey="id"
      columns={columns}
      pagination={{ showSizeChanger: true }}
      toolbar={{
        search: {
          placeholder: 'Filtrar por número',
          allowClear: true,
          onSearch: (value) => setTerm(value),
        },
      }}
      search={false}
      options={false}
      sticky
    />
  );
}
