import {
  ProFormDateRangePicker,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import moment from 'moment';
import { useModalFormEdit } from '../../shared/hooks';
import { useUpdateTollPlazaPeriod } from '../useTollPlazas';

export const useEditTollPlazaPeriod = () =>
  useModalFormEdit({
    resourceName: 'tollPlazaPeriod',
    title: ({ tollPlazaPeriod }) =>
      `Editar - ${tollPlazaPeriod.description || ''}`,
    onInit: ({ tollPlazaPeriod, form }) => {
      form.setFieldsValue({
        tollPlazaPeriodId: tollPlazaPeriod.id,
        period: [
          moment(tollPlazaPeriod.startAt),
          moment(tollPlazaPeriod.endAt),
        ],
        description: tollPlazaPeriod.description,
        active: !tollPlazaPeriod.inactived,
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
    mutation: useUpdateTollPlazaPeriod(),
  });
