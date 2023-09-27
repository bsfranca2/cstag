import { Typography } from 'antd';
import { useModalFormEdit } from '../../shared/hooks';
import { useResetUserPasswordLink } from '../useUsers';

export const useGenerateResetPasswordLink = () => {
  const { link, generateLink } = useResetUserPasswordLink();

  return useModalFormEdit({
    resourceName: 'user',
    title: ({ user }) => `Link para alterar senha - ${user.username}`,
    onInit: ({ user }) => generateLink(user.id),
    formFields: () => [
      <Typography.Link key="link" href={link} target="_blank" copyable>
        {link}
      </Typography.Link>,
    ],
    mutation: {
      isLoading: link ? false : true,
      isError: false,
      reset: () => {},
      mutateAsync: async () => {},
    },
  });
};
