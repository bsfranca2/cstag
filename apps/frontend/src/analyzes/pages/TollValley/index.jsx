import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import TicketAnalyzes from '../../components/TicketAnalyzes';
import TripAnalyzes from '../../components/TripAnalyzes';

export default function TollPlazas() {
  const [tab, setTab] = useState('ticketAnalyzes');

  return (
    <PageContainer
      title="Vale-pedágio"
      subTitle="Consulta de vale-pedágio"
      tabList={[
        {
          key: 'ticketAnalyzes',
          tab: 'Eixos/Valor Praça',
        },
        {
          key: 'tripAnalyzes',
          tab: 'Crédito/Débito',
        },
      ]}
      onTabChange={(key) => setTab(key)}
    >
      {tab === 'ticketAnalyzes' && (
        <TicketAnalyzes ticketType="TOLL_VALLEY_TICKET" />
      )}
      {tab === 'tripAnalyzes' && <TripAnalyzes />}
    </PageContainer>
  );
}
