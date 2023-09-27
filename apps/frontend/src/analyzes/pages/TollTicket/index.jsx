import { PageContainer } from '@ant-design/pro-layout';
import TicketAnalyzes from '../../components/TicketAnalyzes';

export default function TollPlazas() {
  return (
    <PageContainer
      title="Passagem pedágio"
      subTitle="Consulta de passagens pedágio"
    >
      <TicketAnalyzes ticketType="TICKET" />
    </PageContainer>
  );
}
