import axios from 'axios';
const API_URL = 'https://api.takeoffyachts.com/yacht/brands/';

export const getAllBrands = async (token) => {
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

export const getBrand = async (id,token) => {
  try {
    const brands = await getAllBrands(token);
    const brand = brands.find(b => b.id === parseInt(id));
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  } catch (error) {
    throw error;
  }
};

export const addBrand = async (payload,token) => {
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

export const updateBrand = async (brand_id, payload,token) => {
  try {
    const response = await axios.put(`${API_URL}${brand_id}/`, payload,{
      headers: {
        Authorization: `Bearer ${token}`, // Add your token here
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};