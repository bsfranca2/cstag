import { Button, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import { useModalForm } from '../../shared/hooks';
import { useImportInvoice } from '../useInvoices';

export const ImportInvoiceSheet = () =>
  useModalForm({
    title: 'Importar planilha da fatura',
    trigger: (
      <Button type="primary" icon={<PlusOutlined />}>
        Importar planilha
      </Button>
    ),
    formFields: () => [
      <ProFormSelect
        key="operatorCompany"
        name="operatorCompany"
        label="Operadora"
        valueEnum={{ SemParar: 'SemParar' }}
        initialValue="SemParar"
        required={[{ required: true }]}
      />,
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
    mutation: useImportInvoice(),
  });
