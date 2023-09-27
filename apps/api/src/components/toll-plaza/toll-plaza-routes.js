import { Router } from 'express';
import { fileMiddleware } from '../../middleware/file.js';
import { getValidationMiddleware } from '../../middleware/validation.js';
import { authenticateMiddleware } from '../user/index.js';
import {
  importSheet,
  getPeriod,
  listPeriods,
  updatePeriod,
  duplicatePeriod,
  listTollPlazas,
  createTollPlaza,
  updateTollPlaza,
} from './toll-plaza-controller.js';
import * as tollPlazaSchemas from './toll-plaza-schema.js';

export const getRouter = () => {
  const router = Router();
  router.use('/tollPlazas', authenticateMiddleware.only.admin);
  router.use('/tollPlazasPeriods', authenticateMiddleware.only.admin);

  router.post(
    '/tollPlazasPeriods/import',
    fileMiddleware.single('sheet'),
    getValidationMiddleware(tollPlazaSchemas.importSheet),
    importSheet
  );
  router.get('/tollPlazasPeriods', listPeriods);
  router.get(
    '/tollPlazasPeriods/:tollPlazaPeriodId',
    getValidationMiddleware(tollPlazaSchemas.getPeriod),
    getPeriod
  );
  router.patch(
    '/tollPlazasPeriods/:tollPlazaPeriodId',
    getValidationMiddleware(tollPlazaSchemas.updatePeriod),
    updatePeriod
  );
  router.post(
    '/tollPlazasPeriods/:tollPlazaPeriodId/duplicate',
    getValidationMiddleware(tollPlazaSchemas.duplicatePeriod),
    duplicatePeriod
  );

  router.get(
    '/tollPlazas',
    getValidationMiddleware(tollPlazaSchemas.listTollPlazas),
    listTollPlazas
  );
  router.post(
    '/tollPlazas',
    getValidationMiddleware(tollPlazaSchemas.createTollPlaza),
    createTollPlaza
  );
  router.patch(
    '/tollPlazas/:tollPlazaId',
    getValidationMiddleware(tollPlazaSchemas.updateTollPlaza),
    updateTollPlaza
  );
  return router;
};
