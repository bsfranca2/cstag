import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchHeadquartersAvailable = () =>
  request('/accounts/headquarters-available').then((res) => res.data);

export default function useAccounts() {
  return useQuery('headquartersAvailable', fetchHeadquartersAvailable);
}
