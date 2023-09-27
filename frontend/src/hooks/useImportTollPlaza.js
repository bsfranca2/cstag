import { useMutation } from 'react-query';
import { message } from 'antd';
import request from '../utils/request';
import queryClient from '../queryClient';

export default function useImportTollPlaza({ onSuccess }) {
  return useMutation(
    ({ file, startOfPeriod, endOfPeriod }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('startOfPeriod', startOfPeriod);
      formData.append('endOfPeriod', endOfPeriod);
      return request({
        method: 'post',
        url: '/toll-plazas/upload',
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: formData,
      }).then((res) => res.data);
    },
    {
      onSuccess: () => {
        message.success('Planilha importada com sucesso');
        queryClient.invalidateQueries('tollPlazaPeriods');
        if (typeof onSuccess === 'function') onSuccess();
      },
    }
  );
}
