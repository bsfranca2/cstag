import {
  ImportVehicleSheetUseCase,
  ListLicensePlatesUseCase,
  ListVehiclesUseCase,
} from './use-cases/index.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAll = async (req, res, next) => {
  try {
    const useCase = new ListVehiclesUseCase(req.repository);
    return res.json(
      await useCase.execute({ idCompany: req.user.company.idCompany })
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const importSheet = async (req, res, next) => {
  try {
    const useCase = new ImportVehicleSheetUseCase(req.repository);
    await useCase.execute({
      idCompany: req.user.company.idCompany,
      bucketName: req.files.sheet.atStorage.bucketName,
      objectName: req.files.sheet.atStorage.objectName,
      ...req.body,
    });
    return res.status(201).json();
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const listLicensePlate = async (req, res, next) => {
  try {
    const useCase = new ListLicensePlatesUseCase(req.repository);
    return res.json(
      await useCase.execute({ idCompany: req.user.company.idCompany })
    );
  } catch (error) {
    return next(error);
  }
};
