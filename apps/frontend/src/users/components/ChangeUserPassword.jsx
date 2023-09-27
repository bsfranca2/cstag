import { ProFormText } from '@ant-design/pro-form';
import { useModalFormEdit } from '../../shared/hooks';
import { useChangeUserPasswordMutation } from '../useUsers';

export const useChangeUserPassword = () =>
  useModalFormEdit({
    resourceName: 'user',
    title: ({ user }) => `Alterar senha - ${user.username}`,
    formFields: ({ user }) => [
      <ProFormText
        key="userId"
        name="userId"
        initialValue={user.id}
        required={[{ required: true }]}
        hidden
      />,
      <ProFormText.Password
        key="password"
        name="password"
        label="Senha"
        rules={[{ required: true }]}
      />,
      <ProFormText.Password
        key="confirmPassword"
        name="confirmPassword"
        label="Confirmar Senha"
        rules={[{ required: true }]}
      />,
    ],
    mutation: useChangeUserPasswordMutation(),
  });
