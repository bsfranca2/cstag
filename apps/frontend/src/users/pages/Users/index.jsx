import { PageContainer } from '@ant-design/pro-layout';
import { CreateUser } from '../../components/CreateUser';
import UsersTable from '../../components/UsersTable';

export default function Users() {
  return (
    <PageContainer
      title="Usuários"
      subTitle="Gerenciar usuários de empresas"
      extra={<CreateUser />}
    >
      <UsersTable />
    </PageContainer>
  );
}
