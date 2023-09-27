import { Button, Divider, Drawer, Table, Typography } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import useCreditDebitDetails from '../../hooks/useCreditDebitDetails';
import { formatMoney } from '../../utils/format';
import AxlesTooltip from '../../components/AxlesTooltip';

const dateTimeFormatter = (dateTime) =>
  dateTime ? moment(dateTime).format('DD/MM/YYYY HH:mm') : null;

// const dateFormatter = (date) =>
//   date ? moment(date).format('DD/MM/YYYY') : null;

// const periodFormatter = (startOfPeriod, endOfPeriod) =>
//   `${dateFormatter(startOfPeriod)} - ${dateFormatter(endOfPeriod)}`;

const TicketTable = ({ data, loading }) => {
  const columns = [
    {
      title: 'Placa',
      dataIndex: 'licensePlate',
    },
    {
      title: 'Data',
      dataIndex: 'paidAt',
      render: dateTimeFormatter,
    },
    {
      title: 'Avenida',
      dataIndex: 'highway',
    },
    {
      title: 'Tarifa',
      dataIndex: 'fare',
      render: formatMoney,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      render: (category) => <AxlesTooltip id={category} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      size='small'
      summary={(pageData) => {
        let totalValue = 0;

        pageData.forEach(({ fare }) => {
          totalValue += fare;
        });

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell>Total</Table.Summary.Cell>
              <Table.Summary.Cell />
              <Table.Summary.Cell />
              <Table.Summary.Cell colSpan='2'>
                <Typography.Text>{formatMoney(totalValue)}</Typography.Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
};

const CreditTable = ({ data, loading }) => {
  const columns = [
    {
      title: 'Placa',
      dataIndex: 'licensePlate',
    },
    {
      title: 'Data',
      dataIndex: 'receivedAt',
      render: dateTimeFormatter,
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      render: formatMoney,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      size='small'
      summary={(pageData) => {
        let totalValue = 0;

        pageData.forEach(({ value }) => {
          totalValue += value;
        });

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell>Total</Table.Summary.Cell>
              <Table.Summary.Cell />
              <Table.Summary.Cell>
                <Typography.Text>{formatMoney(totalValue)}</Typography.Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
};

const Description = ({ id }) => {
  const { data, isLoading } = useCreditDebitDetails(id);

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  const { creditList = [], ticketList = [] } = data;

  return (
    <div>
      <p className='site-description-item-profile-p'>Passagens</p>
      <TicketTable data={ticketList} loading={isLoading} />
      <Divider />
      <p className='site-description-item-profile-p'>Créditos</p>
      <CreditTable data={creditList} loading={isLoading} />
    </div>
  );
};

export default function Details({ id }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const open = () => setIsModalVisible(true);
  const close = () => setIsModalVisible(false);

  return (
    <>
      <Button size='small' onClick={open}>
        Detalhes
      </Button>
      <Drawer
        title='Detalhes da Análise'
        visible={isModalVisible}
        onClose={close}
        width={840}
      >
        {isModalVisible && <Description id={id} />}
      </Drawer>
    </>
  );
}
