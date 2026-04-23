import request from '@/utils/request'

export const publish = (data) => request.post('/blog', data)

export const hot = (current = 1) => request.get('/blog/hot', { params: { current } })

export const getById = (id) => request.get(`/blog/${id}`)

export const like = (id) => request.put(`/blog/like/${id}`)

export const likeRank = (id) => request.get(`/blog/likes/${id}`)

export const mine = (current = 1) => request.get('/blog/of/me', { params: { current } })

export const byUser = (id, current = 1) => request.get('/blog/of/user', { params: { id, current } })

export const follow = (params) => request.get('/blog/of/follow', { params })
