import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Tabs,
  message,
} from 'antd';
import InputMask from 'antd-mask-input';
import moment from 'moment';
import AxlesForm from './AxlesForm';
import AxlesTooltip from '../../components/AxlesTooltip';
import { insert } from '../../utils/array';
import request from '../../utils/request';
import ClientForm from './ClientForm';
import queryClient from '../../queryClient';

const dateISOFormatter = (isoString) =>
  isoString ? moment(isoString).format('DD/MM/YYYY') : '';

function VehicleForm(props, ref) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [licensePlateFormat, setLicensePlateFormat] = useState('new');
  const licensePlateMask = licensePlateFormat === 'new' ? 'AAA1A11' : 'AAA1111';
  const [isEditing, setIsEditing] = useState(false);

  const axlesForm = useRef();
  const clientForm = useRef();

  const [form] = Form.useForm();
  const initialValues = {
    licensePlate: null,
    brand: null,
    model: null,
    year: null,
    description: null,
  };

  const [axles, setAxles] = useState([]);
  const [clients, setClients] = useState([]);

  const open = (data) => {
    if (data) {
      form.setFieldsValue({ ...initialValues, ...data });
      setAxles(data.axlesRegistries);
      setClients(data.clientRegistries);
      setIsEditing(true);
      try {
        const numberPattern = /\d+/g;
        if (data.licensePlate.match(numberPattern).join('').length === 4) {
          setLicensePlateFormat('old');
        } else {
          setLicensePlateFormat('new');
        }
      } catch (err) {
        //
      }
    }
    setIsModalVisible(true);
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  const handleAxlesSave = ({ index, ...values }) => {
    if (index === 0 || (index && index !== -1)) {
      setAxles(
        insert(
          axles.filter((i, idx) => idx !== index),
          index,
          values
        )
      );
    } else {
      setAxles([...axles, values]);
    }
  };

  const handleClientSave = ({ index, ...values }) => {
    if (index === 0 || (index && index !== -1)) {
      setClients(
        insert(
          clients.filter((i, idx) => idx !== index),
          index,
          values
        )
      );
    } else {
      setClients([...clients, values]);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const save = async () => {
    const values = await form.validateFields();
    try {
      setIsLoading(true);
      const data = {
        ...values,
        axlesRegistries: axles || [],
        clientRegistries: clients || [],
      };
      await request.post('/vehicles', data);
      queryClient.invalidateQueries('vehicles');
      message.success(`Veículo ${values.licensePlate} salvo com sucesso`);
      setIsModalVisible(false);
    } catch (err) {
      message.error(`Falha ao tentar salvar o veículo ${values.licensePlate}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    form.resetFields();
    setClients([]);
    setAxles([]);
    setIsEditing(false);
    setIsModalVisible(false);
  };

  return (
    <Drawer
      title='Veiculo'
      width={640}
      visible={isModalVisible}
      bodyStyle={{ paddingBottom: 80 }}
      onClose={onClose}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button style={{ marginRight: 8 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={isLoading} type='primary' onClick={save}>
            Salvar
          </Button>
        </div>
      }
    >
      <Form form={form} initialValues={initialValues} labelCol={{ span: 4 }}>
        <Form.Item label='Placa'>
          <Input.Group compact>
            <Form.Item noStyle>
              <Select
                value={licensePlateFormat}
                onChange={(value) => setLicensePlateFormat(value)}
                disabled={isEditing}
              >
                <Select.Option value='old'>Formato antigo</Select.Option>
                <Select.Option value='new'>Nova formato</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='Placa'
              name='licensePlate'
              noStyle
              rules={[{ required: true }]}
            >
              <InputMask
                key={licensePlateFormat}
                style={{ width: 100 }}
                mask={licensePlateMask}
                disabled={isEditing}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item name='brand' label='Marca'>
          <Input />
        </Form.Item>
        <Form.Item name='model' label='Modelo'>
          <Input />
        </Form.Item>
        <Form.Item name='year' label='Ano'>
          <InputNumber min={1886} max={9999} />
        </Form.Item>
        <Form.Item name='description' label='Descrição'>
          <Input.TextArea />
        </Form.Item>
      </Form>
      <Tabs>
        <Tabs.TabPane tab='Eixos' key='axles'>
          <Table size='small' dataSource={axles}>
            <Table.ColumnGroup title='Eixos'>
              <Table.Column
                dataIndex='total'
                key='total'
                title='Carregados'
                render={(categoryId) => <AxlesTooltip id={categoryId} />}
              />
              <Table.Column
                dataIndex='suspended'
                key='suspended'
                title='Suspensos'
                render={(categoryId) => <AxlesTooltip id={categoryId} />}
              />
            </Table.ColumnGroup>
            <Table.ColumnGroup title='Período'>
              <Table.Column
                dataIndex='startOfPeriod'
                title='Início'
                render={dateISOFormatter}
              />
              <Table.Column
                dataIndex='endOfPeriod'
                title='Fim'
                render={dateISOFormatter}
              />
            </Table.ColumnGroup>
            <Table.Column
              render={(_, record, index) => (
                <Button
                  type='link'
                  size='small'
                  onClick={() => axlesForm.current.open({ index, ...record })}
                >
                  Editar
                </Button>
              )}
            />
          </Table>
          <Button
            type='dashed'
            size='small'
            icon={<PlusOutlined />}
            block
            onClick={() => axlesForm.current.open()}
          >
            Adicionar registro
          </Button>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Clientes' key='clients'>
          <Table dataSource={clients} size='small'>
            <Table.Column dataIndex='segment' title='Segmento' />
            <Table.Column dataIndex='client' title='Cliente' />
            <Table.Column dataIndex='group' title='Grupo' />
            <Table.Column dataIndex='subgroup' title='Subgrupo' />
            <Table.ColumnGroup title='Período'>
              <Table.Column
                dataIndex='startOfPeriod'
                title='Início'
                render={dateISOFormatter}
              />
              <Table.Column
                dataIndex='endOfPeriod'
                title='Fim'
                render={dateISOFormatter}
              />
            </Table.ColumnGroup>
            <Table.Column
              render={(_, record, index) => (
                <Button
                  type='link'
                  size='small'
                  onClick={() => clientForm.current.open({ index, ...record })}
                >
                  Editar
                </Button>
              )}
            />
          </Table>
          <Button
            type='dashed'
            size='small'
            icon={<PlusOutlined />}
            block
            onClick={() => clientForm.current.open()}
          >
            Adicionar registro
          </Button>
        </Tabs.TabPane>
      </Tabs>
      <AxlesForm ref={axlesForm} onSave={handleAxlesSave} />
      <ClientForm ref={clientForm} onSave={handleClientSave} />
    </Drawer>
  );
}

export default forwardRef(VehicleForm);
