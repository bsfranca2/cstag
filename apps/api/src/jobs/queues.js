export const queues = {
  tollPlaza: process.env.QUEUE_TOLL_PLAZA || 'toll_plaza',
  invoice: process.env.QUEUE_INVOICE || 'invoice',
  ticketAnalysis: process.env.QUEUE_TICKET_ANALYSIS || 'ticket_analysis',
  tripAnalysis: process.env.QUEUE_TRIP_ANALYSIS || 'trip_analysis',
};
