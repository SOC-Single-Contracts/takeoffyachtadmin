import api from './axios';

export const yachtService = {
  // Yacht Categories
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Yacht Features
  getFeatures: () => api.get('/features'),
  getFeaturesByCategory: (categoryId) => api.get(`/features/category/${categoryId}`),
  createFeature: (data) => api.post('/features', data),
  updateFeature: (id, data) => api.put(`/features/${id}`, data),
  deleteFeature: (id) => api.delete(`/features/${id}`),

  // Yachts
  getAllYachts: () => api.get('/yachts'),
  getYachtById: (id) => api.get(`/yachts/${id}`),
  createYacht: (data) => api.post('/yachts', data),
  updateYacht: (id, data) => api.put(`/yachts/${id}`, data),
  deleteYacht: (id) => api.delete(`/yachts/${id}`),

  // Yacht Filtering
  filterYachts: (params) => api.get('/yachts/filter', { params }),

  // Special Events
  getF1Yachts: () => api.get('/yachts/f1'),
  getNewYearYachts: () => api.get('/yachts/new-year'),
  updateF1Settings: (id, data) => api.put(`/yachts/${id}/f1-settings`, data),
  updateNewYearSettings: (id, data) => api.put(`/yachts/${id}/new-year-settings`, data),

  // Menu & Food
  getYachtMenu: (yachtId) => api.get(`/yachts/${yachtId}/menu`),
  updateYachtMenu: (yachtId, data) => api.put(`/yachts/${yachtId}/menu`, data),
  
  // Crew
  getYachtCrew: (yachtId) => api.get(`/yachts/${yachtId}/crew`),
  updateYachtCrew: (yachtId, data) => api.put(`/yachts/${yachtId}/crew`, data),

  // Bookings
  createBooking: (data) => api.post('/bookings', data),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getUserBookings: () => api.get('/bookings/user'),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),
  getBookingTicket: (id) => api.get(`/bookings/${id}/ticket`),

  // Testimonials
  getTestimonials: (yachtId) => api.get(`/yachts/${yachtId}/testimonials`),
  addTestimonial: (yachtId, data) => api.post(`/yachts/${yachtId}/testimonials`, data),

  // Consultants
  getConsultants: () => api.get('/consultants'),
  assignConsultant: (yachtId, consultantId) => api.post(`/yachts/${yachtId}/consultants/${consultantId}`),

  // Additional Features
  getWaterSports: () => api.get('/water-sports'),
  getMiscellaneous: () => api.get('/miscellaneous'),
  getFoodBeverage: () => api.get('/food-beverage'),
};

export default yachtService;
