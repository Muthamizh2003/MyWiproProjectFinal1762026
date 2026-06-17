import api from './api'

export const couponService = {
  apply: (code, orderAmount) =>
    api.post('/coupon/apply', null, { params: { code, orderAmount } }).then(r => r.data),

  getAll: () => api.get('/coupon/all').then(r => r.data),

  getById: (id) => api.get(`/coupon/${id}`).then(r => r.data),

  create: (data) => api.post('/coupon', data).then(r => r.data),

  update: (id, data) => api.put(`/coupon/${id}`, data).then(r => r.data),

  delete: (id) => api.delete(`/coupon/${id}`).then(r => r.data)
}
