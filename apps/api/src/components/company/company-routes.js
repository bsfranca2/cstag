import { Router } from 'express';
import { getValidationMiddleware } from '../../middleware/validation.js';
import { authenticateMiddleware } from '../user/index.js';
import { list, create, listHeadquarters } from './company-controller.js';
import * as companySchemas from './company-schema.js';

export const getRouter = () => {
  const router = Router();
  router.use('/companies', authenticateMiddleware.only.admin);

  router.get('/companies', list);
  router.post(
    '/companies',
    getValidationMiddleware(companySchemas.create),
    create
  );
  router.get('/companies/headquarters', listHeadquarters);

  return router;
};
