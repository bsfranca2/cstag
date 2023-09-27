export const server = [process.env.RABBITMQ_URI || 'amqp://localhost'];

export const tollPlazaQueue = process.env.QUEUE_TOLL_PLAZA || 'toll_plaza';
export const invoiceQueue = process.env.QUEUE_INVOICE || 'invoice';
export const ticketAnalysisQueue =
  process.env.QUEUE_TICKET_ANALYSIS || 'ticket_analysis';
export const tripAnalysisQueue =
  process.env.QUEUE_TRIP_ANALYSIS || 'trip_analysis';

export const queues = {
  tollPlaza: tollPlazaQueue,
  invoice: invoiceQueue,
  ticketAnalysis: ticketAnalysisQueue,
  tripAnalysis: tripAnalysisQueue,
};
