import request from '@/utils/request'

class AccountApi {
  private resource = '/accounts'

  getAll() {
    return request.get<AccountDto[]>(`${this.resource}`)
  }

  changePassword(cnpj: string, formData: Record<string, any>) {
    return request.post<AccountDto>(`${this.resource}/${cnpj}/change-password`, formData)
  }

  create(formData: Record<string, any>) {
    return request.post<AccountDto>(`${this.resource}`, formData)
  }
}

export default new AccountApi()
