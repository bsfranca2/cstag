import axios from 'axios'
import { useAuth } from '@/modules/auth'

const oneMinute = 60 * 1000

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9292/api'
    : 'http://dev.cstag.com.br/api'

const service = axios.create({
  baseURL,
  timeout: oneMinute,
  withCredentials: true,
})

service.interceptors.request.use(
  (config) => {
    const { token } = useAuth()
    if (token?.value) {
      config.headers['Authorization'] = 'Bearer ' + token.value
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

export default service
