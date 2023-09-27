import { cnpj } from 'cpf-cnpj-validator';

export const isCNPJ = (value) => cnpj.isValid(value);
