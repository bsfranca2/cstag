import request from '@/utils/request'

class MonthlyApi {
  private resource = '/monthly-payments'

  getByYear(year: number) {
    return request.get<MonthlyPaymentDto[]>(`${this.resource}/${year}`)
  }
}

export default new MonthlyApi()
