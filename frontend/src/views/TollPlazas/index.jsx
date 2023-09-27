import React from 'react';
import { Button, Card, Dropdown, Menu, Row, Space, Table, Tag } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Layout from '../../layout/index';
import useTollPlazas from '../../hooks/useTollPlazas';
import ImportSheet from './ImportSheet';

const { Column } = Table;

const DropdownMenu = () => (
  <Dropdown
    overlay={() => (
      <Menu>
        <Menu.Item onClick={() => null}>Alterar período</Menu.Item>
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

export default function TollPlazas() {
  const { data = [], isLoading } = useTollPlazas();
  const history = useHistory();

  const dateFormatter = (date) =>
    moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  const importStatusFormatter = (status) => {
    switch (status) {
      case 'Pending':
        return <Tag color='orange'>Pendente</Tag>;
      case 'Done':
        return <Tag color='green'>Importado</Tag>;
      case 'Error':
        return <Tag color='red'>Falhou</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <Layout
      header={{
        title: 'Praças',
        subTitle: 'Gerenciar valores das praças',
      }}
      breadcrumb={[{ path: '/pracas', breadcrumbName: 'Praças' }]}
    >
      <Card className='card-box'>
        <div className='card-toolbox'>
          <Row justify='end'>
            <ImportSheet />
          </Row>
        </div>
        <Table dataSource={data} rowKey='id' loading={isLoading}>
          <Column title='Id' dataIndex='id' key='id' />
          <Column
            title='Início do período'
            dataIndex='startOfPeriod'
            key='startOfPeriod'
            render={dateFormatter}
          />
          <Column
            title='Fim do período'
            dataIndex='endOfPeriod'
            key='endOfPeriod'
            render={dateFormatter}
          />
          <Column
            title='Status'
            dataIndex='status'
            key='status'
            render={importStatusFormatter}
          />
          <Column
            title=''
            key='action'
            width={100}
            render={(text, record) => (
              <Space>
                <Button
                  type='link'
                  onClick={() => history.push(`/pracas/${record.id}`)}
                >
                  Detalhes
                </Button>
                <DropdownMenu />
              </Space>
            )}
          />
        </Table>
      </Card>
    </Layout>
  );
}
