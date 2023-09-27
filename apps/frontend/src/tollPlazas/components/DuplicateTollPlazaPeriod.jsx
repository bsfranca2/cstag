import {
  ProFormDateRangePicker,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import { useModalFormEdit } from '../../shared/hooks';
import { useDuplicateTollPlazaPeriod as useDuplicateTollPlazaPeriodMutation } from '../useTollPlazas';

export const useDuplicateTollPlazaPeriod = () =>
  useModalFormEdit({
    resourceName: 'tollPlazaPeriod',
    title: ({ tollPlazaPeriod }) =>
      `Duplicar - ${tollPlazaPeriod.description || ''}`,
    onInit: ({ tollPlazaPeriod, form }) => {
      form.setFieldsValue({
        active: true,
        tollPlazaPeriodId: tollPlazaPeriod.id,
      });
    },
    formFields: () => [
      <ProFormText
        key="tollPlazaPeriodId"
        name="tollPlazaPeriodId"
        required={[{ required: true }]}
        hidden
      />,
      <ProFormDateRangePicker
        key="period"
        name="period"
        label="Período"
        format="DD/MM/YYYY"
        required={[{ required: true }]}
      />,
      <ProFormText key="description" name="description" label="Descrição" />,
      <ProFormSwitch key="active" name="active" label="Ativo" />,
    ],
    mutation: useDuplicateTollPlazaPeriodMutation(),
  });
