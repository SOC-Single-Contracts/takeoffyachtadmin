import axios from 'axios';
const API_URL = 'https://api.takeoffyachts.com/yacht/brand/';

export const getAllBrands = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getBrand = async (id) => {
  try {
    const brands = await getAllBrands();
    const brand = brands.find(b => b.id === parseInt(id));
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  } catch (error) {
    throw error;
  }
};

export const addBrand = async (title) => {
  try {
    const response = await axios.post(API_URL, { title });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBrand = async (brand_id, title) => {
  try {
    const response = await axios.put(API_URL, { 
      brand_id: parseInt(brand_id),
      title 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};