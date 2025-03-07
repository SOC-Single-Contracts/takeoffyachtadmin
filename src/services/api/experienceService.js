import axios from 'axios';

const API_BASE_URL = 'https://api.takeoffyachts.com';

export const experienceService = {
  // Experience Cards
  getAllExperiences: () => axios.get(`${API_BASE_URL}/yacht/experience/`),
  getExperienceById: (id) => axios.post(`${API_BASE_URL}/yacht/check_experience/`, { experience_id: id, user_id: 1 }),
  createExperience: (data) => axios.post(`${API_BASE_URL}/yacht/experience/`, {user_id: 1}, data),
  updateExperience: (id, data) => axios.put(`${API_BASE_URL}/yacht/experience/`, {experience: id}, data),
  deleteExperience: (id) => axios.delete(`${API_BASE_URL}/yacht/experience/${id}`),

  // Shared Yachts
  getSharedYachts: () => axios.get(`${API_BASE_URL}/yacht/shared-yachts`),
  getSharedYachtById: (id) => axios.get(`${API_BASE_URL}/yacht/shared-yachts/${id}`),
  createSharedYacht: (data) => axios.post(`${API_BASE_URL}/yacht/shared-yachts`, data),
  updateSharedYacht: (id, data) => axios.put(`${API_BASE_URL}/yacht/shared-yachts/${id}`, data),
  deleteSharedYacht: (id) => axios.delete(`${API_BASE_URL}/yacht/shared-yachts/${id}`),

  // Bookings
  createExperienceBooking: (experienceId, data) => axios.post(`${API_BASE_URL}/yacht/experience/${experienceId}/bookings`, data),
  createSharedYachtBooking: (sharedYachtId, data) => axios.post(`${API_BASE_URL}/yacht/shared-yachts/${sharedYachtId}/bookings`, data),
  getBookingById: (bookingId) => axios.get(`${API_BASE_URL}/bookings/${bookingId}`),

  // Availability
  checkExperienceAvailability: (experienceId, date) => axios.get(`${API_BASE_URL}/yacht/experience/${experienceId}/availability`, { params: { date } }),
  checkSharedYachtAvailability: (sharedYachtId, date) => axios.get(`${API_BASE_URL}/yacht/shared-yachts/${sharedYachtId}/availability`, { params: { date } }),

  // Add new experience functions
  getAllExperiencesNew: () => axios.post(`${API_BASE_URL}/yacht/check_experience/`, {user_id: 1}),
  createExperienceNew: (data) => axios.post(`${API_BASE_URL}/yacht/experience/`, data),
  updateExperienceNew: (id, data) => axios.put(`${API_BASE_URL}/yacht/experience/${id}/`, data),
};

export default experienceService;
