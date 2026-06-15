import api from './api'

export const orderService = {
  place: (userId, addressId, couponCode) =>
    api.post('/orders/place', null, { params: { userId, addressId, couponCode } }).then(r => r.data),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`).then(r => r.data),
  getByStatus: (status) => api.get(`/orders/status/${status}`).then(r => r.data),
  cancel: (orderId) => api.put(`/orders/cancel/${orderId}`).then(r => r.data),
  getTop: () => api.get('/orders/top').then(r => r.data)
}
