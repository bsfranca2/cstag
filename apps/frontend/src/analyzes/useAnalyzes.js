import { useQuery } from 'react-query';
import {
  fetchTripAnalysisDetails,
  fetchTicketAnalysisDetails,
} from './analyzesApi';

export function useTripAnalysisDetails(id) {
  return useQuery(['tripAnalysis', id], () => fetchTripAnalysisDetails(id));
}

export function useTicketAnalysisDetails(id) {
  return useQuery(['ticketAnalysis', id], () => fetchTicketAnalysisDetails(id));
}
