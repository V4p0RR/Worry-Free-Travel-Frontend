import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000
})

request.interceptors.request.use(
  (config) => {
    try {
      const auth = useAuthStore()
      if (auth.token) {
        config.headers['authorization'] = auth.token
      }
    } catch (_) {
      // pinia 未就绪时忽略
    }
    return config
  },
  (err) => Promise.reject(err)
)

request.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success === false) {
        const msg = body.errorMsg || '请求失败'
        showError(msg)
        return Promise.reject(new Error(msg))
      }
      return body
    }
    return { success: true, data: body }
  },
  (error) => {
    const status = error.response?.status
    const body = error.response?.data
    let msg = '网络开小差了～'

    if (body && body.errorMsg) msg = body.errorMsg
    else if (status === 401) msg = '登录已过期，请重新登录'
    else if (error.code === 'ECONNABORTED') msg = '请求超时，请稍后重试'
    else if (!error.response) msg = '无法连接服务，请检查网络'

    if (status === 401) {
      try {
        const auth = useAuthStore()
        auth.logout(true)
      } catch (_) {}

      const current = router.currentRoute.value
      if (current.path !== '/login') {
        router.push({ path: '/login', query: { redirect: current.fullPath } })
      }
      showError(msg)
      return Promise.reject(new Error(msg))
    }

    showError(msg)
    return Promise.reject(new Error(msg))
  }
)

function showError(msg) {
  if (typeof window !== 'undefined' && window.$message) {
    window.$message.error(msg)
  } else {
    console.error('[Request]', msg)
  }
}

export default request
