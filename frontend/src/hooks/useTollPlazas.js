import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchAccounts = () =>
  request('/toll-plazas/periods').then((res) => res.data);

export default function useAccounts() {
  return useQuery('tollPlazaPeriods', fetchAccounts);
}
