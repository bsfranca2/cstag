import { cnpj } from 'cpf-cnpj-validator'

export function formatCnpjCpf(value: string) {
  return cnpj.format(value)
}

function getDateParts(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return { year, month, day }
}

const fillZero = (number: number) =>
  number > 9 ? number.toString() : `0${number}`

export function toServeDate(date: Date) {
  const { year, month, day } = getDateParts(date)
  return `${year}-${fillZero(month + 1)}-${fillZero(day)}`
}

export function fromServerDate(value: string): Date {
  return new Date(`${value} 00:00`)
}

export function toLocaleDate(date: Date) {
  const { year, month, day } = getDateParts(date)
  return `${day}/${month + 1}/${year}`
}

export function toLocaleTime(date: Date) {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${fillZero(hours)}:${fillZero(minutes)}`
}
