import request from '@/utils/request'

export const toggle = (id, isFollow) => request.put(`/follow/${id}/${isFollow}`)

export const isFollowed = (id) => request.get(`/follow/or/not/${id}`)

export const common = (id) => request.get(`/follow/common/${id}`)
