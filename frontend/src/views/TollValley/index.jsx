import React, { useState } from 'react';
import { Tabs } from 'antd';
import Layout from '../../layout/index';
import TicketAnalysis from '../../components/TicketAnalysis/index';
import CreditAndDebitAnalysis from './CreditAndDebitAnalysis';

const { TabPane } = Tabs;

export default function TollTicket() {
  const [tab, setTab] = useState('1');

  return (
    <Layout
      header={{
        title: `Vale-pedágio`,
        subTitle: 'Consulta de vale-pedágio',
        footer: (
          <Tabs activeKey={tab} onChange={(key) => setTab(key)}>
            <TabPane tab='Eixos/Valor Praça' key='1' />
            <TabPane tab='Duplicados' key='2' />
            <TabPane tab='Crédito/Débito' key='3' />
          </Tabs>
        ),
      }}
      breadcrumb={[{ path: '/vale-pedagio', breadcrumbName: 'Vale-pedágio' }]}
    >
      {tab === '1' && <TicketAnalysis ticketType='TollValleyTicket' />}
      {tab === '3' && <CreditAndDebitAnalysis />}
    </Layout>
  );
}
