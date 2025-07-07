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

export const updateExtra = async (foodId, data) => {
  try {
    const formData = new FormData();
    formData.append('food_id', foodId);
    formData.append('menucategory', data.menucategory);
    formData.append('name', data.name);
    formData.append('price', data.price);
    if (data.image) {
      switch (data.menucategory) {
        case 'food':
        case 'misc':
        case 'sport':
        case 'extra':
          formData.append('food_image', data.image);
          break;
      }
    }
    const response = await axios.put(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExtraById = async (id, category) => {
  try {
    const response = await axios.get(API_URL);
    let items = [];
    switch (category) {
      case 'food':
        items = response.data.food;
        break;
      case 'sport':
        items = response.data.sport;
        break;
      case 'misc':
        items = response.data.misc;
        break;
      case 'extra':
        items = response.data.extra;
        break;
      default:
        items = [];
    }
    const item = items.find(item => item.id.toString() === id.toString());
    if (!item) throw new Error('Extra not found');
    return item;
  } catch (error) {
    throw error;
  }
};