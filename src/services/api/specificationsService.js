import axios from 'axios';

const BASE_URL = 'https://api.takeoffyachts.com/yacht';

export const getAllSpecifications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/specification/`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getSpecification = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/specification/`);
    const specification = response.data.data.find(item => item.id === parseInt(id));
    if (!specification) {
      throw new Error('Specification not found');
    }
    return specification;
  } catch (error) {
    throw error;
  }
};

export const addSpecification = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/specification/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSpecification = async (specificationId, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/specification/`, {
      specification_id: specificationId,
      ...data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
