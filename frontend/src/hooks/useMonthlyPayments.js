import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchMonthlyPayments = (year) =>
  request(`/monthly-payments/${year}`).then((res) => res.data);

export default function useMonthlyPayments(year) {
  return useQuery(['monthlyPayments', year], () => fetchMonthlyPayments(year));
}
