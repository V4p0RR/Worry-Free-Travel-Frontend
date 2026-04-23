import request from '@/utils/request'

export const seckill = (voucherId) => request.post(`/voucher-order/seckill/${voucherId}`)
