import React, { useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function TicketAnalysisFilter({
  loading = false,
  onFilter = () => null,
}) {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  const initialValues = {
    divergence: 'All',
    trip: null,
    licensePlate: null,
    period: [],
    // operatorCompany: 'All',
  };

  const filter = () => {
    onFilter(form.getFieldValue());
  };

  return (
    <Form labelCol={{ span: 4 }} form={form} initialValues={initialValues}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name='divergence' label='Divergência'>
            <Select>
              <Option value='All'>Tudo</Option>
              <Option value='Without'>Nenhuma</Option>
              <Option value='Credit'>Crédito</Option>
              <Option value='Debit'>Débito</Option>
              <Option value='Credit/Debit'>Cré/Déb</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='trip' label='Viagem'>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='licensePlate' label='Placa'>
            <Input />
          </Form.Item>
        </Col>
        {expand && (
          <>
            <Col span={8}>
              <Form.Item name='period' label='Período'>
                <RangePicker format='DD/MM/YYYY' />
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item name='operatorCompany' label='Operadora'>
                <Select>
                  <Option value='SemParar'>SemParar</Option>
                  <Option value='All'>Todas</Option>
                </Select>
              </Form.Item>
            </Col> */}
          </>
        )}
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button type='primary' loading={loading} onClick={filter}>
              Filtrar
            </Button>
            <Button
              disabled={loading}
              onClick={() => {
                form.resetFields();
                filter();
              }}
            >
              Limpar
            </Button>
            <Button
              type='link'
              onClick={() => {
                setExpand(!expand);
              }}
              icon={expand ? <UpOutlined /> : <DownOutlined />}
            >
              {expand ? 'Contrair' : 'Expandir'}
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
}
