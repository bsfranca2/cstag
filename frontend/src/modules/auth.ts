import { reactive, ref, toRef, toRefs } from 'vue'
import AuthApi from '@/api/auth'
import { getToken, removeToken, setToken } from '@/utils/cookies'

interface AuthState {
  token?: string
  account?: AccountDto
}

const state = reactive<AuthState>({
  token: getToken() || undefined,
  account: undefined
})

export function useAuth() {
  async function login(payload: LoginCredentialsDto) {
    const { data } = await AuthApi.login(payload)
    if (data.token === undefined) {
      return false
    }
    setToken(data.token)
    return true
  }

  function logout() {
    if (state.token === undefined) {
      throw Error('LogOut: token is undefined!')
    }
    removeToken()
    window.location.reload()
  }

  async function checkAccountInfo() {
    const { data } = await AuthApi.check()
    const account: AccountDto = {
      companyCNPJ: data.companyCNPJ,
      companyName: data.companyName,
      role: data.role,
      headquarterCNPJ: null,
      headquarterName: null
    }
    state.account = account
    return toRef(state, 'account')
  }

  function isAuthenticated() {
    return typeof state.account?.companyCNPJ  === typeof ''
  }

  return {
    login,
    checkAccountInfo,
    isAuthenticated,
    logout,
    ...toRefs(state)
  }
}
