import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import { ImportTollPlazaSheet } from '../../components/ImportTollPlazaSheet';
import TollPlazasPeriodsTable from '../../components/TollPlazasPeriodsTable';
import TollPlazaNicknamesTable from '../../components/TollPlazaNicknamesTable';

export default function TollPlazas() {
  const [tab, setTab] = useState('tollPlazasPeriods');

  return (
    <PageContainer
      title="Praças"
      subTitle="Gerenciar valores das praças"
      extra={<ImportTollPlazaSheet />}
      tabList={[
        {
          key: 'tollPlazasPeriods',
          tab: 'Períodos',
        },
        {
          key: 'nicknames',
          tab: 'Apelidos',
        },
      ]}
      onTabChange={(key) => setTab(key)}
    >
      {tab === 'tollPlazasPeriods' && <TollPlazasPeriodsTable />}
      {tab === 'nicknames' && <TollPlazaNicknamesTable />}
    </PageContainer>
  );
}
