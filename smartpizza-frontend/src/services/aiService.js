import api from './api'

export const aiService = {
  recommend: (data) => api.post('/ai/recommend', data).then(r => r.data)
}
