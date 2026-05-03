import request from './agentRequest'

export const chat = (data) => request.post('/chat', data)

export const health = () => request.get('/health')

export const rateLimit = (key) => request.get(`/rate-limit/${key}`)
