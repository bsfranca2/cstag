import { message } from 'antd';
import { useMutation, useQuery } from 'react-query';
import {
  createUser,
  fetchUsers,
  updateUser,
  generateResetUserPasswordLink,
} from './usersApi';
import { queryClient } from '../shared/queryClient';
import { useState } from 'react';

export function useUsers() {
  return useQuery('users', fetchUsers);
}

export function useUsersWithLocalFilter(term) {
  const users = useUsers();

  const data = (users.data || []).filter((user) => {
    const textToSearch = [
      user.username,
      user.company?.name,
      user.company?.cnpj,
      user.company?.headquarter?.name,
      user.company?.headquarter?.cnpj,
    ]
      .filter(Boolean)
      .join(' ');
    return textToSearch.toLowerCase().includes((term || '').toLowerCase());
  });

  return { ...users, data };
}

export function useChangeUserPasswordMutation() {
  return useMutation(updateUser, {
    onSuccess: () => {
      message.success('Senha alterado com sucesso');
    },
  });
}

export function useResetUserPasswordLink() {
  const [link, setLink] = useState(null);

  const generateLink = async (userId) => {
    const { tenant, resetToken } = await generateResetUserPasswordLink(userId);
    setLink(
      encodeURI(
        `${window.location.origin}/resetar-senha?tenant=${tenant}&userId=${userId}&token=${resetToken}`
      )
    );
  };

  return { link, generateLink };
}

export function useCreateUser() {
  return useMutation(createUser, {
    onSuccess: () => {
      message.success('Usuário criado com sucesso');
      queryClient.invalidateQueries('users');
    },
  });
}
