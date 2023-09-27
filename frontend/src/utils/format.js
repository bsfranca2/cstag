import { cnpj } from 'cpf-cnpj-validator';

export function formatCnpj(value) {
  return cnpj.format(value);
}

export function formatMoney(value) {
  if (!value) return '';
  return `R$ ${value.toFixed(2)}`;
}
