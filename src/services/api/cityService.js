import axios from 'axios';
const API_URL = 'https://api.takeoffyachts.com/yacht/city/';

export const getAllCities = async (token) => {
  try {
    const response = await axios.get(API_URL,{
      headers: {
        Authorization: `Bearer ${token}`, // Add your token here
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getCity = async (id,token) => {
  try {
    const cities = await getAllCities(token);
    const city = cities.find(b => b.id === parseInt(id));
    if (!city) {
      throw new Error('City not found');
    }
    return city;
  } catch (error) {
    throw error;
  }
};

export const addCity = async (payload,token) => {
  try {
    const response = await axios.post(API_URL,  payload ,{
      headers: {
        Authorization: `Bearer ${token}`, // Add your token here
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCity = async (city_id, payload,token) => {
  try {
    const response = await axios.put(`${API_URL}`, payload,{
      headers: {
        Authorization: `Bearer ${token}`, // Add your token here
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};