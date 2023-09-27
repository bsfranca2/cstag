import { useState } from 'react';
import { Descriptions, Divider, Drawer } from 'antd';
import { useTicketAnalysisDetails as useTicketAnalysisDetailsQuery } from '../useAnalyzes';

const dateTimeFormatter = (dateTime) =>
  dateTime ? new Date(dateTime).toLocaleString('pt-BR') : null;

const dateFormatter = (date) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : null;

const periodFormatter = (startOfPeriod, endOfPeriod) =>
  `${dateFormatter(startOfPeriod)} - ${dateFormatter(endOfPeriod)}`;

const renderMoney = (value) => value && `R$ ${value}`;

const Description = ({ id }) => {
  const { data, isLoading } = useTicketAnalysisDetailsQuery(id);

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  return (
    <div>
      <Descriptions title="Passagem">
        <Descriptions.Item label="Rodovia" span={2}>
          {data.ticket.highway}
        </Descriptions.Item>
        <Descriptions.Item label="Tarifa" span={2}>
          {renderMoney(data.ticket.fare)}
        </Descriptions.Item>
        <Descriptions.Item label="Placa" span={2}>
          {data.ticket.licensePlate}
        </Descriptions.Item>
        <Descriptions.Item label="Categoria" span={2}>
          {data.ticket.category}
        </Descriptions.Item>
        <Descriptions.Item label="Data" span={2}>
          {dateTimeFormatter(data.ticket.paidAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Operadora" span={2}>
          {data.ticket.invoice.operatorCompany}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions title="Praça">
        <Descriptions.Item label="Rodovia" span={2}>
          {data.tollPlaza?.fullRoadName}
        </Descriptions.Item>
        <Descriptions.Item label="Tarifa" span={2}>
          {renderMoney(data.tollPlaza?.value)}
        </Descriptions.Item>
        <Descriptions.Item label="Associação" span={2}>
          {data.tollPlaza?.associateCompany}
        </Descriptions.Item>
        <Descriptions.Item label="Categoria" span={2}>
          {data.tollPlaza?.category}
        </Descriptions.Item>
        <Descriptions.Item label="Período" span={4}>
          {periodFormatter(data.tollPlaza?.startAt, data.tollPlaza?.endAt)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export function useTicketAnalysisDetails() {
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
      title={'Detalhes da passagem'}
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
