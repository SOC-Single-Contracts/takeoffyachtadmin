import axios from 'axios';
const API_BASE_URL = 'https://api.takeoffyachts.com/yacht';
export const eventService = {
  // Event Management
  getAllEvents: () => axios.get(`${API_BASE_URL}/events`),
  getEventById: (id) => axios.get(`${API_BASE_URL}/events/${id}`),
  createEvent: (data) => axios.post(`${API_BASE_URL}/events`, data),
  updateEvent: (id, data) => axios.put(`${API_BASE_URL}/events/${id}`, data),
  deleteEvent: (id) => axios.delete(`${API_BASE_URL}/events/${id}`),

  // Event Packages
  getEventPackages: (eventId) => api.get(`/events/${eventId}/packages`),
  createEventPackage: (eventId, data) => api.post(`/events/${eventId}/packages`, data),
  updateEventPackage: (eventId, packageId, data) => api.put(`/events/${eventId}/packages/${packageId}`, data),
  deleteEventPackage: (eventId, packageId) => api.delete(`/events/${eventId}/packages/${packageId}`),

  // Event Bookings
  createEventBooking: (eventId, data) => api.post(`/events/${eventId}/bookings`, data),
  getEventBookings: (eventId) => api.get(`/events/${eventId}/bookings`),
  getEventBookingById: (eventId, bookingId) => api.get(`/events/${eventId}/bookings/${bookingId}`),

  // Event Statistics
  getEventStats: (eventId) => api.get(`/events/${eventId}/stats`),
  getTicketAvailability: (eventId, packageId) => api.get(`/events/${eventId}/packages/${packageId}/availability`),
};

export default eventService;
