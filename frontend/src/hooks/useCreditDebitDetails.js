import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchCreditDebitDetails = (id) =>
  request(`/analyzes/credit-debit-analysis/${id}`).then((res) => res.data);

export default function useCreditDebitDetails(id) {
  return useQuery(['creditDebitDetails', id], () =>
    fetchCreditDebitDetails(id)
  );
}
