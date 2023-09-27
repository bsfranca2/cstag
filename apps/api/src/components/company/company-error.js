import { ResponseError } from '../../error.js';

export class CNPJInvalidError extends ResponseError {
  constructor(cnpj) {
    super(400, `CNPJ invalido: ${cnpj}`);
  }
}

export class CompanyAlreadyExistsError extends ResponseError {
  constructor(cnpj) {
    super(400, `Empresa com CNPJ ${cnpj} já existe`);
  }
}
