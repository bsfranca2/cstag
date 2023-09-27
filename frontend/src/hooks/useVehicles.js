import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchAccounts = () => request('/vehicles').then((res) => res.data);

export default function useAccounts() {
  return useQuery('vehicles', fetchAccounts);
}
