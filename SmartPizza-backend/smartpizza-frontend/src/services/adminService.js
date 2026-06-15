import api from './api'

export const adminService = {
  // Dashboard analytics
  getRevenue: () => api.get('/admin/dashboard/revenue').then(r => r.data),
  getOrderAnalytics: () => api.get('/admin/dashboard/orders').then(r => r.data),
  getDeliveryAnalytics: () => api.get('/admin/dashboard/delivery').then(r => r.data),
  getCustomerAnalytics: () => api.get('/admin/dashboard/customers').then(r => r.data),
  getHeatmap: () => api.get('/admin/dashboard/heatmap').then(r => r.data),
  getCustomerTrends: () => api.get('/admin/dashboard/customer-trends').then(r => r.data),

  // Users
  getAllUsers: () => api.get('/users/all').then(r => r.data),
  blockUser: (id) => api.put(`/admin/user/block/${id}`).then(r => r.data),
  deleteUser: (id) => api.delete(`/admin/user/${id}`).then(r => r.data),

  // Orders
  getAllOrders: () => api.get('/admin/orders/all').then(r => r.data),
  updateOrderStatus: (id, status) =>
    api.put(`/admin/order/${id}`, null, { params: { status } }).then(r => r.data),

  // Products
  updateProduct: (id, data) => api.put(`/admin/product/${id}`, data).then(r => r.data),

  // Daily orders (calendar heatmap)
  getDailyOrders: () => api.get('/admin/dashboard/daily-orders').then(r => r.data),

  // Delivery agents
  getDeliveryAgents: () => api.get('/admin/agent').then(r => r.data),
  addDeliveryAgent: (data) => api.post('/admin/agent/add', data).then(r => r.data)
}
