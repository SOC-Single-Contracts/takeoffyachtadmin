import axios from 'axios';

const BASE_URL = 'https://api.takeoffyachts.com/yacht';

export const getAllYachts = async (userId = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/get_yacht/1?user_id=${userId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};