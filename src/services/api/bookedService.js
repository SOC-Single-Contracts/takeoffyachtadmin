import axios from 'axios';

const BASE_URL = 'https://api.takeoffyachts.com/yacht';

export const getBoatBookings = async (yachtId) => {
  try {
    const response = await axios.get(`${BASE_URL}/get_yacht_booking/${yachtId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingsBaseType = async (yachtId,yachtsType) => {
  try {
    const response = await axios.get(`${BASE_URL}/get_yacht_booking/${yachtId}?BookingType=${yachtsType == "f1yachts" ? "f1yachts" : "regular"}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};



export const getEventBookings = async (eventId) => {
  try {
    const response = await axios.get(`${BASE_URL}/get_event_booking/${eventId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};


export const updateBookingStatus = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/approve_cancel_booking/`, userData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data); // Debug log
    throw error;
  }
};