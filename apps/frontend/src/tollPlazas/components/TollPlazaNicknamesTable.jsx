import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
// import { useTollPlazasPeriods } from '../useTollPlazas';

export default function TollPlazaNicknamesTable() {
  // const tollPlazasPeriods = useTollPlazasPeriods();
  const tollPlazasPeriods = {
    data: [],
    isLoading: false,
  };

  const columns = [
    {
      title: 'Início do período',
      dataIndex: 'startAt',
      renderText: (text) => new Date(text).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Fim do período',
      dataIndex: 'endAt',
      renderText: (text) => new Date(text).toLocaleDateString('pt-BR'),
    },
    {
      title: 'De',
      dataIndex: 'from',
    },
    {
      title: 'Para',
      dataIndex: 'to',
    },
    {
      title: 'Ações',
      dataIndex: 'action',
      valueType: 'option',
      render: () => [
        <Button key="editTollPlazaPeriod" size="small">
          Editar
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        request={false}
        dataSource={tollPlazasPeriods.data}
        loading={tollPlazasPeriods.isLoading}
        rowKey="id"
        columns={columns}
        pagination={{ showSizeChanger: true }}
        search={false}
        options={false}
        sticky
      />
    </>
  );
}
