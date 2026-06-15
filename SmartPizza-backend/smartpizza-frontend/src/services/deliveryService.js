import api from './api'

export const deliveryService = {
  start: (orderId) => api.post(`/delivery/start/${orderId}`).then(r => r.data),
  track: (orderId) => api.get(`/delivery/track/${orderId}`).then(r => r.data),
  getEta: (orderId) => api.get(`/delivery/eta/${orderId}`).then(r => r.data),
  getAgentOrders: () => api.get('/delivery/agent/orders').then(r => r.data),
  updateStatus: (deliveryId, status) => api.put('/delivery/agent/status', { deliveryId, status }).then(r => r.data),
  updateLocation: (deliveryId, latitude, longitude) => api.put('/delivery/agent/location', { deliveryId, latitude, longitude }).then(r => r.data)
}
