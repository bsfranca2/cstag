import { PlusOutlined } from '@ant-design/icons';
import { ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { Button } from 'antd';
import { useModalForm } from '../../shared/hooks';
import { useCreateTollPlaza } from '../useTollPlazas';

export const CreateTollPlaza = ({ tollPlazaPeriodId }) =>
  useModalForm({
    title: 'Nova praça de tarifa',
    trigger: (
      <Button type="primary" icon={<PlusOutlined />}>
        Criar praça de tarifa
      </Button>
    ),
    formFields: () => [
      <ProFormText
        key="tollPlazaPeriodId"
        name="tollPlazaPeriodId"
        initialValue={tollPlazaPeriodId}
        required={[{ required: true }]}
        hidden
      />,
      <ProFormText
        key="associateCompany"
        name="associateCompany"
        label="Compania Associada"
        required={[{ required: true }]}
      />,
      <ProFormText
        key="highway"
        name="highway"
        label="Rodovia"
        required={[{ required: true }]}
      />,
      <ProFormText
        key="km"
        name="km"
        label="KM"
        required={[{ required: true }]}
      />,
      <ProFormText
        key="fullRoadName"
        name="fullRoadName"
        label="Descrição"
        placeholder="Rodovia - KM - Cidade"
        required={[{ required: true }]}
      />,
      <ProFormDigit
        key="category"
        name="category"
        label="Categoria"
        min={1}
        max={69}
        fieldProps={{ precision: 0 }}
        required={[{ required: true }]}
      />,
      <ProFormDigit
        key="value"
        name="value"
        label="Valor"
        min={0}
        required={[{ required: true }]}
      />,
    ],
    mutation: useCreateTollPlaza(),
  });
