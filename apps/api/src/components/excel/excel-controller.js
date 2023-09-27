import asyncWrap from '../../async-wrap.js';
import { ServiceManager } from '../../db/index.js';
import { VehicleService as ExcelService } from './excel-service.js';

export const getAll = asyncWrap(async (req, res) => {
  const service = ServiceManager.get(ExcelService)(req);
  return res.download(await service.download(req.idCompany));
});
