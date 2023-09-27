import { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { useCompaniesWithLocalFilter } from '../useCompanies';
import { CompanyCNPJ } from '../../companies/companyCNPJ';

export default function CompaniesTable() {
  const [term, setTerm] = useState(null);
  const companies = useCompaniesWithLocalFilter(term);

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name),
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      renderText: (value) => new CompanyCNPJ(value).formatted,
    },
    {
      title: 'Matriz',
      dataIndex: ['headquarter', 'name'],
    },
    {
      title: 'CNPJ da Matriz',
      dataIndex: ['headquarter', 'cnpj'],
      renderText: (value) => new CompanyCNPJ(value).formatted,
    },
  ];

  return (
    <>
      <ProTable
        request={false}
        dataSource={companies.data}
        loading={companies.isLoading}
        rowKey="id"
        columns={columns}
        pagination={{ showSizeChanger: true }}
        toolbar={{
          search: {
            placeholder: 'Filtrar',
            allowClear: true,
            onSearch: (value) => setTerm(value),
          },
        }}
        search={false}
        options={false}
        sticky
      />
    </>
  );
}
