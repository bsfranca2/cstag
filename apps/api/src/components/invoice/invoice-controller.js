import { putFromMulter } from '../../utils/storage.js'
import {
  ListInvoicesUseCase,
  ImportInvoiceSheetUseCase,
  DeleteInvoiceUseCase,
} from './use-cases/index.js';
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const list = async (req, res, next) => {
  try {
    const useCase = new ListInvoicesUseCase(req.repository);
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
    const { bucketName, objectName } = await putFromMulter(req.file);
    const useCase = new ImportInvoiceSheetUseCase(req.repository);
    await useCase.execute({
      tenant: req.tenant,
      idCompany: req.user.company.idCompany,
      bucketName,
      objectName,
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
export const del = async (req, res, next) => {
  try {
    const useCase = new DeleteInvoiceUseCase(req.repository);
    await useCase.execute({
      tenant: req.tenant,
      companyCNPJ: req.user.company.cnpj,
      invoiceId: req.params.invoiceId,
    });
    return res.status(204).json();
  } catch (error) {
    return next(error);
  }
};
