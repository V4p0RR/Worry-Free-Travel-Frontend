import request from '@/utils/request'

export const getShop = (id) => request.get(`/shop/${id}`)

export const listByType = (params) => request.get('/shop/of/type', { params })

export const searchByName = (params) => request.get('/shop/of/name', { params })

export const createShop = (data) => request.post('/shop', data)

export const updateShop = (data) => request.put('/shop', data)
