import { Router } from 'vue-router'
import { useAuth } from '@/modules/auth'

const homePath: Record<string, string> = {
  Admin: '/accounts',
  Client: '/toll-ticket-analyzes',
}
const loginPath = '/login'
const whiteList = [loginPath]

export function addPermissions(router: Router) {
  router.beforeEach(async (to, _, next) => {
    const { token, checkAccountInfo, logout } = useAuth()
    const accountToken = token?.value
    if (accountToken) {
      try {
        const account = await checkAccountInfo()
        if (to.path === '/' || to.path === loginPath) {
          const home = homePath[account.value!!.role]
          next({ path: home })
        } else {
          next()
        }
      } catch (err) {
        logout()
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`${loginPath}?redirect=${to.path}`)
      }
    }
  })
}
