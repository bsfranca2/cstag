import { formatCnpjCpf, toLocaleDate } from './format'
import { TableColumn } from 'element-plus/lib/el-table/src/table.type'

export function cnpjFormatter(row: unknown, column: TableColumn, cellValue: string) {
  return formatCnpjCpf(cellValue)
}

export function roleFormatter(row: unknown, column: TableColumn, cellValue: string) {
  if (cellValue === 'Client') return 'Cliente'
  return cellValue
}

export function dateFormatter(row: unknown, column: TableColumn, cellValue: string) {
  if (!cellValue) return
  return toLocaleDate(new Date(cellValue))
}

export function moneyFormatter(row: unknown, column: TableColumn, cellValue: number) {
  if (!cellValue) return 'R$ 0.00'
  return `R$ ${cellValue.toFixed(2)}`
}

export function tollTicketTypeFormatter(row: unknown, column: TableColumn, cellValue: string) {
  if (!cellValue) return
  else if (cellValue === 'Positive') return 'Positivo'
  else if (cellValue === 'Negative') return 'Negativo'
  return cellValue
}

export function creditAndDebitTypeFormatter(row: unknown, column: TableColumn, cellValue?: string) {
  if (!cellValue) return
  else if (cellValue === 'Debit') return 'Débito'
  else if (cellValue === 'Credit') return 'Crédito'
  return cellValue
}
