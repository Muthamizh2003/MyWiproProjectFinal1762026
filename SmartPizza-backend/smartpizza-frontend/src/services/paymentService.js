import api from './api'

export const paymentService = {
  create: (orderId) => api.post(`/payment/create/${orderId}`).then(r => r.data),
  confirm: (orderId, paymentId) =>
    api.post(`/payment/confirm/${orderId}`, null, { params: { paymentId } }).then(r => r.data),
  getByOrder: (orderId) => api.get(`/payment/${orderId}`).then(r => r.data),
  invoice: (orderId) => api.get(`/payment/invoice/${orderId}`).then(r => r.data),
  pay: (data) => api.post('/payment/pay', data).then(r => r.data)
}
