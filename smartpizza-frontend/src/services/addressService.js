import api from './api'

export const addressService = {
  addAddress: (userId, data) => api.post(`/address/add/${userId}`, data).then(r => r.data),
  getUserAddresses: (userId) => api.get(`/address/user/${userId}`).then(r => r.data),
  getById: (id) => api.get(`/address/${id}`).then(r => r.data),
  update: (id, data) => api.put(`/address/update/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/address/delete/${id}`).then(r => r.data)
}
