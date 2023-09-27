import { Button, Col, Divider, Drawer, Row } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import useAnalysisTicket from '../../hooks/useAnalysisTicket';
import { formatMoney } from '../../utils/format';

const dateTimeFormatter = (dateTime) =>
  dateTime ? moment(dateTime).format('DD/MM/YYYY HH:mm') : null;

const dateFormatter = (date) =>
  date ? moment(date).format('DD/MM/YYYY') : null;

const periodFormatter = (startOfPeriod, endOfPeriod) =>
  `${dateFormatter(startOfPeriod)} - ${dateFormatter(endOfPeriod)}`;

const DescriptionItem = ({ title, content }) => (
  <div className='site-description-item-profile-wrapper'>
    <p className='site-description-item-profile-p-label'>{title}:</p>
    {content}
  </div>
);

const Description = ({ id }) => {
  const { data, isLoading } = useAnalysisTicket(id);

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  return (
    <div>
      <p className='site-description-item-profile-p'>Passagem</p>
      <Row>
        <Col span={16}>
          <DescriptionItem title='Rodovia' content={data.highway} />
        </Col>
        <Col span={8}>
          <DescriptionItem title='Tarifa' content={formatMoney(data.fare)} />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem title='Placa' content={data.licensePlate} />
        </Col>
        <Col span={12}>
          <DescriptionItem title='Categoria' content={data.category} />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title='Data'
            content={dateTimeFormatter(data.paidAt)}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem title='Operadora' content={data.operatorCompany} />
        </Col>
      </Row>
      <Divider />
      <p className='site-description-item-profile-p'>Praça</p>
      <Row>
        <Col span={16}>
          <DescriptionItem
            title='Rodovia'
            content={data.tollPlazaFullRoadName}
          />
        </Col>
        <Col span={8}>
          <DescriptionItem
            title='Tarifa'
            content={formatMoney(data.tollPlazaValue)}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title='Associação'
            content={data.tollPlazaAssociateCompany}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem title='Categoria' content={data.tollPlazaCategory} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <DescriptionItem
            title='Período'
            content={periodFormatter(
              data.tollPlazaStartOfPeriod,
              data.tollPlazaEndOfPeriod
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default function Details({ ticket }) {
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
        width={640}
      >
        {isModalVisible && <Description id={ticket.id} />}
      </Drawer>
    </>
  );
}
