import request from '@/utils/request'

export const sendCode = (phone) => request.post('/user/code', null, { params: { phone } })

export const login = (form) => request.post('/user/login', form)

export const logout = () => request.post('/user/logout')

export const getMe = () => request.get('/user/me')

export const getUserById = (id) => request.get(`/user/${id}`)

export const getUserInfo = (id) => request.get(`/user/info/${id}`)

export const sign = () => request.post('/user/sign')

export const signCount = () => request.get('/user/sign/count')
