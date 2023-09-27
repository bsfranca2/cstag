import React, { useState } from 'react';
import { Button, Card, Dropdown, Input, Menu, Row, Space, Table } from 'antd';
import { EllipsisOutlined, LoginOutlined } from '@ant-design/icons';
import Layout from '../../layout/index';
import useAccounts from '../../hooks/useAccounts';
import { formatCnpj } from '../../utils/format';
import CreateAccount from './CreateAccount';

const { Column } = Table;
const { Search } = Input;

const DropdownMenu = () => (
  <Dropdown
    overlay={() => (
      <Menu>
        <Menu.Item onClick={() => null}>Alterar senha</Menu.Item>
      </Menu>
    )}
  >
    <Button
      style={{
        border: 'none',
        padding: 0,
      }}
    >
      <EllipsisOutlined
        style={{
          fontSize: 20,
          verticalAlign: 'top',
        }}
      />
    </Button>
  </Dropdown>
);

const roleFormatter = (role) => {
  if (role === 'Client') return 'Cliente';
  return role;
};

export default function Accounts() {
  const [term, setTerm] = useState('');
  const { data = [], isLoading } = useAccounts();

  const dataFiltered = data.filter((i) => {
    const textToSearch = `${i.companyName} ${i.companyCNPJ} ${i.username}`;
    return textToSearch.toLowerCase().includes(term.toLowerCase());
  });

  return (
    <Layout
      header={{
        title: 'Acessos',
        subTitle: 'Gerencias acessos de empresas',
      }}
      breadcrumb={[{ path: '/acessos', breadcrumbName: 'Acessos' }]}
    >
      <Card className='card-box'>
        <div className='card-toolbox'>
          <Row justify='space-between'>
            <Search
              placeholder='Filtrar'
              allowClear
              onSearch={(text) => setTerm(text)}
              style={{ width: 200 }}
            />
            <CreateAccount />
          </Row>
        </div>
        <Table
          dataSource={dataFiltered}
          rowKey='companyCNPJ'
          loading={isLoading}
        >
          <Column
            title='Empresa CNPJ'
            dataIndex='companyCNPJ'
            key='companyCNPJ'
            render={formatCnpj}
          />
          <Column
            title='Empresa Nome'
            dataIndex='companyName'
            key='companyName'
          />
          <Column title='Usuário' dataIndex='username' key='username' />
          <Column
            title='Função'
            dataIndex='role'
            key='role'
            render={roleFormatter}
          />
          <Column
            title='Empresa Matriz'
            dataIndex='headquarterName'
            key='headquarterName'
          />
          <Column
            title=''
            key='action'
            width={200}
            render={() => (
              <Space>
                <Button icon={<LoginOutlined />}>Navegar como</Button>
                <DropdownMenu />
              </Space>
            )}
          />
        </Table>
      </Card>
    </Layout>
  );
}
