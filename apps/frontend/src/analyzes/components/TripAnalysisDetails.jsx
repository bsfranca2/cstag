import { useState } from 'react';
import { Descriptions, Drawer, Table, Typography } from 'antd';
import { useTripAnalysisDetails as useTripAnalysisDetailsQuery } from '../useAnalyzes';

const renderMoney = (value) => value && `R$ ${value}`;

const TicketTable = ({ data }) => {
  const columns = [
    {
      title: 'Data',
      dataIndex: 'paidAt',
      render: (date) => new Date(date).toLocaleString('pt-BR'),
    },
    {
      title: 'Praça pedágio',
      dataIndex: 'highway',
    },
    {
      title: 'Tarifa',
      dataIndex: 'fare',
      render: renderMoney,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
    },
  ];

  return (
    <Table
      title={() => 'Passagens'}
      columns={columns}
      dataSource={data}
      size="small"
      summary={(rows) => {
        const totalValue = rows.reduce((acc, cv) => {
          return acc + Number(cv.fare);
        }, 0);

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan="2">Total</Table.Summary.Cell>
              <Table.Summary.Cell colSpan="2">
                <Typography.Text>{renderMoney(totalValue)}</Typography.Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
};

const CreditTable = ({ data }) => {
  const columns = [
    {
      title: 'Data',
      dataIndex: 'receivedAt',
      render: (date) => new Date(date).toLocaleString('pt-BR'),
    },
    {
      title: 'Valor',
      dataIndex: 'value',
    },
  ];

  return (
    <Table
      title={() => 'Créditos'}
      columns={columns}
      dataSource={data}
      size="small"
      summary={(rows) => {
        const totalValue = rows.reduce((acc, cv) => {
          return acc + Number(cv.value);
        }, 0);

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell>Total</Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{renderMoney(totalValue)}</Typography.Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
};

const Description = ({ id }) => {
  const { data, isLoading } = useTripAnalysisDetailsQuery(id);

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  const { trip, licensePlate, creditList = [], ticketList = [] } = data;
  const shipperName = ticketList.length
    ? ticketList[0].metadata.shipperName
    : creditList[0].metadata.shipperName;
  const shipperCNPJ = ticketList.length
    ? ticketList[0].metadata.shipperCNPJ
    : creditList[0].metadata.shipperCNPJ;

  return (
    <div>
      <Descriptions>
        <Descriptions.Item label="Placa" span={2}>
          {licensePlate}
        </Descriptions.Item>
        <Descriptions.Item label="Viagem" span={2}>
          {trip}
        </Descriptions.Item>
        <Descriptions.Item label="Embarcador" span={2}>
          {shipperName}
        </Descriptions.Item>
        <Descriptions.Item label="CNPJ" span={2}>
          {shipperCNPJ}
        </Descriptions.Item>
      </Descriptions>
      <TicketTable data={ticketList} />
      <CreditTable data={creditList} />
    </div>
  );
};

export function useTripAnalysisDetails() {
  const [id, setId] = useState(null);
  const [visible, setVisible] = useState(false);

  const open = ({ id }) => {
    setId(id);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  const drawer = (
    <Drawer
      title={'Detalhes da viagem'}
      visible={visible}
      onClose={close}
      size="large"
    >
      {visible && <Description id={id} />}
    </Drawer>
  );

  return {
    drawer,
    open,
  };
}
