import { request } from '../shared/request';

export const fetchInvoices = () =>
  request.get('/invoices').then((res) => res.data);

export const importInvoice = (data) =>
  request
    .post('/invoices', data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);

export const deleteInvoice = ({ invoiceId }) =>
  request.delete(`/invoices/${invoiceId}`).then((res) => res.data);
