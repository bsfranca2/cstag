import { toCompanyDTO } from './company-dto.js';
import {
  ListCompaniesUseCase,
  CreateCompanyUseCase,
  ListHeadquartersUseCase,
} from './use-cases/index.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const list = async (req, res, next) => {
  try {
    const useCase = new ListCompaniesUseCase(req.repository);
    const companies = await useCase.execute();
    return res.json(companies.map((c) => toCompanyDTO(c)));
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const create = async (req, res, next) => {
  try {
    const useCase = new CreateCompanyUseCase(req.repository);
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
export const listHeadquarters = async (req, res, next) => {
  try {
    const useCase = new ListHeadquartersUseCase(req.repository);
    const headquarters = await useCase.execute();
    return res.json(headquarters.map((h) => toCompanyDTO(h)));
  } catch (error) {
    return next(error);
  }
};
