import api from './api'

export const comboService = {
  getSmartCombo: (data) => api.post('/combo/smart', data).then(r => r.data)
}
