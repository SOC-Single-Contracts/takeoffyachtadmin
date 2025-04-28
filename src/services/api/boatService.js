import axios from 'axios';

const API_BASE_URL = 'https://api.takeoffyachts.com/yacht';

export const createBoat = async (formData, features = null) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = currentDate.toTimeString().split(' ')[0];

    const boatData = {};
    for (let [key, value] of formData.entries()) {
      boatData[key] = value;
    }

    const additionalData = {
      availability: {
        data: formattedDate,
        time: formattedTime
      },
      user_id: '1',
      created_on: `${formattedDate} ${formattedTime}`,
      status: true
    };

    if (features) {
      additionalData.features = features;
    }

    const finalFormData = new FormData();
    
    Object.keys(boatData).forEach(key => {
      finalFormData.append(key, boatData[key]);
    });

    Object.keys(additionalData).forEach(key => {
      if (key === 'availability') {
        finalFormData.append('availability[data]', additionalData[key].data);
        finalFormData.append('availability[time]', additionalData[key].time);
      } else if (key === 'features') {
        Object.keys(additionalData[key]).forEach(featureKey => {
          finalFormData.append(`features[${featureKey}]`, additionalData[key][featureKey]);
        });
      } else {
        finalFormData.append(key, additionalData[key]);
      }
    });

    const response = await axios.post(`${API_BASE_URL}/yacht/`, finalFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllBoats = async (features = null) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/f1-yachts/`);
    
    const boats = response.data?.data || [];
    return  boats
    // if (features) {
    //   return boats.filter(boat => {
    //     try {
    //       const featuresObj = boat.yacht.features ? JSON.parse(boat.yacht.features.replace(/'/g, '"')) : null;
    //       return featuresObj && featuresObj[features];
    //     } catch (e) {
    //       return false;
    //     }
    //   });
    // }
    // return boats.filter(boat => {
    //   console.log(boat)
    //   try {
    //     const featuresObj = boat.yacht.features ? JSON.parse(boat.yacht.features.replace(/'/g, '"')) : null;
    //     return !featuresObj || Object.keys(featuresObj).length === 0;
    //   } catch (e) {
    //     return true;
    //   }
    // });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const getf1AllBoats = async (features = null) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/f1-yachts/`);
    
    const boats = response.data?.data || [];
    return  boats
    // if (features) {
    //   return boats.filter(boat => {
    //     try {
    //       const featuresObj = boat.yacht.features ? JSON.parse(boat.yacht.features.replace(/'/g, '"')) : null;
    //       return featuresObj && featuresObj[features];
    //     } catch (e) {
    //       return false;
    //     }
    //   });
    // }
    // return boats.filter(boat => {
    //   console.log(boat)
    //   try {
    //     const featuresObj = boat.yacht.features ? JSON.parse(boat.yacht.features.replace(/'/g, '"')) : null;
    //     return !featuresObj || Object.keys(featuresObj).length === 0;
    //   } catch (e) {
    //     return true;
    //   }
    // });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getBoatById = async (id,yachtsType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_yacht/${id}/`, {user_id: 1});

    if (response.data?.error_code === 'pass' && response.data?.data) {
      return response.data.data[0];
    }
    throw new Error('Failed to fetch boat data');
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const getSingleBoatById = async (id,yachtsType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_signle_yacht/${id}/?YachtType=${yachtsType}`);

    if (response.data?.error_code === 'pass' && response.data?.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch boat data');
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const getSingleF1BoatById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/f1-yachts-details/${id}/`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateBoat = async (id, formData, features = null) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = currentDate.toTimeString().split(' ')[0];

    // Convert form data to an object to modify it
    const boatData = {};
    for (let [key, value] of formData.entries()) {
      boatData[key] = value;
    }

    // Add additional fields
    const additionalData = {
      availability: {
        data: formattedDate,
        time: formattedTime
      },
      user_id: '1', // Replace with actual user ID from auth
      updated_on: `${formattedDate} ${formattedTime}`,
    };

    // Add features if provided (for F1 and New Year boats)
    if (features) {
      additionalData.features = features;
    }

    // Create new FormData with all fields
    const finalFormData = new FormData();
    
    // Add original form data
    Object.keys(boatData).forEach(key => {
      finalFormData.append(key, boatData[key]);
    });

    // Add additional data
    Object.keys(additionalData).forEach(key => {
      if (key === 'availability') {
        finalFormData.append('availability[data]', additionalData[key].data);
        finalFormData.append('availability[time]', additionalData[key].time);
      } else if (key === 'features') {
        Object.keys(additionalData[key]).forEach(featureKey => {
          finalFormData.append(`features[${featureKey}]`, additionalData[key][featureKey]);
        });
      } else {
        finalFormData.append(key, additionalData[key]);
      }
    });

    const response = await axios.put(`${API_BASE_URL}/yacht/${id}/`, finalFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};