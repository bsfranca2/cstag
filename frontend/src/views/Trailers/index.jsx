import React from 'react';
import { Card, Row, Table } from 'antd';
import Layout from '../../layout/index';
import useTrailers from '../../hooks/useTrailers';
import ImportSheet from './ImportSheet';
import AxlesTooltip from '../../components/AxlesTooltip';

const { Column } = Table;

export default function Invoices() {
  const { data = [], isLoading } = useTrailers();

  return (
    <>
      <Layout
        header={{
          title: `Carretas`,
          subTitle: 'Gerenciar carretas',
        }}
        breadcrumb={[{ path: '/carretas', breadcrumbName: 'Carretas' }]}
      >
        <Card className='card-box'>
          <div className='card-toolbox'>
            <Row justify='end' style={{ marginBottom: 16 }}>
              <ImportSheet />
            </Row>
          </div>
          <Table dataSource={data} loading={isLoading} size='middle'>
            <Table.ColumnGroup title='Placas'>
              <Column dataIndex='firstLicensePlate' title='1º Carreta' />
              <Column dataIndex='secondLicensePlate' title='2º Carreta' />
              <Column dataIndex='thirdLicensePlate' title='3º Carreta' />
            </Table.ColumnGroup>
            <Column dataIndex='kindOfEquipment' title='Marca' />
            <Column dataIndex='model' title='Modelo' />
            <Table.ColumnGroup title='Eixos'>
              <Column
                dataIndex='axlesTotal'
                title='Carregados'
                render={(text) => <AxlesTooltip id={text} />}
              />
              <Column
                dataIndex='axlesSuspended'
                title='Suspensos'
                render={(text) => <AxlesTooltip id={text} />}
              />
            </Table.ColumnGroup>
          </Table>
        </Card>
      </Layout>
    </>
  );
}
