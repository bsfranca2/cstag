/// TODO: implement reconnect
import * as ticketAnalysis from './ticket-analysis.js';
import * as tripAnalysis from './trip-analysis.js';

export const indicies = {
  ticketAnalysis,
  tripAnalysis,
};

export { default as ensureAllIndiceExists } from './ensure-all-indice-exists.js';
