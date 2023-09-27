import { Card, Form, InputNumber, Table } from 'antd';
import React, { useState } from 'react';
import Layout from '../../layout/index';
import useMonthlyPayments from '../../hooks/useMonthlyPayments';
import AxlesTooltip from '../../components/AxlesTooltip';

const { Column } = Table;

const moneyFormatter = (value) => {
  if (!value || typeof value !== 'number') return 'R$ 0.00';
  return `R$ ${value.toFixed(2)}`;
};

export default function Invoices() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState(null);

  const { data, isLoading } = useMonthlyPayments(year);
  const dataFiltered = data
    ? data.filter((i) => (category ? i.category === category : true))
    : [];

  return (
    <Layout
      header={{
        title: `Mensalidades`,
        subTitle: 'Consulta de mensalidades',
      }}
      breadcrumb={[{ path: '/mensalidades', breadcrumbName: 'Mensalidades' }]}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form layout='inline'>
          <Form.Item label='Ano'>
            <InputNumber
              min={1886}
              max={3000}
              defaultValue={year}
              onChange={(value) => setYear(value)}
            />
          </Form.Item>
          <Form.Item label='Categoria'>
            <InputNumber
              min={1}
              max={69}
              defaultValue={category}
              onChange={(value) => setCategory(value)}
            />
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table
          dataSource={dataFiltered}
          loading={isLoading}
          rowKey='licensePlate'
        >
          <Column title='Placa' dataIndex='licensePlate' />
          <Column
            title='Categoria'
            dataIndex='category'
            align='center'
            render={(value) => <AxlesTooltip id={value} />}
          />
          <Column title='Janeiro' dataIndex='january' render={moneyFormatter} />
          <Column
            title='Fevereiro'
            dataIndex='february'
            render={moneyFormatter}
          />
          <Column title='Março' dataIndex='march' render={moneyFormatter} />
          <Column title='Abril' dataIndex='april' render={moneyFormatter} />
          <Column title='Maio' dataIndex='may' render={moneyFormatter} />
          <Column title='Junho' dataIndex='june' render={moneyFormatter} />
          <Column title='Julho' dataIndex='july' render={moneyFormatter} />
          <Column title='Agosto' dataIndex='august' render={moneyFormatter} />
          <Column
            title='Outubro'
            dataIndex='september'
            render={moneyFormatter}
          />
          <Column
            title='Setembro'
            dataIndex='october'
            render={moneyFormatter}
          />
          <Column
            title='Novembro'
            dataIndex='november'
            render={moneyFormatter}
          />
          <Column
            title='Dezembro'
            dataIndex='december'
            render={moneyFormatter}
          />
        </Table>
      </Card>
    </Layout>
  );
}
