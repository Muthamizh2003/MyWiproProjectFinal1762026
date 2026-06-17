import api from './api'

export const productService = {
  getAll: () => api.get('/products').then(r => r.data),
  getById: (id) => api.get(`/products/${id}`).then(r => r.data),
  getByCategory: (category) => api.get(`/products/category/${category}`).then(r => r.data),
  getBySize: (size) => api.get(`/products/size/${size}`).then(r => r.data),
  search: (keyword) => api.get(`/products/search/${keyword}`).then(r => r.data),
  getByPriceRange: (min, max) => api.get('/products/price-range', { params: { min, max } }).then(r => r.data),
  getTopExpensive: () => api.get('/products/top-expensive').then(r => r.data),
  getRandom: () => api.get('/products/random').then(r => r.data),
  add: (data) => api.post('/products', data).then(r => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/products/${id}`).then(r => r.data)
}
