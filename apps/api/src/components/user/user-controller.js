import {
  ListUsersUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  GenerateUserResetPasswordTokenUseCase,
  ResetUserPasswordUseCase,
} from './use-cases/index.js';
import { toUserDto } from './user-dto.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const list = async (req, res, next) => {
  try {
    const useCase = new ListUsersUseCase(req.repository);
    const users = await useCase.execute();
    return res.json(users.map((u) => toUserDto(u)));
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
    const useCase = new CreateUserUseCase(req.repository);
    return res.status(201).json(await useCase.execute(req.body));
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const update = async (req, res, next) => {
  try {
    const useCase = new UpdateUserUseCase(req.repository);
    await useCase.execute({
      userId: req.params.userId,
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
export const generateResetPasswordToken = async (req, res, next) => {
  try {
    const useCase = new GenerateUserResetPasswordTokenUseCase(req.repository);
    const { userId } = req.params;
    const { resetToken } = await useCase.execute({ userId });
    return res.json({ resetToken, tenant: req.tenant, userId });
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { userId, resetToken, password } = req.body;
    const useCase = new ResetUserPasswordUseCase(req.repository);
    await useCase.execute({ userId, token: resetToken, newPassword: password });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
