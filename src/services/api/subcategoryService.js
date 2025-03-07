import axios from 'axios';

const API_URL = 'https://api.takeoffyachts.com/yacht';

// Subcategory Data endpoints
export const getAllSubcategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/subcategory_data/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSubcategory = async (name) => {
  try {
    const response = await axios.post(`${API_URL}/subcategory_data/`, {
      name: name
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Yacht Subcategory endpoints
export const updateSubcategory = async (subcategoryId, name) => {
  try {
    const response = await axios.put(`${API_URL}/subcategory_data/`, {
      subcategory_id: subcategoryId,
      name: name
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};