import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import useImportTrailers from '../../hooks/useImportTrailers';

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

  const { mutate, isLoading, isError, error, reset } = useImportTrailers({
    onSuccess: close,
  });

  const initialValues = {
    file: [],
  };

  const handleCancel = () => {
    reset();
    close();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const [file] = values.file;
      mutate({ file });
    });
  };

  return (
    <>
      <Button type='primary' icon={<PlusOutlined />} onClick={open}>
        Importar planilha
      </Button>
      <Modal
        title='Importar planilha - Carretas'
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
