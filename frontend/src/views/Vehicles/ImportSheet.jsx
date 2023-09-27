import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { DatePicker, Modal, Form, Button, Upload, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useImportVehicles from '../../hooks/useImportVehicles';

const { RangePicker } = DatePicker;

const normFile = ({ file }) => {
  if (!file || file.status === 'removed') return [];
  return [file];
};

function ImportSheet(props, ref) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const open = () => setIsModalVisible(true);
  const close = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  const { mutate, isLoading, isError, error, reset } = useImportVehicles({
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
        startOfPeriod: startOfPeriod.toISOString(),
        endOfPeriod: endOfPeriod.toISOString(),
      };
      mutate(data);
    });
  };

  return (
    <Modal
      title='Importar planilha - Veículos'
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
        <Form.Item
          label='Período'
          name='period'
          extra='Os registros de eixos e clientes será adicionado com este período'
          rules={[{ required: true }]}
        >
          <RangePicker format='DD/MM/YYYY' />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default forwardRef(ImportSheet);
