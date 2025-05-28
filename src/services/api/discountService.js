import axios from 'axios';

const API_URL = 'https://api.takeoffyachts.com/yacht/promo-codes/';

// Get all discounts
export const getAllDiscounts = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get single discount by ID
export const getDiscount = async (id, token) => {
  try {
    const discounts = await getAllDiscounts(token);
    const discount = discounts.find(d => d.id === parseInt(id));
    if (!discount) {
      throw new Error('Discount not found');
    }
    return discount;
  } catch (error) {
    throw error;
  }
};

// Add a new discount
export const addDiscount = async (payload, token) => {
  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing discount
export const updateDiscount = async (discount_id, payload, token) => {
  try {
    const response = await axios.put(`${API_URL}${discount_id}/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
