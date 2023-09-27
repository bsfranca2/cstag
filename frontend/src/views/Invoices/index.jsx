import { Button, Card, Progress, Radio, Row, Space, Table } from 'antd';
import React from 'react';
import moment from 'moment';
import Layout from '../../layout/index';
import ImportInvoice from './ImportInvoice';
import useInvoices from '../../hooks/useInvoices';

const { Column } = Table;

export default function Invoices() {
  const { data = [], isLoading } = useInvoices();

  const dateFormatter = (date) =>
    moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');

  return (
    <Layout
      header={{
        title: `Faturas`,
        subTitle: 'Gerencias faturas das operadoras',
      }}
      breadcrumb={[{ path: '/faturas', breadcrumbName: 'Faturas' }]}
    >
      <Space style={{ marginBottom: 24 }}>
        <span>Operadora:</span>
        <Radio.Group defaultValue='SemParar' buttonStyle='solid'>
          <Radio.Button value='SemParar'>SemParar</Radio.Button>
        </Radio.Group>
      </Space>
      <Card className='card-box'>
        <div className='card-toolbox'>
          <Row justify='end' style={{ marginBottom: 16 }}>
            <ImportInvoice />
          </Row>
        </div>
        <Table dataSource={data} loading={isLoading}>
          <Column title='Número' dataIndex='identifier' key='identifier' />
          <Column
            title='Data de emissão'
            dataIndex={['metadata', 'issueDate']}
            key='metadata.issueDate'
            render={dateFormatter}
          />
          <Column
            title='Status'
            dataIndex='progress'
            key='progress'
            render={({ isDone, percentage }) => (
              <div style={{ maxWidth: 200 }}>
                <Progress
                  percent={percentage}
                  size='small'
                  status={isDone ? 'success' : 'active'}
                />
              </div>
            )}
          />
          <Column
            title=''
            key='action'
            width={120}
            render={() => (
              <Space>
                <Button>Detalhes</Button>
              </Space>
            )}
          />
        </Table>
      </Card>
    </Layout>
  );
}
