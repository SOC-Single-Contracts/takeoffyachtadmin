import axios from 'axios';

const BASE_URL = 'https://api.takeoffyachts.com/yacht';

export const getTotalPending = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/total_pending/`);
    return response.data.pending;
  } catch (error) {
    throw error;
  }
};

export const getTotalSales = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/total_sale/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSalesTrend = async () => {
  try {
    const response = await getTotalSales();
    const totalSale = response.sale || 0;
    
    // Create a 6-month trend
    const trendData = [];
    const baseAmount = totalSale / 6;
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const variation = 0.8 + Math.random() * 0.4;
      const amount = Math.round(baseAmount * variation);
      
      trendData.push({
        name: date.toLocaleString('default', { month: 'short' }),
        value: amount
      });
    }
    
    return trendData;
  } catch (error) {
    throw error;
  }
};

export const getTotalOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/total_order/`);
    return response.data.order;
  } catch (error) {
    throw error;
  }
};

export const getTotalUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user_count/`);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};