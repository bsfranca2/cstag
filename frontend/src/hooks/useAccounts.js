import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchAccounts = () => request('/accounts').then((res) => res.data);

export default function useAccounts() {
  return useQuery('accounts', fetchAccounts);
}
