import React, { useRef } from 'react';
import { Button, Card, Dropdown, Menu, Row, Space, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Layout from '../../layout/index';
import VehicleForm from './VehicleForm';
import useVehicles from '../../hooks/useVehicles';
import ImportSheet from './ImportSheet';

const { Column } = Table;

export default function Invoices() {
  const vehicleForm = useRef();
  const importSheet = useRef();

  const { data = [], isLoading } = useVehicles();

  const menu = (
    <Menu>
      <Menu.Item
        key='1'
        icon={<UploadOutlined />}
        onClick={() => importSheet.current.open()}
      >
        Importar planilha
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout
        header={{
          title: `Veículos`,
          subTitle: 'Gerenciar veículos',
        }}
        breadcrumb={[{ path: '/veiculos', breadcrumbName: 'Veículos' }]}
      >
        <Card className='card-box'>
          <div className='card-toolbox'>
            <Row justify='end' style={{ marginBottom: 16 }}>
              <Dropdown.Button
                type='primary'
                overlay={menu}
                onClick={() => vehicleForm.current.open()}
              >
                Criar veículo
              </Dropdown.Button>
            </Row>
          </div>
          <Table dataSource={data} loading={isLoading} size='middle'>
            <Column dataIndex='licensePlate' title='Placa' />
            <Column dataIndex='brand' title='Marca' />
            <Column dataIndex='model' title='Modelo' />
            <Column dataIndex='year' title='Ano' />
            <Column dataIndex='description' title='Descrição' />
            <Column
              key='action'
              width={120}
              render={(_, record) => (
                <Space>
                  <Button
                    type='link'
                    onClick={() => vehicleForm.current.open(record)}
                  >
                    Detalhes
                  </Button>
                </Space>
              )}
            />
          </Table>
        </Card>
      </Layout>
      <VehicleForm ref={vehicleForm} />
      <ImportSheet ref={importSheet} />
    </>
  );
}
