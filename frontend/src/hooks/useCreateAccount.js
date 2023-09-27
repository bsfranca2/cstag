import { useMutation } from 'react-query';
import { message } from 'antd';
import request from '../utils/request';
import queryClient from '../queryClient';

export default function useCreateAccount({ onSuccess }) {
  return useMutation(
    (values) => request.post('/accounts', values).then((res) => res.data),
    {
      onSuccess: (data) => {
        message.success('Acesso criado com sucesso');
        queryClient.invalidateQueries('accounts');
        if (data.headquarterCNPJ)
          queryClient.invalidateQueries('headquartersAvailable');
        if (typeof onSuccess === 'function') onSuccess();
      },
    }
  );
}
