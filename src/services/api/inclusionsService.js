import axios from 'axios';

const BASE_URL = 'https://api.takeoffyachts.com/yacht';

export const getAllInclusions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/inclusion/`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getInclusion = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/inclusion/`);
    const inclusion = response.data.data.find(item => item.id === parseInt(id));
    if (!inclusion) {
      throw new Error('Inclusion not found');
    }
    return { ...inclusion, title: inclusion.name };
  } catch (error) {
    throw error;
  }
};

export const addInclusion = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/inclusion/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateInclusion = async (inclusionId, data) => {
  try {
    const formData = new FormData();
    formData.append('inclusion_id', inclusionId);
    
    // Append title instead of name
    if (data.title) {
      formData.append('title', data.title);
    }
    
    // Append icons if provided
    if (data.dark_icon) {
      formData.append('dark_icon', data.dark_icon);
    }
    
    if (data.light_icon) {
      formData.append('light_icon', data.light_icon);
    }

    const response = await axios.put(`${BASE_URL}/inclusion/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};