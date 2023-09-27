import asyncWrap from '../../async-wrap.js';
import { ServiceManager } from '../../db/index.js';
import MonthlyPaymentService from './monthly-payment-service.js';

export const getByYear = asyncWrap(async (req, res) => {
  const monthlyPayment = ServiceManager.get(MonthlyPaymentService)(req);
  const {
    idCompany,
    params: { year },
    query: { category },
  } = req;
  return res.json(
    await monthlyPayment.listByYear(
      idCompany,
      Number.parseInt(year),
      Number.parseInt(category)
    )
  );
});
