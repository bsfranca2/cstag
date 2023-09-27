import { useMutation } from 'react-query';
import { message } from 'antd';
import request from '../utils/request';
import queryClient from '../queryClient';

export default function useImportInvoice({ onSuccess }) {
  return useMutation(
    ({ file, operatorCompany }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('operatorCompany', operatorCompany);
      return request({
        method: 'post',
        url: '/invoices/upload',
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: formData,
      }).then((res) => res.data);
    },
    {
      onSuccess: () => {
        message.success('Planilha enviada com sucesso');
        queryClient.invalidateQueries('invoices');
        if (typeof onSuccess === 'function') onSuccess();
      },
    }
  );
}
