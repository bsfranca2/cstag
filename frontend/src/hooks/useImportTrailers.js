import { useMutation } from 'react-query';
import { message } from 'antd';
import request from '../utils/request';
import queryClient from '../queryClient';

export default function useImportTrailer({ onSuccess }) {
  return useMutation(
    ({ file }) => {
      const formData = new FormData();
      formData.append('file', file);
      return request({
        method: 'post',
        url: '/trailers/upload',
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: formData,
      }).then((res) => res.data);
    },
    {
      onSuccess: () => {
        message.success('Planilha importada com sucesso');
        queryClient.invalidateQueries('trailers');
        if (typeof onSuccess === 'function') onSuccess();
      },
    }
  );
}
