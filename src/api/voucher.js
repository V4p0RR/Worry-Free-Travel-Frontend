import request from '@/utils/request'

export const listByShop = (shopId) => request.get(`/voucher/list/${shopId}`)

export const createVoucher = (data) => request.post('/voucher', data)

export const createSeckill = (data) => request.post('/voucher/seckill', data)
