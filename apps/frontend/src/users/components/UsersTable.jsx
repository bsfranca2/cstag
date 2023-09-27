import { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu } from 'antd';
import { useAuthContext } from '../../auth/useAuthContext';
import { useUsersWithLocalFilter } from '../useUsers';
import { UserRole } from '../../users/userRole';
import { CompanyCNPJ } from '../../companies/companyCNPJ';
import { useChangeUserPassword } from './ChangeUserPassword';
import { useGenerateResetPasswordLink } from './GenerateResetPasswordLink';

export default function UsersTable() {
  const { handleLoginAs } = useAuthContext();
  const [term, setTerm] = useState(null);
  const users = useUsersWithLocalFilter(term);

  const changeUserPassword = useChangeUserPassword();
  const resetPasswordLink = useGenerateResetPasswordLink();

  const columns = [
    {
      title: 'Usuário',
      dataIndex: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Função',
      dataIndex: 'role',
      renderText: (value) => new UserRole(value).roleName,
    },
    {
      title: 'Empresa',
      dataIndex: ['company', 'name'],
      sorter: (a, b) => (a.company?.name || '').localeCompare(b.company?.name),
    },
    {
      title: 'CNPJ',
      dataIndex: ['company', 'cnpj'],
      renderText: (value) => new CompanyCNPJ(value).formatted,
    },
    {
      title: 'Matriz',
      dataIndex: ['company', 'headquarter', 'name'],
    },
    {
      title: 'CNPJ da Matriz',
      dataIndex: ['company', 'headquarter', 'cnpj'],
      renderText: (value) => new CompanyCNPJ(value).formatted,
    },
    {
      title: 'Ações',
      dataIndex: 'option',
      valueType: 'option',
      render: (el, row) => [
        <Dropdown.Button
          key="changePassword"
          size="small"
          onClick={() => changeUserPassword.openModal(row)}
          overlay={
            <Menu
              items={[{ label: 'Gerar link', key: 'generateLink' }]}
              onClick={() => resetPasswordLink.openModal(row)}
            />
          }
        >
          Alterar senha
        </Dropdown.Button>,
        <Button
          key="loginAs"
          size="small"
          onClick={() => handleLoginAs(row.id)}
        >
          Acessar
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        request={false}
        dataSource={users.data}
        loading={users.isLoading}
        rowKey="id"
        columns={columns}
        pagination={{ showSizeChanger: true }}
        toolbar={{
          search: {
            placeholder: 'Filtrar',
            allowClear: true,
            onSearch: (value) => setTerm(value),
          },
        }}
        search={false}
        options={false}
        sticky
      />
      {changeUserPassword.modalForm}
      {resetPasswordLink.modalForm}
    </>
  );
}
