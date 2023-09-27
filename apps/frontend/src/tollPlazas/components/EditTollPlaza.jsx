import { ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { useModalFormEdit } from '../../shared/hooks';
import { useUpdateTollPlaza } from '../useTollPlazas';

export const useEditTollPlaza = () =>
  useModalFormEdit({
    resourceName: 'tollPlaza',
    title: ({ tollPlaza }) => `Editar - ${tollPlaza.fullRoadName || ''}`,
    onInit: ({ tollPlaza, form }) => {
      form.setFieldsValue({
        ...tollPlaza,
        tollPlazaId: tollPlaza.id,
      });
    },
    formFields: () => [
      <ProFormText
        key="tollPlazaId"
        name="tollPlazaId"
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
    mutation: useUpdateTollPlaza(),
  });
