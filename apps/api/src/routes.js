import { Router } from 'express';
import { getAnalysisRouter } from './components/analysis/index.js';
import { getCompanyRouter } from './components/company/index.js';
import { getInvoiceRouter } from './components/invoice/index.js';
import { getTollPlazaRouter } from './components/toll-plaza/index.js';
import { getUserRouter } from './components/user/index.js';

export const getRouter = () => {
  const router = Router();

  router.get('/', (_, res) => {
    res.json({ status: 'ok' });
  });

  router.use(getCompanyRouter());
  router.use(getUserRouter());
  router.use(getTollPlazaRouter());
  router.use(getInvoiceRouter());
  router.use(getAnalysisRouter());
  return router;
};
