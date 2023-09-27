import { toUserDto } from '../user-dto.js';
import {
  AuthenticateUseCase,
  AuthenticateAsUseCase,
} from './use-cases/index.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const login = async (req, res, next) => {
  try {
    const useCase = new AuthenticateUseCase(req.repository);
    return res.json(await useCase.execute(req.body));
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const loginAs = async (req, res, next) => {
  try {
    const {
      tenant,
      params: { userId },
      repository,
    } = req;
    const useCase = new AuthenticateAsUseCase(repository);
    return res.json(await useCase.execute({ tenant, userId }));
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const me = async (req, res, next) => {
  try {
    return res.json(toUserDto(req.user));
  } catch (error) {
    return next(error);
  }
};
