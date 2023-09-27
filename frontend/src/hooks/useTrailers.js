import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchAccounts = () => request('/trailers').then((res) => res.data);

export default function useAccounts() {
  return useQuery('trailers', fetchAccounts);
}
