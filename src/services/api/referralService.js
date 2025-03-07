import api from './axios';

export const referralService = {
  // Admin Operations
  getAllCodes: () => api.get('/referral-codes'),
  getCodeById: (id) => api.get(`/referral-codes/${id}`),
  createCode: (data) => api.post('/referral-codes', data),
  updateCode: (id, data) => api.put(`/referral-codes/${id}`, data),
  deleteCode: (id) => api.delete(`/referral-codes/${id}`),
  
  // Code Redemption History
  getRedemptionHistory: (codeId) => api.get(`/referral-codes/${codeId}/redemptions`),
  getRedemptionsByUser: (userId) => api.get(`/users/${userId}/redemptions`),
  
  // User Operations
  validateCode: (code) => api.post('/referral-codes/validate', { code }),
  applyCode: (code, bookingId) => api.post(`/bookings/${bookingId}/apply-referral`, { code }),
};

export default referralService;
