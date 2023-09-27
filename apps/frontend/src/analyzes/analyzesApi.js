import { request } from '../shared/request';

export const fetchTripAnalyzes = (params) =>
  request.get('/trip-analyzes', { params }).then((res) => res.data);

export const fetchTripAnalysisDetails = (tripAnalysisId) =>
  request.get(`/trip-analyzes/${tripAnalysisId}`).then((res) => res.data);

export const fetchTicketAnalyzes = (params) =>
  request.get('/ticket-analyzes', { params }).then((res) => res.data);

export const fetchTicketAnalysisDetails = (ticketAnalysisId) =>
  request.get(`/ticket-analyzes/${ticketAnalysisId}`).then((res) => res.data);
