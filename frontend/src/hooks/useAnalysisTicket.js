import { useQuery } from 'react-query';
import request from '../utils/request';

export const fetchAnalysisTicket = (id) =>
  request(`/tickets/${id}/analysis`).then((res) => res.data);

export default function useAnalysisTicket(id) {
  return useQuery(['analysisTicket', id], () => fetchAnalysisTicket(id));
}
