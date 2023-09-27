import { Router } from 'express';
import { fileMiddleware } from '../../middleware/file.js';
import { getValidationMiddleware } from '../../middleware/validation.js';
import { authenticateMiddleware } from '../user/index.js';
import { list, importSheet, del } from './invoice-controller.js';
import * as invoiceSchemas from './invoice-schema.js';

export const getRouter = () => {
  const router = Router();
  router.use('/invoices', authenticateMiddleware.only.user);

  router
    .route('/invoices')
    .get(list)
    .post(
      fileMiddleware.single('sheet'),
      getValidationMiddleware(invoiceSchemas.create),
      importSheet
    );
  router.delete('/invoices/:invoiceId', del);

  return router;
};
