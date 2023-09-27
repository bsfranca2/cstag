import request from '@/utils/request'

class AuthApi {
  private resource = '/auth'

  login(data: LoginCredentialsDto) {
    return request.post<TokenDto>(`${this.resource}/login`, data)
  }

  check() {
    return request.get<AccountDto>(`${this.resource}/check`)
  }
}

export default new AuthApi()
