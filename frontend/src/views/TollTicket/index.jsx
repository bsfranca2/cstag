import React from 'react';
import { Tabs } from 'antd';
import Layout from '../../layout/index';
import TicketAnalysis from '../../components/TicketAnalysis/index';

const { TabPane } = Tabs;

export default function TollTicket() {
  return (
    <Layout
      header={{
        title: `Passagem pedágio`,
        subTitle: 'Consulta de passagens pedágio',
        footer: (
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Eixos/Valor Praça' key='1' />
            <TabPane tab='Duplicados' key='2' />
          </Tabs>
        ),
      }}
      breadcrumb={[
        { path: '/passagens-pedagio', breadcrumbName: 'Passagem pedágio' },
      ]}
    >
      <TicketAnalysis ticketType='Ticket' />
    </Layout>
  );
}
