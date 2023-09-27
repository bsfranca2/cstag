import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Modal, Select, Upload } from 'antd';
import React, { useState } from 'react';
import useImportInvoice from '../../hooks/useImportInvoice';

const { Option } = Select;

const fileValueExtractor = ({ file }) => {
  if (!file || file.status === 'removed') return [];
  return [file];
};

export default function ImportInvoice() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const { mutate, isLoading, error, isError, reset } = useImportInvoice({
    onSuccess: closeModal,
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      const [file] = values.file;
      const { operatorCompany } = values;
      mutate({ file, operatorCompany });
    });
  };
  const handleCancel = () => {
    reset();
    closeModal();
  };

  const initialValues = {
    operatorCompany: 'SemParar',
    file: [],
  };

  return (
    <>
      <Button type='primary' onClick={openModal}>
        Importar fatura
      </Button>
      <Modal
        visible={isModalVisible}
        title='Importar fatura'
        okText='Importar'
        okButtonProps={{
          loading: isLoading,
        }}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValue={initialValues} labelCol={{ span: 5 }}>
          {isError && (
            <Form.Item>
              <Alert
                type='error'
                message='Erro ao tentar importar fatura'
                description={error.message}
              />
            </Form.Item>
          )}
          <Form.Item
            name='operatorCompany'
            label='Operadora'
            rules={[{ required: true }]}
          >
            <Select>
              <Option value='SemParar'>SemParar</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='file'
            label='Planilha'
            valuePropName='fileList'
            getValueFromEvent={fileValueExtractor}
            rules={[{ required: true }]}
          >
            <Upload
              accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Selecionar arquivo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
