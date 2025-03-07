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

export const getEventBookings = async (eventId) => {
  try {
    const response = await axios.get(`${BASE_URL}/get_event_booking/${eventId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};