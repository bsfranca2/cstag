import {
  SearchTicketAnalyzesUseCase,
  SearchTripAnalyzesUseCase,
  GetTripAnalysisUseCase,
  GetTicketAnalysisUseCase,
} from './use-cases/index.js';

export const searchTicketAnalysis = async (req, res, next) => {
  try {
    const useCase = new SearchTicketAnalyzesUseCase();
    return res.json(
      await useCase.execute({
        tenant: req.tenant,
        company: req.user.company.cnpj,
        ...req.query,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const searchTripAnalysis = async (req, res, next) => {
  try {
    const useCase = new SearchTripAnalyzesUseCase();
    return res.json(
      await useCase.execute({
        tenant: req.tenant,
        company: req.user.company.cnpj,
        ...req.query,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const tripAnalysisDetails = async (req, res, next) => {
  try {
    const useCase = new GetTripAnalysisUseCase(req.repository);
    return res.json(await useCase.execute({ tripAnalysisId: req.params.id }));
  } catch (error) {
    return next(error);
  }
};

export const ticketAnalysisDetails = async (req, res, next) => {
  try {
    const useCase = new GetTicketAnalysisUseCase(req.repository);
    return res.json(await useCase.execute({ ticketAnalysisId: req.params.id }));
  } catch (error) {
    return next(error);
  }
};
