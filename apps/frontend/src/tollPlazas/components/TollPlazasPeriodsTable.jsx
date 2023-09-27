import ProTable from '@ant-design/pro-table';
import { Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTollPlazasPeriods } from '../useTollPlazas';
import { useEditTollPlazaPeriod } from './EditTollPlazaPeriod';
import { useDuplicateTollPlazaPeriod } from './DuplicateTollPlazaPeriod';
import { TollPlazaPeriodStatus } from './TollPlazaPeriodStatus';

export default function TollPlazasPeriodsTable() {
  const navigate = useNavigate();

  const tollPlazasPeriods = useTollPlazasPeriods();

  const editTollPlazaPeriod = useEditTollPlazaPeriod();
  const duplicateTollPlazaPeriod = useDuplicateTollPlazaPeriod();

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
      title: 'Descrição',
      dataIndex: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <TollPlazaPeriodStatus value={status} />,
    },
    {
      title: 'Ativo',
      dataIndex: 'inactived',
      width: 80,
      render: (value) =>
        value ? <Tag color="red">Inativo</Tag> : <Tag color="green">Ativo</Tag>,
    },
    {
      title: 'Ações',
      dataIndex: 'action',
      valueType: 'option',
      render: (el, row) => [
        <Button
          key="duplicateTollPlazaPeriod"
          size="small"
          onClick={() => duplicateTollPlazaPeriod.openModal(row)}
        >
          Duplicar
        </Button>,
        <Button
          key="editTollPlazaPeriod"
          size="small"
          onClick={() => editTollPlazaPeriod.openModal(row)}
        >
          Editar
        </Button>,
        <Button
          key="tollPlazaPeriodDetails"
          size="small"
          onClick={() => navigate(`/admin/pracas/${row.id}`)}
        >
          Detalhes
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
      {editTollPlazaPeriod.modalForm}
      {duplicateTollPlazaPeriod.modalForm}
    </>
  );
}
