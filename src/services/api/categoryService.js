import axios from 'axios';

const API_URL = 'https://api.takeoffyachts.com/yacht';

// Category Data endpoints (for managing basic categories)
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/category_data/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (name) => {
  try {
    const response = await axios.post(`${API_URL}/category_data/`, {
      name: name
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (categoryId, newName) => {
  try {
    const response = await axios.put(`${API_URL}/category_data/`, {
      category_id: categoryId,
      name: newName
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Yacht Category endpoints (for managing yacht-specific categories)
export const getAllYachtCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/category/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createYachtCategory = async (name, yacht) => {
  try {
    const response = await axios.post(`${API_URL}/category/`, {
      name: name,
      yacht: yacht
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateYachtCategory = async (categoryId, name) => {
  try {
    const response = await axios.put(`${API_URL}/category/`, {
      category_id: categoryId,
      name: name
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
