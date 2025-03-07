import axios from 'axios';

const BASE_URL = 'https://api.takeoffyachts.com';

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/yacht/all_user/`);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    console.log('Making API request with:', userData); // Debug log
    const response = await axios.post(`${BASE_URL}/Auth/SignUp/`, userData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data); // Debug log
    throw error;
  }
};