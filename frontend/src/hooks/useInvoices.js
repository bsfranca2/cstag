import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchInvoices = () => request('/invoices').then((res) => res.data);

export default function useAccounts() {
  return useQuery('invoices', fetchInvoices);
}
