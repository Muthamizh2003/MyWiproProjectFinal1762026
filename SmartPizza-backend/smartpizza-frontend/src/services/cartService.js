import api from './api'

export const cartService = {
  add: (userId, productId, quantity) =>
    api.post('/cart/add', null, { params: { userId, productId, quantity } }).then(r => r.data),
  get: (userId) => api.get(`/cart/${userId}`).then(r => r.data),
  update: (userId, productId, quantity) =>
    api.put('/cart/update', null, { params: { userId, productId, quantity } }).then(r => r.data),
  remove: (userId, productId) =>
    api.delete('/cart/remove', { params: { userId, productId } }).then(r => r.data),
  clear: (userId) => api.delete(`/cart/clear/${userId}`).then(r => r.data)
}
