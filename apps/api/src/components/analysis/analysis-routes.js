import { Router } from 'express';
import { getValidationMiddleware } from '../../middleware/validation.js';
import { authenticateMiddleware } from '../user/index.js';
import {
  searchTicketAnalysis,
  searchTripAnalysis,
  ticketAnalysisDetails,
  tripAnalysisDetails,
} from './analysis-controller.js';
import * as analysisSchema from './analysis-schema.js';

export const getRouter = () => {
  const router = Router();

  router.get(
    '/ticket-analyzes/:id',
    authenticateMiddleware.only.user,
    ticketAnalysisDetails
  );
  router.get(
    '/ticket-analyzes',
    authenticateMiddleware.only.user,
    getValidationMiddleware(analysisSchema.searchTicketAnalyzes),
    searchTicketAnalysis
  );

  router.get(
    '/trip-analyzes/:id',
    authenticateMiddleware.only.user,
    tripAnalysisDetails
  );
  router.get(
    '/trip-analyzes',
    authenticateMiddleware.only.user,
    getValidationMiddleware(analysisSchema.searchTripAnalyzes),
    searchTripAnalysis
  );

  return router;
};
