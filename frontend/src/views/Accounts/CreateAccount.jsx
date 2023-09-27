import React, { useState } from 'react';
import { Input, Modal, Form, Radio, Select, Button, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MaskedInput from 'antd-mask-input';
import useHeadquartersAvailable from '../../hooks/useHeadquartersAvailable';
import useCreateAccount from '../../hooks/useCreateAccount';
import { isCNPJ } from '../../utils/validate';

const { Option } = Select;

const cnpjValidator = (role, value, cb) => {
  if (!isCNPJ(value)) {
    return cb(new Error('CNPJ inválido'));
  }
  return cb();
};

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const {
    data: headquartersAvailable = [],
    isLoading: isHeadquartersAvailableLoading,
  } = useHeadquartersAvailable();

  const open = () => setIsModalVisible(true);
  const close = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const {
    mutate,
    isLoading: isFormLoading,
    isError,
    error,
    reset,
  } = useCreateAccount({ onSuccess: close });

  const initialValues = {
    companyCNPJ: '',
    companyName: '',
    headquarterCNPJ: '',
    username: '',
    password: '',
    role: 'Client',
  };

  const handleCancel = () => {
    reset();
    close();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutate(values);
    });
  };

  return (
    <>
      <Button type='primary' icon={<PlusOutlined />} onClick={open}>
        Criar acesso
      </Button>
      <Modal
        visible={isModalVisible}
        title='Novo acesso'
        okText='Criar'
        okButtonProps={{
          loading: isFormLoading,
        }}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          labelCol={{ span: 4 }}
          form={form}
          initialValues={initialValues}
          validateTrigger='onBlur'
        >
          {isError && <Alert message={error.message} type='error' />}
          <p className='form-group-title'>Dados da empresa</p>
          <Form.Item
            label='Nome'
            name='companyName'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='CNPJ'
            name='companyCNPJ'
            rules={[{ required: true }, { validator: cnpjValidator }]}
          >
            <MaskedInput mask='11.111.111/1111-11' />
          </Form.Item>
          <Form.Item label='Matriz' name='headquarterCNPJ'>
            <Select
              showSearch
              allowClear
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              loading={isHeadquartersAvailableLoading}
            >
              {headquartersAvailable.map((headquarter) => (
                <Option value={headquarter.companyCNPJ}>
                  {headquarter.companyName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <p className='form-group-title'>Dados de acesso</p>
          <Form.Item
            label='Usuário'
            name='username'
            rules={[{ required: true }, { min: 3 }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Senha'
            name='password'
            rules={[{ required: true }, { min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label='Função' name='role' rules={[{ required: true }]}>
            <Radio.Group value={initialValues.role}>
              <Radio value='Client'>Cliente</Radio>
              <Radio value='Admin'>Admin</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
