import { Router } from 'express';
import { createFileMiddleware, saveAt } from '../../middleware/file.js';
import { getValidationMiddleware } from '../../middleware/validation.js';
import { authenticateMiddleware } from '../user/index.js';
import * as invoiceSchemas from './invoice-schema.js';
import {
  getAll,
  importSheet,
  // listLicensePlate
} from './vehicle-controller.js';

export const getRouter = () => {
  const router = Router();
  router.use('/vehicles', authenticateMiddleware.only.user);

  router
    .route('/vehicles')
    .get(getAll)
    .post(
      createFileMiddleware({
        field: 'sheet',
        saveAt: [saveAt.storage],
      }),
      getValidationMiddleware(invoiceSchemas.create),
      importSheet
    );
  // router.delete('/invoices/:invoiceId', del);

  return router;
};
