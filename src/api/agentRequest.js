import axios from 'axios'

const agentRequest = axios.create({
  baseURL: '/agent',
  timeout: 30000
})

// Agent 接口响应格式不同（无 success 包裹），不做统一拦截
agentRequest.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    let msg = 'AI 服务繁忙，请稍后再试～'
    if (status === 429) msg = '请求太频繁啦，请 3 秒后再试'
    else if (error.code === 'ECONNABORTED') msg = 'AI 思考超时，请重试'
    else if (!error.response) msg = 'AI 服务未启动，请检查 Agent'

    if (typeof window !== 'undefined' && window.$message) {
      window.$message.error(msg)
    }
    return Promise.reject(new Error(msg))
  }
)

export default agentRequest
