import { putFromMulter } from '@cstag/core/storage';
import { toTollPlazaPeriodDTO, toTollPlazaDTO } from './toll-plaza-dto.js';
import {
  ImportTollPlazaPeriodSheetUseCase,
  ListTollPlazaPeriodsUseCase,
  GetTollPlazaPeriodUseCase,
  UpdateTollPlazaPeriodUseCase,
  DuplicateTollPlazaPeriodUseCase,
  ListTollPlazasUseCase,
  CreateTollPlazaUseCase,
  UpdateTollPlazaUseCase,
} from './use-cases/index.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const importSheet = async (req, res, next) => {
  try {
    const { bucketName, objectName } = await putFromMulter(req.file);
    const useCase = new ImportTollPlazaPeriodSheetUseCase(req.repository);
    await useCase.execute({
      bucketName,
      objectName,
      tenant: req.tenant,
      description: req.body.description,
      startAt: new Date(req.body.startAt),
      endAt: req.body.endAt ? new Date(req.body.endAt) : null,
    });
    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const listPeriods = async (req, res, next) => {
  try {
    const useCase = new ListTollPlazaPeriodsUseCase(req.repository);
    const periods = await useCase.execute();
    return res.json(periods.map((p) => toTollPlazaPeriodDTO(p)));
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPeriod = async (req, res, next) => {
  try {
    const useCase = new GetTollPlazaPeriodUseCase(req.repository);
    const period = await useCase.execute({
      tollPlazaPeriodId: req.params.tollPlazaPeriodId,
    });
    return res.json(toTollPlazaPeriodDTO(period));
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updatePeriod = async (req, res, next) => {
  try {
    const useCase = new UpdateTollPlazaPeriodUseCase(req.repository);
    await useCase.execute({
      tollPlazaPeriodId: req.params.tollPlazaPeriodId,
      ...req.body,
    });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const duplicatePeriod = async (req, res, next) => {
  try {
    const useCase = new DuplicateTollPlazaPeriodUseCase(req.repository);
    await useCase.execute({
      tollPlazaPeriodId: req.params.tollPlazaPeriodId,
      ...req.body,
    });
    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const listTollPlazas = async (req, res, next) => {
  try {
    const { page, perPage, ...filters } = req.query;
    const pagination = {
      page: Number.parseInt(page) || 1,
      perPage: Number.parseInt(perPage) || 10,
    };
    const useCase = new ListTollPlazasUseCase(req.repository);
    const tollPlazas = await useCase.execute({ filters, pagination });
    return res.json({
      ...tollPlazas,
      data: tollPlazas.data.map((t) => toTollPlazaDTO(t)),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createTollPlaza = async (req, res, next) => {
  try {
    const useCase = new CreateTollPlazaUseCase(req.repository);
    await useCase.execute(req.body);
    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateTollPlaza = async (req, res, next) => {
  try {
    const useCase = new UpdateTollPlazaUseCase(req.repository);
    await useCase.execute({
      tollPlazaId: req.params.tollPlazaId,
      ...req.body,
    });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
