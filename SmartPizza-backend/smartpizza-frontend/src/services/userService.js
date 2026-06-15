import api from './api'

export const userService = {
  getById: (id) => api.get(`/users/${id}`).then(r => r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/users/${id}`).then(r => r.data)
}
