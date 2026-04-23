import request from '@/utils/request'

export const uploadBlogImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/blog', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteBlogImage = (name) =>
  request.get('/upload/blog/delete', { params: { name } })
