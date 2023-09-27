import { DatePicker, Form, InputNumber, Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import moment from 'moment';
import { getAxleLabel } from '../../constants/axles';

function AxlesForm({ onSave }, ref) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [axles, setAxles] = useState({ suspended: null, total: null });
  const suspendedHelper = getAxleLabel(axles.suspended);
  const totalHelper = getAxleLabel(axles.total);

  const [editingIndex, setEditingIndex] = useState(-1);
  const initialValues = {
    id: null,
    total: null,
    suspended: null,
    startOfPeriod: null,
    endOfPeriod: null,
  };

  const open = (props) => {
    if (props) {
      const { index, total, suspended, startOfPeriod, endOfPeriod } = props;
      form.setFieldsValue({
        ...initialValues,
        total,
        suspended,
        startOfPeriod: startOfPeriod ? moment(startOfPeriod) : null,
        endOfPeriod: endOfPeriod ? moment(endOfPeriod) : null,
      });
      setAxles({ suspended, total });
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
        <p className='form-group-title'>Eixos</p>
        <Form.Item
          name='total'
          label='Carregados'
          extra={totalHelper || ''}
          rules={[{ required: true }]}
        >
          <InputNumber
            min={1}
            max={69}
            onChange={(total) => setAxles({ ...axles, total })}
          />
        </Form.Item>
        <Form.Item
          name='suspended'
          label='Suspensos'
          extra={suspendedHelper || ''}
          rules={[{ required: true }]}
        >
          <InputNumber
            min={1}
            max={69}
            onChange={(suspended) => setAxles({ ...axles, suspended })}
          />
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
