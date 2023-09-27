import asyncWrap from '../../async-wrap.js';
import { ServiceManager } from '../../db/index.js';
import TrailerService from './trailer-service.js';

export const getAll = asyncWrap(async (req, res) => {
  const trailerService = ServiceManager.get(TrailerService)(req);
  return res.json(await trailerService.list(req.idCompany));
});

export const importSheet = asyncWrap(async (req, res) => {
  const trailerService = ServiceManager.get(TrailerService)(req);
  await trailerService.importSheet(req.idCompany, req.file);
  return res.status(201).json();
});
