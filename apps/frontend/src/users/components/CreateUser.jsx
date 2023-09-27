import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useModalForm } from '../../shared/hooks';
import { useCreateUser } from '../useUsers';
import { User, UserRole } from '../userRole';
import { fetchCompanies } from '../../companies/companiesApi';

export const CreateUser = () =>
  useModalForm({
    title: 'Novo usuário',
    trigger: (
      <Button type="primary" icon={<PlusOutlined />}>
        Criar usuário
      </Button>
    ),
    formFields: () => [
      <ProFormText
        key="username"
        name="username"
        label="Usuário"
        rules={[{ required: true }]}
      />,
      <ProFormText.Password
        key="password"
        name="password"
        label="Senha"
        rules={[{ required: true }]}
      />,
      <ProFormRadio.Group
        key="role"
        name="role"
        label="Função"
        options={UserRole.getOptions()}
        initialValue={User}
        rules={[{ required: true }]}
      />,
      <ProFormDependency key="companyId" name={['role']}>
        {({ role }) =>
          role === User && (
            <ProFormSelect
              name="companyId"
              label="Empresa"
              request={async () => {
                const data = await fetchCompanies();
                return data.map(({ id: value, name: label }) => ({
                  value,
                  label,
                }));
              }}
              showSearch={true}
              rules={[{ required: true }]}
            />
          )
        }
      </ProFormDependency>,
    ],
    mutation: useCreateUser(),
  });
