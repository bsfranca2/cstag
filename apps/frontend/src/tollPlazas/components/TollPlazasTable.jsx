import { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useTollPlazas } from '../useTollPlazas';
import { useEditTollPlaza } from './EditTollPlaza';

export default function TollPlazasTable({ tollPlazaPeriodId }) {
  const editTollPlaza = useEditTollPlaza();

  const [fullRoadName, setTerm] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const [total, setTotal] = useState(0);

  const tollPlazas = useTollPlazas(
    {
      tollPlazaPeriodId,
      fullRoadName,
      pagination,
    },
    (response) => {
      setTotal(response.totalRowCount);
    }
  );

  const columns = [
    {
      title: 'Compania Associada',
      dataIndex: 'associateCompany',
    },
    {
      title: 'Rodovia',
      dataIndex: 'highway',
    },
    {
      title: 'KM',
      dataIndex: 'km',
    },
    {
      title: 'Descrição',
      dataIndex: 'fullRoadName',
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      renderText: (value) => value && `R$ ${value}`,
    },
    {
      title: 'Ações',
      dataIndex: 'action',
      valueType: 'option',
      render: (el, row) => [
        <Button
          key="editTollPlaza"
          size="small"
          onClick={() => editTollPlaza.openModal(row)}
        >
          Editar
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        request={false}
        dataSource={tollPlazas.data?.data}
        loading={tollPlazas.isLoading}
        rowKey="id"
        columns={columns}
        pagination={{
          current: pagination.page,
          pageSize: pagination.perPage,
          total,
          showSizeChanger: true,
          onChange: (page, perPage) => setPagination({ page, perPage }),
        }}
        toolbar={{
          search: {
            placeholder: 'Filtrar',
            allowClear: true,
            onSearch: (value) => {
              setTerm(value);
              setPagination({ ...pagination, page: 1 });
            },
          },
        }}
        search={false}
        options={false}
        sticky
      />
      {editTollPlaza.modalForm}
    </>
  );
}
