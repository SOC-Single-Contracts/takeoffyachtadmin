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



export const getSingleEventbyId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_single_event/${id}/`);
    if (response?.data?.success == true) {
      return response?.data?.events;
    }
    throw new Error('Failed to fetch event ');
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw error.response?.data || error.message;
  }
};


export const getSinglePackagebyId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/package/?package_id=${id}`);
    if (response?.data?.error_code == "pass") {
      return response?.data?.package;
    }
    throw new Error('Failed to fetch package ');
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw error.response?.data || error.message;
  }
};

export const getEventBookingsAll = async (yachtId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_event_booking/${yachtId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};