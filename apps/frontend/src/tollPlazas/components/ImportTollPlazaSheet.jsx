import { Button, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, {
  ProFormDateRangePicker,
  ProFormText,
} from '@ant-design/pro-form';
import { useModalForm } from '../../shared/hooks';
import { useImportTollPlazaSheet } from '../useTollPlazas';

export const ImportTollPlazaSheet = () =>
  useModalForm({
    title: 'Importar planilha - Valores da praça',
    trigger: (
      <Button type="primary" icon={<PlusOutlined />}>
        Importar planilha
      </Button>
    ),
    formFields: () => [
      <ProFormDateRangePicker
        key="period"
        name="period"
        label="Período"
        format="DD/MM/YYYY"
        required={[{ required: true }]}
      />,
      <ProFormText key="description" name="description" label="Descrição" />,
      <ProForm.Item
        key="sheet"
        name="sheet"
        label="Planilha"
        required={[{ required: true }]}
      >
        <Upload
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          beforeUpload={() => false}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Selecionar arquivo</Button>
        </Upload>
      </ProForm.Item>,
    ],
    mutation: useImportTollPlazaSheet(),
  });
