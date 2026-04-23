import request from '@/utils/request'

export const listTypes = () => request.get('/shop-type/list')
