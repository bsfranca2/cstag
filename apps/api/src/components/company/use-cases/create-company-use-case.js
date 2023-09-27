import { CompanyCNPJ } from '../company-cnpj.js';
import {
  CNPJInvalidError,
  CompanyAlreadyExistsError,
} from '../company-error.js';

export class CreateCompanyUseCase {
  #companyRepo;

  /** @param {import("@prisma/client").PrismaClient} repository */
  constructor(repository) {
    this.#companyRepo = repository.company;
  }

  async execute({ name, cnpj: cnpjUnformmated, headquarterId }) {
    const cnpj = CompanyCNPJ.parse(cnpjUnformmated);

    if (!CompanyCNPJ.validate(cnpj)) {
      throw new CNPJInvalidError(cnpj);
    }

    if (await this.#companyRepo.findUnique({ where: { cnpj } })) {
      throw new CompanyAlreadyExistsError(cnpj);
    }

    await this.#companyRepo.create({
      data: {
        name,
        cnpj,
        headquarter: headquarterId
          ? {
              connect: {
                id: headquarterId,
              },
            }
          : undefined,
      },
    });
  }
}
