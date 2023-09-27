import { DatePicker, Form, Input, Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import moment from 'moment';

function AxlesForm({ onSave }, ref) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [editingIndex, setEditingIndex] = useState(-1);
  const initialValues = {
    id: null,
    segment: null,
    client: null,
    group: null,
    subgroup: null,
    startOfPeriod: null,
    endOfPeriod: null,
  };

  const open = (props) => {
    if (props) {
      const { index, ...data } = props;
      form.setFieldsValue({
        ...initialValues,
        ...data,
        startOfPeriod: data.startOfPeriod ? moment(data.startOfPeriod) : null,
        endOfPeriod: data.endOfPeriod ? moment(data.endOfPeriod) : null,
      });
      setEditingIndex(index);
    } else {
      setEditingIndex(-1);
    }
    setIsModalVisible(true);
  };
  const close = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  const save = () => {
    form.validateFields().then((values) => {
      close();
      const data = {
        index: editingIndex,
        ...values,
        startOfPeriod: values.startOfPeriod.toISOString(),
        endOfPeriod: values.endOfPeriod?.toISOString() ?? null,
      };
      onSave(data);
    });
  };

  return (
    <Modal
      title='Registro de eixo'
      visible={isModalVisible}
      okText='Salvar'
      onOk={save}
      onCancel={close}
    >
      <Form form={form} labelCol={{ span: 6 }} initialValues={initialValues}>
        <p className='form-group-title'>Dados do cliente</p>
        <Form.Item name='segment' label='Segmento'>
          <Input />
        </Form.Item>
        <Form.Item name='client' label='Cliente'>
          <Input />
        </Form.Item>
        <Form.Item name='group' label='Grupo'>
          <Input />
        </Form.Item>
        <Form.Item name='subgroup' label='Subgrupo'>
          <Input />
        </Form.Item>
        <p className='form-group-title'>Período</p>
        <Form.Item
          name='startOfPeriod'
          label='Início'
          rules={[{ required: true }]}
        >
          <DatePicker format='DD/MM/YYYY' />
        </Form.Item>
        <Form.Item name='endOfPeriod' label='Fim'>
          <DatePicker format='DD/MM/YYYY' />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default forwardRef(AxlesForm);
