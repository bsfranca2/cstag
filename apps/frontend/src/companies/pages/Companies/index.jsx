import { PageContainer } from '@ant-design/pro-layout';
import { CreateCompany } from '../../components/CreateCompany';
import CompaniesTable from '../../components/CompaniesTable';

export default function Users() {
  return (
    <PageContainer
      title="Empresas"
      subTitle="Gerenciar cadastro de empresas"
      extra={<CreateCompany />}
    >
      <CompaniesTable />
    </PageContainer>
  );
}
