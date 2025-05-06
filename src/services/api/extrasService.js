import axios from 'axios';

const API_URL = 'https://api.takeoffyachts.com/yacht/food/';

export const getAllExtras = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addExtra = async (data) => {
  try {
    const formData = new FormData();
    formData.append('menucategory', data.menucategory);
    formData.append('name', data.name);
    formData.append('price', data.price);
    
    // Append the appropriate image based on category
    if (data.image) {
      switch (data.menucategory) {
        case 'food':
          formData.append('food_image', data.image);
          break;
        case 'misc':
          formData.append('food_image', data.image);
          break;
        case 'sport':
          formData.append('food_image', data.image);
          break;
          case 'extra':
            formData.append('food_image', data.image);
            break;
      }
    }

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExtra = async (foodId, price) => {
  try {
    const response = await axios.put(API_URL, {
      food_id: foodId,
      price: price
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};