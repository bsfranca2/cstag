import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import MaskedInput from 'antd-mask-input';
import { useModalForm } from '../../shared/hooks';
import { useCreateCompany } from '../useCompanies';
import { fetchHeadquarters } from '../companiesApi';
import { CompanyCNPJ } from '../companyCNPJ';

export const CreateCompany = () =>
  useModalForm({
    title: 'Nova empresa',
    trigger: (
      <Button type="primary" icon={<PlusOutlined />}>
        Criar empresa
      </Button>
    ),
    formFields: () => [
      <ProFormText
        key="name"
        name="name"
        label="Nome"
        rules={[{ required: true }]}
      />,
      <ProForm.Item
        key="cnpj"
        name="cnpj"
        label="CNPJ"
        rules={[
          { required: true },
          {
            validator: (rule, value) =>
              new CompanyCNPJ(value).isValid
                ? Promise.resolve()
                : Promise.reject(new Error('CNPJ inválido')),
          },
        ]}
      >
        <MaskedInput mask="00.000.000/0000-00" />
      </ProForm.Item>,
      <ProFormSelect
        key="headquarterId"
        name="headquarterId"
        label="Matriz"
        request={async () => {
          const data = await fetchHeadquarters();
          return data.map(({ id: value, name: label }) => ({ value, label }));
        }}
        showSearch={true}
      />,
    ],
    mutation: useCreateCompany(),
  });
