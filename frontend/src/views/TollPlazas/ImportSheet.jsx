import React, { useState } from 'react';
import { DatePicker, Modal, Form, Button, Alert, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import useImportTollPlaza from '../../hooks/useImportTollPlaza';

const { RangePicker } = DatePicker;

const normFile = ({ file }) => {
  if (!file || file.status === 'removed') return [];
  return [file];
};

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const open = () => setIsModalVisible(true);
  const close = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const { mutate, isLoading, isError, error, reset } = useImportTollPlaza({
    onSuccess: close,
  });

  const initialValues = {
    period: [],
    file: [],
  };

  const handleCancel = () => {
    reset();
    close();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const [file] = values.file;
      const [startOfPeriod, endOfPeriod] = values.period;
      const data = {
        file,
        startOfPeriod: startOfPeriod.format('YYYY-MM-DD'),
        endOfPeriod: endOfPeriod.format('YYYY-MM-DD'),
      };
      mutate(data);
    });
  };

  return (
    <>
      <Button type='primary' icon={<PlusOutlined />} onClick={open}>
        Importar planilha
      </Button>
      <Modal
        title='Importar planilha - Valores da praça'
        visible={isModalVisible}
        okButtonProps={{
          loading: isLoading,
        }}
        onOk={handleOk}
        okText='Importar'
        onCancel={handleCancel}
      >
        <Form labelCol={{ span: 4 }} form={form} initialValues={initialValues}>
          {isError && <Alert message={error.message} type='error' />}
          <Form.Item label='Período' name='period' rules={[{ required: true }]}>
            <RangePicker format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item
            label='Planilha'
            name='file'
            valuePropName='fileList'
            getValueFromEvent={normFile}
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
};
